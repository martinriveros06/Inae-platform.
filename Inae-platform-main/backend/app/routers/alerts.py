from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user, require_role

router = APIRouter(prefix="/alerts", tags=["Alertas de Riesgo"])


@router.post("/", response_model=schemas.AlertOut, status_code=201)
def create_alert(
    data: schemas.AlertCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "mentor")),
):
    estudiante = db.query(models.User).filter(models.User.id == data.estudiante_id).first()
    if not estudiante:
        raise HTTPException(status_code=404, detail="Estudiante no encontrado")

    alert = models.Alert(**data.model_dump())
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


@router.get("/", response_model=List[schemas.AlertOut])
def get_alerts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "mentor")),
):
    return (
        db.query(models.Alert)
        .order_by(models.Alert.created_at.desc())
        .all()
    )


@router.get("/my", response_model=List[schemas.AlertOut])
def get_my_alerts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Alert)
        .filter(models.Alert.estudiante_id == current_user.id)
        .order_by(models.Alert.created_at.desc())
        .all()
    )


@router.patch("/{alert_id}/resolve")
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "mentor")),
):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alerta no encontrada")
    alert.resuelta = True
    db.commit()
    return {"resuelta": True}
