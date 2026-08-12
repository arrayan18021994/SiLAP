from sqlalchemy.orm import Session
from app.database.models.administration import AdministrativeRecord

class AdministrativeRecordService:
    @staticmethod
    def create_record(db: Session, employee_id: int, data: dict):
        record = AdministrativeRecord(
            employee_id=employee_id,
            service_type=data.get("service_type"),
            reference_number=data.get("reference_number"),
            reference_date=data.get("reference_date"),
            description=data.get("description"),
            due_date=data.get("due_date")
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        
        if record.due_date:
            from app.services.reminder_engine import ReminderEngine
            ReminderEngine.generate_reminder(
                db=db,
                employee_id=employee_id,
                reminder_type="DOKUMEN_USULAN",
                reference_type="administrative_records",
                reference_id=record.id,
                title=f"Usulan {record.service_type} Jatuh Tempo",
                description=f"Usulan administrasi {record.reference_number} memiliki batas waktu penyelesaian.",
                due_date=record.due_date,
                priority="HIGH"
            )
        return record

    @staticmethod
    def complete_record(db: Session, record_id: int):
        record = db.query(AdministrativeRecord).filter(AdministrativeRecord.id == record_id).first()
        if record:
            record.status = "COMPLETED"
            from datetime import date
            record.completed_date = date.today()
            db.commit()
            return True
        return False

    @staticmethod
    def cancel_record(db: Session, record_id: int):
        record = db.query(AdministrativeRecord).filter(AdministrativeRecord.id == record_id).first()
        if record:
            record.status = "CANCELLED"
            db.commit()
            return True
        return False
