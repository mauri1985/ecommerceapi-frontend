import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import Tooltip from "../components/Tooltip";
import BuscadorConSugerencias from "../components/BuscadorConSugerencias";
import { useLoginModal } from "../context/LoginModalContext";
import { useCarrito } from "../context/CarritoContext";
import { useFavoritos } from "../context/FavoritosContext";
import { usePedidos } from "../context/PedidosContext";
import LogoEasyShop from "./LogoEasyShop";
import api from "../api/axios";
import DropdownMenu from "./DropdownMenu";

import {
  ShoppingCart,
  Package,
  LogIn,
  Menu,
  X,
  Store,
  UserPlus,
  Phone,
  Heart,
  SlidersHorizontal,
  Image,
} from "lucide-react";

export default function Navbar() {
  const { usuario, logout, estaLogueado, esAdmin } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { items: productosCarrito, cantidadTotal } = useCarrito();
  const { favoritos } = useFavoritos();
  const [categorias, setCategorias] = useState([]);
  const { pedidos } = usePedidos();
  const totalCarrito = productosCarrito.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );

  // Se carga categorias para el Link de Catalogo
  useEffect(() => {
    api.get("/categorias").then((res) => setCategorias(res.data));
  }, []);

  const {
    abierto: mostrarLogin,
    abrir: abrirLogin,
    cerrar: cerrarLogin,
  } = useLoginModal();

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function handleLogout() {
    logout();
    cerrarMenu();
  }

  return (
    <nav className="md:flex items-center h-14 bg-blue-800 text-white shadow-[0_4px_6px_-2px_rgba(0,0,0,0.30)] relative z-30">
      <div className="flex h-14 gap-2 items-center justify-between w-full md:max-w-350 mx-auto px-1 md:px-4">
        <div className="shrink-0">
          {/* Boton de inicio */}
          <Link to="/" className="shrink-0" onClick={cerrarMenu}>
            <LogoEasyShop className="h-10" />
          </Link>
        </div>
        <div className="hidden md:flex flex-1 max-w-lg min-w-0">
          {/* Buscador, visible en desktop */}
          <BuscadorConSugerencias claseInput="w-full h-10 rounded-full bg-gray-100 text-gray-100 placeholder-slate-400 pl-10 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:text-black" />
        </div>
        <div className="px-2 flex justify-end items-center shrink-0">
          {/* Links en desktop */}
          <div className="hidden px-2 md:flex items-center shrink-0">
            {estaLogueado && (
              <span className="text-sm text-slate-100 px-2">
                Hola, {usuario.nombre} {usuario.apelldio}
              </span>
            )}

            <DropdownMenu
              titulo="Catálogo"
              menu="catalogo"
              categorias={categorias}
            />

            <Tooltip texto="Contacto">
              <Link
                to="/contacto"
                className="flex justify-center items-center h-14 w-11 hover:bg-slate-100 hover:text-slate-600"
              >
                <Phone size={20} />
              </Link>
            </Tooltip>

            {estaLogueado && (
              <>
                <DropdownMenu
                  titulo="Carrito"
                  menu="carrito"
                  productosCarrito={productosCarrito}
                  totalCarrito={totalCarrito}
                  cantidadTotal={cantidadTotal}
                />

                <DropdownMenu
                  titulo="Favoritos"
                  menu="favoritos"
                  favoritos={favoritos}
                />

                <DropdownMenu
                  titulo="Mis pedidos"
                  menu="pedidos"
                  pedidos={pedidos.slice(0, 3)}
                />
              </>
              // ) : (
              //   <></>
              //   // <>
              //   //   <Tooltip texto="Iniciar sesión">
              //   //     <button
              //   //       onClick={() => abrirLogin(true)}
              //   //       className="hover:text-slate-300 cursor-pointer px-2"
              //   //     >
              //   //       <LogIn size={20} />
              //   //     </button>
              //   //   </Tooltip>

              //   //   <Tooltip texto="Registrarse">
              //   //     <Link to="/registro" className="hover:text-slate-300 px-2">
              //   //       <UserPlus size={20} />
              //   //     </Link>
              //   //   </Tooltip>
              //   </>
            )}
            <DropdownMenu titulo="Menú de usuario" menu="cuenta" />
          </div>

          <div>
            {/* Botón hamburguesa, solo en mobile */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden p-2 "
              aria-label="Abrir menú"
            >
              {menuAbierto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {/* Menú desplegable, solo en mobile */}
      <div
        className={`grid md:hidden bg-blue-800 p-2 md:w-0 transition-all duration-300 ease-in-out ${
          menuAbierto
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pb-2">
            {/* Buscador también en el menú mobile */}

            <Link
              to="/catalogo"
              className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
              onClick={cerrarMenu}
            >
              <Store size={18} />
              Catálogo
            </Link>

            {estaLogueado ? (
              <>
                <Link
                  to="/carrito"
                  className="relative flex items-center gap-1.5 hover:text-slate-300 text-sm"
                  onClick={cerrarMenu}
                >
                  <ShoppingCart size={18} />
                  Carrito
                  {cantidadTotal > 0 && (
                    <span className="bg-red-600 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                      {cantidadTotal > 9 ? "9+" : cantidadTotal}
                    </span>
                  )}
                </Link>
                <Link
                  to="/pedidos"
                  className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
                  onClick={cerrarMenu}
                >
                  <Package size={18} />
                  Pedidos
                </Link>
                <Link
                  to="/favoritos"
                  className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
                  onClick={cerrarMenu}
                >
                  <Heart size={18} />
                  Favoritos
                </Link>
                {esAdmin && (
                  <>
                    <Link
                      to="/admin/productos"
                      className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
                      onClick={cerrarMenu}
                    >
                      <SlidersHorizontal size={18} />
                      Adminsitrar productos
                    </Link>
                    <Link
                      to="/admin/banners"
                      className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
                      onClick={cerrarMenu}
                    >
                      <Image size={18} />
                      Banner/Ofertas
                    </Link>
                  </>
                )}
                <span className="text-sm text-slate-300">
                  Hola, {usuario.nombre}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm text-left"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  abrirLogin(true);
                  cerrarMenu();
                }}
                className="flex items-center gap-1.5 hover:text-slate-300 text-sm text-left"
              >
                <LogIn size={18} />
                Iniciar sesión
              </button>
            )}
          </div>
        </div>
      </div>
      <LoginModal abierto={mostrarLogin} onClose={cerrarLogin} />{" "}
    </nav>
  );
}
