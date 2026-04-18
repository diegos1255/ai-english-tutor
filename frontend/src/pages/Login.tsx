import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importado
import { api } from '../services/api';
import Button from '../components/Button';
import toast from 'react-hot-toast';

import axios from 'axios';

export default function Login() {
  const { t } = useTranslation(); // Inicializado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password
      });

      localStorage.setItem('token', response.data.access_token);
      
      toast.success('Bem-vindo de volta!');
      navigate('/dashboard');
      
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (Array.isArray(err.response?.data?.detail)) {
          let errorMsg = err.response?.data?.detail[0]?.msg;
          errorMsg = errorMsg.replace('Value error, ', '');
          toast.error(errorMsg || 'Erro de validação.');
        } else {
          toast.error(err.response?.data?.detail || 'Erro na requisição.');
        }
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* HEADER CORPORATIVO */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto w-full px-8 lg:px-16 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-lg shadow-sm">
              🧠
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              AI English <span className="text-blue-600">Tutor</span>
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-gray-500 select-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm font-medium tracking-wide">{t('auth.secure_environment')}</span>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          
          <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-bold text-gray-900">{t('auth.login_title')}</h2>
            {/*<Link to="/" className="text-gray-400 hover:text-gray-600 transition" title="Voltar para a home">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>*/}
          </div>

          <div className="p-8 pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">{t('auth.email_label')}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" 
                  placeholder={t('auth.email_placeholder')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">{t('auth.password_label')}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" 
                    placeholder={t('auth.password_placeholder')}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.41-3.41" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button type="submit" isLoading={isLoading} className="w-full">
                  {t('auth.login_button')}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-sm text-gray-500 text-center">
              {t('auth.no_account')} <Link to="/cadastro" className="text-blue-600 hover:underline font-medium">{t('auth.create_account_link')}</Link>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}