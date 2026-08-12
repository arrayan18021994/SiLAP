from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import LeaveType, LeaveRule
from app.services.leave_service import LeaveCalculationService, LeavePeriodService

router = APIRouter()

@router.get("/types")
def get_leave_types(db: Session = Depends(get_db)):
    return db.query(LeaveType).filter(LeaveType.is_active == True).all()

@router.post("/periods/ensure")
def ensure_period(data: dict, db: Session = Depends(get_db)):
    # This is an idempotent endpoint that admins or system can call to generate periods
    try:
        period = LeavePeriodService.ensure_period_exists(
            db, 
            employee_id=data['employee_id'],
            leave_type_id=data['leave_type_id'],
            period_start=data['period_start'],
            period_end=data['period_end'],
            rule_id=data['rule_id']
        )
        return {"message": "Periode dipastikan ada", "period_id": period.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/balance/{employee_id}/{leave_type_id}/{leave_period_id}")
def get_balance(employee_id: int, leave_type_id: int, leave_period_id: int, db: Session = Depends(get_db)):
    balance = LeaveCalculationService.calculate_balance(db, employee_id, leave_type_id, leave_period_id)
    if not balance:
        raise HTTPException(status_code=404, detail="Periode cuti tidak ditemukan")
    return balance

# Additional endpoints (CRUD for rules, transactions, workflows, imports) would be added here
