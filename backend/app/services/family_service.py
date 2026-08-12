from sqlalchemy.orm import Session
from app.database.models.family import FamilyMember, FamilyAllowanceRecord
from app.database.models.events import EmployeeLifeEvent

class FamilyService:
    @staticmethod
    def add_family_member(db: Session, employee_id: int, data: dict):
        member = FamilyMember(
            employee_id=employee_id,
            relationship_type=data.get("relationship_type"),
            name=data.get("name"),
            gender=data.get("gender"),
            birth_date=data.get("birth_date"),
            marriage_date=data.get("marriage_date")
        )
        db.add(member)
        db.commit()
        db.refresh(member)
        
        # Trigger Family Allowance Review Reminder via ReminderEngine
        from app.services.reminder_engine import ReminderEngine
        ReminderEngine.generate_reminder(
            db=db,
            employee_id=employee_id,
            reminder_type="TUNJANGAN_KELUARGA",
            reference_type="family_members",
            reference_id=member.id,
            title="Perubahan Data Keluarga",
            description="Terdapat penambahan/perubahan anggota keluarga. Periksa kembali hak tunjangan.",
            due_date=None,
            priority="HIGH"
        )
        return member

class LifeEventService:
    @staticmethod
    def record_event(db: Session, employee_id: int, event_type: str, event_date, description: str):
        event = EmployeeLifeEvent(
            employee_id=employee_id,
            event_type=event_type,
            event_date=event_date,
            description=description
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        
        from app.services.reminder_engine import ReminderEngine
        if event_type in ["MARRIAGE", "CHILD_BIRTH", "DIVORCE"]:
            ReminderEngine.generate_reminder(
                db=db,
                employee_id=employee_id,
                reminder_type="KELUARGA",
                reference_type="employee_life_events",
                reference_id=event.id,
                title=f"Peristiwa Baru: {event_type}",
                description="Peristiwa baru dicatat. Mohon perbarui data keluarga dan periksa dokumen pendukung.",
                due_date=None,
                priority="HIGH"
            )
        return event
