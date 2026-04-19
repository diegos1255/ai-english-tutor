import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import axios from 'axios';

export default function NewUser() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [birthDate, setBirthDate] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const checkEmailExistence = async () => {
    if (!email || !email.includes('@')) {
      setEmailWarning(null);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const response = await api.get(`/users/check-email?email=${email}`);
      
      if (response.data.exists) {
        setEmailWarning('Este e-mail já está em uso.');
      } else {
        setEmailWarning(null); 
      }
    } catch (error) {
      console.error('Erro ao checar e-mail:', error);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (name.trim().length < 3) {
        toast.error('Por favor, insira o nome completo.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!email.includes('@')) {
        toast.error('Por favor, insira um e-mail válido.');
        return;
      }
      if (emailWarning) {
        toast.error('Este e-mail já está em uso. Verifique o aviso.');
        return;
      }
      if (password.length < 6) {
        toast.error('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        toast.error('A senha deve conter pelo menos um caractere especial (!@#$%).');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('As senhas não coincidem.');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleRegister = async () => {
    setIsLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        confirm_password: confirmPassword,
        role,
        birth_date: birthDate ? birthDate : null
      };

      await api.post('/users/admin', payload);
      
      toast.success('Usuário criado com sucesso!');
      navigate('/admin/users');

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (Array.isArray(err.response?.data?.detail)) {
          let errorMsg = err.response?.data?.detail[0]?.msg;
          errorMsg = errorMsg.replace('Value error, ', '');
          toast.error(errorMsg || 'Erro de validação.');
        } else {
          toast.error(err.response?.data?.detail || 'Erro na requisição.');
        }
      } else {
        toast.error('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans overflow-hidden h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl px-8 lg:px-12 py-12 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Novo Usuário</h1>
            <p className="mt-2 text-gray-600">Adicione um novo usuário ao sistema.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 w-full max-w-3xl">
            <div className="p-8">
              
              {/* Progress Bar */}
              <div className="mb-10 mt-2 px-4 w-full">
                <div className="flex justify-between relative">
                  <div className="absolute left-0 top-5 -translate-y-1/2 w-full h-1.5 bg-gray-100 rounded-full -z-10"></div>
                  <div 
                    className="absolute left-0 top-5 -translate-y-1/2 h-1.5 bg-blue-600 rounded-full -z-10 transition-all duration-500 ease-out" 
                    style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                  ></div>

                  <div className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-base transition-colors duration-300 ${step >= 1 ? 'border-blue-600 bg-white text-blue-600' : 'border-gray-200 bg-white text-gray-400'}`}>
                      {step > 1 ? (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      ) : '1'}
                    </div>
                    <span className={`text-sm font-semibold text-center whitespace-nowrap ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>Dados Básicos</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-base transition-colors duration-300 ${step >= 2 ? 'border-blue-600 bg-white text-blue-600' : 'border-gray-200 bg-white text-gray-400'}`}>
                      {step > 2 ? (
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                      ) : '2'}
                    </div>
                    <span className={`text-sm font-semibold text-center whitespace-nowrap ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>Acesso e Conta</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 bg-white px-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-base transition-colors duration-300 ${step === 3 ? 'border-blue-600 bg-white text-blue-600' : 'border-gray-200 bg-white text-gray-400'}`}>
                      3
                    </div>
                    <span className={`text-sm font-semibold text-center whitespace-nowrap ${step === 3 ? 'text-blue-600' : 'text-gray-400'}`}>Revisão</span>
                  </div>
                </div>
              </div>

              {/* Form Steps */}
              <div className="space-y-5 min-h-[220px] mt-10">
                
                {step === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Nome Completo</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" 
                        placeholder="Ex: João Silva" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Data de Nascimento <span className="text-gray-400 font-normal">(Opcional)</span></label>
                      <input 
                        type="date" 
                        value={birthDate} 
                        onChange={(e) => setBirthDate(e.target.value)} 
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition text-gray-700" 
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">E-mail</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          value={email} 
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if(emailWarning) setEmailWarning(null);
                          }} 
                          onBlur={checkEmailExistence}
                          required 
                          className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:bg-white outline-none transition ${emailWarning ? 'border-orange-400 focus:ring-orange-400' : 'border-gray-200 focus:ring-blue-500'}`} 
                          placeholder="email@exemplo.com" 
                        />
                        {isCheckingEmail && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                      
                      {emailWarning && (
                        <div className="mt-2.5 flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-orange-800 text-sm animate-fade-in">
                          <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div>
                            {emailWarning}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Senha</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition" 
                            placeholder="Mínimo 6 caracteres" 
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition">
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.41-3.41" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5">Use no mínimo 6 caracteres e 1 especial (!@#$%).</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Confirmar Senha</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? "text" : "password"} 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            className={`w-full px-4 pr-10 py-2.5 bg-gray-50 border rounded-lg focus:ring-2 focus:bg-white outline-none transition ${passwordsMismatch ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} 
                            placeholder="Repita a senha" 
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition">
                            {showPassword ? (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0l-3.41-3.41" /></svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                          </button>
                        </div>
                        {passwordsMismatch && (<p className="text-xs text-red-500 mt-1.5 font-medium">As senhas não coincidem.</p>)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1.5">Nível de Acesso (Papel)</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      >
                        <option value="USER">Usuário (Usuário Padrão)</option>
                        <option value="ADMIN">Administrador (Administrador)</option>
                      </select>
                    </div>

                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 flex items-start gap-3">
                      <svg className="w-8 h-8 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <div>
                        <p className="font-bold text-base mb-1">Quase lá!</p>
                        <p>Revise as informações abaixo antes de criar a conta do usuário.</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-3 shadow-inner">
                      <div className="flex justify-between border-b border-gray-100 pb-2.5">
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="font-semibold text-gray-900">{name}</p>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2.5">
                        <p className="text-sm text-gray-500">E-mail</p>
                        <p className="font-semibold text-gray-900">{email}</p>
                      </div>
                      {birthDate && (
                        <div className="flex justify-between border-b border-gray-100 pb-2.5">
                          <p className="text-sm text-gray-500">Data de Nascimento</p>
                          <p className="font-semibold text-gray-900">{new Date(birthDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500">Acesso</p>
                        <p className="font-semibold text-gray-900">{role === 'ADMIN' ? 'Administrador' : 'Usuário Padrão'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="pt-8 flex items-center justify-between mt-6 border-t border-gray-100">
                <div>
                  {step > 1 && (
                    <button type="button" onClick={handlePrevStep} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition duration-200">
                      Voltar
                    </button>
                  )}
                  {step === 1 && (
                    <button type="button" onClick={() => navigate('/admin/users')} className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition duration-200">
                      Cancelar
                    </button>
                  )}
                </div>
                
                <div>
                  {step < 3 ? (
                    <Button type="button" onClick={handleNextStep} className="px-10 text-base py-2.5">
                      Próximo
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleRegister} isLoading={isLoading} disabled={passwordsMismatch} className="px-10 bg-green-600 hover:bg-green-700 focus:ring-green-500 text-base py-2.5 shadow-md hover:shadow-lg transition-all">
                      Confirmar e Criar Conta
                    </Button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
