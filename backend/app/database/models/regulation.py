import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Boolean
from app.database.session import Base

class Regulation(Base):
    __tablename__ = "regulations"
    id = Column(Integer, primary_key=True, index=True)
    regulation_type = Column(String, nullable=False)
    regulation_number = Column(String, nullable=False)
    regulation_name = Column(String, nullable=False)
    issuing_authority = Column(String, nullable=True)
    publication_date = Column(Date, nullable=True)
    effective_date = Column(Date, nullable=False)
    status = Column(String, nullable=False, default="DRAFT") # DRAFT, ACTIVE, SUPERSEDED, EXPIRED, CANCELLED
    description = Column(String, nullable=True)
    document_id = Column(String, ForeignKey("employee_documents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)

class RegulationVersion(Base):
    __tablename__ = "regulation_versions"
    id = Column(Integer, primary_key=True, index=True)
    regulation_id = Column(Integer, ForeignKey("regulations.id"), nullable=False)
    version_number = Column(Integer, nullable=False, default=1)
    effective_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    version_status = Column(String, nullable=False, default="ACTIVE")
    change_summary = Column(String, nullable=True)
    source_document_id = Column(String, ForeignKey("employee_documents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)

class RegulationImpactAnalysis(Base):
    __tablename__ = "regulation_impact_analysis"
    id = Column(Integer, primary_key=True, index=True)
    regulation_id = Column(Integer, ForeignKey("regulations.id"), nullable=False)
    regulation_version_id = Column(Integer, ForeignKey("regulation_versions.id"), nullable=False)
    mass_update_job_id = Column(String, nullable=True) # Linked to mass_update_jobs.id
    module = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    impact_type = Column(String, nullable=False) # CREATE, UPDATE, RECALCULATE, NO_CHANGE, WARNING
    impact_level = Column(String, nullable=False, default="INFO") # INFO, WARNING, CRITICAL
    old_value_json = Column(String, nullable=True)
    new_value_json = Column(String, nullable=True)
    reason = Column(String, nullable=True)
    impact_status = Column(String, nullable=False, default="PENDING")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RegulationDependency(Base):
    __tablename__ = "regulation_dependencies"
    id = Column(Integer, primary_key=True, index=True)
    source_module = Column(String, nullable=False)
    source_entity = Column(String, nullable=False)
    target_module = Column(String, nullable=False)
    target_entity = Column(String, nullable=False)
    dependency_type = Column(String, nullable=False) # e.g., CALCULATE_NEXT_KGB, UPDATE_LEAVE_BALANCE
    data_scope = Column(String, nullable=False, default="CURRENT") # CURRENT, HISTORICAL, PROJECTED
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
