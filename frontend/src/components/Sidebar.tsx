import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface Menu {
  id: string;
  title: string;
  path: string;
  icon: string;
  order_index: number;
}

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await api.get('/menus/');
        setMenus(response.data);
      } catch {
        toast.error('Erro ao carregar o menu.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  const renderIcon = (iconName: string) => {
    const iconClass = "w-5 h-5 mr-3 shrink-0 transition-colors duration-200"; 
    switch (iconName) {
      case 'home': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case 'bot': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
      case 'settings': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
      case 'users_cog': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
      case 'user_plus': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>;
      case 'menu': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
      default: return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };

  return (
    // ADICIONADO: sticky e top-0 para travar o menu, e h-screen para ocupar a altura toda
    <aside className="w-64 bg-white flex flex-col h-screen border-r border-gray-200 shadow-sm sticky top-0 shrink-0">
      
      <div className="p-6 border-b border-gray-100 mb-2">
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-lg shadow-sm">🧠</div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            AI English <span className="text-blue-600">Tutor</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="space-y-3 px-2 mt-2">
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        ) : (
          menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.id}
                to={menu.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100'
                    : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {renderIcon(menu.icon)}
                {menu.title}
              </Link>
            );
          })
        )}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/50">
        <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
          <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
            {t('sidebar.language')}
          </span>
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-sm font-bold px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
          >
            {i18n.language === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-semibold flex items-center gap-2 group"
        >
          <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}