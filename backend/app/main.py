from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.database.session import get_db, engine
from app.database.models import Base
from app.core.installation import determine_system_status

# Ensure tables are created (for simple local dev; usually handled by alembic)
Base.metadata.create_all(bind=engine)

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

from app.api import setup, auth, employees, imports, leave, salary, kgb, regulation, mass_update, family, events, administration, reminders
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
