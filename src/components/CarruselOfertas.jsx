import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import TituloAnimado from "./TituloAnimado";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarruselOfertas() {
  const [productos, setProductos] = useState([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: false,
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    api.get("/productos/destacados").then((res) => setProductos(res.data));
  }, []);

  const desplazarAtras = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const desplazarAdelante = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  if (productos.length === 0) return null;

  return (
    <div className="relative py-4 bg-gray-200">
      <div className="max-w-350 mx-auto px-4">
        <TituloAnimado className="text-2xl font-bold pb-4" timeout={400}>
          Destacados
        </TituloAnimado>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {productos.map((producto) => (
                <Link
                  key={producto.id}
                  to={`/productos/${producto.id}`}
                  className="flex-[0_0_100%] sm:flex-[0_0_320px] min-w-0 bg-white rounded-sm shadow-black shadow-md/20 hover:shadow-md/40 transition overflow-hidden"
                >
                  <div className="overflow-hidden">
                    <img
                      src={producto.imagenes[0]}
                      alt={producto.nombre}
                      loading="eager"
                      className="w-full aspect-square object-contain shrink-0 transition-all duration-300 ease-in-out hover:scale-105"
                    />
                  </div>
                  <div className="p-4 bg-green-500 text-white overflow-hidden">
                    <h3 className="font-semibold text-lg truncate">
                      {producto.nombre}
                    </h3>
                    <p className="text-sm mb-2">{producto.categoriaNombre}</p>
                    {producto.porcentajeDescuento ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xl">
                          ${producto.precioOferta}
                        </span>
                        <span className="text-sm text-gray-200 line-through">
                          ${producto.precio}
                        </span>
                      </div>
                    ) : (
                      <p className="font-bold text-xl">${producto.precio}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {productos.length > 2 && (
            <>
              <button
                onClick={desplazarAtras}
                className="flex absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 hover:bg-slate-50"
                aria-label="Anterior"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={desplazarAdelante}
                className="flex absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 hover:bg-slate-50"
                aria-label="Siguiente"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
