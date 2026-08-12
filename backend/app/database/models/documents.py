import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Date
from app.database.session import Base

class DocumentType(Base):
    __tablename__ = "document_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class EmployeeDocument(Base):
    __tablename__ = "employee_documents"
    id = Column(String, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    document_type_id = Column(Integer, ForeignKey("document_types.id"), nullable=False)
    document_number = Column(String, nullable=True)
    document_date = Column(Date, nullable=True)
    original_file_name = Column(String, nullable=False)
    stored_file_name = Column(String, nullable=False)
    relative_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=True)
    checksum = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)
