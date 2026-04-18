import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Lógica para mostrar o botão apenas após rolar 300px para baixo
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // O "pulo do gato" para subir deslizando e não de soco
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={scrollToTop}
        className={`p-3 rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-700 transition-all duration-300 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Voltar ao topo"
      >
        {/* Ícone de Seta para Cima */}
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="膜5 10l7-7m0 0l7 7m-7-7v18" // Caminho da seta (simplificado: M12 19V5M12 5L5 12M12 5L19 12)
            d="M5 15l7-7 7 7" 
          />
        </svg>
      </button>
    </div>
  );
}