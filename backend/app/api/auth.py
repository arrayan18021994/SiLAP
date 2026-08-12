from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import jwt

import random
import uuid
from app.config.settings import settings
from app.database.session import get_db
from app.database.models import User, PasswordResetOTP, AuditLog
from app.core.security import verify_password, get_password_hash
from app.core.installation import determine_system_status, InstallationState
from app.services.email_service import email_service

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Block login if system is not ACTIVE
    state = determine_system_status(db)
    if state != InstallationState.ACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Login is disabled. System status is {state.value}."
        )

    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    if user.account_status != "ACTIVE":
        raise HTTPException(status_code=403, detail=f"Account is {user.account_status}")

    # Update last login
    user.last_login_at = datetime.utcnow()
    db.commit()

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    # Also verify system state
    state = determine_system_status(db)
    if state != InstallationState.ACTIVE:
        raise HTTPException(status_code=403, detail="System not active")

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
        
    return user

from pydantic import BaseModel

class ForgotPasswordRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Pretend it worked to prevent email enumeration
        return {"message": "Jika email terdaftar, OTP telah dikirim."}
        
    # Check cooldown
    existing_otp = db.query(PasswordResetOTP).filter(PasswordResetOTP.user_id == user.id).first()
    if existing_otp:
        cooldown = existing_otp.requested_at + timedelta(seconds=60)
        if datetime.utcnow() < cooldown:
            raise HTTPException(status_code=429, detail="Tunggu 60 detik sebelum meminta OTP baru.")
        db.delete(existing_otp)
        db.commit()
        
    # Generate OTP
    otp = f"{random.randint(100000, 999999)}"
    
    # Store OTP
    new_otp = PasswordResetOTP(
        user_id=user.id,
        otp_hash=get_password_hash(otp),
        expires_at=datetime.utcnow() + timedelta(minutes=5)
    )
    db.add(new_otp)
    
    # Audit Log
    audit = AuditLog(
        user_id=str(user.id),
        module="AUTH",
        action="PASSWORD_RESET_REQUEST",
        entity="USER",
        record_id=str(user.id)
    )
    db.add(audit)
    db.commit()
    
    # Send email
    email_service.send_otp_email(user.email, otp)
    
    return {"message": "Jika email terdaftar, OTP telah dikirim."}

@router.post("/verify-otp")
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="OTP tidak valid.")
        
    otp_record = db.query(PasswordResetOTP).filter(PasswordResetOTP.user_id == user.id).first()
    if not otp_record:
        raise HTTPException(status_code=400, detail="OTP tidak valid atau kadaluarsa.")
        
    if datetime.utcnow() > otp_record.expires_at:
        db.delete(otp_record)
        db.commit()
        raise HTTPException(status_code=400, detail="OTP telah kadaluarsa.")
        
    if otp_record.attempts >= 5:
        db.delete(otp_record)
        db.commit()
        raise HTTPException(status_code=400, detail="Terlalu banyak percobaan. Silakan minta OTP baru.")
        
    if not verify_password(req.otp, otp_record.otp_hash):
        otp_record.attempts += 1
        db.commit()
        raise HTTPException(status_code=400, detail="OTP salah.")
        
    # Success! Generate a temporary reset token (valid for 10 minutes)
    reset_token = create_access_token(data={"sub": user.email, "type": "reset"}, expires_delta=timedelta(minutes=10))
    
    # Delete OTP record
    db.delete(otp_record)
    
    # Audit Log
    audit = AuditLog(
        user_id=str(user.id),
        module="AUTH",
        action="OTP_VERIFIED",
        entity="USER",
        record_id=str(user.id)
    )
    db.add(audit)
    db.commit()
    
    return {"message": "OTP valid.", "reset_token": reset_token}

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(req.reset_token, settings.SECRET_KEY, algorithms=["HS256"])
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        if email is None or token_type != "reset":
            raise HTTPException(status_code=401, detail="Token tidak valid.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token tidak valid atau kadaluarsa.")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan.")
        
    user.password_hash = get_password_hash(req.new_password)
    
    # Audit Log
    audit = AuditLog(
        user_id=str(user.id),
        module="AUTH",
        action="PASSWORD_RESET_SUCCESS",
        entity="USER",
        record_id=str(user.id)
    )
    db.add(audit)
    db.commit()
    
    return {"message": "Sandi berhasil diubah. Silakan login."}
