import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useFavoritos } from "../context/FavoritosContext";
import { useLoginModal } from "../context/LoginModalContext";

export default function BotonFavorito({ productoId, size = 20 }) {
  const { estaLogueado } = useAuth();
  const { esFavorito, toggleFavorito } = useFavoritos();
  const { abrir: abrirLogin } = useLoginModal();
  const activo = estaLogueado && esFavorito(productoId);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!estaLogueado) {
      abrirLogin();
      return;
    }
    toggleFavorito(productoId);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={activo ? "Quitar de favoritos" : "Agregar a favoritos"}
      className="bg-white/80 hover:bg-white rounded-full p-1.5 cursor-pointer shadow transition-all duration-300 ease-in-out hover:scale-115"
    >
      <Heart
        size={size}
        className={
          activo
            ? "fill-red-500 text-red-500"
            : "text-slate-600 hover:text-red-600 hover:fill-red-600"
        }
      />
    </button>
  );
}
