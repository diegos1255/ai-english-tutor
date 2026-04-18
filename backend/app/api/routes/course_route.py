from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.models.course_models import Level, Module, Lesson, UserLessonProgress
from app.schemas.course_schemas import DashboardResponse, ModuleResponse, LessonResponse

router = APIRouter(prefix="/course", tags=["Course"])

@router.get("/dashboard", response_model=DashboardResponse)
def get_user_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Pega o nível mais básico (Iniciante) por padrão. 
    # No futuro, se o usuário avançar, puxaremos o nível correspondente ao perfil dele.
    current_level = db.query(Level).order_by(Level.order.asc()).first()

    # 2. Busca todos os módulos desse nível
    modules = db.query(Module).filter(Module.level_id == current_level.id).order_by(Module.order.asc()).all()

    # 3. Descobre quais lições esse usuário ESPECÍFICO já terminou
    user_progress = db.query(UserLessonProgress).filter(
        UserLessonProgress.user_id == current_user.id,
        UserLessonProgress.status == "completed"
    ).all()
    completed_lesson_ids = {progress.lesson_id for progress in user_progress}

    # 4. Monta a estrutura (Módulos -> Lições)
    modules_response = []
    for mod in modules:
        # Busca lições do módulo
        lessons = db.query(Lesson).filter(Lesson.module_id == mod.id).order_by(Lesson.order.asc()).all()
        
        lessons_list = []
        for les in lessons:
            lessons_list.append(LessonResponse(
                id=les.id,
                title=les.title,
                order=les.order,
                is_completed=les.id in completed_lesson_ids # Checa no Set se ele já fez
            ))

        modules_response.append(ModuleResponse(
            id=mod.id,
            title=mod.title,
            description=mod.description,
            order=mod.order,
            lessons=lessons_list
        ))

    # Retorna o pacote completo para o Front-end brilhar!
    return DashboardResponse(
        user_xp=current_user.xp if hasattr(current_user, 'xp') else 0, # Se você adicionou a coluna xp no user_model
        current_level_name=current_level.name,
        modules=modules_response
    )