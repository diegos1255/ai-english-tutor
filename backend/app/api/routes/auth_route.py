from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth_schema import LoginRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):

    auth_service = AuthService(db)

    try:
        # Tenta fazer o login com o Guardião ativado
        token = auth_service.login(data.email, data.password)

        # Se passou direto, sucesso!
        return {
            "access_token": token,
            "token_type": "bearer"
        }
        
    except Exception as e:
        # Agarra a mensagem de erro vinda do AuthService
        erro_msg = str(e)
        
        # Decide qual código HTTP faz mais sentido
        if "bloqueado" in erro_msg:
            status_code = status.HTTP_403_FORBIDDEN
        else:
            status_code = status.HTTP_401_UNAUTHORIZED
            
        raise HTTPException(
            status_code=status_code,
            detail=erro_msg
        )