from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models.reminders import ReminderRecord
from app.services.reminder_engine import ReminderEngine

router = APIRouter()

@router.get("/")
def get_reminders(db: Session = Depends(get_db)):
    return db.query(ReminderRecord).filter(ReminderRecord.is_dismissed == False, ReminderRecord.status != "COMPLETED").all()

@router.post("/refresh")
def refresh_reminders(db: Session = Depends(get_db)):
    ReminderEngine.refresh_gaji_berkala(db)
    return {"status": "success"}

@router.post("/{id}/dismiss")
def dismiss_reminder(id: int, db: Session = Depends(get_db)):
    if ReminderEngine.dismiss(db, id):
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Reminder not found")

@router.post("/{id}/complete")
def complete_reminder(id: int, db: Session = Depends(get_db)):
    if ReminderEngine.complete(db, id):
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Reminder not found")
