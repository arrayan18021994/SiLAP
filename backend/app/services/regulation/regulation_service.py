from sqlalchemy.orm import Session
from app.database.models.regulation import Regulation, RegulationVersion

class RegulationService:
    @staticmethod
    def create_regulation(db: Session, reg_data: dict):
        reg = Regulation(
            regulation_type=reg_data.get("regulation_type"),
            regulation_number=reg_data.get("regulation_number"),
            regulation_name=reg_data.get("regulation_name"),
            effective_date=reg_data.get("effective_date"),
            description=reg_data.get("description")
        )
        db.add(reg)
        db.commit()
        db.refresh(reg)
        
        # Create initial version
        version = RegulationVersion(
            regulation_id=reg.id,
            version_number=1,
            effective_date=reg.effective_date,
            change_summary="Initial version"
        )
        db.add(version)
        db.commit()
        return reg

    @staticmethod
    def resolve_regulation(db: Session, regulation_type: str, effective_date):
        return db.query(Regulation).filter(
            Regulation.regulation_type == regulation_type,
            Regulation.effective_date <= effective_date,
            Regulation.status == "ACTIVE"
        ).order_by(Regulation.effective_date.desc()).first()
