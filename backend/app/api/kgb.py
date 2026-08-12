from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models.kgb import KGBRule, KGBRecord, KGBCalculationSnapshot
from app.services.kgb_service import KGBService, KGBCalculationService

router = APIRouter()

@router.get("/rules")
def get_kgb_rules(db: Session = Depends(get_db)):
    return db.query(KGBRule).all()

@router.get("/latest/{employee_id}")
def get_latest_kgb(employee_id: int, db: Session = Depends(get_db)):
    latest = KGBService.get_latest_kgb(db, employee_id)
    if not latest:
        raise HTTPException(status_code=404, detail="KGB terakhir tidak ditemukan")
    return latest

@router.post("/calculate/{employee_id}")
def calculate_kgb(employee_id: int, db: Session = Depends(get_db)):
    try:
        result = KGBCalculationService.recalculate_employee(db, employee_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@router.get("/projection/{employee_id}")
def get_kgb_projection(employee_id: int, db: Session = Depends(get_db)):
    snapshot = db.query(KGBCalculationSnapshot).filter(
        KGBCalculationSnapshot.employee_id == employee_id
    ).order_by(KGBCalculationSnapshot.calculated_at.desc()).first()
    
    if not snapshot:
        # Request a new calculation if no snapshot exists
        snapshot = KGBCalculationService.recalculate_employee(db, employee_id)
        
    return snapshot
