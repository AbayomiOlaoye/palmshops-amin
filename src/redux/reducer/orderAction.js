import {
  createOrder,
  createOrderSuccess,
  createOrderFail,
  updateOrder,
  updateOrderSuccess,
  updateOrderFail,
  fetchOrders,
  fetchOrdersSuccess,
  fetchOrdersFail,
} from '../features/orderSlice';
import { auth } from '../../apiCall';

export const createOrderReq = async (dispatch, carts, address, total, payment, delivery) => {
  dispatch(createOrder());
  try {
    const res = await auth.post('/orders', {
      items: carts,
      shippingInfo: address,
      totalAmount: total,
      payment,
      delivery,
    });
    dispatch(createOrderSuccess(res.data));
  } catch (err) {
    dispatch(createOrderFail());
    throw new Error(err);
  }
};

export const updateOrderReq = async (dispatch, orderNumber, values) => {
  const encodedOrderNumber = encodeURIComponent(orderNumber);
  dispatch(updateOrder());
  try {
    const res = await auth.put(`/orders/${encodedOrderNumber}`, {
      status: values.status,
      deliveryStatus: values.deliveryStatus,
    });
    dispatch(updateOrderSuccess(res.data));
  } catch (err) {
    dispatch(updateOrderFail());
    throw new Error(err);
  }
};

export const fetchOrdersReq = async (dispatch) => {
  dispatch(fetchOrders());
  try {
    const res = await auth.get('/orders');
    dispatch(fetchOrdersSuccess(res.data));
  } catch (err) {
    dispatch(fetchOrdersFail());
    throw new Error(err);
  }
};
