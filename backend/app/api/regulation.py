from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models.regulation import Regulation
from app.services.regulation.regulation_service import RegulationService

router = APIRouter()

@router.get("/")
def get_regulations(db: Session = Depends(get_db)):
    return db.query(Regulation).all()

@router.post("/")
def create_regulation(reg_data: dict, db: Session = Depends(get_db)):
    return RegulationService.create_regulation(db, reg_data)

@router.post("/{regulation_id}/activate")
def activate_regulation(regulation_id: int, db: Session = Depends(get_db)):
    reg = db.query(Regulation).filter(Regulation.id == regulation_id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Regulasi tidak ditemukan")
    reg.status = "ACTIVE"
    db.commit()
    return {"status": "success"}
