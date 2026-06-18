# INAE · Plataforma de Bienestar Estudiantil

Plataforma web para la detección temprana de factores de riesgo y reducción de la deserción estudiantil en INACAP.

**Equipo:** Walther Mora · Julio Opazo · Martín Riveros · Maximiliano Soto  
**Asignatura:** Proyecto de Innovación · INACAP · Junio 2026

---

## Requisitos previos

Instala estas herramientas antes de comenzar:

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|----------|
| Python | 3.10+ | https://www.python.org/downloads/ |
| Node.js | 18+ | https://nodejs.org/ |
| Git | cualquiera | https://git-scm.com/ |

---

## Instalación (solo la primera vez)

### 1. Clonar el repositorio

```bash
git clone https://github.com/WaltherMoraRivera/Inae-platform.git
cd Inae-platform
```

### 2. Configurar el Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows PowerShell:
./venv/Scripts/Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo de entorno
copy .env.example .env        # Windows
cp .env.example .env          # Mac/Linux
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

---

## Levantar el proyecto (cada vez que trabajes)

Necesitas **dos terminales** abiertas al mismo tiempo.

### Terminal 1 — Backend

```bash
cd Inae-platform/backend
./venv/Scripts/uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Espera hasta ver:
```
Application startup complete.
Uvicorn running on http://127.0.0.1:8000
```

> **Error `[Errno 10048]`** → el puerto 8000 ya está ocupado.
> Ejecuta `netstat -ano | findstr :8000`, anota el PID y ejecuta `taskkill /PID <número> /F`. Luego intenta de nuevo.

### Terminal 2 — Frontend

```bash
cd Inae-platform/frontend
npm run dev
```

Espera hasta ver:
```
VITE ready
Local: http://localhost:5173/
```

### Abrir en el navegador

Entra a **http://localhost:5173**

> Los datos de prueba se crean automáticamente la primera vez que inicia el backend.

---

## Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin DAE | admin@inacap.cl | admin123 |
| Mentor | mentor1@inacap.cl | mentor123 |
| Mentor | mentor2@inacap.cl | mentor123 |
| Estudiante | estudiante1@inacap.cl | est123 |
| Estudiante | estudiante2@inacap.cl | est123 |

---

## Funcionalidades por rol

| Pantalla | Estudiante | Mentor | Admin DAE |
|----------|-----------|--------|-----------|
| Dashboard | ✓ | ✓ | ✓ |
| Bienestar Emocional | ✓ registro propio | ✓ ve todos | ✓ ve todos |
| Agenda Académica | ✓ | — | — |
| Red de Mentores | ✓ solicitar sesión | ✓ gestionar | ✓ |
| Alertas de Riesgo | — | ✓ | ✓ |

---

## Stack tecnológico

- **Frontend:** React 18 + Vite + TypeScript + TailwindCSS
- **Backend:** FastAPI (Python) + SQLAlchemy + SQLite
- **Auth:** JWT (JSON Web Tokens)
- **DB:** SQLite — el archivo `backend/inae.db` se crea automáticamente

---

## Flujo de trabajo con Git

```bash
# Antes de empezar, actualiza tu copia local
git pull origin main

# Crea una rama para tu tarea
git checkout -b feature/nombre-descriptivo

# Trabaja, luego sube tus cambios
git add .
git commit -m "descripción de lo que hiciste"
git push origin feature/nombre-descriptivo
```

Crea un **Pull Request** en GitHub para que el equipo revise antes de unir a `main`.

---

## Estructura del proyecto

```
Inae-platform/
├── backend/
│   ├── app/
│   │   ├── main.py        # Punto de entrada FastAPI
│   │   ├── models.py      # Modelos de base de datos
│   │   ├── schemas.py     # Esquemas Pydantic
│   │   ├── auth.py        # Lógica JWT
│   │   ├── seed.py        # Datos de prueba automáticos
│   │   └── routers/       # auth / users / emotional / agenda / mentors / alerts
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    └── src/
        ├── pages/         # Login · Dashboard · Emocional · Agenda · Mentores · Alertas
        ├── components/    # Sidebar · Navbar
        ├── context/       # AuthContext (manejo de sesión)
        └── api/           # Cliente axios con interceptores
```
