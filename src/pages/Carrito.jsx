import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MensajeError from "../components/MensajeError";

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [error, setError] = useState("");
  const [confirmando, setConfirmando] = useState(false);
  const [actualizandoId, setActualizandoId] = useState(null);

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

  async function quitarItem(itemId) {
    try {
      await api.delete(`/carrito/item/${itemId}`);
      setItems(items.filter((i) => i.id !== itemId));
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
                className="flex justify-between items-center border rounded-lg p-4"
              >
                <div>
                  <p className="font-medium">{item.productoNombre}</p>
                  <p className="text-sm text-slate-500">
                    ${item.precioUnitario} c/u
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => cambiarCantidad(item, item.cantidad - 1)}
                      disabled={actualizandoId === item.id}
                      className="px-2.5 py-1 hover:bg-slate-100 disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 border-x min-w-[2.5rem] text-center">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => cambiarCantidad(item, item.cantidad + 1)}
                      disabled={actualizandoId === item.id}
                      className="px-2.5 py-1 hover:bg-slate-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-semibold w-16 text-right">
                    ${item.subtotal}
                  </span>

                  <button
                    onClick={() => quitarItem(item.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Quitar
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
    </div>
  );
}
