from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models.salary import SalaryTable, SalaryRegulation
from app.services.salary_service import SalaryCalculationService

router = APIRouter()

@router.get("/regulations")
def get_regulations(db: Session = Depends(get_db)):
    return db.query(SalaryRegulation).all()

@router.get("/lookup")
def lookup_salary(rank_id: int, service_period_years: int, effective_date: str, db: Session = Depends(get_db)):
    from datetime import datetime
    try:
        eff_date = datetime.strptime(effective_date, "%Y-%m-%d").date()
    except:
        raise HTTPException(status_code=400, detail="Format tanggal tidak valid. Gunakan YYYY-MM-DD")
        
    salary, reg_id = SalaryCalculationService.get_salary(db, rank_id, service_period_years, eff_date)
    return {"salary_amount": salary, "regulation_id": reg_id}
