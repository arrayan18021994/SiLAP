import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database.session import Base

class MassUpdateJob(Base):
    __tablename__ = "mass_update_jobs"
    id = Column(String, primary_key=True, index=True)
    job_number = Column(String, unique=True, index=True, nullable=False)
    regulation_id = Column(Integer, ForeignKey("regulations.id"), nullable=True)
    regulation_version_id = Column(Integer, ForeignKey("regulation_versions.id"), nullable=True)
    module = Column(String, nullable=False)
    operation_type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="DRAFT") # DRAFT, ANALYZING, PREVIEW_READY, PENDING_APPROVAL, APPROVED, EXECUTING, COMPLETED, FAILED, CANCELLED, ROLLED_BACK
    
    total_records = Column(Integer, default=0)
    affected_records = Column(Integer, default=0)
    warning_records = Column(Integer, default=0)
    error_records = Column(Integer, default=0)
    
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    
    executed_by = Column(String, nullable=True)
    executed_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    rollback_available = Column(String, nullable=True) # YES, NO
    rollback_block_reason = Column(String, nullable=True)
    
    description = Column(String, nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MassUpdateItem(Base):
    __tablename__ = "mass_update_items"
    id = Column(Integer, primary_key=True, index=True)
    mass_update_job_id = Column(String, ForeignKey("mass_update_jobs.id"), nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    operation = Column(String, nullable=False) # CREATE, UPDATE, DELETE
    old_value_json = Column(String, nullable=True)
    new_value_json = Column(String, nullable=True)
    impact_level = Column(String, nullable=False, default="INFO")
    status = Column(String, nullable=False, default="PENDING")
    error_code = Column(String, nullable=True)
    error_message = Column(String, nullable=True)
    processed_at = Column(DateTime, nullable=True)

class RecalculationTask(Base):
    __tablename__ = "recalculation_tasks"
    id = Column(Integer, primary_key=True, index=True)
    mass_update_job_id = Column(String, ForeignKey("mass_update_jobs.id"), nullable=False)
    module = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    status = Column(String, nullable=False, default="PENDING") # PENDING, PROCESSING, COMPLETED, FAILED, SKIPPED
    error_message = Column(String, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
