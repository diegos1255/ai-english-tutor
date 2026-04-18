from enum import Enum


class UserRole(str, Enum):

    USER = "USER" #usuario padrao
    STAFF = "STAFF" #empregado, tem alguns acessos
    ADMIN = "ADMIN" #administrador, tem acesso a tudo