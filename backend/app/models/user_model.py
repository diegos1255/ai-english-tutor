import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Date, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

from sqlalchemy import Enum
from app.core.enums import UserRole


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # identidade
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    avatar_url = Column(String, nullable=True)

    # perfil
    birth_date = Column(Date, nullable=True)
    english_level = Column(String, nullable=True) # <-- NOVO: Nível de inglês (ex: Iniciante, Avançado)
    tech_stack = Column(String, nullable=True)    # <-- NOVO: Área de atuação (ex: Front-end, Python, DevOps)

    # autenticação
    password_hash = Column(String, nullable=False)
    password_updated_at = Column(DateTime, nullable=True)

    # segurança
    failed_login_attempts = Column(Integer, default=0)
    last_login_at = Column(DateTime, nullable=True)

    # permissão
    role = Column(String, default=UserRole.USER)

    # lifecycle
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True)

    # relacionamentos (ORM)
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")