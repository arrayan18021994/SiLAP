import os
import shutil
import zipfile
import json
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from tempfile import mkdtemp

from app.config.settings import settings

router = APIRouter()

@router.get("/backup")
def create_backup():
    """
    Creates a full backup of the SQLite database and the documents folder.
    Returns a ZIP file.
    """
    try:
        # Create a temporary directory for the backup assembly
        temp_dir = mkdtemp()
        backup_name = f"SiLAP_Backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        backup_folder = os.path.join(temp_dir, backup_name)
        os.makedirs(backup_folder, exist_ok=True)
        
        # 1. Copy Database
        db_path = os.path.join(settings.DATA_DIR, "database", "silap.db")
        if os.path.exists(db_path):
            dest_db_dir = os.path.join(backup_folder, "data", "database")
            os.makedirs(dest_db_dir, exist_ok=True)
            shutil.copy2(db_path, os.path.join(dest_db_dir, "silap.db"))
            
        # 2. Copy Documents
        if os.path.exists(settings.DOCUMENTS_DIR):
            dest_docs_dir = os.path.join(backup_folder, "documents")
            shutil.copytree(settings.DOCUMENTS_DIR, dest_docs_dir, dirs_exist_ok=True)
            
        # 3. Create Manifest
        manifest = {
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat(),
            "type": "full_backup",
            "system": "SiLAP"
        }
        with open(os.path.join(backup_folder, "manifest.json"), "w") as f:
            json.dump(manifest, f, indent=4)
            
        # 4. Zip it
        zip_path = os.path.join(temp_dir, f"{backup_name}.zip")
        shutil.make_archive(os.path.join(temp_dir, backup_name), 'zip', backup_folder)
        
        # Cleanup the unzipped folder
        shutil.rmtree(backup_folder)
        
        return FileResponse(zip_path, media_type="application/zip", filename=f"{backup_name}.zip")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create backup: {str(e)}")


@router.post("/restore")
async def restore_backup(file: UploadFile = File(...)):
    """
    Restores the system from an uploaded ZIP backup.
    Overwrites the current database and documents.
    """
    if not file.filename.endswith('.zip'):
        raise HTTPException(status_code=400, detail="Must be a ZIP file")
        
    try:
        temp_dir = mkdtemp()
        zip_path = os.path.join(temp_dir, "uploaded_backup.zip")
        
        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        extract_dir = os.path.join(temp_dir, "extracted")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)
            
        # Validate manifest
        manifest_path = os.path.join(extract_dir, "manifest.json")
        if not os.path.exists(manifest_path):
            raise HTTPException(status_code=400, detail="Invalid backup file: manifest.json missing")
            
        # 1. Restore Database
        src_db = os.path.join(extract_dir, "data", "database", "silap.db")
        if os.path.exists(src_db):
            dest_db_dir = os.path.join(settings.DATA_DIR, "database")
            os.makedirs(dest_db_dir, exist_ok=True)
            shutil.copy2(src_db, os.path.join(dest_db_dir, "silap.db"))
            
        # 2. Restore Documents
        src_docs = os.path.join(extract_dir, "documents")
        if os.path.exists(src_docs):
            os.makedirs(settings.DOCUMENTS_DIR, exist_ok=True)
            # Remove existing docs to ensure clean state
            shutil.rmtree(settings.DOCUMENTS_DIR)
            shutil.copytree(src_docs, settings.DOCUMENTS_DIR)
            
        # Cleanup
        shutil.rmtree(temp_dir)
        
        # After restore, the system will naturally fall into INSTALLATION_MISMATCH
        # because the restored DB has a different installation_id than the local identity.json
        
        return {"message": "Restore successful. System will now require rebind."}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to restore backup: {str(e)}")
