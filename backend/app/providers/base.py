from typing import List, Dict, Any
from sqlalchemy.orm import Session

class RegulationImpactProvider:
    """
    Contract for SiLAP modules that need to participate in Mass Regulation Updates.
    Each module (Salary, KGB, Leave, etc.) implements this interface.
    """
    def analyze_impact(self, db: Session, regulation_version_id: int, new_data: Dict[str, Any]) -> Dict[str, Any]:
        raise NotImplementedError
        
    def validate_change(self, db: Session, new_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        raise NotImplementedError
        
    def apply_change(self, db: Session, regulation_version_id: int, new_data: Dict[str, Any]) -> bool:
        raise NotImplementedError
        
    def recalculate(self, db: Session, entity_ids: List[str]) -> bool:
        raise NotImplementedError
        
    def validate_result(self, db: Session) -> bool:
        raise NotImplementedError
