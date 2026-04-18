from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.schemas.menu_schema import MenuResponse
from app.services.menu_service import MenuService

router = APIRouter(prefix="/menus", tags=["Menus"])

@router.get("/", response_model=list[MenuResponse])
def get_my_menus(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Precisamos saber quem tá logado!
):
    menu_service = MenuService(db)
    
    # Passamos a role do usuário logado para o Service fazer o filtro mágico
    menus = menu_service.get_user_menus(current_user.role)
    
    return menus