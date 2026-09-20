import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MensajeError from "../components/MensajeError";
import BotonFavorito from "../components/BotonFavorito";
import DOMPurify from "dompurify";
import { useCarrito } from "../context/CarritoContext";
import Lightbox from "../components/Lightbox";
import BotonCompartir from "../components/BotonCompartir";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [agregando, setAgregando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const { cargarCarrito } = useCarrito();
  const [lightboxAbierto, setLightboxAbierto] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });

  const { usuario, estaLogueado } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarProducto();
  }, [id]);

  function cargarProducto() {
    setCargando(true);
    setError(null);

    api
      .get(`/productos/${id}`)
      .then((res) => setProducto(res.data))
      .catch((err) => setError(err))
      .finally(() => setCargando(false));
  }

  async function agregarAlCarrito() {
    if (!estaLogueado) {
      navigate("/login");
      return;
    }

    setAgregando(true);
    try {
      await api.post("/carrito", {
        usuarioId: usuario.id,
        productoId: producto.id,
        cantidad,
      });
      cargarCarrito();
      mostrarToast("¡Producto agregado al carrito!");
      setCantidad(1);
    } catch (err) {
      setError(err);
    } finally {
      setAgregando(false);
    }
  }

  // Cuando Embla cambia de imagen (swipe o botones), reflejamos el índice en el estado
  useEffect(() => {
    if (!emblaApi) return;
    const actualizarIndice = () =>
      setImagenActiva(emblaApi.selectedScrollSnap());
    emblaApi.on("select", actualizarIndice);
    return () => emblaApi.off("select", actualizarIndice);
  }, [emblaApi]);

  // Cuando el índice cambia desde afuera (miniatura clickeada, o vuelta del lightbox), sincronizamos Embla
  useEffect(() => {
    if (!emblaApi) return;
    if (emblaApi.selectedScrollSnap() !== imagenActiva) {
      emblaApi.scrollTo(imagenActiva);
    }
  }, [imagenActiva, emblaApi]);

  const imagenAnterior = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const imagenSiguiente = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  if (cargando)
    return <p className="text-center mt-10">Cargando producto...</p>;
  if (error && !producto)
    return <MensajeError error={error} onReintentar={cargarProducto} />;
  if (!producto) return null;

  const imagenes = producto.imagenes?.length > 0 ? producto.imagenes : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        {imagenes ? (
          <>
            <div className="relative overflow-hidden rounded-lg border border-slate-300 ">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {imagenes.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={producto.nombre}
                      className="flex-[0_0_100%] min-w-0 aspect-square object-contain cursor-zoom-in bg-white"
                      onClick={() => setLightboxAbierto(true)}
                    />
                  ))}
                </div>
              </div>

              {imagenes.length > 1 && (
                <>
                  <button
                    onClick={imagenAnterior}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white h-15 rounded-r-2xl p-1 border border-slate-300 shadow"
                    aria-label="Imagen anterior"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                    onClick={imagenSiguiente}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white h-15 rounded-l-2xl p-1 border border-slate-300 shadow"
                    aria-label="Imagen siguiente"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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

                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {imagenActiva + 1} / {imagenes.length}
                  </span>
                </>
              )}
            </div>

            {imagenes.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto px-1 py-2">
                {imagenes.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setImagenActiva(i)}
                    className={`shrink-0 w-16 h-16 rounded border border-slate-300 overflow-hidden ${
                      i === imagenActiva ? "ring-2 ring-blue-400" : ""
                    }`}
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full aspect-square bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
            Sin imagen
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-slate-500 mb-1">
          {producto.categoriaNombre}
        </p>
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <div className="flex gap-2">
            <BotonCompartir
              titulo={producto.nombre}
              texto={`¡Mirá "${producto.nombre}" en Mauri Shop! $${
                producto.precioOferta || producto.precio
              }`}
              size={24}
            />
            <BotonFavorito productoId={producto.id} size={24} />
          </div>
        </div>
        <div
          className="prose prose-sm max-w-none text-slate-700 mb-6"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(producto.descripcion),
          }}
        />

        {producto.atributos && Object.keys(producto.atributos).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(producto.atributos).map(([clave, valor]) => (
              <span
                key={clave}
                className="text-xs bg-slate-300 text-slate-700 px-2.5 py-1 rounded-md font-semibold ring ring-slate-400"
              >
                {clave.toUpperCase()}: {String(valor.toUpperCase())}
              </span>
            ))}
          </div>
        )}

        {producto.porcentajeDescuento ? (
          <div className="mb-2">
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-green-600">
                ${producto.precioOferta}
              </p>
              <span className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded">
                -{producto.porcentajeDescuento}%
              </span>
            </div>
            <p className="text-lg text-slate-400 line-through">
              ${producto.precio}
            </p>
          </div>
        ) : (
          <p className="text-3xl font-bold mb-2">${producto.precio}</p>
        )}
        <p className="text-sm text-slate-500 mb-6">
          Stock disponible: {producto.stock}
        </p>

        {error && producto && (
          <p className="text-red-600 mb-3">
            {error.response?.data?.mensajes?.[0] ||
              "Error al agregar al carrito"}
          </p>
        )}
        {mensajeExito && <p className="text-green-600 mb-3">{mensajeExito}</p>}

        {producto.stock > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium">Cantidad:</span>
            <div className="flex items-center border border-gray-400 rounded">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="px-3 py-1.5 hover:bg-slate-100"
              >
                −
              </button>
              <span className="px-4 py-1.5 border-x border-gray-400">
                {cantidad}
              </span>
              <button
                onClick={() =>
                  setCantidad((c) => Math.min(producto.stock, c + 1))
                }
                className="px-3 py-1.5 hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>
        )}

        <button
          onClick={agregarAlCarrito}
          disabled={agregando || producto.stock === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded py-3 px-8 font-medium shadow-md/20"
        >
          {producto.stock === 0
            ? "Sin stock"
            : agregando
            ? "Agregando..."
            : "Agregar al carrito"}
        </button>
      </div>

      {lightboxAbierto && (
        <Lightbox
          imagenes={imagenes}
          indiceActivo={imagenActiva}
          onCerrar={() => setLightboxAbierto(false)}
          onCambiarIndice={setImagenActiva}
        />
      )}
    </div>
  );
}
