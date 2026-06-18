from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(prefix="/agenda", tags=["Agenda Académica"])


@router.post("/", response_model=schemas.AgendaTaskOut, status_code=201)
def create_task(
    data: schemas.AgendaTaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = models.AgendaTask(usuario_id=current_user.id, **data.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/", response_model=List[schemas.AgendaTaskOut])
def get_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.AgendaTask)
        .filter(models.AgendaTask.usuario_id == current_user.id)
        .order_by(models.AgendaTask.fecha_limite.asc())
        .all()
    )


@router.patch("/{task_id}/complete")
def toggle_complete(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = db.query(models.AgendaTask).filter(
        models.AgendaTask.id == task_id,
        models.AgendaTask.usuario_id == current_user.id,
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    task.completada = not task.completada
    db.commit()
    return {"completada": task.completada}


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = db.query(models.AgendaTask).filter(
        models.AgendaTask.id == task_id,
        models.AgendaTask.usuario_id == current_user.id,
    ).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    db.delete(task)
    db.commit()
    return {"ok": True}
