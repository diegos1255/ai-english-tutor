import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Settings() {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState(''); 
  
  const [englishLevel, setEnglishLevel] = useState('');
  const [techStack, setTechStack] = useState('');
  
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        const response = await api.get('/users/me');
        setUserId(response.data.id); 
        setName(response.data.name);
        setEmail(response.data.email);
        if (response.data.birth_date) setBirthDate(response.data.birth_date);
        
        if (response.data.english_level) setEnglishLevel(response.data.english_level);
        if (response.data.tech_stack) setTechStack(response.data.tech_stack);
        
      } catch {
        toast.error('Erro ao carregar dados.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchMyData();
  }, []);

  const handleGlobalSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        birth_date: birthDate || null,
        english_level: englishLevel || null,
        tech_stack: techStack || null,
        ...(newPassword ? { password: newPassword } : {})
      };

      await api.put(`/users/${userId}`, payload);
      toast.success('Configurações atualizadas com sucesso!');
      setNewPassword(''); 
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.detail || 'Erro ao atualizar.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden h-screen">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-12">
        <div className="max-w-6xl px-8 lg:px-12 py-12 w-full">
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Configurações</h1>
            <p className="text-sm text-gray-500 mt-1.5">Gerencie suas informações e o comportamento da IA.</p>
          </div>

          {isFetching ? (
            <div className="animate-pulse space-y-4">
               <div className="h-32 bg-gray-200 rounded-2xl w-full mb-8"></div>
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
                  <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
               </div>
            </div>
          ) : (
            <form onSubmit={handleGlobalSave} className="flex flex-col gap-8">
              
              {/* DESTAQUE ABSOLUTO: PERFIL DA IA */}
              <div className="bg-white rounded-2xl border-2 border-blue-400 shadow-md shadow-blue-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600"></div>
                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50/80 to-white flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-blue-200 shrink-0">
                    🧠
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">O Cérebro do seu Tutor</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Preencha estes dados para a Inteligência Artificial adaptar o vocabulário e os exemplos para a sua realidade.</p>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
                  <div>
                    <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Qual o seu nível de Inglês?</label>
                    <select 
                      value={englishLevel} 
                      onChange={(e) => setEnglishLevel(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition text-sm text-gray-800 font-medium cursor-pointer"
                    >
                      <option value="">Selecione seu nível...</option>
                      <option value="Iniciante">Iniciante (A1-A2)</option>
                      <option value="Intermediário">Intermediário (B1-B2)</option>
                      <option value="Avançado">Avançado (C1-C2)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Qual a sua área / Tech Stack?</label>
                    <select 
                      value={techStack} 
                      onChange={(e) => setTechStack(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition text-sm text-gray-800 font-medium cursor-pointer"
                    >
                      <option value="">Selecione sua stack...</option>
                      <option value="Front-end">Front-end (React, Vue, Angular)</option>
                      <option value="Back-end">Back-end (Node, Java, C#, Python)</option>
                      <option value="Full-stack">Full-stack</option>
                      <option value="Mobile">Mobile (React Native, Flutter, Swift)</option>
                      <option value="DevOps / Cloud">DevOps / Cloud (AWS, Docker)</option>
                      <option value="Dados / IA">Dados / IA (SQL, Machine Learning)</option>
                      <option value="QA / Testes">QA / Automação de Testes</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* LINHA DE BAIXO: DUAS COLUNAS (DADOS ESQUERDA | SEGURANÇA E BOTAO DIREITA) */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                
                {/* COLUNA ESQUERDA: DADOS PESSOAIS */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                  <div className="px-8 py-5 border-b border-gray-100 bg-white">
                    <h2 className="text-lg font-semibold text-gray-900">Dados Pessoais</h2>
                  </div>

                  <div className="p-8 space-y-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl uppercase shadow-md shrink-0">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 leading-tight">Sua foto de perfil</p>
                        <button type="button" className="text-xs text-blue-600 font-semibold hover:underline">Alterar foto</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nome Completo</label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">E-mail</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Data de Nascimento</label>
                      <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" />
                    </div>
                  </div>
                </div>

                {/* COLUNA DIREITA: SEGURANÇA + BOTÃO SALVAR */}
                <div className="flex flex-col gap-8 h-full">
                  
                  {/* SEGURANÇA */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-100 bg-white">
                      <h2 className="text-lg font-semibold text-gray-900">Segurança</h2>
                    </div>
                    <div className="p-8 space-y-6">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Deseja alterar sua senha? Digite a nova senha abaixo. 
                        <br />Caso contrário, deixe o campo em branco.
                      </p>
                      
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nova Senha</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                            placeholder="Digite a nova senha..." 
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                          >
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.41-3.41" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BARRA DE AÇÃO - SALVAR (Agora Clean e Minimalista) */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 flex flex-col gap-5 mt-auto">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Confirmar alterações</h3>
                      <p className="text-xs text-gray-500 mt-1">Não esqueça de salvar para aplicar o seu novo perfil na IA e atualizar seus dados pessoais.</p>
                    </div>
                    <Button type="submit" isLoading={isLoading} className="w-full py-3.5 text-[15px] font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all rounded-xl">
                      Salvar Todas as Alterações
                    </Button>
                  </div>

                </div>
              </div>

            </form>
          )}
        </div>
      </main>
    </div>
  );
}