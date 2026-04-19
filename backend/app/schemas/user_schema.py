from pydantic import BaseModel, EmailStr, Field, model_validator
from uuid import UUID
from datetime import datetime, date
from typing import Optional
import re

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, description="Nome completo do usuário")
    email: EmailStr
    birth_date: Optional[date] = Field(None, description="Data de nascimento")
    password: str = Field(min_length=6, description="Mínimo de 6 caracteres")
    confirm_password: str

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError('As senhas não coincidem.')
        
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", self.password):
            raise ValueError('A senha deve conter pelo menos um caractere especial.')
        
        return self

class UserAdminCreate(BaseModel):
    name: str = Field(..., min_length=2, description="Nome completo do usuário")
    email: EmailStr
    birth_date: Optional[date] = Field(None, description="Data de nascimento")
    password: str = Field(min_length=6, description="Mínimo de 6 caracteres")
    confirm_password: str
    role: str

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError('As senhas não coincidem.')
        
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", self.password):
            raise ValueError('A senha deve conter pelo menos um caractere especial.')
        
        return self

class UserResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    avatar_url: Optional[str]
    birth_date: Optional[date]
    english_level: Optional[str] # <-- NOVO
    tech_stack: Optional[str]    # <-- NOVO
    is_active: bool
    role: str
    failed_login_attempts: int
    last_login_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    deleted_at: Optional[datetime]

    class Config:
        from_attributes = True

class UserMeResponse(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    avatar_url: Optional[str]
    birth_date: Optional[date]
    english_level: Optional[str] # <-- NOVO (Para o Front-end ler na tela Settings)
    tech_stack: Optional[str]    # <-- NOVO (Para o Front-end ler na tela Settings)
    role: str

    class Config:
        from_attributes = True

class UserRegisterResponse(BaseModel):
    user: UserMeResponse
    access_token: str
    token_type: str

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    birth_date: Optional[date] = None
    english_level: Optional[str] = None # <-- NOVO (Para receber do Front-end)
    tech_stack: Optional[str] = None    # <-- NOVO (Para receber do Front-end)

class UserAdminUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2)
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    failed_login_attempts: Optional[int] = None
    english_level: Optional[str] = None
    tech_stack: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)

    @model_validator(mode='after')
    def check_password_strength(self):
        if self.password:
            if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", self.password):
                raise ValueError('A senha deve conter pelo menos um caractere especial.')
        return self