# Contexto do Projeto: AI English Tutor

## Visão Geral
Plataforma de E-learning de inglês guiada por IA. O sistema não é apenas um chat, é um LMS (Learning Management System) onde a IA atua proativamente como um professor, avaliando gramática e passando lições com base na stack técnica do usuário.

## Estrutura e Stack Tecnológica
- **/frontend:** React, TypeScript, Tailwind CSS, Vite.
- **/backend:** Python, FastAPI, SQLAlchemy, Alembic (PostgreSQL).
- **Infraestrutura:** Docker Compose na raiz orquestrando os serviços.

## Regras de Arquitetura (Diretrizes de Ouro)
1. **Back-end é a Fonte da Verdade:** O Front-end NUNCA decide se uma lição foi concluída. Toda regra de negócio, gamificação (XP) e validação de segurança ocorre no FastAPI.
2. **Design System (Front-end):** Usamos Tailwind. As telas principais devem seguir o contêiner padrão "max-w-6xl mx-auto px-8 lg:px-12", layout respirável, fundo "bg-gray-50" e cards "bg-white" com bordas e sombras sutis.
3. **Segurança da IA:** O sistema usa interceptação de tags no Back-end (ex: a IA responde com `[LESSON_COMPLETED]`, o Back-end processa a tag, dá o XP no banco de dados e remove a tag antes de devolver ao Front-end). O usuário nunca deve ver essas tags.

## Fluxo de Trabalho Assistido por IA (Spec -> Plan -> Execute)
Ao ser solicitado para criar uma funcionalidade:
1. NÃO escreva código imediatamente.
2. Leia e entenda a SPEC fornecida.
3. Gere um arquivo `PLAN.md` detalhando quais arquivos do frontend e backend serão modificados.
4. Aguarde a aprovação do usuário ('Plano aprovado') antes de iniciar a execução do código.