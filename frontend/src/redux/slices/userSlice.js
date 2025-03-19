import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import userService from '../../services/userService';

// Async Thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProfile();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Falha ao buscar perfil do usuário.'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.updateUserProfile(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Falha ao atualizar perfil do usuário.'
      );
    }
  }
);

export const fetchLeaderboard = createAsyncThunk(
  'user/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getLeaderboard();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Falha ao buscar ranking de jogadores.'
      );
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    leaderboard: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetUserState: (state) => {
      state.profile = null;
      state.leaderboard = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        toast.success('Perfil atualizado com sucesso!');
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      
      // Fetch Leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;