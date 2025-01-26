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

export const addHarvestStock = createAsyncThunk(
  'harvest/addStock',
  async (formDataArray, { rejectWithValue }) => {
    try {
      const { data } = await auth.post('/harvest/new', formDataArray);
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

export const updateHarvestStock = createAsyncThunk(
  'harvest/updateStock',
  async (updateData, { rejectWithValue }) => {
    try {
      const { data } = await auth.put(`/harvest/stock/${updateData.id}`, updateData.update);
      toast.success('Stock was updated successfully.', options);
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

export const fetchAllHarvests = createAsyncThunk(
  'harvest/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await auth.get('/harvest/stock/all');
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

export const getHarvestStock = createAsyncThunk(
  'harvest/getStock',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await auth.get('/harvest/stock');
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

export const deleteHarvestStock = createAsyncThunk(
  'harvest/deleteStock',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await auth.delete(`/harvest/stock/${id}`);
      toast.success('Product was successfully removed.', options);
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
