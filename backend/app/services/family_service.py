from sqlalchemy.orm import Session
from app.database.models.family import FamilyMember, FamilyAllowanceRecord
from app.database.models.events import EmployeeLifeEvent

import datetime

def parse_date_val(d_val):
    if not d_val:
        return None
    if isinstance(d_val, (datetime.date, datetime.datetime)):
        return d_val if isinstance(d_val, datetime.date) else d_val.date()
    d_str = str(d_val).strip()
    for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%Y/%m/%d"):
        try:
            return datetime.datetime.strptime(d_str, fmt).date()
        except ValueError:
            pass
    return None

class FamilyService:
    @staticmethod
    def add_family_member(db: Session, employee_id: int, data: dict):
        member = FamilyMember(
            employee_id=employee_id,
            relationship_type=data.get("relationship_type") or data.get("relationship") or "FAMILY",
            name=data.get("name") or "",
            gender=data.get("gender"),
            nik=data.get("nik"),
            birth_place=data.get("birth_place"),
            birth_date=parse_date_val(data.get("birth_date")),
            marriage_date=parse_date_val(data.get("marriage_date")),
            job=data.get("job") or data.get("pekerjaan"),
            child_status=data.get("child_status") or data.get("status_anak"),
            education=data.get("education") or data.get("pendidikan"),
            document_number=data.get("document_number") or data.get("nik") or data.get("akta_number"),
            notes=data.get("notes")
        )
        db.add(member)
        db.commit()
        db.refresh(member)
        
        # Trigger Family Allowance Review Reminder via ReminderEngine
        try:
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
        except Exception as e:
            print("Reminder engine trigger error:", e)

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
