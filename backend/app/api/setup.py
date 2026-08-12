import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import datetime

from app.database.session import get_db
from app.database.models import OrganizationSettings, LetterheadSettings, User, Installation, InstallationSecurity
from app.core.installation import determine_system_status, InstallationState, write_local_identity
from app.core.security import get_password_hash, get_activation_credential_hash, verify_activation_credential

router = APIRouter()

class OrgSetup(BaseModel):
    government_name: str
    agency_name: str
    agency_short_name: str
    address: str
    phone: str
    email: str
    website: str

class LetterheadSetup(BaseModel):
    header_text: str
    footer_text: str
    # other fields...

class OwnerSetup(BaseModel):
    email: str
    password: str
    full_name: str
    activation_credential: str

class ActivateRequest(BaseModel):
    pass # might need more fields in future

class VerifyActivationRequest(BaseModel):
    activation_credential: str

class RebindRequest(BaseModel):
    activation_credential: str

def check_new_state(db: Session):
    state = determine_system_status(db)
    if state != InstallationState.NEW:
        raise HTTPException(status_code=400, detail="System is not in NEW state.")

@router.post("/organization")
def setup_organization(data: OrgSetup, db: Session = Depends(get_db)):
    check_new_state(db)
    org = OrganizationSettings(**data.dict())
    db.add(org)
    db.commit()
    return {"message": "Organization saved"}

@router.post("/letterhead")
def setup_letterhead(data: LetterheadSetup, db: Session = Depends(get_db)):
    check_new_state(db)
    lh = LetterheadSettings(**data.dict())
    db.add(lh)
    db.commit()
    return {"message": "Letterhead saved"}

@router.post("/owner")
def setup_owner(data: OwnerSetup, db: Session = Depends(get_db)):
    check_new_state(db)
    
    # Create Owner Account
    owner = User(
        email=data.email,
        password_hash=get_password_hash(data.password),
        full_name=data.full_name,
        role="OWNER",
        account_status="ACTIVE"
    )
    db.add(owner)
    
    # Stash activation credential hash for later activation step
    # We create a pending installation record here
    install_id = str(uuid.uuid4())
    installation = Installation(
        installation_id=install_id,
        installation_name="Primary Installation",
        installation_status="SETUP_REQUIRED" # Wait until explicit activate
    )
    db.add(installation)
    
    security = InstallationSecurity(
        installation_id=install_id,
        activation_credential_hash=get_activation_credential_hash(data.activation_credential)
    )
    db.add(security)
    
    db.commit()
    return {"message": "Owner and pending installation created", "installation_id": install_id}

@router.post("/activate")
def activate_installation(db: Session = Depends(get_db)):
    state = determine_system_status(db)
    if state not in [InstallationState.NEW, InstallationState.SETUP_REQUIRED]:
        raise HTTPException(status_code=400, detail="Cannot activate from this state.")
        
    installations = db.query(Installation).filter(Installation.installation_status == "SETUP_REQUIRED").all()
    if not installations:
        raise HTTPException(status_code=400, detail="No pending installation found.")
        
    installation = installations[0]
    installation.installation_status = "ACTIVE"
    installation.activated_at = datetime.datetime.utcnow()
    
    # Write to local identity file
    write_local_identity(installation.installation_id)
    
    db.commit()
    return {"message": "Installation activated successfully"}

@router.post("/verify-activation")
def verify_activation(data: VerifyActivationRequest, db: Session = Depends(get_db)):
    state = determine_system_status(db)
    if state not in [InstallationState.SETUP_REQUIRED, InstallationState.INSTALLATION_MISMATCH]:
        raise HTTPException(status_code=400, detail="Verification not required in current state.")
        
    # We must find the active installation record from the DB
    installations = db.query(Installation).all()
    if not installations:
        raise HTTPException(status_code=404, detail="Installation record not found.")
        
    installation = installations[0] # assuming the main one
    security = db.query(InstallationSecurity).filter_by(installation_id=installation.installation_id).first()
    
    if not security:
        raise HTTPException(status_code=500, detail="Security record missing.")
        
    if not verify_activation_credential(data.activation_credential, security.activation_credential_hash):
        raise HTTPException(status_code=401, detail="Invalid activation credential.")
        
    return {"message": "Activation credential verified."}

@router.post("/rebind")
def rebind_installation(data: RebindRequest, db: Session = Depends(get_db)):
    # Very similar to verify but actually generates a new ID and binds it
    state = determine_system_status(db)
    if state not in [InstallationState.SETUP_REQUIRED, InstallationState.INSTALLATION_MISMATCH]:
        raise HTTPException(status_code=400, detail="Rebind not permitted in current state.")
        
    installations = db.query(Installation).all()
    if not installations:
        raise HTTPException(status_code=404, detail="Installation record not found.")
        
    old_installation = installations[0]
    security = db.query(InstallationSecurity).filter_by(installation_id=old_installation.installation_id).first()
    
    if not security or not verify_activation_credential(data.activation_credential, security.activation_credential_hash):
        raise HTTPException(status_code=401, detail="Invalid activation credential.")
        
    # Generate new installation ID
    new_install_id = str(uuid.uuid4())
    
    # Deactivate old (or just delete it/update it depending on strategy)
    # Let's just update the existing one for simplicity in Phase 0
    old_installation.installation_id = new_install_id
    old_installation.installation_status = "ACTIVE"
    old_installation.activated_at = datetime.datetime.utcnow()
    
    # Update security record
    # Delete old, create new
    db.delete(security)
    db.flush()
    new_security = InstallationSecurity(
        installation_id=new_install_id,
        activation_credential_hash=get_activation_credential_hash(data.activation_credential),
        last_rebind_at=datetime.datetime.utcnow()
    )
    db.add(new_security)
    
    # Write to local identity file
    write_local_identity(new_install_id)
    
    db.commit()
    return {"message": "Rebind successful. Installation is now ACTIVE."}
