import { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  failed_login_attempts: number;
  created_at: string;
}

type SortConfig = {
  key: keyof User;
  direction: 'asc' | 'desc';
} | null;

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    is_active: true,
    failed_login_attempts: 0,
    new_password: '' 
  });
  
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users/');
        setUsers(response.data);
      } catch {
        toast.error('Erro ao buscar lista de usuários.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      failed_login_attempts: user.failed_login_attempts,
      new_password: ''
    });
    setShowNewPassword(false);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setShowNewPassword(false);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    setIsSaving(true);
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        is_active: editForm.is_active,
        failed_login_attempts: editForm.failed_login_attempts,
        ...(editForm.new_password ? { password: editForm.new_password } : {})
      };

      await api.put(`/users/admin/${selectedUser.id}`, payload);
      
      toast.success('Usuário atualizado com sucesso!');
      
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...payload } : u));
      
      handleCloseModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.detail || 'Erro ao salvar usuário.');
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [users, searchTerm, sortConfig]);

  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (columnKey: keyof User) => {
    if (sortConfig?.key !== columnKey) return <span className="ml-1 text-gray-300">↕</span>;
    return sortConfig.direction === 'asc' 
      ? <span className="ml-1 text-blue-600">↑</span> 
      : <span className="ml-1 text-blue-600">↓</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden h-screen">
      <Sidebar />

      {/* ÁREA PRINCIPAL: Mesma estrutura do "Meus Dados" (max-w-6xl e sem mx-auto) */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl px-8 lg:px-12 py-12 w-full">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gerenciar Usuários</h1>
            <p className="text-sm text-gray-500 mt-1.5">Visualize e gerencie os acessos da plataforma.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            
            <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-sm"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                Total: <span className="text-gray-900">{filteredAndSortedUsers.length}</span> usuários
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <th className="p-5 font-semibold cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('name')}>Usuário {renderSortIcon('name')}</th>
                    <th className="p-5 font-semibold cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('role')}>Nível de Acesso {renderSortIcon('role')}</th>
                    <th className="p-5 font-semibold cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('is_active')}>Status {renderSortIcon('is_active')}</th>
                    <th className="p-5 font-semibold cursor-pointer hover:bg-gray-100 transition" onClick={() => requestSort('created_at')}>Data de Cadastro {renderSortIcon('created_at')}</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {isLoading ? (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-400 animate-pulse font-medium">Carregando usuários...</td></tr>
                  ) : filteredAndSortedUsers.length === 0 ? (
                    <tr><td colSpan={4} className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        Nenhum usuário encontrado.
                      </div>
                    </td></tr>
                  ) : (
                    filteredAndSortedUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        onClick={() => handleOpenModal(user)}
                        className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase shrink-0">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{user.name}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center w-max border ${user.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-2 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {user.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="p-5 text-gray-500 font-medium">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL MANTIDA INTACTA AQUI (Omitido visualmente para você focar no wrapper, mas ela continua igualzinho) */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          {/* ... (Todo o seu código da Modal igualzinho ao arquivo anterior) ... */}
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in">
            
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-gray-900">Editar Usuário</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-8">
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Dados Principais</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Nome Completo</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">E-mail</label>
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" />
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-t border-gray-100 pt-6">Acesso e Segurança</h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Nível de Acesso (Role)</label>
                    <select value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer">
                      <option value="USER">USER (Usuário Padrão)</option>
                      <option value="ADMIN">ADMIN (Administrador)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50/50 border border-red-100 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-red-900">Tentativas Falhas de Login</p>
                      <p className="text-xs text-red-600 mt-1">Atualmente: <strong className="bg-red-100 px-1.5 py-0.5 rounded">{editForm.failed_login_attempts}</strong> (Bloqueia em 3)</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setEditForm({...editForm, failed_login_attempts: 0})}
                      disabled={editForm.failed_login_attempts === 0}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      Zerar Falhas
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Status da Conta</p>
                      <p className="text-xs text-gray-500 mt-1">Contas inativas não podem acessar o sistema.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={editForm.is_active} onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})} />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">Redefinir Senha <span className="text-gray-400 font-normal">(Opcional)</span></label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        placeholder="Digite apenas se quiser alterar..."
                        value={editForm.new_password} 
                        onChange={(e) => setEditForm({...editForm, new_password: e.target.value})} 
                        className="w-full px-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                      >
                        {showNewPassword ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.41-3.41" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 mt-auto">
              <button 
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors shadow-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveUser}
                disabled={isSaving}
                className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-sm"
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}