from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models.administration import AdministrativeRecord
from app.services.administrative_record_service import AdministrativeRecordService

router = APIRouter()

@router.get("/")
def get_administration_records(db: Session = Depends(get_db)):
    return db.query(AdministrativeRecord).all()

@router.post("/")
def create_record(data: dict, db: Session = Depends(get_db)):
    return AdministrativeRecordService.create_record(db, data.get("employee_id"), data)

@router.post("/{id}/complete")
def complete_record(id: int, db: Session = Depends(get_db)):
    if AdministrativeRecordService.complete_record(db, id):
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Record not found")

@router.post("/{id}/cancel")
def cancel_record(id: int, db: Session = Depends(get_db)):
    if AdministrativeRecordService.cancel_record(db, id):
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Record not found")
