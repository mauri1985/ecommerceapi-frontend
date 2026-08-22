import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [confirmando, setConfirmando] = useState(false);

  const { usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
  }, []);

  function cargarCarrito() {
    setCargando(true);
    api
      .get(`/carrito/${usuario.id}`)
      .then((res) => setItems(res.data))
      .catch(() => setError("No se pudo cargar el carrito"))
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
                    {item.cantidad} x ${item.precioUnitario}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">${item.subtotal}</span>
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
