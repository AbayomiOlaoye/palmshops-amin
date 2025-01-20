/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  status: 'pending',
  isFetching: false,
  isSuccess: false,
  cartSuccess: false,
  uploaded: false,
  type: '',
  id: '',
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    saveAddress: (state, action) => {
      state.shippingInfo = action.payload;
    },
    clearAddress: (state) => {
      state.shippingInfo = null;
    },
    createOrder: (state) => {
      state.isFetching = true;
    },
    createOrderSuccess: (state, action) => {
      state.isFetching = false;
      state.orders = [...state.orders, action.payload];
      state.status = 'success';
      state.isSuccess = true;
      state.cartSuccess = true;
      state.type = 'create';
    },
    createOrderFail: (state) => {
      state.isFetching = false;
      state.status = 'failed';
    },
    updateOrder: (state) => {
      state.isFetching = true;
    },
    updateOrderSuccess: (state, action) => {
      state.isFetching = false;
      const index = state.orders.findIndex((order) => order.orderNumber === action.payload.orderNumber);
      if (index !== -1) {
        state.orders = [
          ...state.orders.slice(0, index),
          action.payload,
          ...state.orders.slice(index + 1),
        ];
      }
      state.status = 'success';
      state.uploaded = true;
      state.isSuccess = true;
      state.type = 'update';
      state.id = action.payload.orderNumber;
    },
    updateOrderFail: (state) => {
      state.isFetching = false;
      state.status = 'failed';
    },
    fetchOrders: (state) => {
      state.isFetching = true;
      state.isError = false;
    },
    fetchOrdersSuccess: (state, action) => {
      state.isFetching = false;
      state.orders = action.payload;
      state.status = 'success';
      state.isSuccess = true;
      state.type = 'fetch';
    },
    fetchOrdersFail: (state) => {
      state.isFetching = false;
      state.status = 'failed';
      state.isError = true;
    },
    resetSuccess: (state) => {
      state.cartSuccess = false;
      state.uploaded = false;
    },
    resetOrder: (state) => {
      state.orders = null;
      state.address = null;
      state.status = 'pending';
      state.isFetching = false;
      state.isSuccess = false;
      state.type = '';
      state.id = '';
    },
  },
});

export const {
  saveAddress,
  clearAddress,
  createOrder,
  createOrderSuccess,
  createOrderFail,
  updateOrder,
  updateOrderSuccess,
  updateOrderFail,
  resetSuccess,
  fetchOrders,
  fetchOrdersSuccess,
  fetchOrdersFail,
  // resetOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
