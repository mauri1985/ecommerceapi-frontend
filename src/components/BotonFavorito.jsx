import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFavoritos } from "../context/FavoritosContext";

export default function BotonFavorito({ productoId, size = 20 }) {
  const { estaLogueado } = useAuth();
  const { esFavorito, toggleFavorito } = useFavoritos();
  const navigate = useNavigate();
  const activo = estaLogueado && esFavorito(productoId);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!estaLogueado) {
      navigate("/login");
      return;
    }
    toggleFavorito(productoId);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
      className="bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md/25"
    >
      <Heart
        size={size}
        className={activo ? "fill-red-500 text-red-500" : "text-slate-600"}
      />
    </button>
  );
}
