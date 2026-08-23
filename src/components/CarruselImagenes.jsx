import { useState, useEffect } from "react";

export default function CarruselImagenes({ imagenes, alt }) {
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    if (!imagenes) return;
    imagenes.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imagenes]);

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-100 rounded flex items-center justify-center text-slate-400 text-sm">
        Sin imagen
      </div>
    );
  }

  function anterior(e) {
    e.preventDefault();
    e.stopPropagation();
    setActiva((i) => (i === 0 ? imagenes.length - 1 : i - 1));
  }

  function siguiente(e) {
    e.preventDefault();
    e.stopPropagation();
    setActiva((i) => (i === imagenes.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="relative">
      <img
        src={imagenes[activa]}
        alt={alt}
        loading="eager"
        className="w-full aspect-square object-cover rounded"
      />

      {imagenes.length > 1 && (
        <>
          <button
            onClick={anterior}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-md h-10 p-1 shadow"
            aria-label="Imagen anterior"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
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
            onClick={siguiente}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-md h-10 p-1 shadow"
            aria-label="Imagen siguiente"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
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
                className={`w-1.5 h-1.5 rounded-full ${
                  i === activa ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
