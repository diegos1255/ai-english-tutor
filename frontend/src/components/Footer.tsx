export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-400 py-10 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">AI English Tutor</h3>
            <p>Evoluindo a forma como desenvolvedores aprendem inglês, conectando código e idioma em uma só experiência.</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Sobre o projeto</a></li>
              <li><a href="#" className="hover:text-white transition">Quem somos</a></li>
              <li><a href="#" className="hover:text-white transition">Contato</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-10 border-t border-gray-800 pt-6 text-xs">
          &copy; {new Date().getFullYear()} AI English Tutor. Todos os direitos reservados.
        </div>
      </footer>
    );
}