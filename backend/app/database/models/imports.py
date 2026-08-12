import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database.session import Base

class ImportBatch(Base):
    __tablename__ = "import_batches"
    id = Column(String, primary_key=True, index=True)
    module = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    template_version = Column(String, nullable=True)
    total_rows = Column(Integer, default=0)
    valid_rows = Column(Integer, default=0)
    warning_rows = Column(Integer, default=0)
    error_rows = Column(Integer, default=0)
    successful_rows = Column(Integer, default=0)
    failed_rows = Column(Integer, default=0)
    status = Column(String, nullable=False)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class ImportError(Base):
    __tablename__ = "import_errors"
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String, ForeignKey("import_batches.id"), nullable=False)
    row_number = Column(Integer, nullable=False)
    field_name = Column(String, nullable=True)
    error_code = Column(String, nullable=True)
    message = Column(String, nullable=False)
    raw_value = Column(String, nullable=True)
    severity = Column(String, default="ERROR")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
