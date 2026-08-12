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
    def refresh_child_age_reminders(db: Session):
        """
        Check all children for age >= 21.
        If age >= 21 and no valid school_letter_number/file, mark child status as INACTIVE/PERLU_SURAT_KULIAH
        and generate a reminder record.
        If valid school letter exists, mark child status as ACTIVE and resolve pending reminders.
        """
        from app.database.models.family import FamilyMember
        today = datetime.date.today()
        all_family = db.query(FamilyMember).filter(FamilyMember.birth_date.isnot(None)).all()

        for member in all_family:
            rel = (member.relationship_type or "").upper()
            if "ANAK" not in rel and "CHILD" not in rel:
                continue

            bdate = member.birth_date
            age = today.year - bdate.year - ((today.month, today.day) < (bdate.month, bdate.day))

            has_valid_letter = False
            if (member.school_letter_number and str(member.school_letter_number).strip()) or (member.document_file_name and str(member.document_file_name).strip()):
                if not member.school_letter_valid_until or member.school_letter_valid_until >= today:
                    has_valid_letter = True

            if age >= 21:
                if not has_valid_letter:
                    member.status = "INACTIVE"
                    member.child_status = "PERLU_SURAT_KULIAH"
                    title = f"Pengingat Tunjangan Anak: {member.name} Berusia {age} Tahun"
                    description = f"Anak {member.name} telah berusia {age} tahun. Diperlukan unggah Surat Keterangan Aktif Kuliah pada data pegawai untuk mengaktifkan kembali tunjangan keluarga."
                    
                    ReminderEngine.generate_reminder(
                        db=db,
                        employee_id=member.employee_id,
                        reminder_type="ANAK_21_TAHUN",
                        reference_type="family_members",
                        reference_id=member.id,
                        title=title,
                        description=description,
                        due_date=today,
                        priority="HIGH"
                    )
                else:
                    member.status = "ACTIVE"
                    member.child_status = "AKTIF_KULIAH"
                    reminders = db.query(ReminderRecord).filter(
                        ReminderRecord.reference_type == "family_members",
                        ReminderRecord.reference_id == member.id,
                        ReminderRecord.reminder_type == "ANAK_21_TAHUN",
                        ReminderRecord.status != "COMPLETED"
                    ).all()
                    for r in reminders:
                        r.status = "COMPLETED"
            else:
                member.status = "ACTIVE"
                member.child_status = "AKTIF"

        db.commit()
    
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
