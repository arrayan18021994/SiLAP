import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Boolean
from app.database.session import Base

class ReminderSetting(Base):
    __tablename__ = "reminder_settings"
    id = Column(Integer, primary_key=True, index=True)
    reminder_type = Column(String, unique=True, nullable=False)
    days_before = Column(Integer, nullable=False, default=30)
    is_active = Column(Boolean, default=True)

class ReminderRecord(Base):
    __tablename__ = "reminder_records"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    reminder_type = Column(String, nullable=False) # KGB, GAJI_BERKALA, CUTI, DOKUMEN, KELUARGA, dll
    reference_type = Column(String, nullable=True) # Tabel rujukan (misal: administrative_records)
    reference_id = Column(Integer, nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    due_date = Column(Date, nullable=True)
    reminder_date = Column(Date, nullable=True)
    priority = Column(String, nullable=False, default="NORMAL") # LOW, NORMAL, HIGH, URGENT
    status = Column(String, nullable=False, default="UPCOMING") # UPCOMING, DUE, OVERDUE, COMPLETED, DISMISSED
    is_read = Column(Boolean, default=False)
    is_dismissed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
