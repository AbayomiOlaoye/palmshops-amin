import { createSlice } from '@reduxjs/toolkit';
import {
  deleteProduct,
  updateproductStock,
  fetchAllproductStock,
  addProduct,
  fetchOrders,
} from '../reducer/productAction';

const initialState = {
  loading: false,
  products: [],
  orders: [],
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add product Stock
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products.push(payload);
        state.success = true;
      })
      .addCase(addProduct.rejected, (state) => {
        state.loading = false;
      })

      .addCase(updateproductStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateproductStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = state.products.map((product) => (product._id === payload._id ? payload : product));
        state.success = true;
      })
      .addCase(updateproductStock.rejected, (state) => {
        state.loading = false;
      })

      // Fetch All product Stock
      .addCase(fetchAllproductStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllproductStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = payload;
        state.success = true;
      })
      .addCase(fetchAllproductStock.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = payload;
        state.success = true;
      })
      .addCase(fetchOrders.rejected, (state) => {
        state.loading = false;
      })

      // Delete product Stock
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = state.products.filter((product) => product._id !== payload.id);
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state) => {
        state.loading = false;
      })
  },
});

export default productSlice.reducer;
