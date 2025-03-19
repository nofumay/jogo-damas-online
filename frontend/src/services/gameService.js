import api from './api';

const gameService = {
  // Função para criar nova partida
  createGame: async (gameOptions) => {
    const response = await api.post('/partidas', gameOptions);
    return response.data;
  },

  // Função para entrar em uma partida
  joinGame: async (gameId) => {
    const response = await api.post(`/partidas/${gameId}/entrar`);
    return response.data;
  },

  // Função para buscar partida por ID
  getGameById: async (gameId) => {
    const response = await api.get(`/partidas/${gameId}`);
    return response.data;
  },

  // Função para buscar partida por código
  getGameByCode: async (code) => {
    const response = await api.get(`/partidas/codigo/${code}`);
    return response.data;
  },

  // Função para buscar partidas disponíveis (aguardando jogadores)
  getAvailableGames: async () => {
    const response = await api.get('/partidas/aguardando');
    return response.data;
  },

  // Função para buscar minhas partidas
  getMyGames: async () => {
    const response = await api.get('/partidas');
    return response.data;
  },

  // Função para realizar um movimento
  makeMove: async (gameId, move) => {
    const response = await api.post(`/partidas/${gameId}/movimento`, move);
    return response.data;
  },

  // Função para desistir de uma partida
  resignGame: async (gameId) => {
    const response = await api.post(`/partidas/${gameId}/desistir`);
    return response.data;
  },
};

export default gameService;