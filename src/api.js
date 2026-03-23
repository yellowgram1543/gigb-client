import axios from 'axios';

// While developing, we use localhost. 
// When we deploy the backend, we will replace this URL with the live Render URL.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

export default api;
