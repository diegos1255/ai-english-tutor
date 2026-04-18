from sqlalchemy.orm import Session
from app.models.menu_model import Menu
from app.core.enums import UserRole

class MenuRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_menus_by_role(self, user_role: str):
        query = self.db.query(Menu).filter(Menu.is_active == True)
        
        # Se o usuario for ADMIN, filtramos com in, para pegar os menus de user e de admin juntos
        if user_role == UserRole.ADMIN:
            # Admin vê os menus de ADMIN e os de USER
            query = query.filter(Menu.role.in_([UserRole.ADMIN, UserRole.USER]))
        else:
            # User comum só vê os menus de USER
            query = query.filter(Menu.role == UserRole.USER)
            
        # Retornamos ordenado pelo order_index para o Front-end não ter trabalho
        return query.order_by(Menu.order_index.asc()).all()