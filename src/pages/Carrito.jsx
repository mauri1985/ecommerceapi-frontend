import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MensajeError from "../components/MensajeError";
import CarruselImagenes from "../components/CarruselImagenes";
import ModalConfirmacion from "../components/ModalConfirmacion";
import { Trash2, Minus, Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [error, setError] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [actualizandoId, setActualizandoId] = useState(null);
  const [itemAEliminar, setItemAEliminar] = useState(null);
  const { mostrarToast } = useToast();

  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
  }, []);

  function cargarCarrito() {
    setCargando(true);
    setErrorCarga(null);
    api
      .get(`/carrito/${usuario.id}`)
      .then((res) => setItems(res.data))
      .catch((err) => setErrorCarga(err))
      .finally(() => setCargando(false));
  }

  async function confirmarEliminacion() {
    const itemId = itemAEliminar.id;
    setItemAEliminar(null);
    try {
      await api.delete(`/carrito/item/${itemId}`);
      setItems(items.filter((i) => i.id !== itemId));
      mostrarToast("¡Producto eliminado del carrito!");
    } catch {
      setError("No se pudo quitar el producto");
    }
  }

  async function cambiarCantidad(item, nuevaCantidad) {
    if (nuevaCantidad < 1) return;

    setActualizandoId(item.id);
    setError("");
    try {
      const { data } = await api.put(`/carrito/item/${item.id}`, {
        cantidad: nuevaCantidad,
      });
      setItems(items.map((i) => (i.id === item.id ? data : i)));
    } catch (err) {
      setError(
        err.response?.data?.mensajes?.[0] || "No se pudo actualizar la cantidad"
      );
    } finally {
      setActualizandoId(null);
    }
  }

  async function confirmarPedido() {
    setConfirmando(true);
    setError("");
    try {
      await api.post(`/pedidos/${usuario.id}`);
      navigate("/pedidos");
    } catch (err) {
      const mensaje =
        err.response?.data?.mensajes?.[0] || "Error al confirmar el pedido";
      setError(mensaje);
    } finally {
      setConfirmando(false);
    }
  }

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  if (cargando) return <p className="text-center mt-10">Cargando carrito...</p>;
  if (errorCarga)
    return <MensajeError error={errorCarga} onReintentar={cargarCarrito} />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mi Carrito</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {items.length === 0 ? (
        <p className="text-slate-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row md:items-center gap-4 border border-gray-400 shadow-md rounded-lg p-4"
              >
                {/* Carrusel */}
                <Link
                  to={`/productos/${item.productoId}`}
                  className="md:w-50 w-full shrink-0"
                >
                  <CarruselImagenes
                    imagenes={item.imagenes}
                    alt={item.productoNombre}
                  />
                </Link>

                {/* Nombre del producto + precio unitario */}
                <div className="flex-1 min-w-0">
                  <Link to={`/productos/${item.productoId}`}>
                    <p className="font-medium hover:text-blue-600 truncate">
                      {item.productoNombre}
                    </p>
                  </Link>
                  <p className="text-sm text-slate-500">
                    ${item.precioUnitario} c/u
                  </p>
                </div>

                {/* Editor de cantidad */}
                <div className="flex max-w-24 items-center border rounded shrink-0">
                  <button
                    onClick={() => cambiarCantidad(item, item.cantidad - 1)}
                    disabled={actualizandoId === item.id}
                    className="p-1.5 hover:bg-slate-100 disabled:opacity-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-3 py-1 border-x min-w-[2.5rem] text-center">
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => cambiarCantidad(item, item.cantidad + 1)}
                    disabled={actualizandoId === item.id}
                    className="p-1.5 hover:bg-slate-100 disabled:opacity-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex gap-2">
                  {/* Subtotal del producto */}
                  <span className="font-semibold md:w-16 md:text-right shrink-0">
                    ${item.subtotal}
                  </span>

                  {/* Boton eliminar */}
                  <button
                    onClick={() => setItemAEliminar(item)}
                    className="text-red-600 hover:text-red-700 shrink-0"
                    aria-label="Quitar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <span className="text-lg font-bold">
              Total: ${total.toFixed(2)}
            </span>
            <button
              onClick={confirmarPedido}
              disabled={confirmando}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-2 rounded font-medium"
            >
              {confirmando ? "Confirmando..." : "Confirmar pedido"}
            </button>
          </div>
        </>
      )}

      <ModalConfirmacion
        abierto={itemAEliminar !== null}
        titulo="Quitar producto"
        mensaje={`¿Seguro que querés quitar "${itemAEliminar?.productoNombre}" del carrito?`}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setItemAEliminar(null)}
      />
    </div>
  );
}
