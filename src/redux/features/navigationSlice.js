/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: ['Market'],
  isOpenForm: false,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigateTo: (state, action) => {
      state.history.push(action.payload);
    },
    goBack: (state) => {
      if (state.history.length > 1) {
        state.history.pop();
      }
    },
    resetNavigation: (state) => {
      state.history.push('Market');
    },
    openForm: (state) => {
      state.isOpenForm = true;
    },
    closeForm: (state) => {
      state.isOpenForm = false;
    },
  },
});

export const {
  navigateTo, goBack, resetNavigation, closeForm, openForm,
} = navigationSlice.actions;

export const selectCurrentPage = (state) => state.navigation.history[state.navigation.history.length - 1];

export default navigationSlice.reducer;
