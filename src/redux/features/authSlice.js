import { createSlice } from '@reduxjs/toolkit';
import {
  signIn,
  signOut,
  fetchStoreProducts,
  fetchUsers,
  deleteUser,
} from '../reducer/authActions';

const initialState = {
  loading: false,
  isAuthenticated: false,
  users: [],
  user: {},
  token: null,
  error: null,
  success: false,
  phone: '',
  verified: false,
  products: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.success = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStoreProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchStoreProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
