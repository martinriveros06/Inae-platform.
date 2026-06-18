from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..auth import get_current_user, require_role

router = APIRouter(prefix="/mentors", tags=["Mentoría"])


@router.post("/sessions", response_model=schemas.MentorSessionOut, status_code=201)
def request_session(
    data: schemas.MentorSessionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    mentor = db.query(models.User).filter(
        models.User.id == data.mentor_id, models.User.role == "mentor"
    ).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor no encontrado")

    session = models.MentorSession(
        mentor_id=data.mentor_id,
        estudiante_id=current_user.id,
        fecha=data.fecha,
        notas=data.notas,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions/my", response_model=List[schemas.MentorSessionOut])
def get_my_sessions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if current_user.role == "mentor":
        return (
            db.query(models.MentorSession)
            .filter(models.MentorSession.mentor_id == current_user.id)
            .order_by(models.MentorSession.fecha.desc())
            .all()
        )
    return (
        db.query(models.MentorSession)
        .filter(models.MentorSession.estudiante_id == current_user.id)
        .order_by(models.MentorSession.fecha.desc())
        .all()
    )


@router.patch("/sessions/{session_id}/status")
def update_session_status(
    session_id: int,
    estado: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    session = db.query(models.MentorSession).filter(models.MentorSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    if current_user.id not in [session.mentor_id, session.estudiante_id]:
        raise HTTPException(status_code=403, detail="Sin permisos")
    session.estado = estado
    db.commit()
    return {"estado": session.estado}
