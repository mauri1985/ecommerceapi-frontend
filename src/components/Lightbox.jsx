import { useEffect, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({
  imagenes,
  indiceActivo,
  onCerrar,
  onCambiarIndice,
}) {
  const [arrastreX, setArrastreX] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const touchStartXRef = useRef(0);

  useEffect(() => {
    function manejarTeclado(e) {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
    }
    document.addEventListener("keydown", manejarTeclado);
    document.body.style.overflow = "hidden";
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

  function handleTouchStart(e) {
    touchStartXRef.current = e.touches[0].clientX;
    setArrastrando(true);
  }

  function handleTouchMove(e) {
    if (!arrastrando) return;
    setArrastreX(e.touches[0].clientX - touchStartXRef.current);
  }

  function handleTouchEnd() {
    const UMBRAL_MINIMO = 50;

    if (arrastreX < -UMBRAL_MINIMO) {
      siguiente();
    } else if (arrastreX > UMBRAL_MINIMO) {
      anterior();
    }

    setArrastrando(false);
    setArrastreX(0);
  }

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center overflow-hidden"
      onClick={onCerrar}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
        className={`max-w-[90vw] max-h-[85vh] object-contain select-none ${
          arrastrando ? "" : "transition-transform duration-200 ease-out"
        }`}
        style={{ transform: `translateX(${arrastreX}px)` }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />

      {imagenes.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              anterior();
            }}
            className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 bg-black/40 rounded-full p-2"
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              siguiente();
            }}
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 bg-black/40 rounded-full p-2"
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
