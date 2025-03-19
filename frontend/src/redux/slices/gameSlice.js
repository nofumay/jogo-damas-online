import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import gameService from '../../services/gameService';

// Async Thunks
export const createGame = createAsyncThunk(
  'game/createGame',
  async (gameOptions, { rejectWithValue }) => {
    try {
      const response = await gameService.createGame(gameOptions);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Falha ao criar partida. Tente novamente.'
      );
    }
  }
);

export const joinGame = createAsyncThunk(
  'game/joinGame',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await gameService.joinGame(gameId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Falha ao entrar na partida. Tente novamente.'
      );
    }
  }
);

export const fetchGameById = createAsyncThunk(
  'game/fetchGameById',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await gameService.getGameById(gameId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Falha ao carregar partida. Tente novamente.'
      );
    }
  }
);

export const fetchAvailableGames = createAsyncThunk(
  'game/fetchAvailableGames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gameService.getAvailableGames();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Falha ao buscar partidas disponíveis. Tente novamente.'
      );
    }
  }
);

export const fetchMyGames = createAsyncThunk(
  'game/fetchMyGames',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gameService.getMyGames();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Falha ao buscar suas partidas. Tente novamente.'
      );
    }
  }
);

export const makeMove = createAsyncThunk(
  'game/makeMove',
  async ({ gameId, move }, { rejectWithValue }) => {
    try {
      const response = await gameService.makeMove(gameId, move);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Movimento inválido. Tente novamente.'
      );
    }
  }
);

export const resignGame = createAsyncThunk(
  'game/resignGame',
  async (gameId, { rejectWithValue }) => {
    try {
      const response = await gameService.resignGame(gameId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Falha ao desistir da partida. Tente novamente.'
      );
    }
  }
);

// Slice
const gameSlice = createSlice({
  name: 'game',
  initialState: {
    currentGame: null,
    availableGames: [],
    myGames: [],
    selectedPiece: null,
    possibleMoves: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetGame: (state) => {
      state.currentGame = null;
      state.selectedPiece = null;
      state.possibleMoves = [];
    },
    selectPiece: (state, action) => {
      state.selectedPiece = action.payload;
      // Aqui poderíamos implementar a lógica para calcular os possíveis movimentos
      // baseados na peça selecionada e no estado atual do tabuleiro
    },
    clearSelection: (state) => {
      state.selectedPiece = null;
      state.possibleMoves = [];
    },
    updateGameState: (state, action) => {
      state.currentGame = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Game
      .addCase(createGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
        toast.success('Partida criada com sucesso!');
      })
      .addCase(createGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Join Game
      .addCase(joinGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
        toast.success('Você entrou na partida!');
      })
      .addCase(joinGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Fetch Game By Id
      .addCase(fetchGameById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Fetch Available Games
      .addCase(fetchAvailableGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableGames = action.payload;
      })
      .addCase(fetchAvailableGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Fetch My Games
      .addCase(fetchMyGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myGames = action.payload;
      })
      .addCase(fetchMyGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Make Move
      .addCase(makeMove.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(makeMove.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
        state.selectedPiece = null;
        state.possibleMoves = [];
      })
      .addCase(makeMove.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Resign Game
      .addCase(resignGame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resignGame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentGame = action.payload;
        toast.info('Você desistiu da partida.');
      })
      .addCase(resignGame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetGame, selectPiece, clearSelection, updateGameState } = gameSlice.actions;
export default gameSlice.reducer;