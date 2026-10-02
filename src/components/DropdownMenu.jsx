import { useState } from "react";
import { Link } from "react-router-dom";
import { estadoColor } from "../data/enumerados";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useLoginModal } from "../context/LoginModalContext";
import LoginModal from "./LoginModal";

import {
  CircleUserRound,
  ShoppingCart,
  Package,
  Store,
  Heart,
  Image,
  SlidersHorizontal,
  LogIn,
  UserPlus,
  LogOut,
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
}) {
  const ruta = "/" + menu.toLowerCase();
  const [isHovered, setIsHovered] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const { mostrarToast } = useToast();
  const { usuario, logout, estaLogueado, esAdmin } = useAuth();
  const { isActive, setIsActive } = useState(null);

  const {
    abierto: mostrarLogin,
    abrir: abrirLogin,
    cerrar: cerrarLogin,
  } = useLoginModal();

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

  function handleLogout() {
    logout();
  }

  return (
    <div
      className="relative w-11 h-14"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex h-14 items-center justify-center  ${
          isHovered && "bg-slate-100 text-slate-600"
        }`}
      >
        <Link to={ruta} className="relative ">
          {menu === "catalogo" && <Store size={20} />}
          {menu === "carrito" && <ShoppingCart size={20} />}
          {menu === "pedidos" && <Package size={20} />}
          {menu === "favoritos" && <Heart size={20} />}
          {menu === "cuenta" && <CircleUserRound size={20} />}
          {cantidadTotal > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-4 h-4 flex items-center justify-center px-1 overflow-hidden">
              {cantidadTotal > 9 ? "9+" : cantidadTotal}
            </span>
          )}
        </Link>
      </div>
      {isHovered && (
        <div className="absolute top-14 right-0 min-w-100 bg-slate-100 rounded-l-xl rounded-b-xl py-2 text-slate-600 shadow-md shadow-black/15 overflow-hidden">
          <div>
            <div className="flex justify-between border-b border-slate-300 pb-2">
              <h1 className="text-md font-semibold px-4">{titulo}</h1>
              {menu !== "cuenta" && (
                <Link
                  to={ruta}
                  className="px-4 hover:font-semibold hover:underline"
                >
                  Ver todo
                </Link>
              )}
            </div>
            <div className="overflow-hidden">
              {/* Categorias */}
              {categorias && (
                <ul>
                  {categorias
                    .filter((c) => !c.categoriaPadreId)
                    .map((c) => (
                      <li key={c.id}>
                        <Link
                          to={`/catalogo?categoriaIds=${c.id}`}
                          className="flex items-center h-10 text-sm hover:font-semibold hover:underline px-4 hover:bg-slate-200"
                        >
                          {c.nombre}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
              {/* Carrito */}
              {productosCarrito?.length > 0 ? (
                <ul>
                  {productosCarrito?.map((producto) => (
                    <li key={producto.productoId}>
                      <Link
                        to={`/productos/${producto.productoId}`}
                        target="_blank"
                      >
                        <div className="flex items-stretch gap-3 px-3 py-2 hover:bg-slate-200">
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
                  <li>
                    <div className="flex justify-between items-center border-t border-slate-300 pt-4 pb-1 px-4">
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
                <ul>
                  {pedidos.map((pedido) => (
                    <li
                      key={pedido.id}
                      className="border-b border-slate-300 px-4 py-2"
                    >
                      <div>
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

                        <div className="flex justify-end pt-3">
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
                <ul>
                  {favoritos?.map((favorito) => (
                    <li key={favorito.productoId}>
                      <Link
                        to={`/productos/${favorito.productoId}`}
                        target="_blank"
                      >
                        <div className="flex items-stretch gap-3 px-3 py-2 hover:bg-slate-200">
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
              {/* Menu Usuario */}
              {menu === "cuenta" && (
                <ul>
                  {estaLogueado ? (
                    <>
                      {esAdmin && (
                        <>
                          <li>
                            <div className="flex w-full h-10 items-center justify-between gap-3 hover:font-semibold hover:bg-slate-200">
                              <Link
                                to="/admin/productos"
                                target="_blank"
                                className="flex w-full items-center justify-between gap-3 text-sm px-4"
                              >
                                Editar productos
                                <SlidersHorizontal size={20} />
                              </Link>
                            </div>
                          </li>
                          <li>
                            <div className="flex w-full h-10 items-center justify-between gap-3 hover:font-semibold hover:bg-slate-200">
                              <Link
                                to="/admin/banners"
                                target="_blank"
                                className="flex w-full items-center justify-between gap-3 text-sm px-4"
                              >
                                Editar Banners/Ofertas
                                <Image size={20} />
                              </Link>
                            </div>
                          </li>
                        </>
                      )}
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex w-full h-10 items-center justify-between hover:font-semibold hover:bg-slate-200 px-4 cursor-pointer"
                        >
                          <span className="text-sm">Cerrar sesión</span>
                          <LogOut size={20} className="text-red-400" />
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <div className="flex w-full h-10 items-center justify-between gap-3 hover:font-semibold hover:bg-slate-200 cursor-pointer">
                          <button
                            onClick={() => abrirLogin(true)}
                            className="flex w-full items-center justify-between gap-3 text-sm px-4 cursor-pointer"
                          >
                            Iniciar sesion
                            <LogIn size={20} />
                          </button>
                        </div>
                      </li>
                      <li>
                        <div className="flex w-full h-10 items-center justify-between gap-3 hover:font-semibold hover:bg-slate-200">
                          <Link
                            to="/registro"
                            className="flex w-full items-center justify-between gap-3 text-sm px-4"
                          >
                            Registrarse
                            <UserPlus size={20} />
                          </Link>
                        </div>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
      <LoginModal abierto={mostrarLogin} onClose={cerrarLogin} />{" "}
    </div>
  );
}
