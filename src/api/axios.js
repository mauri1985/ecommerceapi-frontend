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
      error.esErrorDeConexion = true;
    } else if (error.response.status === 401) {
      const esIntentoDeLogin =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/google");

      if (!esIntentoDeLogin) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
