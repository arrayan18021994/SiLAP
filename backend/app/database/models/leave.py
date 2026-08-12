import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

class LeaveType(Base):
    __tablename__ = "leave_types"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)

class LeaveRule(Base):
    __tablename__ = "leave_rules"
    id = Column(Integer, primary_key=True, index=True)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    rule_name = Column(String, nullable=False)
    version = Column(Integer, nullable=False, default=1)
    effective_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    employee_status = Column(String, nullable=True)
    asn_status = Column(String, nullable=True)
    entitlement_unit = Column(String, nullable=False) # e.g. DAYS
    entitlement_value = Column(Integer, nullable=False)
    calculation_method = Column(String, nullable=False) # e.g. FIXED, CALENDAR_YEAR
    carry_forward_allowed = Column(Boolean, default=False)
    maximum_carry_forward = Column(Integer, default=0)
    minimum_service_years = Column(Integer, default=0)
    minimum_service_months = Column(Integer, default=0)
    requires_document = Column(Boolean, default=False)
    requires_approval = Column(Boolean, default=True)
    counts_against_balance_status = Column(String, nullable=False, default="APPROVED,COMPLETED")
    is_active = Column(Boolean, default=True)
    parameters_json = Column(String, nullable=True) # For extensible logic
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)

class LeavePeriod(Base):
    __tablename__ = "leave_periods"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    rule_id = Column(Integer, ForeignKey("leave_rules.id"), nullable=False)
    status = Column(String, nullable=False, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class LeaveEntitlement(Base):
    __tablename__ = "leave_entitlements"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    leave_period_id = Column(Integer, ForeignKey("leave_periods.id"), nullable=False)
    rule_id = Column(Integer, ForeignKey("leave_rules.id"), nullable=False)
    entitlement = Column(Integer, nullable=False, default=0)
    carry_forward = Column(Integer, nullable=False, default=0)
    total_available = Column(Integer, nullable=False, default=0)
    used = Column(Integer, nullable=False, default=0)
    remaining = Column(Integer, nullable=False, default=0)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)
    calculated_by = Column(String, nullable=True)
    calculation_version = Column(String, nullable=True)

class LeaveTransaction(Base):
    __tablename__ = "leave_transactions"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    leave_period_id = Column(Integer, ForeignKey("leave_periods.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_days = Column(Integer, nullable=False)
    reason = Column(String, nullable=True)
    request_number = Column(String, nullable=True)
    request_date = Column(Date, nullable=True)
    approval_number = Column(String, nullable=True)
    approval_date = Column(Date, nullable=True)
    status = Column(String, nullable=False, default="DRAFT") # DRAFT, SUBMITTED, VERIFIED, APPROVED, REJECTED, CANCELLED, COMPLETED
    notes = Column(String, nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_by = Column(String, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class LeaveTransactionHistory(Base):
    __tablename__ = "leave_transaction_history"
    id = Column(Integer, primary_key=True, index=True)
    leave_transaction_id = Column(Integer, ForeignKey("leave_transactions.id"), nullable=False)
    old_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    reason = Column(String, nullable=True)
    changed_by = Column(String, nullable=True)
    changed_at = Column(DateTime, default=datetime.datetime.utcnow)

class LeaveTransactionDocument(Base):
    __tablename__ = "leave_transaction_documents"
    id = Column(Integer, primary_key=True, index=True)
    leave_transaction_id = Column(Integer, ForeignKey("leave_transactions.id"), nullable=False)
    employee_document_id = Column(String, ForeignKey("employee_documents.id"), nullable=False)
    document_role = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)

class LeaveBalanceSnapshot(Base):
    __tablename__ = "leave_balance_snapshots"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    leave_period_id = Column(Integer, ForeignKey("leave_periods.id"), nullable=False)
    rule_id = Column(Integer, ForeignKey("leave_rules.id"), nullable=False)
    entitlement = Column(Integer, nullable=False)
    carry_forward = Column(Integer, nullable=False)
    used = Column(Integer, nullable=False)
    adjustment = Column(Integer, nullable=False, default=0)
    remaining = Column(Integer, nullable=False)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)
    calculated_by = Column(String, nullable=True)
    calculation_version = Column(String, nullable=True)

class LeaveBalanceAdjustment(Base):
    __tablename__ = "leave_balance_adjustments"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    leave_period_id = Column(Integer, ForeignKey("leave_periods.id"), nullable=False)
    days = Column(Integer, nullable=False)
    adjustment_type = Column(String, nullable=False) # INCREASE, DECREASE
    reason = Column(String, nullable=False)
    document_id = Column(String, ForeignKey("employee_documents.id"), nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
