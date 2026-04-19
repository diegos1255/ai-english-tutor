# Contexto do Projeto: AI English Tutor

## Visão Geral
Plataforma de E-learning de inglês guiada por IA. O sistema não é apenas um chat, é um LMS (Learning Management System) onde a IA atua proativamente como um professor, avaliando gramática e passando lições com base na stack técnica do usuário.

## Estrutura e Stack Tecnológica
- **/frontend:** React, TypeScript, Tailwind CSS, Vite.
- **/backend:** Python, FastAPI, SQLAlchemy, Alembic (PostgreSQL).
- **Infraestrutura:** Docker Compose na raiz orquestrando os serviços.

## Regras de Arquitetura e UI/UX (Diretrizes de Ouro)
1. **Back-end é a Fonte da Verdade:** O Front-end NUNCA decide se uma lição foi concluída. Toda regra de negócio, gamificação (XP) e validação de segurança ocorre no FastAPI.
2. **Layout Autenticado (Sidebar):** TODA tela que fica dentro da área logada do sistema (ex: painéis, dashboards) DEVE obrigatoriamente importar e renderizar o componente `<Sidebar />`, seguindo a estrutura: `<div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden h-screen"><Sidebar /><main className="flex-1 overflow-y-auto pb-12">...conteúdo max-w-6xl...</main></div>`.
3. **Padrão de Botões:** NUNCA invente CSS para botões principais. Siga o padrão: `px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-600/20`.
4. **Validações Rigorosas:** Toda criação ou edição de usuário DEVE validar se o E-mail é válido e exigir uma Senha forte (Mínimo 6 caracteres e 1 caractere especial `!@#$%`). Reutilize a lógica que já existe no sistema.
5. **Segurança da IA:** O sistema usa interceptação de tags no Back-end (ex: `[LESSON_COMPLETED]`). O usuário nunca deve ver essas tags.

## Fluxo de Trabalho Assistido por IA (Spec -> Plan -> Execute)
Ao ser solicitado para criar uma funcionalidade:
1. NÃO escreva código imediatamente.
2. Leia e entenda a SPEC fornecida.
3. Gere um arquivo `PLAN.md` detalhando quais arquivos do frontend e backend serão modificados.
4. Aguarde a aprovação do usuário ('Plano aprovado') antes de iniciar a execução do código.