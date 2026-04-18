import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- Importamos aqui
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register'; // <-- Importe aqui
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Importando nosso segurança
import ScrollToTop from './components/ScrollToTop';

import Settings from './pages/Settings';
import AdminUsers from './pages/AdminUsers';
import Tutor from './pages/Tutor';

export default function App() {
  return (
    <>
      {/* Configuração global dos Toasts: Canto superior direito, some em 3 segundos (3000ms) */}
      <Toaster position="top-right" toastOptions={{ duration: 5000 }} />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          
          {/* Rotas Privadas (Envolvidas pelo ProtectedRoute) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/chat" element={<Tutor />} />
            {/* Qualquer outra tela futura logada (ex: /chat) vai entrar aqui dentro também! */}
          </Route>
        </Routes>
        <ScrollToTop />
      </BrowserRouter>
    </>
  );
}