import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import MensajeError from "../components/MensajeError";

const estadoColor = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  PAGADO: "bg-green-100 text-green-800",
  ENVIADO: "bg-blue-100 text-blue-800",
  CANCELADO: "bg-red-100 text-red-800",
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { usuario } = useAuth();

  useEffect(() => {
    cargarPedidos();
  }, [usuario.id]);

  function cargarPedidos() {
    setCargando(true);
    setError(null);

    api
      .get(`/pedidos/${usuario.id}`)
      .then((res) => setPedidos(res.data))
      .catch((err) => setError(err))
      .finally(() => setCargando(false));
  }

  if (cargando) return <p className="text-center mt-10">Cargando pedidos...</p>;
  if (error) return <MensajeError error={error} onReintentar={cargarPedidos} />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <p className="text-slate-500">Todavía no realizaste ningún pedido.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {pedidos.map((pedido) => (
            <div key={pedido.id} className="border rounded-lg p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">Pedido #{pedido.id}</p>
                  <p className="text-sm text-slate-500">
                    {new Date(pedido.fecha).toLocaleString("es-AR")}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    estadoColor[pedido.estado]
                  }`}
                >
                  {pedido.estado}
                </span>
              </div>

              <div className="flex flex-col gap-1 mb-3">
                {pedido.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-slate-700"
                  >
                    <span>
                      {item.cantidad} x {item.productoNombre}
                    </span>
                    <span>${item.subtotal}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t pt-3">
                <span className="font-bold">Total: ${pedido.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
