from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.database.session import get_db, engine, Base
from app.core.installation import determine_system_status

import os
import sqlite3

def ensure_sqlite_columns():
    try:
        db_file = settings.DATABASE_URL.replace("sqlite:///", "")
        if not os.path.isabs(db_file):
            db_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", db_file))
        if os.path.exists(db_file):
            conn = sqlite3.connect(db_file)
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(employees)")
            cols = [row[1] for row in cursor.fetchall()]
            if cols:
                if "mkg_years" not in cols:
                    cursor.execute("ALTER TABLE employees ADD COLUMN mkg_years INTEGER DEFAULT 0")
                if "mkg_months" not in cols:
                    cursor.execute("ALTER TABLE employees ADD COLUMN mkg_months INTEGER DEFAULT 0")
                if "tmt_mkg" not in cols:
                    cursor.execute("ALTER TABLE employees ADD COLUMN tmt_mkg DATE")
                conn.commit()
            conn.close()
    except Exception as e:
        print("SQLite columns auto-migration notice:", e)

# Ensure tables are created (for simple local dev; usually handled by alembic)
Base.metadata.create_all(bind=engine)
ensure_sqlite_columns()

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In a local app, allowing all or specific frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/system/status")
def get_system_status(db: Session = Depends(get_db)):
    """Returns the current installation status of the system."""
    status = determine_system_status(db)
    return {"status": status}

from app.api import setup, auth, employees, imports, leave, salary, kgb, regulation, mass_update, family, events, administration, reminders, backup_restore
app.include_router(setup.router, prefix="/api/v1/setup", tags=["setup"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(employees.router, prefix="/api/v1/employees", tags=["employees"])
app.include_router(imports.router, prefix="/api/v1/imports", tags=["imports"])
app.include_router(leave.router, prefix="/api/v1/leave", tags=["leave"])
app.include_router(salary.router, prefix="/api/v1/salary", tags=["salary"])
app.include_router(kgb.router, prefix="/api/v1/kgb", tags=["kgb"])
app.include_router(regulation.router, prefix="/api/v1/regulations", tags=["regulations"])
app.include_router(mass_update.router, prefix="/api/v1/mass-updates", tags=["mass-updates"])
app.include_router(family.router, prefix="/api/v1/family", tags=["family"])
app.include_router(events.router, prefix="/api/v1/events", tags=["events"])
app.include_router(administration.router, prefix="/api/v1/administration", tags=["administration"])
app.include_router(reminders.router, prefix="/api/v1/reminders", tags=["reminders"])
app.include_router(backup_restore.router, prefix="/api/v1/system", tags=["system"])
