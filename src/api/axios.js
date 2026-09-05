import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: maneja errores comunes de forma centralizada
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // El backend no respondió (caído, CORS, sin conexión, etc.)
      error.esErrorDeConexion = true;
    } else if (error.response.status === 401) {
      // Token vencido o inválido: cerramos sesión y mandamos a login
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
