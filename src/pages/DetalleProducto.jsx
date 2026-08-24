import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MensajeError from "../components/MensajeError";

export default function DetalleProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [agregando, setAgregando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

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
      setMensajeExito("¡Producto agregado al carrito!");
      setCantidad(1);
      setTimeout(() => setMensajeExito(""), 2000);
    } catch (err) {
      setError(err);
    } finally {
      setAgregando(false);
    }
  }

  if (cargando)
    return <p className="text-center mt-10">Cargando producto...</p>;
  if (error && !producto)
    return <MensajeError error={error} onReintentar={cargarProducto} />;
  if (!producto) return null;

  const imagenes = producto.imagenes?.length > 0 ? producto.imagenes : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10 min-h-svh">
      <div>
        {imagenes ? (
          <>
            <div className="relative">
              <img
                src={imagenes[imagenActiva]}
                alt={producto.nombre}
                className="w-full aspect-square object-cover rounded-lg border"
              />

              {imagenes.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setImagenActiva((i) =>
                        i === 0 ? imagenes.length - 1 : i - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-md h-15 p-2 shadow"
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
                    onClick={() =>
                      setImagenActiva((i) =>
                        i === imagenes.length - 1 ? 0 : i + 1
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-md h-15 p-2 shadow"
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
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {imagenes.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setImagenActiva(i)}
                    className={`shrink-0 w-16 h-16 rounded border overflow-hidden ${
                      i === imagenActiva ? "ring-2 ring-blue-600" : ""
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

      <div>
        <p className="text-sm text-slate-500 mb-1">
          {producto.categoriaNombre}
        </p>
        <h1 className="text-3xl font-bold mb-4">{producto.nombre}</h1>
        <p className="text-slate-700 mb-6">{producto.descripcion}</p>

        {producto.atributos && Object.keys(producto.atributos).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(producto.atributos).map(([clave, valor]) => (
              <span
                key={clave}
                className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full"
              >
                {clave}: {String(valor)}
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
            <div className="flex items-center border rounded">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="px-3 py-1.5 hover:bg-slate-100"
              >
                −
              </button>
              <span className="px-4 py-1.5 border-x">{cantidad}</span>
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
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded py-3 px-8 font-medium"
        >
          {producto.stock === 0
            ? "Sin stock"
            : agregando
            ? "Agregando..."
            : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
