// API Base URL configuration
// In development: Vite proxy handles /api/* -> localhost:3001
// In production: Points to Render backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default API_BASE_URL;
