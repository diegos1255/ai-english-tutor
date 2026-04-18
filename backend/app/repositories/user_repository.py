from sqlalchemy.orm import Session
from uuid import UUID

from app.models.user_model import User


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, user: User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def find_by_email(self, email: str):
        return (
            self.db
            .query(User)
            .filter(User.email == email)
            .first()
        )

    def find_by_id(self, user_id: UUID):
        return (
            self.db
            .query(User)
            .filter(User.id == user_id)
            .first()
        )

    def list_users(self):
        return self.db.query(User).all()