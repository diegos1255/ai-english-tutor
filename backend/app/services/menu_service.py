from sqlalchemy.orm import Session
from app.repositories.menu_repository import MenuRepository

class MenuService:
    def __init__(self, db: Session):
        self.menu_repository = MenuRepository(db)

    def get_user_menus(self, user_role: str):
        return self.menu_repository.get_menus_by_role(user_role)