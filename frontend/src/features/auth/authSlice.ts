import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '@/src/lib/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage: string | null;
}

interface AuthState {
  user: User | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
}

const initialState: AuthState = { user: null, status: 'idle' };

export const restoreSession = createAsyncThunk('auth/restoreSession', async () => {
  const res = await apiFetch('/auth/me');
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    logout(state) {
      state.user = null;
      state.status = 'unauthenticated';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;