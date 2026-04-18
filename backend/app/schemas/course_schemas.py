from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class LessonResponse(BaseModel):
    id: UUID
    title: str
    order: int
    is_completed: bool # <-- O segredo do progresso! O Back-end calcula isso.

class ModuleResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    order: int
    lessons: List[LessonResponse]

class DashboardResponse(BaseModel):
    user_xp: int
    current_level_name: str
    modules: List[ModuleResponse]