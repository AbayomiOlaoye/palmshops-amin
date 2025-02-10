import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { publicApi, auth } from '../../apiCall';

const options = {
  theme: 'light',
  position: 'bottom-right',
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ phone, password }, { rejectWithValue }) => {
    try {
      const { data } = await publicApi.post('/signin', { phone, password });
      toast.success('Login successful', options);
      return data;
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        toast.error(error.response.data.error, options);
      } else {
        toast.error(error.response.data.message || 'Check your internet connection and try again', options);
      }
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await auth.get('/');
      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 || status === 401) {
          return rejectWithValue(data.error || 'Invalid request');
        }
      }
      toast.error('Check your internet connection and try again', options);
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      toast.success('Hope to see you again soon!', options);
      return 'User logged out successfully';
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchStoreProducts = createAsyncThunk(
  'auth/fetchStoreProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await publicApi.get('/products/all');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await auth.delete(`/${id}`);
      toast.success(data.message, options);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)
