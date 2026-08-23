import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import MensajeError from "../components/MensajeError";
import CarruselImagenes from "../components/CarruselImagenes";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [agregandoId, setAgregandoId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");

  const { usuario, estaLogueado } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/categorias").then((res) => setCategorias(res.data));
  }, []);

  useEffect(() => {
    setCargando(true);
    const params = categoriaSeleccionada
      ? { categoriaId: categoriaSeleccionada }
      : {};

    api
      .get("/productos", { params })
      .then((res) => setProductos(res.data))
      .catch(() => setError("No se pudieron cargar los productos"))
      .finally(() => setCargando(false));
  }, [categoriaSeleccionada]);

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

  useEffect(() => {
    cargarProductos();
  }, [categoriaSeleccionada]);

  function cargarProductos() {
    setCargando(true);
    setError(null);
    const params = categoriaSeleccionada
      ? { categoriaId: categoriaSeleccionada }
      : {};

    api
      .get("/productos", { params })
      .then((res) => setProductos(res.data))
      .catch((err) => setError(err))
      .finally(() => setCargando(false));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Catálogo</h1>

        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      {error && !cargando && productos.length === 0 ? (
        <MensajeError error={error} onReintentar={cargarProductos} />
      ) : cargando ? (
        <p className="text-center mt-10">Cargando productos...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="border rounded-lg p-4 hover:shadow-md transition flex flex-col"
            >
              <CarruselImagenes
                imagenes={producto.imagenes}
                alt={producto.nombre}
              />

              <Link to={`/productos/${producto.id}`} className="mt-3">
                <h2 className="font-semibold text-lg hover:text-blue-600">
                  {producto.nombre}
                </h2>
              </Link>
              <p className="text-slate-500 text-sm mb-2">
                {producto.categoriaNombre}
              </p>
              <p className="text-slate-700 mb-3 flex-1">
                {producto.descripcion}
              </p>
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
      )}

      {!cargando && productos.length === 0 && (
        <p className="text-center text-slate-500 mt-10">
          No hay productos en esta categoría.
        </p>
      )}
    </div>
  );
}
