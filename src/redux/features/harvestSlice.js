import { createSlice } from '@reduxjs/toolkit';
import {
  addHarvestStock, deleteHarvestStock, updateHarvestStock, getHarvestStock, fetchAllHarvests,
} from '../reducer/harvestAction';

const initialState = {
  loading: false,
  harvested: [],
  error: null,
  success: false,
};

const harvestSlice = createSlice({
  name: 'harvest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addHarvestStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(addHarvestStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.harvested = [...state.harvested, payload];
        state.success = true;
      })
      .addCase(addHarvestStock.rejected, (state) => {
        state.loading = false;
      })

      .addCase(updateHarvestStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateHarvestStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.harvested = state.harvested.map((product) =>
          product._id === payload._id ? payload : product
        );
        state.success = true;
      })
      .addCase(updateHarvestStock.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchAllHarvests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllHarvests.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.harvested = payload;
        state.success = true;
      })
      .addCase(fetchAllHarvests.rejected, (state) => {
        state.loading = false;
      })

      .addCase(deleteHarvestStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteHarvestStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.harvested = state.harvested.filter(
          (product) => product._id !== payload.id
        );
        state.success = true;
      })
      .addCase(deleteHarvestStock.rejected, (state) => {
        state.loading = false;
      })

      .addCase(getHarvestStock.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHarvestStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.harvested = payload;
        state.success = true;
      })
      .addCase(getHarvestStock.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default harvestSlice.reducer;
