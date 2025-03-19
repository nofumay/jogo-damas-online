import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});