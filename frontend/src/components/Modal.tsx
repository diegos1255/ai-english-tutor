import React from 'react';

// Definimos o contrato do componente: quais parâmetros ele aceita
interface ModalProps {
  isOpen: boolean;       // Controla se a modal aparece
  onClose: () => void;   // Função para fechar (clique no X ou Cancelar)
  title: string;         // Título da modal
  description: string;   // Texto descritivo
  // Ícone opcional. Se não passar, desenhamos o ícone de alerta vermelho padrão
  icon?: React.ReactNode; 
  
  // Configuração do botão Principal (ex: Confirmar, Excluir)
  primaryAction?: {
    label: string;
    onClick: () => void;
    // Permite mudar a cor do botão principal (padrão é azul, mas pode ser vermelho para exclusão)
    variant?: 'danger' | 'primary'; 
  };
  
  // Configuração do botão Secundário (ex: Cancelar, Voltar) - Opcional
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  primaryAction,
  secondaryAction
}: ModalProps) {
  
  // Se a modal não estiver aberta, não renderiza nada
  if (!isOpen) return null;

  // Define a cor do botão principal com base na variante
  const primaryButtonClass = primaryAction?.variant === 'danger'
    ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
    : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20";

  return (
    // O CONTAINER PRINCIPAL: fixed ocupa a tela toda, z-50 para ficar por cima de tudo
    // bg-gray-900/60 escurece um pouco e backdrop-blur-sm cria o efeito borrado chic!
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      
      {/* O PAINEL DA MODAL (O card branco) */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-scale-in">
        
        {/* Botão X (Fechar) no canto superior direito */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
          title="Fechar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex items-start gap-6">
          {/* ÁREA DO ÍCONE: Se passar um ícone usa ele, senão usa o padrão de alerta */}
          <div className="shrink-0">
            {icon ? icon : (
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center border border-red-200 shadow-inner">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
          </div>

          {/* ÁREA DE TEXTO */}
          <div className="flex-1 mt-1">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* ÁREA DOS BOTÕES DE AÇÃO */}
        <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
          
          {/* Só renderiza o botão secundário se ele foi configurado */}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-6 py-2.5 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-gray-600 font-bold rounded-xl text-sm transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}

          {/* Só renderiza o botão principal se ele foi configurado */}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className={`px-8 py-2.5 text-white font-bold rounded-xl text-sm transition-all shadow-lg ${primaryButtonClass}`}
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}