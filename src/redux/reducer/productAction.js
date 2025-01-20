export const CHOOSE_PRODUCT = 'product/choose';
export const REMOVE_PRODUCT = 'product/remove';

export const chooseProduct = (product, source) => ({
  type: CHOOSE_PRODUCT,
  payload: { product, source },
});

export const removeProduct = () => ({
  type: REMOVE_PRODUCT,
});
