import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Boolean
from app.database.session import Base

class KGBRule(Base):
    __tablename__ = "kgb_rules"
    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String, nullable=False)
    version = Column(Integer, nullable=False, default=1)
    effective_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    employee_status = Column(String, nullable=True)
    asn_status = Column(String, nullable=True)
    calculation_method = Column(String, nullable=False, default="INTERVAL")
    interval_years = Column(Integer, nullable=False, default=2)
    interval_months = Column(Integer, nullable=False, default=0)
    requires_performance = Column(Boolean, default=False)
    minimum_performance_value = Column(Integer, nullable=True)
    requires_active_status = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    parameters_json = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)

class KGBRecord(Base):
    __tablename__ = "kgb_records"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    rank_id = Column(Integer, ForeignKey("ranks.id"), nullable=False)
    rank_code_snapshot = Column(String, nullable=False)
    rank_name_snapshot = Column(String, nullable=False)
    masa_kerja_years = Column(Integer, nullable=False)
    masa_kerja_months = Column(Integer, nullable=False)
    tmt_kgb = Column(Date, nullable=False)
    tmt_kgb_next = Column(Date, nullable=True)
    gaji_pokok_before = Column(Integer, nullable=True)
    gaji_pokok_after = Column(Integer, nullable=False)
    document_number = Column(String, nullable=True)
    document_date = Column(Date, nullable=True)
    document_id = Column(String, ForeignKey("employee_documents.id"), nullable=True)
    status = Column(String, nullable=False, default="DRAFT") # DRAFT, SUBMITTED, VERIFIED, APPROVED, REJECTED, CANCELLED, COMPLETED
    source_type = Column(String, nullable=False, default="MANUAL")
    source_file_name = Column(String, nullable=True)
    import_batch_id = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)

class KGBRecordHistory(Base):
    __tablename__ = "kgb_record_history"
    id = Column(Integer, primary_key=True, index=True)
    kgb_record_id = Column(Integer, ForeignKey("kgb_records.id"), nullable=False)
    old_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    reason = Column(String, nullable=True)
    changed_by = Column(String, nullable=True)
    changed_at = Column(DateTime, default=datetime.datetime.utcnow)

class KGBRecordDocument(Base):
    __tablename__ = "kgb_record_documents"
    id = Column(Integer, primary_key=True, index=True)
    kgb_record_id = Column(Integer, ForeignKey("kgb_records.id"), nullable=False)
    employee_document_id = Column(String, ForeignKey("employee_documents.id"), nullable=False)
    document_role = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)

class KGBCalculationSnapshot(Base):
    __tablename__ = "kgb_calculation_snapshots"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    latest_kgb_id = Column(Integer, ForeignKey("kgb_records.id"), nullable=True)
    rule_id = Column(Integer, ForeignKey("kgb_rules.id"), nullable=True)
    rule_version = Column(Integer, nullable=True)
    service_period_years = Column(Integer, nullable=True)
    service_period_months = Column(Integer, nullable=True)
    service_period_source_id = Column(Integer, ForeignKey("employee_service_periods.id"), nullable=True)
    next_kgb_date = Column(Date, nullable=True)
    projected_rank_id = Column(Integer, ForeignKey("ranks.id"), nullable=True)
    projected_salary = Column(Integer, nullable=True)
    eligibility_status = Column(String, nullable=False, default="INSUFFICIENT_DATA")
    warnings_json = Column(String, nullable=True)
    calculation_version = Column(String, nullable=True)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)
    calculated_by = Column(String, nullable=True)

class KGBAdjustment(Base):
    __tablename__ = "kgb_adjustments"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    kgb_record_id = Column(Integer, ForeignKey("kgb_records.id"), nullable=False)
    adjustment_type = Column(String, nullable=False)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    reason = Column(String, nullable=False)
    document_id = Column(String, ForeignKey("employee_documents.id"), nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
