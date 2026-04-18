import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Checamos se existe o token no cofre do navegador
  const token = localStorage.getItem('token');

  // Se não tem token, forçamos o usuário (Navigate) de volta para o login.
  // O replace=true impede que ele use a seta de "voltar" do navegador para tentar burlar.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se tem token, o Outlet renderiza a página que ele queria ver (ex: Dashboard)
  return <Outlet />;
}