
import axios from 'axios';
import { API_URL } from './src/config';

const HttpToken = axios.create({

  baseURL: API_URL, 
});

HttpToken.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;

  }
  return config;
});

export default HttpToken;
