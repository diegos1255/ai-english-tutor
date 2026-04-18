from pydantic import BaseModel
from uuid import UUID

class MenuResponse(BaseModel):
    id: UUID
    title: str
    path: str
    icon: str
    order_index: int
    
    # O Front-end não precisa saber o 'role', o 'is_active' ou 'created_at'.
    # O Backend já filtrou por role e is_active=True na consulta!
    
    class Config:
        from_attributes = True