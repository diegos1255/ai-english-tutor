import { useState, useEffect, useRef } from 'react';

const MESSAGES = [
  { 
    role: 'user', 
    text: 'Como eu uso o passado (Simple Past) para falar de um bug?' 
  },
  { 
    role: 'ai', 
    text: 'Boa! 🚀 No inglês técnico, usamos muito o final "ED". Exemplo: "I fixed the bug" (Eu corrigi o bug). Pense nisso como um commit: o erro já foi resolvido!' 
  },
  { 
    role: 'user', 
    text: 'Entendi! E se eu quiser dizer que eu "deletei" uma tabela?' 
  },
  { 
    role: 'ai', 
    text: 'Fica: "I deleted the table". 💡 Dica: Verbos terminados em "E" só ganham o "D". Você "created" a branch e "updated" o código. Easy, right? 😉' 
  },
];

export default function ChatSimulator() {
  const [visibleMessages, setVisibleMessages] = useState<typeof MESSAGES>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função para destacar o que estiver entre aspas como se fosse código
  const renderMessageWithCodeHighlight = (text: string) => {
    const regex = /("[^"]*")/g;
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.match(regex)) {
        return (
          <span key={index} className="text-blue-400 font-mono bg-slate-900/50 px-1.5 py-0.5 rounded-md mx-0.5 shadow-inner border border-white/5">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  useEffect(() => {
    if (currentIndex < MESSAGES.length) {
      // Se for a vez da IA (índices ímpares)
      if (currentIndex % 2 === 1) {
        // CORREÇÃO: Colocamos o início do "digitando" num pequeno delay
        // para evitar o erro de renderização síncrona
        const startTypingTimer = setTimeout(() => {
          setIsTyping(true);
        }, 400); // Dá um tempinho antes de começar a digitar

        const typingTimer = setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages((prev) => [...prev, MESSAGES[currentIndex]]);
          setCurrentIndex(currentIndex + 1);
        }, 3000); // Tempo total que a IA leva para responder

        return () => {
          clearTimeout(startTypingTimer);
          clearTimeout(typingTimer);
        };
      } else {
        // Se for a vez do Usuário
        const userTimer = setTimeout(() => {
          setVisibleMessages((prev) => [...prev, MESSAGES[currentIndex]]);
          setCurrentIndex(currentIndex + 1);
        }, 1500);
        return () => clearTimeout(userTimer);
      }
    } else {
      // Loop: Espera 7 segundos e reinicia
      const resetTimer = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
      }, 7000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex]);

  // Scroll automático para a última mensagem
  // Scroll automático APENAS dentro do container do chat
  useEffect(() => {
    // Em vez de usar scrollIntoView (que move a página toda)
    // Vamos calcular o scroll apenas do elemento pai (o container das mensagens)
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [visibleMessages, isTyping]);

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden h-[450px] flex flex-col font-sans">
      {/* Header do terminal fake */}
      <div className="bg-slate-700/50 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-900/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-900/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-900/50"></div>
          <span className="text-slate-400 text-[10px] ml-2 font-bold uppercase tracking-widest">AI ENGLISH TUTOR</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 p-6 space-y-5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {visibleMessages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-slate-700 text-slate-100 rounded-tl-none border border-slate-600'
            }`}>
              {renderMessageWithCodeHighlight(msg.text)}
            </div>
          </div>
        ))}

        {/* Indicador de que a IA está digitando */}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="bg-slate-700 p-4 rounded-2xl rounded-tl-none border border-slate-600 flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Fake de baixo */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <div className="bg-slate-700 rounded-full h-11 flex items-center px-5 text-slate-500 text-sm border border-slate-600 italic">
          {currentIndex % 2 === 0 ? "O tutor está digitando..." : "Digite sua dúvida de inglês técnico..."}
        </div>
      </div>
    </div>
  );
}