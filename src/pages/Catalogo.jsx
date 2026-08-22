import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [agregandoId, setAgregandoId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  const { usuario, estaLogueado } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/productos")
      .then((res) => setProductos(res.data))
      .catch(() => setError("No se pudieron cargar los productos"))
      .finally(() => setCargando(false));
  }, []);

  async function agregarAlCarrito(productoId) {
    if (!estaLogueado) {
      navigate("/login");
      return;
    }

    setAgregandoId(productoId);
    setMensajeExito("");

    try {
      await api.post("/carrito", {
        usuarioId: usuario.id,
        productoId,
        cantidad: 1,
      });
      setMensajeExito("¡Producto agregado al carrito!");
      setTimeout(() => setMensajeExito(""), 2000);
    } catch (err) {
      const mensaje =
        err.response?.data?.mensajes?.[0] || "Error al agregar al carrito";
      setError(mensaje);
    } finally {
      setAgregandoId(null);
    }
  }

  if (cargando)
    return <p className="text-center mt-10">Cargando productos...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Catálogo</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {mensajeExito && <p className="text-green-600 mb-4">{mensajeExito}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="border rounded-lg p-4 hover:shadow-md transition flex flex-col"
          >
            <h2 className="font-semibold text-lg">{producto.nombre}</h2>
            <p className="text-slate-500 text-sm mb-2">
              {producto.categoriaNombre}
            </p>
            <p className="text-slate-700 mb-3 flex-1">{producto.descripcion}</p>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-lg">${producto.precio}</span>
              <span className="text-sm text-slate-400">
                Stock: {producto.stock}
              </span>
            </div>
            <button
              onClick={() => agregarAlCarrito(producto.id)}
              disabled={agregandoId === producto.id || producto.stock === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded py-2 text-sm font-medium"
            >
              {producto.stock === 0
                ? "Sin stock"
                : agregandoId === producto.id
                ? "Agregando..."
                : "Agregar al carrito"}
            </button>
          </div>
        ))}
      </div>

      {productos.length === 0 && (
        <p className="text-center text-slate-500 mt-10">
          No hay productos disponibles.
        </p>
      )}
    </div>
  );
}
