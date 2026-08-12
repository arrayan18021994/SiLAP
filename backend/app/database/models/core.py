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
    agency_short_name = Column(String)
    address = Column(String)
    phone = Column(String)
    email = Column(String)
    website = Column(String)

class LetterheadSettings(Base):
    __tablename__ = "letterhead_settings"
    id = Column(Integer, primary_key=True, index=True)
    government_name = Column(String)
    agency_name = Column(String)
    address = Column(String)
    contact = Column(String)
    header_text = Column(String)
    footer_text = Column(String)
    logo_path = Column(String)
    secondary_logo_path = Column(String)

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
