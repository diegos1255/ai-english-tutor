from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health_route import router as health_router
from app.api.routes.user_route import router as user_router
from app.api.routes import auth_route

from app.api.routes import menu_route

from app.api.routes import chat_route

# Note que não precisamos mais importar o 'engine' nem o 'Base' aqui
# pois o Alembic cuidará da conexão para criar as tabelas.
import app.models.user_model

from app.api.routes import course_route

app = FastAPI(title="AI English Tutor API")

# --- CONFIGURAÇÃO DE SEGURANÇA CORS ---
origens_permitidas = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens_permitidas,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------------------

# Rotas mapeadas
app.include_router(health_router)
app.include_router(user_router)
app.include_router(auth_route.router)
app.include_router(menu_route.router)
app.include_router(chat_route.router)
app.include_router(course_route.router)