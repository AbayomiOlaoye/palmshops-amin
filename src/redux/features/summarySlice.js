import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSummaryOpen: false,
  selectedOrder: null,
};

const summarySlice = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    openSummary: (state, action) => {
      state.isSummaryOpen = true;
      state.selectedOrder = action.payload;
    },
    closeSummary: (state) => {
      state.isSummaryOpen = false;
      state.selectedOrder = null;
    },
  },
});

export const { openSummary, closeSummary } = summarySlice.actions;
export default summarySlice.reducer;
