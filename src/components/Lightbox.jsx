import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({
  imagenes,
  indiceActivo,
  onCerrar,
  onCambiarIndice,
}) {
  useEffect(() => {
    function manejarTeclado(e) {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
    }
    document.addEventListener("keydown", manejarTeclado);
    document.body.style.overflow = "hidden"; // evita que la página de fondo scrollee
    return () => {
      document.removeEventListener("keydown", manejarTeclado);
      document.body.style.overflow = "";
    };
  }, [indiceActivo]);

  function anterior() {
    onCambiarIndice(
      indiceActivo === 0 ? imagenes.length - 1 : indiceActivo - 1
    );
  }

  function siguiente() {
    onCambiarIndice(
      indiceActivo === imagenes.length - 1 ? 0 : indiceActivo + 1
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onCerrar}
    >
      <button
        onClick={onCerrar}
        className="absolute top-4 right-4 text-white hover:text-slate-300 z-10"
        aria-label="Cerrar"
      >
        <X size={32} />
      </button>

      <img
        src={imagenes[indiceActivo]}
        alt=""
        className="max-w-[90vw] max-h-[85vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {imagenes.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              anterior();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 bg-black/40 rounded-full p-2"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              siguiente();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 bg-black/40 rounded-full p-2"
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={28} />
          </button>

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-full">
            {indiceActivo + 1} / {imagenes.length}
          </span>
        </>
      )}
    </div>
  );
}
