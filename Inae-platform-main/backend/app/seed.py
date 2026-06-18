"""Run once to populate the database with mock data for the demo."""
from datetime import datetime, timedelta
import random
from .database import SessionLocal, engine
from . import models
from .auth import get_password_hash

EMOTIONS = ["muy_bien", "bien", "neutral", "mal", "muy_mal"]
PRIORITIES = ["alta", "media", "baja"]
SUBJECTS = ["Matemáticas", "Programación", "Inglés", "Base de Datos", "Redes", "Proyecto Final"]
ALERT_TYPES = ["Bajo rendimiento académico", "Riesgo de deserción", "Estado emocional crítico", "Inasistencia reiterada"]
ALERT_LEVELS = ["alto", "medio", "bajo"]
CARRERAS = ["Ingeniería en Informática", "Técnico en Programación", "Administración de Empresas", "Enfermería"]
SEDES = ["Santiago Centro", "Maipú", "Pudahuel", "San Joaquín"]


def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(models.User).count() > 0:
        print("DB already seeded.")
        db.close()
        return

    # --- Users ---
    admin = models.User(
        nombre="Admin DAE",
        email="admin@inacap.cl",
        hashed_password=get_password_hash("admin123"),
        role="admin",
        sede="Santiago Centro",
    )
    db.add(admin)

    mentors = []
    for i in range(1, 4):
        m = models.User(
            nombre=f"Mentor {i}",
            email=f"mentor{i}@inacap.cl",
            hashed_password=get_password_hash("mentor123"),
            role="mentor",
            carrera=random.choice(CARRERAS),
            sede=random.choice(SEDES),
        )
        db.add(m)
        mentors.append(m)

    students = []
    nombres = [
        "Valentina López", "Sebastián Muñoz", "Camila Torres", "Diego Herrera",
        "Fernanda Reyes", "Matías González", "Javiera Soto", "Tomás Vargas",
        "Isabella Rojas", "Nicolás Pérez",
    ]
    for i, nombre in enumerate(nombres):
        s = models.User(
            nombre=nombre,
            email=f"estudiante{i+1}@inacap.cl",
            hashed_password=get_password_hash("est123"),
            role="estudiante",
            carrera=random.choice(CARRERAS),
            sede=random.choice(SEDES),
        )
        db.add(s)
        students.append(s)

    db.commit()

    # Refresh to get IDs
    db.refresh(admin)
    for m in mentors:
        db.refresh(m)
    for s in students:
        db.refresh(s)

    # --- Emotional records ---
    for student in students:
        for day_offset in range(14, 0, -1):
            record = models.EmotionalRecord(
                usuario_id=student.id,
                emocion=random.choice(EMOTIONS),
                nota=random.choice([None, "Me siento bien hoy", "Estresado con los ramos", "Todo va bien"]),
                fecha=datetime.utcnow() - timedelta(days=day_offset, hours=random.randint(0, 5)),
            )
            db.add(record)

    # --- Agenda tasks ---
    for student in students:
        for j in range(random.randint(3, 6)):
            task = models.AgendaTask(
                usuario_id=student.id,
                titulo=f"Tarea {j+1} - {random.choice(SUBJECTS)}",
                descripcion="Completar antes de la fecha límite.",
                fecha_limite=datetime.utcnow() + timedelta(days=random.randint(1, 14)),
                completada=random.choice([True, False]),
                prioridad=random.choice(PRIORITIES),
                asignatura=random.choice(SUBJECTS),
            )
            db.add(task)

    # --- Mentor sessions ---
    for student in students[:6]:
        mentor = random.choice(mentors)
        session = models.MentorSession(
            mentor_id=mentor.id,
            estudiante_id=student.id,
            fecha=datetime.utcnow() + timedelta(days=random.randint(1, 7)),
            estado=random.choice(["pendiente", "confirmada", "completada"]),
            notas="Primera sesión de apoyo académico.",
        )
        db.add(session)

    # --- Alerts ---
    for student in students[:5]:
        alert = models.Alert(
            estudiante_id=student.id,
            tipo=random.choice(ALERT_TYPES),
            descripcion="Se detectó una situación de riesgo que requiere atención.",
            nivel=random.choice(ALERT_LEVELS),
            resuelta=random.choice([True, False]),
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 7)),
        )
        db.add(alert)

    db.commit()
    db.close()
    print("✓ Seed completed successfully.")


if __name__ == "__main__":
    seed()
