import datetime
from sqlalchemy.orm import Session
from app.database.models.reminders import ReminderRecord
from app.database.models.kgb import KGBCalculationSnapshot

class ReminderEngine:
    @staticmethod
    def generate_reminder(db: Session, employee_id: int, reminder_type: str, reference_type: str, reference_id: int, title: str, description: str, due_date, priority: str = "NORMAL"):
        # Deduplication check
        existing = db.query(ReminderRecord).filter(
            ReminderRecord.employee_id == employee_id,
            ReminderRecord.reminder_type == reminder_type,
            ReminderRecord.reference_type == reference_type,
            ReminderRecord.reference_id == reference_id,
            ReminderRecord.is_dismissed == False,
            ReminderRecord.status != "COMPLETED"
        ).first()
        
        if existing:
            return existing
            
        reminder = ReminderRecord(
            employee_id=employee_id,
            reminder_type=reminder_type,
            reference_type=reference_type,
            reference_id=reference_id,
            title=title,
            description=description,
            due_date=due_date,
            priority=priority
        )
        db.add(reminder)
        db.commit()
        return reminder

    @staticmethod
    def refresh_gaji_berkala(db: Session):
        """
        Pull from KGBCalculationSnapshot to generate Gaji Berkala reminders
        """
        snapshots = db.query(KGBCalculationSnapshot).all()
        today = datetime.date.today()
        
        for snap in snapshots:
            if snap.next_kgb_date:
                days_diff = (snap.next_kgb_date - today).days
                if days_diff <= 90:
                    title = f"Gaji Berkala (KGB) - Jatuh tempo dalam {days_diff} hari"
                    if days_diff < 0:
                        title = f"Gaji Berkala (KGB) - Terlambat {abs(days_diff)} hari"
                    
                    priority = "URGENT" if days_diff <= 30 else "HIGH" if days_diff <= 60 else "NORMAL"
                    
                    ReminderEngine.generate_reminder(
                        db=db,
                        employee_id=snap.employee_id,
                        reminder_type="GAJI_BERKALA",
                        reference_type="kgb_calculation_snapshots",
                        reference_id=snap.id,
                        title=title,
                        description="Segera persiapkan usulan SK KGB",
                        due_date=snap.next_kgb_date,
                        priority=priority
                    )
    
    @staticmethod
    def dismiss(db: Session, reminder_id: int):
        reminder = db.query(ReminderRecord).filter(ReminderRecord.id == reminder_id).first()
        if reminder:
            reminder.is_dismissed = True
            db.commit()
            return True
        return False

    @staticmethod
    def complete(db: Session, reminder_id: int):
        reminder = db.query(ReminderRecord).filter(ReminderRecord.id == reminder_id).first()
        if reminder:
            reminder.status = "COMPLETED"
            db.commit()
            return True
        return False
