from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models.events import EmployeeLifeEvent
from app.services.family_service import LifeEventService

router = APIRouter()

@router.get("/{employee_id}")
def get_life_events(employee_id: int, db: Session = Depends(get_db)):
    return db.query(EmployeeLifeEvent).filter(EmployeeLifeEvent.employee_id == employee_id).all()

@router.post("/{employee_id}")
def record_event(employee_id: int, data: dict, db: Session = Depends(get_db)):
    return LifeEventService.record_event(
        db, 
        employee_id, 
        data.get("event_type"), 
        data.get("event_date"), 
        data.get("description")
    )
