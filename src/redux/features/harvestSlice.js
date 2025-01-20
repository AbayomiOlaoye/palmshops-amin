/* eslint-disable no-confusing-arrow */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
import { createSlice } from '@reduxjs/toolkit';
import {
  addHarvestStock, deleteHarvestStock, updateHarvestStock, getHarvestStock,
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
  extraReducers: {
    [addHarvestStock.pending]: (state) => {
      state.loading = true;
    },
    [addHarvestStock.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.harvested = [...state.harvested, payload];
      state.success = true;
    },
    [addHarvestStock.rejected]: (state) => {
      state.loading = false;
    },

    // Update Farm Stock
    [updateHarvestStock.pending]: (state) => {
      state.loading = true;
    },
    [updateHarvestStock.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.harvested = state.harvested.map((product) => product._id === payload._id ? payload : product);
      state.success = true;
    },
    [updateHarvestStock.rejected]: (state) => {
      state.loading = false;
    },

    // Delete Farm Stock
    [deleteHarvestStock.pending]: (state) => {
      state.loading = true;
    },
    [deleteHarvestStock.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.harvested = state.harvested.filter((product) => product._id !== payload.id);
      state.success = true;
    },
    [deleteHarvestStock.rejected]: (state) => {
      state.loading = false;
    },

    // Get Farm Stock
    [getHarvestStock.pending]: (state) => {
      state.loading = true;
    },
    [getHarvestStock.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.harvested = payload;
      state.success = true;
    },
    [getHarvestStock.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default harvestSlice.reducer;
