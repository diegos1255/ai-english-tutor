from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.services.user_service import UserService
from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.schemas.user_schema import UserAdminUpdate, UserCreate, UserResponse, UserMeResponse, UserRegisterResponse, UserUpdate, UserAdminCreate
from app.models.user_model import User

from app.core.dependencies import require_self_or_admin, require_role

from app.core.enums import UserRole

from app.core.security import create_access_token


router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserRegisterResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_service = UserService(db)
    
    try:
        new_user = user_service.create_user(
            name=user.name, 
            email=user.email, 
            password=user.password,
            birth_date=user.birth_date
        )
        
        access_token = create_access_token(str(new_user.id)) 
        
        return {
            "user": new_user,
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        erro_msg = str(e)
        if erro_msg == "User already exists":
            erro_msg = "Este e-mail já está em uso."
            
        raise HTTPException(status_code=400, detail=erro_msg)


@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user = Depends(require_role(UserRole.ADMIN))
):
    user_service = UserService(db)
    return user_service.list_users()

@router.get("/check-email")
def check_email_exists(email: str, db: Session = Depends(get_db)):
    user_service = UserService(db)
    user = user_service.user_repository.find_by_email(email)
    return {"exists": user is not None}

@router.get("/me", response_model=UserMeResponse)
def get_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(require_self_or_admin)
):
    user_service = UserService(db)
    return user_service.get_user_by_id(user_id)

@router.put("/{user_id}", response_model=UserMeResponse)
def update_user_data(
    user_id: UUID,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_self_or_admin)
):
    user_service = UserService(db)
    try:
        # Passando os dois campos novos para a camada de Serviço!
        updated_user = user_service.update_user(
            user_id=str(user_id),
            name=user_data.name,
            email=user_data.email,
            avatar_url=user_data.avatar_url,
            birth_date=user_data.birth_date,
            english_level=user_data.english_level, # <-- NOVO
            tech_stack=user_data.tech_stack        # <-- NOVO
        )
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.put("/admin/{user_id}", response_model=UserResponse)
def admin_update_user_endpoint(
    user_id: UUID,
    user_data: UserAdminUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(UserRole.ADMIN))
):
    user_service = UserService(db)
    try:
        update_data = user_data.model_dump(exclude_unset=True)
        updated_user = user_service.admin_update_user(
            user_id=str(user_id),
            data=update_data
        )
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/admin", response_model=UserResponse)
def admin_create_user_endpoint(
    user_data: UserAdminCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(UserRole.ADMIN))
):
    user_service = UserService(db)
    try:
        new_user = user_service.admin_create_user(user_data.model_dump())
        return new_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))