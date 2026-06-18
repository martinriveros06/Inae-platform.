from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user, require_role

router = APIRouter(prefix="/emotional", tags=["Monitoreo Emocional"])


@router.post("/", response_model=schemas.EmotionalRecordOut, status_code=201)
def create_record(
    data: schemas.EmotionalRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    record = models.EmotionalRecord(
        usuario_id=current_user.id,
        emocion=data.emocion,
        nota=data.nota,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/my", response_model=List[schemas.EmotionalRecordOut])
def get_my_records(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.EmotionalRecord)
        .filter(models.EmotionalRecord.usuario_id == current_user.id)
        .order_by(models.EmotionalRecord.fecha.desc())
        .limit(30)
        .all()
    )


@router.get("/all", response_model=List[schemas.EmotionalRecordOut])
def get_all_records(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "mentor")),
):
    return (
        db.query(models.EmotionalRecord)
        .order_by(models.EmotionalRecord.fecha.desc())
        .limit(100)
        .all()
    )
