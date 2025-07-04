
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (credentials: { username: string; password: string }) => {
    return await api.post('/login', credentials);
  },

  register: async (userData: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    return await api.post('/register', userData);
  },
};
