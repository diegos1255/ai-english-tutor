import { useTranslation } from 'react-i18next';

// 1. Importando os assets localmente
import flagUS from '../assets/flags/us.png';
import flagBR from '../assets/flags/br.png';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const nextLang = currentLang === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center bg-blue-600 rounded-full p-1 cursor-pointer transition-all duration-300 shadow-sm hover:bg-blue-700 border border-blue-500/30"
      aria-label="Alternar idioma"
    >
      {/* Opção EN */}
      <div className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 flex items-center gap-2 ${
        currentLang === 'en' 
          ? 'bg-white text-blue-600 shadow-md scale-105' 
          : 'text-white/80 hover:text-white'
      }`}>
        <img 
          src={flagUS} // <--- Usando a variável importada
          alt="USA" 
          className="w-5 h-auto rounded-sm object-cover" 
        />
        <span>EN</span>
      </div>

      {/* Opção PT */}
      <div className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-300 flex items-center gap-2 ${
        currentLang === 'pt' 
          ? 'bg-white text-blue-600 shadow-md scale-105' 
          : 'text-white/80 hover:text-white'
      }`}>
        <img 
          src={flagBR} // <--- Usando a variável importada
          alt="Brazil" 
          className="w-5 h-auto rounded-sm object-cover" 
        />
        <span>PT</span>
      </div>
    </button>
  );
}