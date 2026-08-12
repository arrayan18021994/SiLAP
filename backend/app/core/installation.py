import os
import json
from enum import Enum
from sqlalchemy.orm import Session
from app.database.models import Installation, InstallationSecurity
from app.config.settings import settings

class InstallationState(str, Enum):
    NEW = "NEW"
    SETUP_REQUIRED = "SETUP_REQUIRED"
    ACTIVE = "ACTIVE"
    LOCKED = "LOCKED"
    INSTALLATION_MISMATCH = "INSTALLATION_MISMATCH"

def get_local_identity():
    """Reads the local identity file."""
    if not os.path.exists(settings.LOCAL_IDENTITY_PATH):
        return None
    try:
        with open(settings.LOCAL_IDENTITY_PATH, "r") as f:
            return json.load(f)
    except Exception:
        return None

def write_local_identity(installation_id: str):
    """Writes the local identity file."""
    os.makedirs(os.path.dirname(settings.LOCAL_IDENTITY_PATH), exist_ok=True)
    with open(settings.LOCAL_IDENTITY_PATH, "w") as f:
        json.dump({"installation_id": installation_id}, f)

def determine_system_status(db: Session) -> InstallationState:
    """
    Determines the system status based on Database vs Local Identity.
    Case A: No initialized database -> NEW
    Case B: DB has installation, local identity matches -> Stored Status (e.g. ACTIVE)
    Case C: DB has installation, local identity missing -> SETUP_REQUIRED
    Case D: DB has installation, local identity mismatch -> INSTALLATION_MISMATCH
    """
    try:
        installations = db.query(Installation).all()
    except Exception:
        # Table might not exist yet if migrations haven't run, but assuming they have
        return InstallationState.NEW

    if not installations:
        return InstallationState.NEW

    # Assume we only ever have one active installation record per DB that we care about binding to
    # Or we look for the most recently active one.
    db_installation = installations[0]
    
    local_id = get_local_identity()

    if local_id is None:
        return InstallationState.SETUP_REQUIRED

    if local_id.get("installation_id") == db_installation.installation_id:
        return InstallationState(db_installation.installation_status)
    else:
        return InstallationState.INSTALLATION_MISMATCH
