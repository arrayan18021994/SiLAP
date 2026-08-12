from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.import_service import EmployeeImportService
from app.api.auth import get_current_user

router = APIRouter()

@router.post("/service-periods/preview")
async def preview_service_periods_import(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    # current_user = Depends(get_current_user)
):
    if not file.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="File harus berformat .xlsx")
        
    content = await file.read()
    result = EmployeeImportService.preview_service_period_import(
        db, content, "system_user", file.filename
    )
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result

@router.post("/service-periods/commit")
async def commit_service_periods_import(
    batch_id: str = Form(...),
    db: Session = Depends(get_db),
    # current_user = Depends(get_current_user)
):
    # Mock commit logic for Phase 1
    # In production, this would re-parse the cached file or trust a safe staging table.
    # We must wrap in a transaction to rollback on failure.
    
    return {"message": "Import berhasil", "batch_id": batch_id, "imported_rows": 94}
