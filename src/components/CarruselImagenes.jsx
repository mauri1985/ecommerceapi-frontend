import { useState, useEffect, useRef } from "react";

export default function CarruselImagenes({ imagenes, alt }) {
  const [arrastreX, setArrastreX] = useState(0);
  const [arrastrando, setArrastrando] = useState(false);
  const [imagenActiva, setImagenActiva] = useState(0);
  const touchStartXRef = useRef(0);

  useEffect(() => {
    if (!imagenes) return;
    imagenes.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imagenes]);

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
        Sin imagen
      </div>
    );
  }

  function imagenAnterior() {
    setImagenActiva((i) => (i === 0 ? imagenes.length - 1 : i - 1));
  }

  function imagenSiguiente() {
    setImagenActiva((i) => (i === imagenes.length - 1 ? 0 : i + 1));
  }

  function handleTouchStart(e) {
    touchStartXRef.current = e.touches[0].clientX;
    setArrastrando(true);
  }

  function handleTouchMove(e) {
    if (!arrastrando) return;
    const delta = e.touches[0].clientX - touchStartXRef.current;
    setArrastreX(delta);
  }

  function handleTouchEnd() {
    const UMBRAL_MINIMO = 50;

    if (arrastreX < -UMBRAL_MINIMO) {
      imagenSiguiente();
    } else if (arrastreX > UMBRAL_MINIMO) {
      imagenAnterior();
    }

    setArrastrando(false);
    setArrastreX(0);
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg "
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`flex ${
          arrastrando ? "" : "transition-transform duration-300 ease-out"
        }`}
        style={{
          transform: `translateX(calc(-${
            imagenActiva * 100
          }% + ${arrastreX}px))`,
        }}
      >
        {imagenes.map((url, i) => (
          <img
            key={i}
            src={url}
            className="w-full aspect-square object-contain shrink-0"
          />
        ))}
      </div>

      {imagenes.length > 1 && (
        <>
          <button
            onClick={imagenAnterior}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-r-2xl h-15 p-1 border-t border-r border-b border-gray-300 shadow"
            aria-label="Imagen anterior"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="5 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={imagenSiguiente}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-l-2xl h-15 p-1 border-t border-l border-b border-gray-300 shadow"
            aria-label="Imagen siguiente"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="-5 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
            {imagenes.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ring ring-gray-300 ${
                  i === imagenActiva ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
