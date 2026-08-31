import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios";
import { useToast } from "./ToastContext";
import { tokenExpirado, msHastaExpirar } from "../utils/jws";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { mostrarToast } = useToast();

  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem("token");
    const guardado = localStorage.getItem("usuario");

    if (!token || !guardado || tokenExpirado(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      return null;
    }
    return JSON.parse(guardado);
  });

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }, []);

  // Programa el cierre de sesión exactamente cuando el token vence,
  // en vez de esperar a que una llamada a la API falle con 401.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!usuario || !token) return;

    const restante = msHastaExpirar(token);
    if (restante <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
      mostrarToast("Tu sesión expiró. Iniciá sesión de nuevo.", "error");
    }, restante);

    return () => clearTimeout(timer);
  }, [usuario, logout, mostrarToast]);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });

    const datosUsuario = {
      id: data.id,
      email: data.email,
      nombre: data.nombre,
      rol: data.rol,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        estaLogueado: !!usuario,
        esAdmin: usuario?.rol === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
