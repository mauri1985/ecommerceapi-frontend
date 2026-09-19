import { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({
  imagenes,
  indiceActivo,
  onCerrar,
  onCambiarIndice,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center" });

  // Al montarse, saltamos (sin animación) a la imagen que ya estaba activa en la página
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(indiceActivo, true);
  }, [emblaApi]);

  // Cuando el usuario swipea dentro del lightbox, avisamos al padre para que quede sincronizado
  useEffect(() => {
    if (!emblaApi) return;
    const actualizar = () => onCambiarIndice(emblaApi.selectedScrollSnap());
    emblaApi.on("select", actualizar);
    return () => emblaApi.off("select", actualizar);
  }, [emblaApi, onCambiarIndice]);

  const anterior = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const siguiente = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

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
  }, [anterior, siguiente, onCerrar]);

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

      <div
        className="overflow-hidden max-w-[90vw] max-h-[85vh] w-full"
        ref={emblaRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {imagenes.map((url, i) => (
            <div
              key={i}
              className="flex-[0_0_100%] min-w-0 flex items-center justify-center"
            >
              <img
                src={url}
                alt=""
                className="max-w-[90vw] max-h-[85vh] object-contain select-none"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

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
