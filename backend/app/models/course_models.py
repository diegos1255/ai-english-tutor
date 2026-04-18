import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Level(Base):
    __tablename__ = "levels"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False) # Iniciante, Intermediário, Avançado
    order = Column(Integer, nullable=False) # 1, 2, 3

    modules = relationship("Module", back_populates="level")

class Module(Base):
    __tablename__ = "modules"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    level_id = Column(UUID(as_uuid=True), ForeignKey("levels.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)

    level = relationship("Level", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id = Column(UUID(as_uuid=True), ForeignKey("modules.id"))
    title = Column(String, nullable=False)
    
    # Este campo é o "Script" que mandaremos para a IA
    content_focus = Column(Text, nullable=False) 
    
    order = Column(Integer, nullable=False)

    module = relationship("Module", back_populates="lessons")

class UserLessonProgress(Base):
    __tablename__ = "user_lessons_progress"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"))
    
    status = Column(String, default="completed") # 'completed'
    completed_at = Column(DateTime, default=datetime.utcnow)