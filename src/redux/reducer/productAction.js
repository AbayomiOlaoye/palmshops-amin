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

export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await auth.post('/products/new', productData);
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

export const updateproductStock = createAsyncThunk(
  'product/updateStock',
  async (updateData, { rejectWithValue }) => {
    try {
      const { data } = await auth.put(`/products/${updateData._id}`, updateData);
      toast.success('Product was updated successfully.', options);
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

export const fetchAllproductStock = createAsyncThunk(
  'product/fetchAllStock', async (_, { rejectWithValue }) => {
  try {
    const { data } = await auth.get('/products/all');
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

export const deleteProduct = createAsyncThunk(
  'product/deleteStock',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await auth.delete(`/products/${id}`);
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

export const fetchOrders = createAsyncThunk(
  'product/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await auth.get('/orders');
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
