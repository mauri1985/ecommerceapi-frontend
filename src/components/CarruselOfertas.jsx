import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
// import CarruselImagenes from "./CarruselImagenes";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarruselOfertas() {
  const [productos, setProductos] = useState([]);
  const contenedorRef = useRef(null);

  useEffect(() => {
    api.get("/productos/destacados").then((res) => setProductos(res.data));
  }, []);

  function desplazar(direccion) {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;
    const distancia = contenedor.clientWidth * 0.9;
    contenedor.scrollBy({ left: direccion * distancia, behavior: "smooth" });
  }

  if (productos.length === 0) return null;

  return (
    <div className="relative py-8 bg-gray-200">
      <div className="max-w-350 mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Destacados</h2>

        <div className="relative">
          <div
            ref={contenedorRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {productos.map((producto) => (
              <Link
                key={producto.id}
                to={`/productos/${producto.id}`}
                className="w-full snap-start shrink-0 sm:w-80 bg-white rounded-sm shadow-black shadow-md/20 hover:shadow-md/40 transition overflow-hidden"
              >
                <div className="transition-all duration-300 ease-in-out hover:scale-103 overflow-hidden">
                  {/* <CarruselImagenes
                    imagenes={producto.imagenes}
                    alt={producto.nombre}
                  /> */}
                  <img
                    src={producto.imagenes[0]}
                    alt={producto.nombre}
                    loading="eager"
                    className="w-full aspect-square object-contain shrink-0"
                  />
                </div>
                <div className="p-4 bg-green-500 text-white">
                  <h3 className="font-semibold text-lg truncate">
                    {producto.nombre}
                  </h3>
                  <p className="text-sm mb-2">{producto.categoriaNombre}</p>
                  {producto.porcentajeDescuento ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xl ">
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

          {productos.length > 2 && (
            <>
              <button
                onClick={() => desplazar(-1)}
                className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 hover:bg-slate-50"
                aria-label="Anterior"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={() => desplazar(1)}
                className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 hover:bg-slate-50"
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
