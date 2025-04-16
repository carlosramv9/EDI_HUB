import { UserData } from '@/interfaces/auth/UserData';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  error?: any;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state) => {
      state.loading = true;
    },
    setCredentials: (state, action: PayloadAction<{ user: AuthState['user']; }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    setLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<{ error: AuthState['error']; }>) => {
      state.error = action.payload.error;
      state.loading = false;
    },
  },
});

export const { setCredentials, setLogout, setAuth, setError } = authSlice.actions;
export default authSlice.reducer; 