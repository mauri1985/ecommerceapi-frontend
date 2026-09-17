import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function BotonCompartir({ titulo, texto, size = 20 }) {
  const [copiado, setCopiado] = useState(false);
  const { mostrarToast } = useToast();

  async function compartir(e) {
    e.preventDefault();
    e.stopPropagation();

    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url });
      } catch (err) {
        // El usuario canceló el diálogo de compartir; no es un error real, no hacemos nada.
        if (err.name !== "AbortError") {
          mostrarToast("No se pudo compartir", "error");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(
          `${texto ? texto + "\n" : ""}${url}`
        );
        setCopiado(true);
        mostrarToast("¡Link copiado al portapapeles!");
        setTimeout(() => setCopiado(false), 2000);
      } catch {
        mostrarToast("No se pudo copiar el link", "error");
      }
    }
  }

  return (
    <button
      onClick={compartir}
      aria-label="Compartir"
      className="bg-white/80 hover:bg-white rounded-full p-1.5 cursor-pointer shadow transition-all duration-300 ease-in-out hover:scale-115 shadow"
    >
      {copiado ? (
        <Check size={size} className="text-green-600" />
      ) : (
        <Share2 size={size} className="text-slate-600 " />
      )}
    </button>
  );
}
