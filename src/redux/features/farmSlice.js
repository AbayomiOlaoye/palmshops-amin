/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
import { createSlice } from '@reduxjs/toolkit';
import {
  addFarmStock, deleteFarmStock, updateFarmStock, getFarmStock,
} from '../reducer/farmAction';

const initialState = {
  loading: false,
  farms: [],
  error: null,
  success: false,
};

const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFarmStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFarmStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.farms = [...state.farms, payload];
        state.success = true;
      })
      .addCase(addFarmStock.rejected, (state) => {
        state.loading = false;
      })

      // Update Farm Stock
      .addCase(updateFarmStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFarmStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.farms = state.farms.map((product) => (product._id === payload._id ? payload : product));
        state.success = true;
      })
      .addCase(updateFarmStock.rejected, (state) => {
        state.loading = false;
      })

      // Delete Farm Stock
      .addCase(deleteFarmStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFarmStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.farms = state.farms.filter((product) => product._id !== payload.id);
        state.success = true;
      })
      .addCase(deleteFarmStock.rejected, (state) => {
        state.loading = false;
      })

      // Get Farm Stock
      .addCase(getFarmStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFarmStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.farms = payload;
        state.success = true;
      })
      .addCase(getFarmStock.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default farmSlice.reducer;
