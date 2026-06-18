from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from .models import RoleEnum, EmotionEnum


class UserCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    role: RoleEnum = RoleEnum.estudiante
    carrera: Optional[str] = None
    sede: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    nombre: str
    email: str
    role: RoleEnum
    carrera: Optional[str]
    sede: Optional[str]
    activo: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class EmotionalRecordCreate(BaseModel):
    emocion: EmotionEnum
    nota: Optional[str] = None


class EmotionalRecordOut(BaseModel):
    id: int
    emocion: EmotionEnum
    nota: Optional[str]
    fecha: datetime
    usuario: UserOut

    class Config:
        from_attributes = True


class AgendaTaskCreate(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha_limite: datetime
    prioridad: str = "media"
    asignatura: Optional[str] = None


class AgendaTaskOut(BaseModel):
    id: int
    titulo: str
    descripcion: Optional[str]
    fecha_limite: datetime
    completada: bool
    prioridad: str
    asignatura: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class MentorSessionCreate(BaseModel):
    mentor_id: int
    fecha: datetime
    notas: Optional[str] = None


class MentorSessionOut(BaseModel):
    id: int
    mentor_id: int
    estudiante_id: int
    fecha: datetime
    estado: str
    notas: Optional[str]
    mentor: UserOut
    estudiante: UserOut

    class Config:
        from_attributes = True


class AlertCreate(BaseModel):
    estudiante_id: int
    tipo: str
    descripcion: str
    nivel: str = "medio"


class AlertOut(BaseModel):
    id: int
    estudiante_id: int
    tipo: str
    descripcion: str
    nivel: str
    resuelta: bool
    created_at: datetime
    estudiante: UserOut

    class Config:
        from_attributes = True
