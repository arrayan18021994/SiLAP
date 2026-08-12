import datetime
import json
from sqlalchemy.orm import Session
from app.database.models.kgb import (
    KGBRule, KGBRecord, KGBRecordHistory, KGBCalculationSnapshot
)
from app.database.models.employees import Employee, Rank, EmployeeServicePeriod
from app.services.salary_service import SalaryCalculationService

class KGBService:
    @staticmethod
    def get_latest_kgb(db: Session, employee_id: int):
        return db.query(KGBRecord).filter(
            KGBRecord.employee_id == employee_id,
            KGBRecord.status.in_(["VERIFIED", "APPROVED", "COMPLETED"])
        ).order_by(KGBRecord.tmt_kgb.desc()).first()

class KGBRuleService:
    @staticmethod
    def resolve_rule(db: Session, effective_date: datetime.date):
        rule = db.query(KGBRule).filter(
            KGBRule.effective_date <= effective_date,
            KGBRule.is_active == True
        ).order_by(KGBRule.effective_date.desc()).first()
        return rule

class KGBCalculationService:
    @staticmethod
    def calculate_next_kgb(db: Session, employee_id: int):
        # 1. Check employee
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if not employee:
            return {"eligibility_status": "INSUFFICIENT_DATA", "warnings": ["Employee not found"]}
            
        # 2. Get Latest KGB
        latest_kgb = KGBService.get_latest_kgb(db, employee_id)
        if not latest_kgb:
            return {"eligibility_status": "INSUFFICIENT_DATA", "warnings": ["No historical KGB record found"]}
            
        # 3. Resolve Rule
        # In this calculation we project into the future from the last KGB
        projected_tmt = latest_kgb.tmt_kgb.replace(year=latest_kgb.tmt_kgb.year + 2) # Default assumption
        rule = KGBRuleService.resolve_rule(db, projected_tmt)
        if not rule:
            return {"eligibility_status": "INSUFFICIENT_DATA", "warnings": ["No KGB Rule found for the projected date"]}
            
        # Refine projected_tmt with rule interval
        projected_tmt = latest_kgb.tmt_kgb.replace(year=latest_kgb.tmt_kgb.year + rule.interval_years)
        
        # 4. Official Service Period
        # Normally would call ServicePeriodCalculationService, here we fetch the latest record directly
        latest_sp = db.query(EmployeeServicePeriod).filter(
            EmployeeServicePeriod.employee_id == employee_id
        ).order_by(EmployeeServicePeriod.effective_date.desc()).first()
        
        if not latest_sp:
            return {"eligibility_status": "INSUFFICIENT_DATA", "warnings": ["No official service period found"]}
            
        # Calculate Projected Service Period at the time of projected TMT
        # Simple projection: difference between SP effective date and projected_tmt
        days_diff = (projected_tmt - latest_sp.effective_date).days
        years_diff = days_diff // 365
        projected_mkg = latest_sp.total_years + years_diff
        
        # 5. Salary Lookup
        salary_amount, regulation_id = SalaryCalculationService.get_salary(db, latest_kgb.rank_id, projected_mkg, projected_tmt)
        
        warnings = []
        if not salary_amount:
            warnings.append("SALARY DATA NOT CONFIGURED")
            eligibility = "INSUFFICIENT_DATA"
        else:
            eligibility = "ELIGIBLE"
            
        result = {
            "latest_kgb_id": latest_kgb.id,
            "next_kgb_date": projected_tmt,
            "projected_rank_id": latest_kgb.rank_id,
            "projected_service_period_years": projected_mkg,
            "projected_salary": salary_amount,
            "eligibility_status": eligibility,
            "warnings": warnings,
            "rule_id": rule.id,
            "rule_version": rule.version
        }
        
        return result
        
    @staticmethod
    def recalculate_employee(db: Session, employee_id: int):
        result = KGBCalculationService.calculate_next_kgb(db, employee_id)
        
        # Save snapshot
        snapshot = KGBCalculationSnapshot(
            employee_id=employee_id,
            latest_kgb_id=result.get("latest_kgb_id"),
            rule_id=result.get("rule_id"),
            rule_version=result.get("rule_version"),
            service_period_years=result.get("projected_service_period_years"),
            next_kgb_date=result.get("next_kgb_date"),
            projected_rank_id=result.get("projected_rank_id"),
            projected_salary=result.get("projected_salary"),
            eligibility_status=result.get("eligibility_status", "INSUFFICIENT_DATA"),
            warnings_json=json.dumps(result.get("warnings", [])),
            calculation_version="kgb-engine-v1"
        )
        db.add(snapshot)
        db.commit()
        return snapshot
