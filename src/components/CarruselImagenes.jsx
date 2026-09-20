import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function CarruselImagenes({ imagenes, alt }) {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  useEffect(() => {
    if (!imagenes) return;
    imagenes.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imagenes]);

  useEffect(() => {
    if (!emblaApi) return;
    const actualizarIndice = () =>
      setImagenActiva(emblaApi.selectedScrollSnap());
    emblaApi.on("select", actualizarIndice);
    return () => emblaApi.off("select", actualizarIndice);
  }, [emblaApi]);

  const imagenAnterior = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi && emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  const imagenSiguiente = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi && emblaApi.scrollNext();
    },
    [emblaApi]
  );

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
        Sin imagen
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {imagenes.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={alt}
              className="flex-[0_0_100%] min-w-0 aspect-square object-contain bg-white"
            />
          ))}
        </div>
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
