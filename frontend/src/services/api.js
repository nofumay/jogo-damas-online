import axios from 'axios';

// Define a URL base para as chamadas à API
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.jogo-damas-online.herokuapp.com/api'
  : 'http://localhost:8080/api';

// Cria uma instância do axios com a URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona interceptors para incluir o token JWT em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Adiciona interceptors para tratar erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;