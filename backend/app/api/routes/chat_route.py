from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user_model import User
from app.models.chat_models import ChatSession, ChatMessage

from app.models.course_models import Lesson

from app.schemas.chat_schemas import (
    ChatMessageCreate, 
    ChatMessageResponse, 
    ChatSessionResponse,
    ChatSessionUpdate,
    ChatMessageUpdate
)
from app.core.config import settings
from uuid import UUID
from typing import List

# Import do Groq
from groq import Groq

router = APIRouter(prefix="/chat", tags=["Chat"])

# Inicializa o cliente do Groq
client = Groq(api_key=settings.GROQ_API_KEY)

# Transformamos a instrução em uma BASE (que será customizada para cada usuário)
BASE_SYSTEM_INSTRUCTION = """
Você é um Tutor de Inglês focado em Desenvolvedores de Software. 
Seu objetivo é ajudar o usuário a melhorar o inglês para o trabalho.
Corrija erros gramaticais de forma educada, explique termos técnicos em inglês, 
e ajude com e-mails ou simulações de entrevista. 
Responda sempre em um tom encorajador e mantenha as respostas objetivas.
"""

# 1. Rota para listar todas as conversas na Barra Lateral (Agora com ORDENAÇÃO)
@router.get("/sessions", response_model=List[ChatSessionResponse])
def get_user_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).order_by(ChatSession.is_pinned.desc(), ChatSession.created_at.desc()).all()
    return sessions

# 2. Rota para pegar o histórico de UMA conversa específica
@router.get("/history/{session_id}", response_model=List[ChatMessageResponse])
def get_chat_history(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat_session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == current_user.id
    ).first()
    
    if not chat_session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")

    messages = db.query(ChatMessage).filter(
        ChatMessage.session_id == chat_session.id
    ).order_by(ChatMessage.created_at.asc()).all()
    return messages

# 3. Rota de enviar mensagem
@router.post("/", response_model=ChatMessageResponse)
def send_message(
    msg_in: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat_session = None

    if msg_in.session_id:
        chat_session = db.query(ChatSession).filter(
            ChatSession.id == msg_in.session_id,
            ChatSession.user_id == current_user.id
        ).first()

    if not chat_session:
        novo_titulo = msg_in.content[:30] + "..." if len(msg_in.content) > 30 else msg_in.content
        chat_session = ChatSession(user_id=current_user.id, title=novo_titulo)
        db.add(chat_session)
        db.commit()
        db.refresh(chat_session)

    user_msg = ChatMessage(session_id=chat_session.id, role="user", content=msg_in.content)
    db.add(user_msg)
    db.commit()

    historico = db.query(ChatMessage).filter(
        ChatMessage.session_id == chat_session.id
    ).order_by(ChatMessage.created_at.desc()).limit(15).all()
    historico.reverse()

    # --- 🧠 MÁGICA DA IMERSÃO: CONTEXTO DINÂMICO DE IDIOMA E NÍVEL ---
    instrucao_final = BASE_SYSTEM_INSTRUCTION
    
    if current_user.english_level or current_user.tech_stack:
        instrucao_final += "\n\nIMPORTANTE - PERFIL DO ALUNO:\n"
        
        if current_user.tech_stack:
            instrucao_final += f"- Área de atuação: {current_user.tech_stack}. Use exemplos práticos dessa tecnologia.\n"
        
        if current_user.english_level == "Iniciante":
            instrucao_final += "- Nível: Iniciante (A1-A2). Converse em PORTUGUÊS para não assustar o aluno, mas ensine e destaque o vocabulário, frases e exemplos práticos em INGLÊS.\n"
        elif current_user.english_level == "Intermediário":
            instrucao_final += "- Nível: Intermediário (B1-B2). MISTURE OS IDIOMAS. Explique conceitos mais difíceis em Português, mas mantenha boa parte das interações e perguntas em Inglês.\n"
        elif current_user.english_level == "Avançado":
            instrucao_final += "- Nível: Avançado (C1-C2). MODO HARD ATIVADO. A partir de agora, responda 100% em INGLÊS, use jargões técnicos, phrasal verbs corporativos e aja como um nativo fluente.\n"
    # -----------------------------------------------------------------

    mensagens_groq = [{"role": "system", "content": instrucao_final}]
    
    for msg in historico:
        role_formatado = "assistant" if msg.role == "ai" else "user"
        mensagens_groq.append({"role": role_formatado, "content": msg.content})

    try:
        chat_completion = client.chat.completions.create(
            messages=mensagens_groq,
            model="llama-3.3-70b-versatile",
        )
        ai_text = chat_completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na IA: {str(e)}")

    ai_msg = ChatMessage(session_id=chat_session.id, role="ai", content=ai_text)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg

# 4. Rota para ATUALIZAR a sessão (Renomear ou Fixar)
@router.patch("/sessions/{session_id}", response_model=ChatSessionResponse)
def update_session(
    session_id: UUID,
    session_in: ChatSessionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id, 
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    
    if session_in.title is not None:
        session.title = session_in.title
        
    if session_in.is_pinned is not None:
        session.is_pinned = session_in.is_pinned
        
    db.commit()
    db.refresh(session)
    return session

# 5. Rota para FIXAR/DESFIXAR uma mensagem
@router.patch("/messages/{message_id}/pin", response_model=ChatMessageResponse)
def toggle_pin_message(
    message_id: UUID,
    msg_in: ChatMessageUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    message = db.query(ChatMessage).join(ChatSession).filter(
        ChatMessage.id == message_id,
        ChatSession.user_id == current_user.id
    ).first()

    if not message:
        raise HTTPException(status_code=404, detail="Mensagem não encontrada")

    message.is_pinned = msg_in.is_pinned
    db.commit()
    db.refresh(message)
    return message

# 6. Rota para EXCLUIR uma sessão inteira
@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = db.query(ChatSession).filter(
        ChatSession.id == session_id, 
        ChatSession.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    
    db.delete(session)
    db.commit()
    return {"message": "Sessão excluída com sucesso"}

# 7. Rota para INICIAR uma Lição Proativamente
@router.post("/lesson/{lesson_id}/start")
def start_lesson(
    lesson_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lição não encontrada")

    # Cria a sessão de chat com um ícone de livro para destacar que é Aula
    chat_session = ChatSession(user_id=current_user.id, title=f"📚 {lesson.title}")
    db.add(chat_session)
    db.commit()
    db.refresh(chat_session)

    # Monta a Instrução da IA para dar o Ponto de Partida
    instrucao_final = BASE_SYSTEM_INSTRUCTION
    if current_user.tech_stack:
        instrucao_final += f"\n- Área do aluno: {current_user.tech_stack}."
    if current_user.english_level:
        instrucao_final += f"\n- Nível do aluno: {current_user.english_level}."

    instrucao_final += f"""\n\nATENÇÃO - INÍCIO DE LIÇÃO:
    O usuário acaba de abrir a lição: '{lesson.title}'.
    FOCO PEDAGÓGICO DESTA LIÇÃO: {lesson.content_focus}

    AJA AGORA: Você deve dar o primeiro passo! Cumprimente o aluno pelo nome ({current_user.name}), explique rapidamente de forma amigável o que vocês vão fazer nesta lição e JÁ FAÇA a primeira pergunta ou peça para ele fazer o primeiro exercício. 
    NÃO espere o usuário falar 'Oi'. Comece você!"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "system", "content": instrucao_final}],
            model="llama-3.3-70b-versatile",
        )
        ai_text = chat_completion.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na IA: {str(e)}")

    # Salva a primeira mensagem da IA no banco
    ai_msg = ChatMessage(session_id=chat_session.id, role="ai", content=ai_text)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    # Devolve o ID da sessão e a mensagem para o Front-end
    return {
        "session_id": chat_session.id,
        "message": {
            "id": str(ai_msg.id),
            "role": "ai",
            "content": ai_msg.content,
            "is_pinned": False
        }
    }