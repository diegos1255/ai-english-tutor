from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

# O que recebemos para criar mensagem
class ChatMessageCreate(BaseModel):
    content: str
    session_id: Optional[UUID] = None

# O que recebemos para atualizar uma mensagem (ex: fixar a mensagem no chat)
class ChatMessageUpdate(BaseModel):
    is_pinned: bool

# O que devolvemos (Mensagem individual)
class ChatMessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    is_pinned: bool
    created_at: datetime

    class Config:
        from_attributes = True

# NOVO: O que recebemos para renomear ou fixar a sessão
class ChatSessionUpdate(BaseModel):
    title: Optional[str] = None     # <-- Agora é opcional
    is_pinned: Optional[bool] = None # <-- Adicionado para fixar o chat na Sidebar

# O que devolvemos (Sessão para a Barra Lateral)
class ChatSessionResponse(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    is_pinned: bool # <-- O Front-end agora vai saber se tem o alfinete!

    class Config:
        from_attributes = True