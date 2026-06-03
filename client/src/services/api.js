import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const login = (payload) => api.post('/auth/login', payload).then((res) => res.data);
export const register = (payload) => api.post('/auth/register', payload).then((res) => res.data);
export const fetchProducts = (token) => api.get('/products', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const createProduct = (token, payload) => api.post('/products', payload, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const deleteProduct = (token, id) => api.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const updateProduct = (token, id, payload) => api.put(`/products/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
// Unit conversion removed per project requirements
export const getCurrentUser = (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const createOrder = (token, payload) => api.post('/orders', payload, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const fetchUserOrders = (token) => api.get('/orders/mine', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const fetchAllOrders = (token) => api.get('/orders', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const setOrderPrice = (token, id, payload) => api.put(`/orders/${id}/price`, payload, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const confirmOrder = (token, id) => api.put(`/orders/${id}/confirm`, {}, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const updateOrderStatus = (token, id, payload) => api.put(`/orders/${id}/status`, payload, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
export const deleteOrder = (token, id) => api.delete(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.data);
