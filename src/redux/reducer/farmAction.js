/* eslint-disable import/no-cycle */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { auth } from '../../apiCall';

const options = {
  theme: 'light',
  position: 'bottom-right',
  autoClose: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const addFarmStock = createAsyncThunk(
  'farm/addStock',
  async (formDataArray, { rejectWithValue }) => {
    try {
      const { data } = await auth.post('/farm/new', formDataArray);
      return data;
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        toast.error(error.response.data.error, options);
      } else {
        toast.error('Check your internet connection and try again', options);
      }
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const updateFarmStock = createAsyncThunk(
  'farm/updateStock',
  async (updateData, { rejectWithValue }) => {
    try {
      const { data } = await auth.put(`/farm/stock/${updateData.id}`, updateData.update);
      toast.success('Product was added successfully.', options);
      return data;
    } catch (error) {
      if (error.response.status === 400) {
        toast.error(error.response.data.error, options);
      }
      if (error.response && error.message) {
        toast.error(error.response.data.error, options);
        return rejectWithValue(error.response);
      }
      toast.error(error.response.data.error, options);
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const getFarmStock = createAsyncThunk('farm/getStock', async (_, { rejectWithValue }) => {
  try {
    const { data } = await auth.get('/farm/stock');
    return data;
  } catch (error) {
    if (error.response.status === 400) {
      toast.error(error.response.data.error, options);
    }
    if (error.response && error.message) {
      toast.error(error.response.data.error, options);
      return rejectWithValue(error.response);
    }
    toast.error(error.response.data.error, options);
    return rejectWithValue(error.response.data.error);
  }
});

export const deleteFarmStock = createAsyncThunk(
  'farm/deleteStock',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await auth.delete(`/farm/stock/${id}`);
      toast.success('Product removed successfully', options);
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
