import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { BANNERS_OFERTAS } from "../data/bannersOfertas";

const INTERVALO_MS = 5000;

export default function BannerOfertas() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [indiceActivo, setIndiceActivo] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const actualizar = () => setIndiceActivo(emblaApi.selectedScrollSnap());
    emblaApi.on("select", actualizar);
    return () => emblaApi.off("select", actualizar);
  }, [emblaApi]);

  // Autoplay: pasa al siguiente banner cada INTERVALO_MS
  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), INTERVALO_MS);
    return () => clearInterval(timer);
  }, [emblaApi]);

  const irA = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  if (BANNERS_OFERTAS.length === 0) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {BANNERS_OFERTAS.map((banner, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 relative h-full">
              <img
                src={banner.imagen}
                alt={banner.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-white text-4xl md:text-5xl font-bold mb-3">
                  {banner.titulo}
                </h2>
                <p className="text-white text-lg md:text-xl mb-6">
                  {banner.subtitulo}
                </p>
                <Link
                  to={banner.link}
                  className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-medium hover:bg-slate-100"
                >
                  {banner.textoBoton}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {BANNERS_OFERTAS.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNERS_OFERTAS.map((_, i) => (
            <button
              key={i}
              onClick={() => irA(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === indiceActivo ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Ir al banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
