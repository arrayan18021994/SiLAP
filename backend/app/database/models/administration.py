import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from app.database.session import Base

class AdministrativeRecord(Base):
    __tablename__ = "administrative_records"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    service_type = Column(String, nullable=False) # PANGKAT, MUTASI, PROMOSI, GAJI_BERKALA, etc
    reference_number = Column(String, nullable=True)
    reference_date = Column(Date, nullable=True)
    description = Column(String, nullable=True)
    status = Column(String, nullable=False, default="PROCESSING") # DRAFT, PROCESSING, COMPLETED, CANCELLED
    due_date = Column(Date, nullable=True)
    completed_date = Column(Date, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)
