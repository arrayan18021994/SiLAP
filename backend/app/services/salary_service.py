import datetime
from sqlalchemy.orm import Session
from app.database.models.salary import SalaryTable, SalaryRegulation

class SalaryCalculationService:
    @staticmethod
    def get_salary(db: Session, rank_id: int, service_period_years: int, effective_date: datetime.date):
        """
        Lookup the dynamic salary based on Rank, Service Period Years, and the effective regulation.
        """
        # Get the active regulation for the effective_date
        regulation = db.query(SalaryRegulation).filter(
            SalaryRegulation.effective_date <= effective_date
        ).order_by(SalaryRegulation.effective_date.desc()).first()

        if not regulation:
            return None, None

        # Get the salary table entry
        salary_entry = db.query(SalaryTable).filter(
            SalaryTable.regulation_id == regulation.id,
            SalaryTable.rank_id == rank_id,
            SalaryTable.service_period_years == service_period_years
        ).first()

        if not salary_entry:
            return None, regulation.id

        return salary_entry.salary_amount, regulation.id
