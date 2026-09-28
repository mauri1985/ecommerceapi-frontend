import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const PedidosContext = createContext(null);

export function PedidosProvider({ children }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const { usuario, estaLogueado } = useAuth();

  const cargarPedidos = useCallback(() => {
    if (!usuario) return Promise.resolve();

    setCargando(true);
    setError(null);
    return api
      .get(`/pedidos/${usuario.id}`)
      .then((res) => setPedidos(res.data))
      .catch((err) => setError(err))
      .finally(() => setCargando(false));
  }, [usuario?.id]);

  useEffect(() => {
    if (estaLogueado) {
      cargarPedidos();
    } else {
      setPedidos([]);
    }
  }, [estaLogueado, usuario?.id]);

  return (
    <PedidosContext.Provider
      value={{ pedidos, cargando, error, cargarPedidos }}
    >
      {children}
    </PedidosContext.Provider>
  );
}

export function usePedidos() {
  return useContext(PedidosContext);
}
