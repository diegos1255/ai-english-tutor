import bcrypt
from datetime import datetime

from app.repositories.user_repository import UserRepository
from app.core.security import create_access_token


class AuthService:

    def __init__(self, db):
        self.user_repository = UserRepository(db)

    def login(self, email: str, password: str):

        user = self.user_repository.find_by_email(email)

        # 1. Se o usuário não existe no banco, já cortamos aqui
        if not user:
            raise Exception("E-mail ou senha incorretos.")

        # =================================================================
        # AS NOVAS CATRACAS DE SEGURANÇA
        # =================================================================
        
        # 2. Checa se a conta foi excluída (Soft Delete)
        if user.deleted_at is not None:
            raise Exception("Sua conta foi excluída. Contate o suporte.")

        # 3. Checa se o Administrador inativou a conta
        if not user.is_active:
            raise Exception("Conta inativa, contate o suporte.")
            
        # =================================================================

        # 4. O Guardião: Checa se está bloqueado ANTES de testar a senha
        if user.failed_login_attempts >= 3:
            raise Exception("Usuário bloqueado. Entre em contato com o administrador do sistema.")

        # 5. Testa a validade da senha
        password_valid = bcrypt.checkpw(
            password.encode(),
            user.password_hash.encode()
        )

        # 6. Se a senha estiver errada, punimos com +1 falha
        if not password_valid:
            user.failed_login_attempts += 1
            self.user_repository.db.commit()
            raise Exception("E-mail ou senha incorretos.")

        # 7. SUCESSO! Zeramos a ficha criminal e anotamos a hora do login
        user.failed_login_attempts = 0
        user.last_login_at = datetime.utcnow()
        self.user_repository.db.commit()

        # Passamos o ID como string para evitar bugs na hora de serializar o JWT
        token = create_access_token(str(user.id))

        return token