from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models.family import FamilyMember
from app.services.family_service import FamilyService

router = APIRouter()

@router.get("/{employee_id}")
def get_family_members(employee_id: int, db: Session = Depends(get_db)):
    return db.query(FamilyMember).filter(FamilyMember.employee_id == employee_id).all()

@router.post("/{employee_id}")
def add_family_member(employee_id: int, data: dict, db: Session = Depends(get_db)):
    return FamilyService.add_family_member(db, employee_id, data)
