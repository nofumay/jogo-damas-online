import api from './api';

const authService = {
  // Função para realizar login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Função para registrar novo usuário
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Função para validar token
  validateToken: async (token) => {
    const response = await api.get(`/auth/validate?token=${token}`);
    return response.data;
  },
};

export default authService;