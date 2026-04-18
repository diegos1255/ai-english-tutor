import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// 1. Tipagens do Perfil (Seu código)
interface UserProfile {
  name: string;
  email: string;
  role: string;
}

// 2. Tipagens do Curso (Nosso novo código)
interface Lesson {
  id: string;
  title: string;
  order: number;
  is_completed: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface CourseData {
  user_xp: number;
  current_level_name: string;
  modules: Module[];
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Estados para guardar Perfil + Curso
  const [user, setUser] = useState<UserProfile | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Dispara as duas requisições ao mesmo tempo para a tela carregar mais rápido!
        const [userResponse, courseResponse] = await Promise.all([
          api.get('/users/me'),
          api.get('/course/dashboard')
        ]);
        
        setUser(userResponse.data);
        setCourseData(courseResponse.data);
      } catch {
        toast.error('Erro ao carregar os dados do painel.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStartLesson = (lessonId: string) => {
    toast.success('Iniciando lição... Em breve redirecionaremos pro chat!');
    navigate(`/chat?lesson_id=${lessonId}`); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden h-screen">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pb-12">
        <div className="max-w-6xl px-8 lg:px-12 py-12 w-full">
          
          <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Painel de Controle</h1>
          
          {isLoading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-2xl w-full"></div>
              <div className="h-32 bg-gray-200 rounded-2xl w-full"></div>
              <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* SESSÃO 1: MEU PERFIL (O seu código original, mantido e ajustado!) */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="relative group cursor-pointer shrink-0">
                  <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                    <svg className="w-16 h-16 text-blue-400 mt-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Alterar</span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left pt-2">
                  <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-500 mb-4">{user?.email}</p>
                  
                  <div className="inline-block px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full border border-green-200">
                    Plano Free
                  </div>
                </div>
              </div>

              {/* SESSÃO 2: GAMIFICAÇÃO E NÍVEL (A união dos mundos) */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg shadow-blue-600/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 text-3xl shrink-0">
                    🏆
                  </div>
                  <div>
                    <p className="text-blue-100 font-medium uppercase tracking-wider text-xs mb-1">Seu Nível Atual</p>
                    <h2 className="text-3xl font-bold">{courseData?.current_level_name}</h2>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="text-blue-100 font-medium uppercase tracking-wider text-xs mb-1">Experiência Acumulada</p>
                  <h3 className="text-3xl font-bold flex items-baseline gap-1 sm:justify-end">
                    {courseData?.user_xp} <span className="text-base font-normal text-blue-200">XP</span>
                  </h3>
                </div>
              </div>

              {/* SESSÃO 3: A TRILHA DE APRENDIZADO (Roadmap) */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 px-2">Sua Trilha de Estudos</h3>
                
                {courseData?.modules.map((mod) => (
                  <div key={mod.id} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Cabeçalho do Módulo */}
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded-lg tracking-wider">
                          Módulo {mod.order}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{mod.title}</h3>
                      {mod.description && <p className="text-sm text-gray-500 mt-2">{mod.description}</p>}
                    </div>

                    {/* Lições do Módulo */}
                    <div className="p-8 space-y-4">
                      {mod.lessons.map((lesson, index) => (
                        <div 
                          key={lesson.id} 
                          className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                            lesson.is_completed 
                              ? 'border-green-100 bg-green-50' 
                              : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm shrink-0 ${
                              lesson.is_completed ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {lesson.is_completed ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                index + 1
                              )}
                            </div>
                            <div>
                              <h4 className={`font-bold text-sm sm:text-base ${lesson.is_completed ? 'text-green-900' : 'text-gray-900'}`}>
                                {lesson.title}
                              </h4>
                            </div>
                          </div>

                          {/* Botão de Ação */}
                          <div className="ml-4 shrink-0">
                            {lesson.is_completed ? (
                              <span className="text-sm font-bold text-green-600 bg-white px-4 py-2.5 rounded-xl border border-green-200 shadow-sm hidden sm:inline-block">
                                Concluído
                              </span>
                            ) : (
                              <button 
                                onClick={() => handleStartLesson(lesson.id)}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-600/20"
                              >
                                Começar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}