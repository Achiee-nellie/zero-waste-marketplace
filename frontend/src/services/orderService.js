import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get('/orders/myorders');
  return response.data;
};

export const getSellerOrders = async () => {
  const response = await api.get('/orders/seller');
  return response.data;
};

export const updateOrderToPaid = async (id, paymentResult) => {
  const response = await api.put(`/orders/${id}/pay`, paymentResult);
  return response.data;
};

export const updateOrderToDelivered = async (id) => {
  const response = await api.put(`/orders/${id}/deliver`);
  return response.data;
};

export const cancelOrder = async (id, reason) => {
  const response = await api.put(`/orders/${id}/cancel`, { reason });
  return response.data;
};
