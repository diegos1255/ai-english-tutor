from uuid import UUID
from datetime import datetime, date
from typing import Optional
import bcrypt

from app.models.user_model import User
from app.repositories.user_repository import UserRepository


class UserService:

    def __init__(self, db):
        self.user_repository = UserRepository(db)

    def create_user(self, name: str, email: str, password: str, birth_date: Optional[date] = None):

        existing_user = self.user_repository.find_by_email(email)

        if existing_user:
            raise Exception("User already exists")

        password_hash = bcrypt.hashpw(
            password.encode(),
            bcrypt.gensalt()
        ).decode()

        # Instancia o model novo. is_active, role e created_at o SQLAlchemy cuida!
        new_user = User(
            name=name,
            email=email,
            password_hash=password_hash,
            birth_date=birth_date
        )

        return self.user_repository.create(new_user)

    def get_user_by_id(self, user_id: UUID):
        return self.user_repository.find_by_id(user_id)

    def list_users(self):
        return self.user_repository.list_users()
    
    def update_user(self, user_id: str, name: str = None, email: str = None, avatar_url: str = None, birth_date: date = None, english_level: str = None, tech_stack: str = None):
        user = self.user_repository.find_by_id(user_id)
        if not user:
            raise Exception("Usuário não encontrado.")

        # Se ele tentou mudar o e-mail, checamos se já não existe outro com esse novo e-mail
        if email and email != user.email:
            existing_user = self.user_repository.find_by_email(email)
            if existing_user:
                raise Exception("Este e-mail já está em uso.")
            user.email = email

        if name is not None:
            user.name = name
            
        if avatar_url is not None:
            user.avatar_url = avatar_url
            
        if birth_date is not None:
            user.birth_date = birth_date

        # Novos campos de Perfil
        if english_level is not None:
            user.english_level = english_level
            
        if tech_stack is not None:
            user.tech_stack = tech_stack

        # A Mágica do Ciclo de Vida: Atualizamos a data de modificação
        user.updated_at = datetime.utcnow()

        # Salva as alterações no banco
        self.user_repository.db.commit()
        self.user_repository.db.refresh(user)
        
        return user
    
    def admin_update_user(self, user_id: str, data: dict):
        user = self.user_repository.find_by_id(user_id)
        if not user:
            raise Exception("Usuário não encontrado.")

        # Se houver senha no dicionário, precisamos hashear antes de salvar
        if data.get("password"):
            password_hash = bcrypt.hashpw(
                data["password"].encode(),
                bcrypt.gensalt()
            ).decode()
            user.password_hash = password_hash

        # Atualiza os campos básicos se eles vierem no dicionário
        if "name" in data and data["name"] is not None:
            user.name = data["name"]
        
        if "email" in data and data["email"] is not None:
            # Se mudar o e-mail, checa se já existe
            if data["email"] != user.email:
                if self.user_repository.find_by_email(data["email"]):
                    raise Exception("Este e-mail já está em uso.")
                user.email = data["email"]

        if "role" in data and data["role"] is not None:
            user.role = data["role"]

        if "is_active" in data and data["is_active"] is not None:
            user.is_active = data["is_active"]

        if "failed_login_attempts" in data and data["failed_login_attempts"] is not None:
            user.failed_login_attempts = data["failed_login_attempts"]

        # Adicionando a atualização dos novos campos pelo painel admin também
        if "english_level" in data and data["english_level"] is not None:
            user.english_level = data["english_level"]

        if "tech_stack" in data and data["tech_stack"] is not None:
            user.tech_stack = data["tech_stack"]

        user.updated_at = datetime.utcnow()

        self.user_repository.db.commit()
        self.user_repository.db.refresh(user)
        return user