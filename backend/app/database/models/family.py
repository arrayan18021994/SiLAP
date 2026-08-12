import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from app.database.session import Base

class FamilyMember(Base):
    __tablename__ = "family_members"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    relationship_type = Column(String, nullable=False) # SPOUSE, CHILD
    name = Column(String, nullable=False)
    gender = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)
    marriage_date = Column(Date, nullable=True)
    status = Column(String, nullable=False, default="ACTIVE") # ACTIVE, INACTIVE
    document_number = Column(String, nullable=True)
    document_date = Column(Date, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class FamilyAllowanceRecord(Base):
    __tablename__ = "family_allowance_records"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    family_member_id = Column(Integer, ForeignKey("family_members.id"), nullable=False)
    allowance_type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="PENDING_DATA") # ACTIVE, INACTIVE, PENDING_DATA
    effective_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    notes = Column(String, nullable=True)
    document_id = Column(String, ForeignKey("employee_documents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
