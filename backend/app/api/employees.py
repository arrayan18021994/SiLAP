from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import io
from openpyxl import Workbook, load_workbook
from fastapi.responses import StreamingResponse

from app.database.session import get_db
from app.database.models import Employee, Organization, Position, Rank
from app.api.auth import get_current_user

router = APIRouter()

@router.get("/")
def get_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve employees with pagination and basic filtering."""
    employees = db.query(Employee).filter(Employee.is_active == True).offset(skip).limit(limit).all()
    # In a real implementation, we'd return Pydantic schemas. For Phase 1 backend mock, return raw dicts/ORM objects.
    return employees

@router.get("/{employee_id}")
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id, Employee.is_active == True).first()
    if not emp:
         raise HTTPException(status_code=404, detail="Pegawai tidak ditemukan")
    return emp

@router.post("/")
def create_employee(data: dict, db: Session = Depends(get_db)): # In production, use Pydantic schema
    # Validate NIP unique
    if db.query(Employee).filter(Employee.nip == data.get("nip")).first():
        raise HTTPException(status_code=400, detail="NIP sudah terdaftar.")
        
    emp = Employee(**data)
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

@router.patch("/{employee_id}/status")
def deactivate_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp:
         raise HTTPException(status_code=404, detail="Pegawai tidak ditemukan")
         
    emp.is_active = False
    db.commit()
    return {"message": "Pegawai dinonaktifkan."}

@router.get("/template")
def download_template():
    wb = Workbook()
    ws = wb.active
    ws.title = "Data_Pegawai"
    # Header
    ws.append(["NIP", "Nama", "Status", "Pangkat", "Jabatan", "OPD"])
    
    # Save to BytesIO
    stream = io.BytesIO()
    wb.save(stream)
    stream.seek(0)
    
    return StreamingResponse(
        stream, 
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=Template_Import_Pegawai.xlsx"}
    )

@router.post("/preview")
async def preview_employees_import(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="File harus berformat .xlsx")
        
    content = await file.read()
    wb = load_workbook(filename=io.BytesIO(content), data_only=True)
    if "Data_Pegawai" not in wb.sheetnames:
        return {"error": "Sheet 'Data_Pegawai' tidak ditemukan dalam file Excel."}
        
    sheet = wb["Data_Pegawai"]
    rows = list(sheet.iter_rows(values_only=True))
    
    if len(rows) < 2:
        return {"error": "Data kosong."}
        
    data_rows = rows[1:]
    preview_data = []
    
    for idx, row in enumerate(data_rows, start=2):
        if not row or all(cell is None for cell in row):
            continue
            
        nip = str(row[0]).strip() if row[0] else ""
        name = str(row[1]).strip() if row[1] else ""
        
        status_msg = "VALID"
        messages = []
        if not nip:
            status_msg = "ERROR"
            messages.append("NIP kosong")
        if not name:
            status_msg = "ERROR"
            messages.append("Nama kosong")
            
        existing = db.query(Employee).filter(Employee.nip == nip).first()
        if existing:
            status_msg = "ERROR"
            messages.append("NIP sudah terdaftar")
            
        preview_data.append({
            "row": idx,
            "nip": nip,
            "name": name,
            "status": row[2] if row[2] else "PNS",
            "rank": row[3] if row[3] else "-",
            "position": row[4] if row[4] else "-",
            "opd": row[5] if row[5] else "-",
            "import_status": status_msg,
            "messages": messages
        })
        
    return {
        "total_rows": len(preview_data),
        "valid_rows": sum(1 for p in preview_data if p["import_status"] == "VALID"),
        "error_rows": sum(1 for p in preview_data if p["import_status"] == "ERROR"),
        "preview_data": preview_data
    }

@router.post("/commit")
async def commit_employees_import(data: dict, db: Session = Depends(get_db)):
    # Expects {"preview_data": [...]}
    preview_data = data.get("preview_data", [])
    imported = 0
    for row in preview_data:
        if row.get("import_status") == "VALID":
            emp = Employee(
                nip=row["nip"],
                name=row["name"],
                status=row["status"],
                rank=row["rank"],
                position=row["position"],
                opd=row["opd"]
            )
            db.add(emp)
            imported += 1
    
    db.commit()
    return {"message": "Import berhasil", "imported_rows": imported}
