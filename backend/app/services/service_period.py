import datetime
from sqlalchemy.orm import Session
from app.database.models import EmployeeServicePeriod

class ServicePeriodCalculationService:
    
    @staticmethod
    def normalize_months(years: int, months: int) -> tuple[int, int]:
        """Normalizes months to years and months. E.g., 2 years 15 months -> 3 years 3 months."""
        extra_years = months // 12
        remaining_months = months % 12
        return years + extra_years, remaining_months

    @staticmethod
    def calculate_total(base_years: int, base_months: int, adjustment_years: int, adjustment_months: int) -> tuple[int, int]:
        """Calculates total normalized service period."""
        total_years = base_years + adjustment_years
        total_months = base_months + adjustment_months
        return ServicePeriodCalculationService.normalize_months(total_years, total_months)

    @staticmethod
    def get_current_service_period(db: Session, employee_id: int):
        """
        Gets the most recent official service period for the employee based on effective_date.
        This must be the ONLY source of truth for KGB Engine.
        """
        record = db.query(EmployeeServicePeriod).filter(
            EmployeeServicePeriod.employee_id == employee_id
        ).order_by(
            EmployeeServicePeriod.effective_date.desc(),
            EmployeeServicePeriod.created_at.desc()
        ).first()
        
        return record

    @staticmethod
    def create_manual_service_period(
        db: Session, 
        employee_id: int, 
        effective_date: datetime.date,
        base_years: int,
        base_months: int,
        adjustment_years: int,
        adjustment_months: int,
        document_number: str = None,
        document_date: datetime.date = None,
        notes: str = None,
        created_by: str = None
    ) -> EmployeeServicePeriod:
        """Creates a manual service period record."""
        total_y, total_m = ServicePeriodCalculationService.calculate_total(
            base_years, base_months, adjustment_years, adjustment_months
        )
        
        new_record = EmployeeServicePeriod(
            employee_id=employee_id,
            effective_date=effective_date,
            base_years=base_years,
            base_months=base_months,
            adjustment_years=adjustment_years,
            adjustment_months=adjustment_months,
            total_years=total_y,
            total_months=total_m,
            document_number=document_number,
            document_date=document_date,
            notes=notes,
            input_method="MANUAL",
            created_by=created_by
        )
        
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record
