from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models.mass_update import MassUpdateJob
from app.services.regulation.mass_update_service import MassUpdateEngine

router = APIRouter()

@router.get("/")
def get_mass_updates(db: Session = Depends(get_db)):
    return db.query(MassUpdateJob).all()

@router.post("/")
def create_mass_update(data: dict, db: Session = Depends(get_db)):
    # data: regulation_id, module, operation_type
    job = MassUpdateEngine.create_job(
        db, 
        regulation_id=data.get("regulation_id"),
        module=data.get("module"),
        operation_type=data.get("operation_type"),
        created_by="admin"
    )
    return job

@router.post("/{job_id}/analyze")
def analyze_mass_update(job_id: str, db: Session = Depends(get_db)):
    return MassUpdateEngine.analyze_impact(db, job_id)

@router.post("/{job_id}/approve")
def approve_mass_update(job_id: str, db: Session = Depends(get_db)):
    success = MassUpdateEngine.approve_job(db, job_id, "admin")
    if not success:
        raise HTTPException(status_code=400, detail="Approval failed or invalid status")
    return {"status": "success"}

@router.post("/{job_id}/execute")
def execute_mass_update(job_id: str, db: Session = Depends(get_db)):
    return MassUpdateEngine.execute_job(db, job_id, "admin")

@router.post("/{job_id}/rollback")
def rollback_mass_update(job_id: str, db: Session = Depends(get_db)):
    return MassUpdateEngine.rollback_job(db, job_id)
