import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import toast from 'react-hot-toast';
import Modal from '../components/Modal'; // <-- IMPORTAMOS NOSSO NOVO COMPONENTE

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useSearchParams } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  is_pinned?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  is_pinned?: boolean;
}

let messageIdCounter = 0;
const generateId = () => {
  messageIdCounter += 1;
  return messageIdCounter.toString();
};

export default function Tutor() {
  const { t } = useTranslation();
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [isListening, setIsListening] = useState(false);

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState('');
  
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/chat/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) { console.error("Erro ao carregar sessões:", error); }
  };

  const loadHistory = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/chat/history/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const history = data.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          is_pinned: msg.is_pinned
        }));
        setMessages(history);
      }
    } catch (error) { console.error("Erro ao carregar histórico:", error); }
  };

  useEffect(() => { loadSessions(); }, []);

  useEffect(() => {
    if (currentSessionId) {
      loadHistory(currentSessionId);
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const lessonId = searchParams.get('lesson_id');
    if (lessonId) {
      startLesson(lessonId);
      // Limpa a URL para não disparar duas vezes se a tela recarregar
      searchParams.delete('lesson_id');
      setSearchParams(searchParams);
    }
  }, [searchParams]);

  const startLesson = async (lessonId: string) => {
    setIsTyping(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/chat/lesson/${lessonId}/start`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Muda para a nova conversa criada e atualiza a barra lateral
        setCurrentSessionId(data.session_id);
        loadSessions();
      } else {
        toast.error("Erro ao iniciar a lição.");
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => { setCurrentSessionId(null); };

  const handleSaveTitle = async (sessionId: string) => {
    if (!editTitleValue.trim()) {
      setEditingSessionId(null);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title: editTitleValue })
      });
      
      setEditingSessionId(null);
      loadSessions();
    } catch (error) { console.error("Erro ao renomear:", error); }
  };

  const handleToggleSessionPin = async (sessionId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ is_pinned: !currentStatus })
      });
      loadSessions();
    } catch (error) { console.error("Erro ao fixar sessão:", error); }
  };

  const handleTogglePin = async (messageId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/chat/messages/${messageId}/pin`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ is_pinned: !currentStatus })
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_pinned: !currentStatus } : msg
      ));
    } catch (error) { console.error("Erro ao fixar:", error); }
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/chat/sessions/${sessionToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (currentSessionId === sessionToDelete) setCurrentSessionId(null);
      loadSessions();
      toast.success('Chat excluído com sucesso!');
    } catch (error) { 
      console.error("Erro ao excluir:", error);
      toast.error('Erro ao excluir o chat.');
    } finally {
      setSessionToDelete(null); 
    }
  };

  const handleSpeakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Seu navegador não suporta leitura de voz.');
      return;
    }
    
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_`~>]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9;     
    
    window.speechSynthesis.speak(utterance);
  };

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error('Seu navegador não suporta reconhecimento de voz (tente no Chrome).');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      toast.success('Pode falar em Inglês! 🎤', { duration: 3000, position: 'bottom-center' });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      if (event.error === 'not-allowed') {
        toast.error('Permita o uso do microfone no navegador.');
      } else {
        toast.error('Não entendi direito. Tente falar novamente.');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendMessage = async (e?: React.FormEvent, suggestionText?: string) => {
    if (e) e.preventDefault();
    const textToSend = suggestionText || inputValue;
    if (!textToSend.trim()) return;

    const newUserMsg: Message = { id: generateId(), role: 'user', content: textToSend };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token'); 
      const payload: any = { content: textToSend };
      if (currentSessionId) payload.session_id = currentSessionId;

      const response = await fetch('http://localhost:8000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Falha ao comunicar com o servidor');
      const data = await response.json();

      const aiResponse: Message = {
        id: data.id,
        role: 'ai',
        content: data.content,
        is_pinned: false
      };
      
      setMessages(prev => [...prev, aiResponse]);

      if (!currentSessionId) loadSessions();

    } catch (error) { console.error("Erro no chat:", error); } 
    finally { setIsTyping(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden h-screen relative">
      <Sidebar />

      {/* Menu Interno: Lista de Conversas */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex z-10">
        <div className="p-4 border-b border-gray-200">
          <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl font-medium transition-colors">
            <span>+</span> {t('tutor.new_chat')}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">{t('tutor.history')}</h3>
          
          {sessions.map(session => (
            <div key={session.id} className="relative group">
              {editingSessionId === session.id ? (
                <input
                  autoFocus
                  value={editTitleValue}
                  onChange={(e) => setEditTitleValue(e.target.value)}
                  onBlur={() => handleSaveTitle(session.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle(session.id)}
                  className="w-full text-sm px-3 py-2 border-2 border-blue-500 rounded-lg outline-none bg-blue-50"
                />
              ) : (
                <>
                  <button
                    onClick={() => setCurrentSessionId(session.id)}
                    className={`w-full text-left pl-3 pr-24 py-2.5 rounded-lg text-sm truncate transition-colors ${
                      currentSessionId === session.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    💬 {session.title}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSessionPin(session.id, !!session.is_pinned);
                    }}
                    className={`absolute right-14 top-1/2 -translate-y-1/2 p-1.5 transition-all ${
                      session.is_pinned ? 'text-yellow-500 opacity-100' : 'text-gray-400 hover:text-yellow-500 opacity-0 group-hover:opacity-100'
                    }`}
                    title={session.is_pinned ? "Desfixar Chat" : "Fixar Chat"}
                  >
                    <svg className="w-4 h-4" fill={session.is_pinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSessionId(session.id);
                      setEditTitleValue(session.title);
                    }}
                    className="absolute right-8 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Renomear Chat"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(session.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Excluir Chat"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Área do Chat */}
      <main className="flex-1 flex flex-col relative bg-gray-50 z-0">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 md:py-20 animate-fade-in">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-sm border border-blue-200">🧠</div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">{t('tutor.welcome_title')}</h2>
                <p className="text-gray-500 text-center max-w-xl leading-relaxed mb-10">{t('tutor.welcome_desc')}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                  {[
                    { title: t('tutor.suggestion_1_title'), desc: t('tutor.suggestion_1_desc') },
                    { title: t('tutor.suggestion_2_title'), desc: t('tutor.suggestion_2_desc') },
                    { title: t('tutor.suggestion_3_title'), desc: t('tutor.suggestion_3_desc') },
                  ].map((sug, idx) => (
                    <button key={idx} onClick={() => handleSendMessage(undefined, sug.desc)} className="text-left p-5 bg-white border border-gray-200 rounded-2xl hover:border-blue-400 hover:shadow-md transition-all group">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{sug.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{sug.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
                <div className={`max-w-[85%] md:max-w-[75%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm shrink-0 shadow-sm mt-1 relative">
                      🧠
                      {msg.is_pinned && <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>}
                    </div>
                  )}

                  <div className={`p-4 rounded-2xl shadow-sm relative ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                    
                    {msg.role === 'ai' && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleSpeakText(msg.content)}
                          title="Ouvir"
                          className="p-1.5 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 10v4a2 2 0 002 2h2.586a1 1 0 01.707.293l3.414 3.414A1 1 0 0015 19V5a1 1 0 00-1.707-.707l-3.414 3.414A1 1 0 019.172 8H7a2 2 0 00-2 2z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => handleTogglePin(msg.id, !!msg.is_pinned)}
                          title={msg.is_pinned ? t('tutor.unpin_message') : t('tutor.pin_message')}
                          className={`p-1.5 rounded-md transition-all ${
                            msg.is_pinned ? 'text-yellow-500 opacity-100' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                          }`}
                        >
                          <svg className="w-5 h-5" fill={msg.is_pinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-white pr-16">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                 <div className="max-w-[75%] flex gap-4 flex-row">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm shrink-0 shadow-sm mt-1">🧠</div>
                    <div className="p-4 rounded-2xl bg-white border border-gray-200 rounded-tl-none flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white border-t border-gray-200 shrink-0">
          <div className="max-w-4xl mx-auto relative">
            <form onSubmit={handleSendMessage} className="relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 shadow-inner focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
              
              <button 
                type="button" 
                onClick={handleListen}
                title="Falar em Inglês"
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors mb-0.5 ${
                  isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Ouvindo... Fale em inglês!" : t('tutor.input_placeholder')}
                className="w-full max-h-32 bg-transparent border-none outline-none resize-none py-3 px-2 text-sm text-gray-800 placeholder-gray-400 custom-scrollbar"
                rows={1}
                style={{ minHeight: '44px' }}
              />
              <button type="submit" disabled={!inputValue.trim() || isTyping} className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5">
                <svg className="w-5 h-5 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* --- USAMOS O NOSSO NOVO COMPONENTE AQUI --- */}
      <Modal
        isOpen={Boolean(sessionToDelete)} // Abre se tiver um ID para deletar
        onClose={() => setSessionToDelete(null)} // Fecha ao clicar no X ou Cancelar
        title="Excluir Conversa?"
        description="Tem certeza que deseja apagar este chat? Esta ação não poderá ser desfeita e todo o histórico será perdido."
        primaryAction={{
          label: 'Sim, excluir',
          onClick: confirmDeleteSession,
          variant: 'danger' // Cor vermelha para exclusão
        }}
        secondaryAction={{
          label: 'Cancelar',
          onClick: () => setSessionToDelete(null)
        }}
      />
      {/* ------------------------------------------- */}

    </div>
  );
}