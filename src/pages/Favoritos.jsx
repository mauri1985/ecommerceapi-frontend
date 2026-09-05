import { Link } from "react-router-dom";
import { useFavoritos } from "../context/FavoritosContext";
import BotonFavorito from "../components/BotonFavorito";
import CarruselImagenes from "../components/CarruselImagenes";

export default function Favoritos() {
  const { favoritos } = useFavoritos();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis favoritos</h1>

      {favoritos.length === 0 ? (
        <p className="text-slate-500">
          Todavía no agregaste ningún producto a favoritos.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritos.map((producto) => (
            <div
              key={producto.productoId}
              className="border border-gray-300 rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col shadow"
            >
              <div className="relative overflow-hidden rounded-t-2xl">
                <CarruselImagenes
                  imagenes={producto.imagenes}
                  alt={producto.productoNombre}
                />
                {producto.porcentajeDescuento && (
                  <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                    -{producto.porcentajeDescuento}%
                  </span>
                )}
                <div className="absolute top-2 right-2 z-10">
                  <BotonFavorito productoId={producto.productoId} />
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <Link to={`/productos/${producto.productoId}`}>
                  <h2 className="font-semibold text-lg hover:text-blue-600">
                    {producto.productoNombre}
                  </h2>
                </Link>
                {producto.porcentajeDescuento ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-lg text-green-50bg-green-500">
                      ${producto.precioOferta}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ${producto.precio}
                    </span>
                  </div>
                ) : (
                  <span className="font-bold text-lg mt-1">
                    ${producto.precio}
                  </span>
                )}
                {!producto.activo && (
                  <p className="text-xs text-red-500 mt-1">
                    Este producto ya no está disponible
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
