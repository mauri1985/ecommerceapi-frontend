import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);
  const { usuario, estaLogueado } = useAuth();

  useEffect(() => {
    if (estaLogueado) {
      cargarCarrito();
    } else {
      setItems([]);
    }
  }, [estaLogueado]);

  function cargarCarrito() {
    api.get(`/carrito/${usuario.id}`).then((res) => setItems(res.data));
  }

  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ items, cantidadTotal, cargarCarrito, setItems }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
