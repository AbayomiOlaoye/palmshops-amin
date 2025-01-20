import { CHOOSE_PRODUCT, REMOVE_PRODUCT } from '../reducer/productAction';

const initialState = {
  selectedProduct: null,
};

const productReducer = (state = initialState, action) => {
  const { product, source } = action.payload || {};
  switch (action.type) {
    case CHOOSE_PRODUCT:
      return {
        ...state,
        selectedProduct: { ...product, source },
      };
    case REMOVE_PRODUCT:
      return {
        ...state,
        selectedProduct: null,
      };
    default:
      return state;
  }
};

export default productReducer;
