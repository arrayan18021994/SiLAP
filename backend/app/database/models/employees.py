import datetime
from sqlalchemy import Column, Integer, String, DateTime, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database.session import Base

class Organization(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    code = Column(String, nullable=True)
    name = Column(String, nullable=False)
    short_name = Column(String, nullable=True)
    organization_type = Column(String, nullable=True)
    address = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Position(Base):
    __tablename__ = "positions"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, nullable=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Rank(Base):
    __tablename__ = "ranks"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, nullable=False)
    name = Column(String, nullable=False)
    asn_status = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    nip = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    front_title = Column(String, nullable=True)
    back_title = Column(String, nullable=True)
    birth_place = Column(String, nullable=True)
    birth_date = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    nik = Column(String, nullable=True)
    asn_status = Column(String, nullable=False)
    employment_status = Column(String, nullable=False)
    marital_status = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    tmt_cpns = Column(Date, nullable=True)
    tmt_pns = Column(Date, nullable=True)
    mkg_years = Column(Integer, default=0, nullable=True)
    mkg_months = Column(Integer, default=0, nullable=True)
    tmt_mkg = Column(Date, nullable=True)
    rank = Column(String, nullable=True)
    position = Column(String, nullable=True)
    opd = Column(String, nullable=True)
    unit_kerja = Column(String, nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    notes = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)

    organization = relationship("Organization")

class EmployeePosition(Base):
    __tablename__ = "employee_positions"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    position_id = Column(Integer, ForeignKey("positions.id"), nullable=False)
    position_name_snapshot = Column(String, nullable=False)
    position_type = Column(String, nullable=False)
    organization_id = Column(Integer, ForeignKey("organizations.id"), nullable=True)
    tmt_position = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    sk_number = Column(String, nullable=True)
    sk_date = Column(Date, nullable=True)
    document_id = Column(String, nullable=True)
    is_current = Column(Boolean, default=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)

class EmployeeRank(Base):
    __tablename__ = "employee_ranks"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    rank_id = Column(Integer, ForeignKey("ranks.id"), nullable=False)
    rank_name_snapshot = Column(String, nullable=False)
    rank_code_snapshot = Column(String, nullable=False)
    tmt_rank = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    sk_number = Column(String, nullable=True)
    sk_date = Column(Date, nullable=True)
    document_id = Column(String, nullable=True)
    is_current = Column(Boolean, default=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    created_by = Column(String, nullable=True)

class EmployeeServicePeriod(Base):
    __tablename__ = "employee_service_periods"
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    effective_date = Column(Date, nullable=False)
    base_years = Column(Integer, default=0)
    base_months = Column(Integer, default=0)
    adjustment_years = Column(Integer, default=0)
    adjustment_months = Column(Integer, default=0)
    total_years = Column(Integer, default=0)
    total_months = Column(Integer, default=0)
    document_number = Column(String, nullable=True)
    document_date = Column(Date, nullable=True)
    document_id = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    input_method = Column(String, nullable=False)
    source_file_name = Column(String, nullable=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
