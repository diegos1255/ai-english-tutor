import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/80 backdrop-blur-lg border-b border-gray-200 py-3' 
        : 'bg-white py-5'
    }`}>
      <div className="flex justify-between items-center px-8 max-w-7xl mx-auto w-full">
        
        {/* LADO ESQUERDO: Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
             <span className="text-xl">🧠</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            AI English <span className="text-blue-600">Tutor</span>
          </span>
        </Link>

        {/* CENTRO: Links de Navegação (O que tira a sensação de "pobre") */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#home" className="hover:text-blue-600 transition-colors">Início</a>
          <a href="#depoimentos" className="hover:text-blue-600 transition-colors">Depoimentos</a>
          <a href="#sobre" className="hover:text-blue-600 transition-colors">Sobre</a>
          <a href="#contato" className="hover:text-blue-600 transition-colors">Contato</a>
        </nav>
        
        {/* LADO DIREITO: Ações */}
        <div className="flex items-center gap-6">
          <LanguageSwitcher />
          
          {/* Linha Divisória sutil */}
          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

          <Link to="/login" className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-blue-200 active:scale-95">
            {t('navbar.login')}
          </Link>
        </div>
      </div>
    </header>
  );
}