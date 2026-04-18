import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatSimulator from '../components/ChatSimulator';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 w-full">
        
        {/* SEÇÃO 1: HERO (O "Cofre" Escuro) */}
        {/* Usamos pt-48 para o Navbar fixo e pb-24 para dar espaço ao chat simulador */}
        <section id="home" className="bg-slate-900 pt-48 pb-10 px-6 relative overflow-hidden">
          {/* Efeito de luz azul no fundo para profundidade */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full -mr-20 pointer-events-none"></div>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
            {/* LADO ESQUERDO: Textos e CTA Principal */}
            <div className="flex-1 text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
                {t('hero.title_1')} <br />
                <span className="text-blue-500">{t('hero.title_highlight')}</span>
              </h1>
              
              <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link 
                  to="/cadastro" 
                  className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-center hover:bg-blue-700 transition shadow-lg shadow-blue-900/40 transform hover:scale-105 active:scale-95"
                >
                  {t('cards.ready.button')}
                </Link>
              </div>
            </div>

            {/* LADO DIREITO: O Simulador de Chat (Destaque Visual) */}
            <div className="flex-1 w-full max-w-lg lg:max-w-md shadow-[0_0_50px_-12px_rgba(59,130,246,0.2)] rounded-2xl">
              <ChatSimulator />
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: CARDS (Ação e Detalhes) */}
        {/* Agora 100% abaixo do Hero para não "roubar" o foco do Chat */}
        <section className="bg-gray-50 py-10 px-6 relative z-10 border-b border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-center items-stretch">
            
            {/* Card 1: Conversão */}
            <div className="bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md w-full flex flex-col items-center text-center transform hover:-translate-y-2 transition duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('cards.ready.title')}</h3>
              <p className="text-gray-600 mb-8 flex-1 leading-relaxed">
                {t('cards.ready.desc')}
              </p>
              <Link to="/cadastro" className="w-full py-3 text-lg font-medium text-white bg-gray-900 rounded-full hover:bg-black transition shadow-md">
                {t('cards.ready.button')}
              </Link>
            </div>

            {/* Card 2: Feature Highlight */}
            <div className="bg-white p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md w-full flex flex-col items-center text-center transform hover:-translate-y-2 transition duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6 shadow-inner">💻</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('cards.context.title')}</h3>
              <p className="text-gray-600 mb-8 flex-1 leading-relaxed">
                {t('cards.context.desc')}
              </p>
              <button className="w-full py-3 text-lg font-medium text-gray-700 bg-gray-50 rounded-full hover:bg-gray-100 transition border border-gray-200">
                {t('cards.context.button')}
              </button>
            </div>

          </div>
        </section>

        {/* SEÇÃO 3: DEPOIMENTOS (Prova Social) */}
        <section id="depoimentos" className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('sections.testimonials_title')}</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Lucas Silva", role: "Backend Dev", text: "Finalmente um curso que entende que eu não quero aprender a pedir café, eu quero entender a documentação do Kubernetes!" },
              { name: "Mariana Costa", role: "Frontend Engineer", text: "A função de tradução contextual por cima do código é bizarra de boa. Ganhei meses de vocabulário técnico." },
              { name: "André Santos", role: "Fullstack Jr", text: "O tutor de IA me explicou o que era um 'Closure' em inglês e eu entendi melhor do que em português. Sensacional!" }
            ].map((dep, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <p className="text-gray-600 italic mb-6">"{dep.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white uppercase">{dep.name[0]}</div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900 text-sm">{dep.name}</h4>
                    <p className="text-xs text-gray-500">{dep.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 4: SOBRE (Onde a Mágica acontece) */}
        <section id="sobre" className="bg-gray-50 py-24 px-6 border-y border-gray-100">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-600/5 rounded-3xl blur-2xl"></div>
                <div className="relative bg-gray-900 rounded-3xl p-8 shadow-2xl border border-slate-800">
                  <pre className="text-sm text-blue-400 font-mono overflow-x-auto">
                    <code>{`function learn() {\n  const goal = "Fluency";\n  const tool = "AI English Tutor";\n\n  return \`I am using \${tool} \n  to reach \${goal}!\`;\n}`}</code>
                  </pre>
                </div>
              </div>
            </div>
            <div className="flex-1 text-left order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {t('sections.about_title')} <br /><span className="text-blue-600">{t('sections.about_highlight')}</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {t('sections.about_desc')}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[t('sections.about_item1'), t('sections.about_item2'), t('sections.about_item3'), t('sections.about_item4')].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-sm font-medium">
                    <span className="text-blue-600">✔</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SEÇÃO 5: CONTATO */}
        <section id="contato" className="bg-white py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('sections.contact_title')}</h2>
            <p className="text-gray-600 mb-10">{t('sections.contact_subtitle')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition group">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">E-mail</p>
                <p className="text-blue-600 font-bold group-hover:scale-105 transition-transform">diego@aienglishtutor.com</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition group">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2 font-bold">WhatsApp</p>
                <p className="text-gray-900 font-bold group-hover:scale-105 transition-transform">+55 (41) 99886-4199</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}