/* eslint-disable consistent-return */
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

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({
    name, email, phone, password, confirmPass,
  }, { rejectWithValue }) => {
    try {
      if (password !== confirmPass) {
        toast.error('Passwords do not match', options);
        return rejectWithValue('Passwords do not match');
      }

      const { data } = await publicApi.post('/signup',
        {
          name, phone, email, password,
        });

      toast.success('You are in! You will receive an OTP shortly', options);
      return data;
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.error, options);
      }
      if (error.message) {
        toast.error(error.response.data.error, options);
        return rejectWithValue(error.response);
      }
      toast.error(error.response.data.error, options);
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otp, { rejectWithValue }) => {
    try {
      if (otp.length < 6) {
        toast.error('OTP cannot be empty. Enter your 6 digits please', options);
        return rejectWithValue('OTP cannot be empty. Enter your 6 digits please');
      }
      const { data } = await auth.post('/verify-otp', { otp });

      toast.success('Phone number verified successfully', options);
      return data;
    } catch (error) {
      if (error.response.status === 400) {
        toast.error('Invalid OTP. Try again', options);
      }
      toast.error('Invalid OTP. Try again', options);
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await auth.post('/resend-otp', { });
      toast.success('OTP sent successfully', options);
      return data;
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.error, options);
      }
      toast.error(error.response.data.error, options);
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
