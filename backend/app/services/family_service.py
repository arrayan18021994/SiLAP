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
            ReminderEngine.refresh_child_age_reminders(db)
        except Exception as e:
            print("Reminder engine trigger error:", e)

        return member

    @staticmethod
    def get_family_members(db: Session, employee_id: int):
        from app.services.reminder_engine import ReminderEngine
        try:
            ReminderEngine.refresh_child_age_reminders(db)
        except Exception as e:
            print("Refresh child reminders error:", e)

        members = db.query(FamilyMember).filter(FamilyMember.employee_id == employee_id).all()
        result = []
        today = datetime.date.today()
        for m in members:
            age = None
            if m.birth_date:
                bdate = m.birth_date
                age = today.year - bdate.year - ((today.month, today.day) < (bdate.month, bdate.day))
            
            needs_school_letter = False
            rel = (m.relationship_type or "").upper()
            if ("ANAK" in rel or "CHILD" in rel) and age is not None and age >= 21:
                has_letter = bool(
                    (m.school_letter_number and str(m.school_letter_number).strip()) or
                    (m.document_file_name and str(m.document_file_name).strip())
                )
                if has_letter and m.school_letter_valid_until and m.school_letter_valid_until < today:
                    has_letter = False
                needs_school_letter = not has_letter

            result.append({
                "id": m.id,
                "employee_id": m.employee_id,
                "relationship_type": m.relationship_type,
                "name": m.name,
                "gender": m.gender,
                "nik": m.nik,
                "birth_place": m.birth_place,
                "birth_date": str(m.birth_date) if m.birth_date else None,
                "marriage_date": str(m.marriage_date) if m.marriage_date else None,
                "job": m.job,
                "child_status": m.child_status or ("AKTIF" if m.status == "ACTIVE" else "NONAKTIF"),
                "education": m.education,
                "status": m.status,
                "document_number": m.document_number,
                "document_date": str(m.document_date) if m.document_date else None,
                "school_letter_number": m.school_letter_number,
                "school_letter_date": str(m.school_letter_date) if m.school_letter_date else None,
                "school_letter_valid_until": str(m.school_letter_valid_until) if m.school_letter_valid_until else None,
                "document_file_name": m.document_file_name,
                "notes": m.notes,
                "age": age,
                "needs_school_letter": needs_school_letter
            })
        return result

    @staticmethod
    def update_family_member(db: Session, member_id: int, data: dict):
        member = db.query(FamilyMember).filter(FamilyMember.id == member_id).first()
        if not member:
            return None

        if "relationship_type" in data:
            member.relationship_type = data["relationship_type"]
        if "name" in data:
            member.name = data["name"]
        if "gender" in data:
            member.gender = data["gender"]
        if "nik" in data:
            member.nik = data["nik"]
        if "birth_place" in data:
            member.birth_place = data["birth_place"]
        if "birth_date" in data:
            member.birth_date = parse_date_val(data["birth_date"])
        if "marriage_date" in data:
            member.marriage_date = parse_date_val(data["marriage_date"])
        if "job" in data:
            member.job = data["job"]
        if "child_status" in data:
            member.child_status = data["child_status"]
        if "education" in data:
            member.education = data["education"]
        if "status" in data:
            member.status = data["status"]
        if "school_letter_number" in data:
            member.school_letter_number = data["school_letter_number"]
        if "school_letter_date" in data:
            member.school_letter_date = parse_date_val(data["school_letter_date"])
        if "school_letter_valid_until" in data:
            member.school_letter_valid_until = parse_date_val(data["school_letter_valid_until"])
        if "document_file_name" in data:
            member.document_file_name = data["document_file_name"]
        if "notes" in data:
            member.notes = data["notes"]

        db.commit()
        db.refresh(member)

        from app.services.reminder_engine import ReminderEngine
        ReminderEngine.refresh_child_age_reminders(db)
        return member

    @staticmethod
    def upload_surat_kuliah(db: Session, member_id: int, file_name: str, school_letter_number: str = None, school_letter_date = None, school_letter_valid_until = None):
        member = db.query(FamilyMember).filter(FamilyMember.id == member_id).first()
        if not member:
            return None

        member.document_file_name = file_name
        if school_letter_number:
            member.school_letter_number = school_letter_number
        if school_letter_date:
            member.school_letter_date = parse_date_val(school_letter_date)
        if school_letter_valid_until:
            member.school_letter_valid_until = parse_date_val(school_letter_valid_until)

        # Re-activate child!
        member.status = "ACTIVE"
        member.child_status = "AKTIF_KULIAH"

        db.commit()
        db.refresh(member)

        # Resolve reminders
        from app.database.models.reminders import ReminderRecord
        reminders = db.query(ReminderRecord).filter(
            ReminderRecord.reference_type == "family_members",
            ReminderRecord.reference_id == member.id,
            ReminderRecord.reminder_type == "ANAK_21_TAHUN",
            ReminderRecord.status != "COMPLETED"
        ).all()
        for r in reminders:
            r.status = "COMPLETED"
        db.commit()

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
