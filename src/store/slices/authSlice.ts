import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '../../constants/roles/roles';

export interface User {
  id: string;
  branchIds: string[];
  nombre: string;
  email: string;
  rol: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  needsOnboarding: boolean; // Para saber si es un DUEÑO nuevo que debe configurar el RUC
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  needsOnboarding: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; isNew?: boolean; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.needsOnboarding = action.payload.isNew || false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.needsOnboarding = false;
    },
    completeOnboarding: (state) => {
      state.needsOnboarding = false;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, completeOnboarding } = authSlice.actions;
export default authSlice.reducer;