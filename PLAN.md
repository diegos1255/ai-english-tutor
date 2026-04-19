# PLANO DE EXECUÇÃO: Criação de Novo Usuário pelo Painel Admin

Este documento descreve as etapas e arquivos que serão modificados/criados para atender à especificação `specs/01_create_new_user.md`.

## 1. Back-end (FastAPI)

### 1.1 `backend/app/schemas/user_schema.py`
- **Ação**: Modificar
- **Detalhes**: Criar um novo schema Pydantic chamado `UserAdminCreate` para validar os dados recebidos do formulário de admin. Este schema deve conter `name`, `email`, `password`, `confirm_password` e `role`.

### 1.2 `backend/app/services/user_service.py`
- **Ação**: Modificar
- **Detalhes**: Adicionar um novo método `admin_create_user(self, data: dict)` que receba os dados do usuário, incluindo a *role*.
  - Checar se o e-mail já existe utilizando `self.user_repository.find_by_email(email)`, levantando um erro se já estiver em uso.
  - Criptografar a senha utilizando `bcrypt` assim como na criação normal.
  - Salvar no banco o novo registro com as flags corretas.

### 1.3 `backend/app/api/routes/user_route.py`
- **Ação**: Modificar
- **Detalhes**: Adicionar um endpoint `POST /users/admin` exclusivo para administradores, protegido por `Depends(require_role(UserRole.ADMIN))`.
  - A rota irá receber os dados do tipo `UserAdminCreate` e delegar para o `user_service.admin_create_user`.
  - Em caso de falha de e-mail existente, capturar a exceção e retornar `HTTPException` de status code 400.
  - Retornar o usuário criado (`UserResponse`).

## 2. Front-end (React/TypeScript)

### 2.1 `frontend/src/pages/NewUser.tsx`
- **Ação**: Criar (Novo arquivo)
- **Detalhes**: 
  - Criar a página seguindo o Design System do projeto (container central `max-w-6xl mx-auto px-8 lg:px-12`, cor de fundo `bg-gray-50` via classes wrapper e o formulário dentro de um card `bg-white` com bordas e sombras sutis).
  - O formulário terá os campos: Nome, E-mail, Senha e Select de Papel (Role - Admin/User).
  - Fazer requisição POST via axios (`api.post('/users/admin')`).
  - Utilizar `react-hot-toast` para mostrar mensagens de sucesso ("Usuário criado com sucesso") e erro. 
  - Após sucesso, redirecionar de volta para `/admin/users` via `useNavigate`.

### 2.2 `frontend/src/App.tsx`
- **Ação**: Modificar
- **Detalhes**:
  - Importar `NewUser` de `./pages/NewUser`.
  - Adicionar a rota `<Route path="/admin/users/new" element={<NewUser />} />` dentro do agrupamento protegido do React Router.
