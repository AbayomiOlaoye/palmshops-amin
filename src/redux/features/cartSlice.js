/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import { createSlice } from '@reduxjs/toolkit';

const calculateTotal = (products) => products.reduce((acc, item) => acc + item.price * item.quantity, 0);

const initialState = {
  products: [],
  quantity: 0,
  total: 0,
  loading: false,
  success: false,
  type: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.loading = true;
      const existingIndex = state.products.findIndex(
        (item) => item._id === action.payload._id,
      );

      if (existingIndex >= 0) {
        state.type = 'Item is already in cart';
      } else {
        state.products = [...state.products, action.payload];
        state.loading = false;
        state.success = true;
        state.type = 'Item successfully added to cart';
        state.quantity += 1;
      }

      state.total = calculateTotal(state.products);
    },

    removeProduct: (state, action) => {
      state.loading = true;
      const { productId } = action.payload;

      state.products = state.products.filter((item) => item._id !== productId);

      state.total = calculateTotal(state.products);
      state.products = state.products.filter((item) => (item._id !== productId));
      state.quantity -= 1;
      state.loading = false;
      state.success = true;
      state.type = 'Item removed from the cart';
    },

    resetSuccess: (state) => {
      state.success = false;
    },

    updateQuantity: (state, action) => {
      const {
        productId, newQuantity,
      } = action.payload;

      const product = state.products.find((item) => item._id === productId);

      if (product) {
        product.quantity = newQuantity;
        state.total = calculateTotal(state.products);
      }
    },
    clearCart: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
      state.loading = false;
      state.success = false;
      state.type = 'clear';
    },
  },
});

export const {
  addProduct,
  removeProduct,
  updateQuantity,
  clearCart,
  resetSuccess,
} = cartSlice.actions;
export default cartSlice.reducer;
