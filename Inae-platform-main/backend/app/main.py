from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth, users, emotional, agenda, mentors, alerts
from .seed import seed

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="INAE Platform API",
    description="Plataforma de bienestar estudiantil INACAP",
    version="1.0.0",
    redirect_slashes=False,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(emotional.router)
app.include_router(agenda.router)
app.include_router(mentors.router)
app.include_router(alerts.router)


@app.on_event("startup")
def startup_event():
    seed()


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "INAE Platform API running"}
