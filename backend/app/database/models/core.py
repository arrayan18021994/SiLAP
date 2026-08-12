import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database.session import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String)
    role = Column(String, nullable=False) 
    account_status = Column(String, nullable=False, default="PENDING") 
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    last_login_at = Column(DateTime, nullable=True)

class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    otp_hash = Column(String, nullable=False)
    attempts = Column(Integer, default=0)
    expires_at = Column(DateTime, nullable=False)
    requested_at = Column(DateTime, default=datetime.datetime.utcnow)


class Installation(Base):
    __tablename__ = "installations"
    id = Column(Integer, primary_key=True, index=True)
    installation_id = Column(String, unique=True, index=True, nullable=False)
    installation_name = Column(String)
    installation_status = Column(String, nullable=False, default="NEW") 
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    activated_at = Column(DateTime, nullable=True)
    last_seen_at = Column(DateTime, nullable=True)

class InstallationSecurity(Base):
    __tablename__ = "installation_security"
    installation_id = Column(String, primary_key=True, index=True)
    activation_credential_hash = Column(String, nullable=False)
    credential_version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    last_rebind_at = Column(DateTime, nullable=True)

class OrganizationSettings(Base):
    __tablename__ = "organization_settings"
    id = Column(Integer, primary_key=True, index=True)
    government_name = Column(String)
    agency_name = Column(String)
    address = Column(String)
    phone = Column(String)
    email = Column(String)
    logo_path = Column(String) # Store logo path/base64

class LetterheadSettings(Base):
    __tablename__ = "letterhead_settings"
    id = Column(Integer, primary_key=True, index=True)
    # The letterhead will pull identity data from OrganizationSettings dynamically on frontend/generation
    # But if we need to store specific letterhead overrides, we put them here. The prompt implies it's automatic.
    # We will keep header_text if there's any custom tagline, but otherwise it's just format.
    header_text = Column(String)
    logo_path = Column(String) # If they want a specific logo for letterhead, though prompt says it uses OrganizationSettings

class DocumentFormatSettings(Base):
    __tablename__ = "document_format_settings"
    id = Column(Integer, primary_key=True, index=True)
    paper_size = Column(String, default="A4") # A4, F4, Letter, Custom
    orientation = Column(String, default="Portrait") # Portrait, Landscape
    margin_top = Column(Integer, default=3) # in cm
    margin_bottom = Column(Integer, default=3)
    margin_left = Column(Integer, default=4)
    margin_right = Column(Integer, default=3)

class DisplaySettings(Base):
    __tablename__ = "display_settings"
    id = Column(Integer, primary_key=True, index=True)
    theme = Column(String, default="Light") # System, Light, Dark
    size = Column(String, default="Normal") # Compact, Normal, Large
    sidebar_open = Column(Integer, default=1) # 1 for open, 0 for closed
    time_format = Column(String, default="24 Jam") # 24 Jam, 12 Jam

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    module = Column(String)
    action = Column(String)
    entity = Column(String)
    record_id = Column(String)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
