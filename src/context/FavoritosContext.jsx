import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const FavoritosContext = createContext(null);

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);
  const { usuario, estaLogueado } = useAuth();

  useEffect(() => {
    if (estaLogueado) {
      cargarFavoritos();
    } else {
      setFavoritos([]);
    }
  }, [estaLogueado]);

  function cargarFavoritos() {
    api.get(`/favoritos/${usuario.id}`).then((res) => setFavoritos(res.data));
  }

  function esFavorito(productoId) {
    return favoritos.some((f) => f.productoId === productoId);
  }

  async function toggleFavorito(productoId) {
    if (esFavorito(productoId)) {
      await api.delete(`/favoritos/${usuario.id}/${productoId}`);
      setFavoritos(favoritos.filter((f) => f.productoId !== productoId));
    } else {
      await api.post(`/favoritos/${usuario.id}/${productoId}`);
      cargarFavoritos();
    }
  }

  return (
    <FavoritosContext.Provider
      value={{ favoritos, esFavorito, toggleFavorito, cargarFavoritos }}
    >
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  return useContext(FavoritosContext);
}
