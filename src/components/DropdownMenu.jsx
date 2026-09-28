import { useState } from "react";
import { Link } from "react-router-dom";
import { estadoColor } from "../data/enumerados";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import {
  ShoppingCart,
  Package,
  Store,
  Settings,
  Heart,
  Image,
  SlidersHorizontal,
} from "lucide-react";

export default function DropdownMenu({
  titulo,
  menu,
  categorias,
  productosCarrito,
  totalCarrito,
  cantidadTotal,
  pedidos,
  favoritos,
  admin,
}) {
  const ruta = "/" + menu.toLowerCase();
  const [isHovered, setIsHovered] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();

  async function confirmarPedido() {
    setConfirmando(true);
    try {
      const { data: pedido } = await api.post(`/pedidos/${usuario.id}`);
      const { data: pago } = await api.post(`/pagos/preferencia/${pedido.id}`);
      window.location.href = pago.urlPago;
    } catch (err) {
      const mensaje =
        err.response?.data?.mensajes?.[0] || "Error al confirmar el pedido";
      mostrarToast(mensaje, "error");
      setConfirmando(false);
    }
  }

  return (
    <div
      className="relative h-10 w-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-full items-center justify-center">
        <Link to={ruta} className="relative hover:text-slate-300">
          {menu === "catalogo" && <Store size={20} />}
          {menu === "carrito" && <ShoppingCart size={20} />}
          {menu === "pedidos" && <Package size={20} />}
          {menu === "favoritos" && <Heart size={20} />}
          {menu === "admin" && <Settings size={20} />}
          {cantidadTotal > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-4 h-4 flex items-center justify-center px-1">
              {cantidadTotal > 9 ? "9+" : cantidadTotal}
            </span>
          )}
        </Link>
      </div>
      {isHovered && (
        <div className="absolute top-10 right-0 min-w-100 bg-slate-100 border border-slate-300 rounded-md py-2 text-slate-600 shadow-md shadow-black/15">
          <div>
            <div className="flex justify-between border-b border-slate-400 pb-2">
              <h1 className="text-md font-semibold px-4">{titulo}</h1>
              <Link
                to={ruta}
                className="px-4 hover:font-semibold hover:underline"
              >
                Ver todo
              </Link>
            </div>
            <div className="pt-2">
              {/* Categorias */}
              {categorias && (
                <ul>
                  {categorias
                    .filter((c) => !c.categoriaPadreId)
                    .map((c) => (
                      <li key={c.id}>
                        <Link
                          to={`/catalogo?categoriaIds=${c.id}`}
                          className="block py-1 hover:font-semibold hover:underline px-4"
                        >
                          {c.nombre}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
              {/* Carrito */}
              {productosCarrito?.length > 0 ? (
                <ul className="px-2">
                  {productosCarrito?.map((producto) => (
                    <li key={producto.productoId}>
                      <Link
                        to={`/productos/${producto.productoId}`}
                        target="_blank"
                      >
                        <div className="flex items-stretch gap-3 py-1">
                          <div className="overflow-hidden">
                            <div className="flex">
                              {!producto.imagenes ||
                              producto.imagenes.length === 0 ? (
                                <div className="text-xs min-w-20 rounded aspect-square bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-300">
                                  Sin imagen
                                </div>
                              ) : (
                                <img
                                  src={producto.imagenes?.[0]}
                                  alt={producto.productoNombre}
                                  className="flex min-w-0 max-w-20 aspect-square object-contain bg-white rounded border border-slate-300"
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">
                              {producto.productoNombre}
                            </p>
                            <p className="text-xs text-slate-500">
                              ${" "}
                              {producto.precioUnitario.toLocaleString("es-ES")}{" "}
                              c/u
                            </p>
                            <p className="text-xs text-slate-500">
                              Cantidad: {producto.cantidad}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li className="mt-2">
                    <div className="flex justify-between items-center border-t border-slate-400 pt-4 pb-1">
                      <span className="text-md font-semibold">
                        Total: ${totalCarrito.toFixed(2)}
                      </span>
                      <button
                        onClick={confirmarPedido}
                        disabled={confirmando}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-2 rounded font-medium cursor-pointer"
                      >
                        {confirmando ? "Confirmando..." : "Confirmar pedido"}
                      </button>
                    </div>
                  </li>
                </ul>
              ) : (
                menu === "carrito" && (
                  <p className="text-slate-600 px-4">Tu carrito está vacío.</p>
                )
              )}
              {/* Pedidos */}
              {pedidos?.length > 0 ? (
                <ul className="px-4">
                  {pedidos.map((pedido) => (
                    <li key={pedido.id}>
                      <div className="border-b pb-2">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold">Pedido #{pedido.id}</p>
                            <p className="text-xs text-slate-500">
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
                              className="flex justify-between text-xs text-slate-700"
                            >
                              <span>
                                {item.cantidad} x {item.productoNombre}
                              </span>
                              <span>${item.subtotal}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end border-t border-slate-300 pt-3">
                          <span className="text-sm font-bold">
                            Total: ${pedido.total}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                menu === "pedidos" && (
                  <p className="text-slate-600 px-4">No hay pedidos.</p>
                )
              )}
              {/* Favoritos */}
              {favoritos?.length > 0 ? (
                <ul className="px-4">
                  {favoritos?.map((favorito) => (
                    <li key={favorito.productoId}>
                      <Link
                        to={`/productos/${favorito.productoId}`}
                        target="_blank"
                      >
                        <div className="flex items-stretch gap-3 py-1">
                          <div className="overflow-hidden">
                            <div className="flex">
                              {!favorito.imagenes ||
                              favorito.imagenes.length === 0 ? (
                                <div className="text-xs min-w-20 rounded aspect-square bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-300">
                                  Sin imagen
                                </div>
                              ) : (
                                <img
                                  src={favorito.imagenes?.[0]}
                                  alt={favorito.productoNombre}
                                  className="flex min-w-0 max-w-20 aspect-square object-contain bg-white rounded border border-slate-300"
                                />
                              )}
                            </div>
                          </div>
                          <div className="relative flex-1">
                            {favorito.porcentajeDescuento ? (
                              <>
                                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                                  -{favorito.porcentajeDescuento}%
                                </span>

                                <p className="text-sm font-semibold">
                                  {favorito.productoNombre}
                                </p>
                                <p className="text-sm text-slate-500">
                                  ${" "}
                                  {favorito.precioOferta.toLocaleString(
                                    "es-ES"
                                  )}{" "}
                                  c/u
                                </p>
                                <p className="text-xs text-slate-500 line-through">
                                  $ {favorito.precio.toLocaleString("es-ES")}{" "}
                                  c/u
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="text-sm font-semibold">
                                  {favorito.productoNombre}
                                </p>
                                <p className="text-xs text-slate-500">
                                  $ {favorito.precio.toLocaleString("es-ES")}{" "}
                                  c/u
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                menu === "favoritos" && (
                  <p className="text-slate-600 px-4">
                    La lista de favoritos está vacía.
                  </p>
                )
              )}
              {/* Menu Admin */}
              {admin && (
                <ul className="px-4">
                  <li className="pb-1">
                    <div className="flex w-full items-center justify-between gap-3 hover:font-semibold">
                      <Link
                        to="/admin/productos"
                        target="_blank"
                        className="flex w-full items-center justify-between gap-3"
                      >
                        Administrar productos
                      </Link>
                      <SlidersHorizontal size={20} />
                    </div>
                  </li>
                  <li className="pb-1">
                    <div className="hover:font-semibold">
                      <Link
                        to="/admin/banners"
                        target="_blank"
                        className="flex w-full items-center justify-between gap-3"
                      >
                        Banners/Ofertas
                        <Image size={20} />
                      </Link>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
