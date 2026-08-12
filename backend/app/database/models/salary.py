import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Boolean
from app.database.session import Base

class SalaryRegulation(Base):
    __tablename__ = "salary_regulations"
    id = Column(Integer, primary_key=True, index=True)
    regulation_name = Column(String, nullable=False)
    regulation_number = Column(String, nullable=False)
    effective_date = Column(Date, nullable=False)
    document_id = Column(String, ForeignKey("employee_documents.id"), nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class SalaryTable(Base):
    __tablename__ = "salary_tables"
    id = Column(Integer, primary_key=True, index=True)
    regulation_id = Column(Integer, ForeignKey("salary_regulations.id"), nullable=False)
    effective_date = Column(Date, nullable=False)
    rank_id = Column(Integer, ForeignKey("ranks.id"), nullable=False)
    service_period_years = Column(Integer, nullable=False)
    service_period_months = Column(Integer, nullable=False, default=0)
    salary_amount = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
