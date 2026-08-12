import os
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models.family import FamilyMember
from app.services.family_service import FamilyService

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "uploads", "surat_kuliah")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/{employee_id}")
def get_family_members(employee_id: int, db: Session = Depends(get_db)):
    return FamilyService.get_family_members(db, employee_id)

@router.post("/{employee_id}")
def add_family_member(employee_id: int, data: dict, db: Session = Depends(get_db)):
    return FamilyService.add_family_member(db, employee_id, data)

@router.put("/member/{member_id}")
def update_family_member(member_id: int, data: dict, db: Session = Depends(get_db)):
    updated = FamilyService.update_family_member(db, member_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Anggota keluarga tidak ditemukan")
    return updated

@router.delete("/member/{member_id}")
def delete_family_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(FamilyMember).filter(FamilyMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Anggota keluarga tidak ditemukan")
    db.delete(member)
    db.commit()
    return {"status": "success", "message": "Anggota keluarga berhasil dihapus"}

@router.post("/member/{member_id}/upload-surat-kuliah")
def upload_surat_kuliah(
    member_id: int,
    file: Optional[UploadFile] = File(None),
    school_letter_number: Optional[str] = Form(None),
    school_letter_date: Optional[str] = Form(None),
    school_letter_valid_until: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    filename = None
    if file and file.filename:
        filename = f"surat_kuliah_{member_id}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    updated = FamilyService.upload_surat_kuliah(
        db=db,
        member_id=member_id,
        file_name=filename or "surat_aktif_kuliah.pdf",
        school_letter_number=school_letter_number,
        school_letter_date=school_letter_date,
        school_letter_valid_until=school_letter_valid_until
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Anggota keluarga tidak ditemukan")
    return {"status": "success", "message": "Surat Aktif Kuliah berhasil diunggah & data anak diaktifkan kembali.", "data": updated}
