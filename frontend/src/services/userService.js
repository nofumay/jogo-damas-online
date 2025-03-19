import api from './api';

const userService = {
  // Função para buscar perfil do usuário
  getUserProfile: async () => {
    const response = await api.get('/usuarios/perfil');
    return response.data;
  },

  // Função para atualizar perfil do usuário
  updateUserProfile: async (userData) => {
    const response = await api.put('/usuarios/perfil', userData);
    return response.data;
  },

  // Função para buscar ranking de jogadores
  getLeaderboard: async () => {
    const response = await api.get('/usuarios/ranking');
    return response.data;
  },

  // Função para buscar estatísticas do usuário
  getUserStats: async (userId) => {
    const response = await api.get(`/usuarios/${userId}/estatisticas`);
    return response.data;
  },
};

export default userService;