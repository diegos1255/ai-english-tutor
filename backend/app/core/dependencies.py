from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_access_token
from app.repositories.user_repository import UserRepository

from app.core.enums import UserRole

from uuid import UUID
from fastapi import Path

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user_repository = UserRepository(db)

    user = user_repository.find_by_id(user_id)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    return user

def require_admin(current_user = Depends(get_current_user)):

    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required"
        )

    return current_user

def require_self_or_admin(
    user_id: UUID = Path(...),
    current_user = Depends(get_current_user)
):

    if current_user.role == UserRole.ADMIN:
        return current_user

    if current_user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )

    return current_user

def require_role(role: UserRole):

    def role_checker(current_user = Depends(get_current_user)):

        if current_user.role != role:
            raise HTTPException(
                status_code=403,
                detail="Not enough permissions"
            )

        return current_user

    return role_checker