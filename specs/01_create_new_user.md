# SPEC: Criação de Novo Usuário pelo Painel Admin

## 1. Contexto e Objetivo
O menu lateral já possui um botão "Novo Usuário" que aponta para a rota `/admin/users/new`. No entanto, a tela no Front-end está em branco e não existe uma rota no Back-end para salvar esse usuário. O objetivo é criar a interface de cadastro e a API para persistir os dados, validando se o e-mail já existe.

## 2. Requisitos (Requirements)

**Front-end:**
- Criar o componente/página em `src/pages/NewUser.tsx` (ou caminho equivalente que corresponda à rota `/admin/users/new`).
- A tela deve seguir o Design System do projeto (`max-w-6xl mx-auto`, `bg-gray-50`, cards brancos, etc.), contendo um formulário com: Nome, E-mail, Senha e Papel (Role - Admin ou User).
- Ao submeter, deve chamar a API de criação. Exibir um toast de sucesso ou erro. Se sucesso, limpar o form ou redirecionar para a lista de usuários.

**Back-end:**
- Criar a rota `POST /users/` (ou similar) no FastAPI para criar um usuário.
- O Back-end deve validar se o `email` já existe na tabela `users`. Se existir, retornar erro 400 (Bad Request).
- A senha recebida DEVE ser criptografada (hash) antes de salvar no banco, utilizando a mesma biblioteca de hash que o projeto já utiliza para o cadastro/login.

## 3. Não-Objetivos (Non-Goals)
- NÃO é necessário implementar envio de e-mail de boas-vindas neste momento.
- NÃO alterar o layout geral do Sidebar ou Navbar, apenas criar a área de conteúdo da nova página.

## 4. Diretrizes de Arquitetura
- Reutilizar funções existentes de hashing de senha localizadas na pasta `core` ou `utils` do backend.
- Manter o schema de entrada (Pydantic) estrito para a criação do usuário (ex: `UserCreate`).