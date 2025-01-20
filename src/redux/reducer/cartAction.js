/* eslint-disable import/no-cycle */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../apiCall';

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async ({ selectedProduct, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await auth.post('/carts', {
        items: selectedProduct,
        quantity,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await auth.get('/carts/user');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, newQuantity }, { rejectWithValue }) => {
    try {
      const { data } = await auth.put(`/carts/${productId}`, { quantity: newQuantity });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (id, { rejectWithValue }) => {
    try {
      await auth.delete(`/carts/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
