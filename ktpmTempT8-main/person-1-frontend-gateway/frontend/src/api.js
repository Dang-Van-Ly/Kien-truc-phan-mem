import axios from 'axios';

const API_BASE = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE
});

export async function registerUser(payload) {
  const { data } = await api.post('/users/register', payload);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post('/users/login', payload);
  return data;
}

export async function getMovies() {
  const { data } = await api.get('/movies');
  return data;
}

export async function createMovie(payload) {
  const { data } = await api.post('/movies', payload);
  return data;
}

export async function createBooking(payload) {
  const { data } = await api.post('/bookings', payload);
  return data;
}

export async function getBookings() {
  const { data } = await api.get('/bookings');
  return data;
}
