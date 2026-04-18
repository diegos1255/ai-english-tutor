import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    # Usando UUID nativo do Postgres para manter o padrão do seu projeto
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Agora sim, o user_id é do tipo UUID, compatível com users.id
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    title = Column(String, default="Novo Chat")
    created_at = Column(DateTime, default=datetime.utcnow)

    is_pinned = Column(Boolean, default=False)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    # Usando UUID nativo do Postgres
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Compatível com o id do chat_sessions
    session_id = Column(UUID(as_uuid=True), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False)
    
    role = Column(String, nullable=False) # 'user' ou 'ai'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    is_pinned = Column(Boolean, default=False)

    session = relationship("ChatSession", back_populates="messages")