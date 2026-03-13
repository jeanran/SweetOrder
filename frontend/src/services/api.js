// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Make sure this is '/api' not '/base'
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;