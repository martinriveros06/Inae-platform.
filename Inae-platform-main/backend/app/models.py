from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base


class RoleEnum(str, enum.Enum):
    estudiante = "estudiante"
    mentor = "mentor"
    admin = "admin"


class EmotionEnum(str, enum.Enum):
    muy_bien = "muy_bien"
    bien = "bien"
    neutral = "neutral"
    mal = "mal"
    muy_mal = "muy_mal"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.estudiante)
    carrera = Column(String(150), nullable=True)
    sede = Column(String(100), nullable=True)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    emociones = relationship("EmotionalRecord", back_populates="usuario", foreign_keys="EmotionalRecord.usuario_id")
    tareas = relationship("AgendaTask", back_populates="usuario")
    mentoria_como_estudiante = relationship("MentorSession", back_populates="estudiante", foreign_keys="MentorSession.estudiante_id")
    mentoria_como_mentor = relationship("MentorSession", back_populates="mentor", foreign_keys="MentorSession.mentor_id")
    alertas = relationship("Alert", back_populates="estudiante", foreign_keys="Alert.estudiante_id")


class EmotionalRecord(Base):
    __tablename__ = "emotional_records"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("users.id"))
    emocion = Column(Enum(EmotionEnum), nullable=False)
    nota = Column(Text, nullable=True)
    fecha = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("User", back_populates="emociones", foreign_keys=[usuario_id])


class AgendaTask(Base):
    __tablename__ = "agenda_tasks"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("users.id"))
    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)
    fecha_limite = Column(DateTime, nullable=False)
    completada = Column(Boolean, default=False)
    prioridad = Column(String(20), default="media")
    asignatura = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("User", back_populates="tareas")


class MentorSession(Base):
    __tablename__ = "mentor_sessions"

    id = Column(Integer, primary_key=True, index=True)
    mentor_id = Column(Integer, ForeignKey("users.id"))
    estudiante_id = Column(Integer, ForeignKey("users.id"))
    fecha = Column(DateTime, nullable=False)
    estado = Column(String(50), default="pendiente")
    notas = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    mentor = relationship("User", back_populates="mentoria_como_mentor", foreign_keys=[mentor_id])
    estudiante = relationship("User", back_populates="mentoria_como_estudiante", foreign_keys=[estudiante_id])


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("users.id"))
    tipo = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=False)
    nivel = Column(String(20), default="medio")
    resuelta = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    estudiante = relationship("User", back_populates="alertas", foreign_keys=[estudiante_id])
