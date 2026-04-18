import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

from app.core.database import Base
from app.core.enums import UserRole

class Menu(Base):
    __tablename__ = "menus"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    path = Column(String, nullable=False)
    icon = Column(String, nullable=False)
    role = Column(String, default=UserRole.USER)
    order_index = Column(Integer, default=0) # Para ordenar o sidebar certinho!
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)