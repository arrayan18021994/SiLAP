import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey
from app.database.session import Base

class EmployeeLifeEvent(Base):
    __tablename__ = "employee_life_events"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    event_type = Column(String, nullable=False) # MARRIAGE, CHILD_BIRTH, DIVORCE, FAMILY_CHANGE, OTHER
    event_date = Column(Date, nullable=False)
    description = Column(String, nullable=True)
    document_id = Column(String, ForeignKey("employee_documents.id"), nullable=True)
    notes = Column(String, nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
