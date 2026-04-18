import axios from 'axios';

// Cria uma instância do Axios apontando para o seu FastAPI (ajuste a porta se o seu backend estiver rodando em outra)
export const api = axios.create({
  baseURL: 'http://localhost:8000', 
});

// O "Mochileiro" (Interceptor): Antes de QUALQUER requisição sair do React, ele passa por aqui.
api.interceptors.request.use((config) => {
  // Buscamos o token no cofre do navegador
  const token = localStorage.getItem('token');
  
  if (token) {
    // Se tem token, injetamos no cabeçalho de Autorização (padrão Bearer)
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});