import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import Tooltip from "../components/Tooltip";

import {
  ShoppingCart,
  Package,
  LogIn,
  LogOut,
  Menu,
  X,
  Store,
  Search,
  Settings,
  UserPlus,
} from "lucide-react";

export default function Navbar() {
  const { usuario, logout, estaLogueado, esAdmin } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();
  const [mostrarLogin, setMostrarLogin] = useState(false);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function handleLogout() {
    logout();
    cerrarMenu();
  }

  function handleBuscar(e) {
    e.preventDefault();
    if (!busqueda.trim()) return;
    navigate(`/catalogo?q=${encodeURIComponent(busqueda.trim())}`);
    cerrarMenu();
  }

  return (
    <nav className="bg-slate-800 text-white px-6 md:py-4 py-2 shadow-md shadow-gray-400">
      <div class="flex gap-2">
        <div class="md:w-1/3 w-1/2 p-2">
          {/* Boton de inicio */}
          <Link
            to="/"
            className="text-xl font-bold shrink-0"
            onClick={cerrarMenu}
          >
            MiTienda
          </Link>
        </div>
        <div class="hidden md:w-1/3 p-2 md:flex">
          {/* Buscador, visible en desktop */}
          <form onSubmit={handleBuscar} className="flex flex-1">
            <div className="relative w-full">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full h-10 rounded-full bg-slate-700 text-gray-100 placeholder-slate-400 pl-10 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-200 focus:text-black"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </form>
        </div>
        <div class="md:w-1/3 w-1/2 p-2 flex justify-end">
          {/* Links en desktop */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <Tooltip texto="Catálogo">
              <Link to="/catalogo" className="hover:text-slate-300">
                <Store size={20} />
              </Link>
            </Tooltip>

            {estaLogueado ? (
              <>
                <Tooltip texto="Carrito">
                  <Link to="/carrito" className="hover:text-slate-300">
                    <ShoppingCart size={20} />
                  </Link>
                </Tooltip>

                <Tooltip texto="Mis pedidos">
                  <Link to="/pedidos" className="hover:text-slate-300">
                    <Package size={20} />
                  </Link>
                </Tooltip>

                {esAdmin && (
                  <Tooltip texto="Panel de administración">
                    <Link
                      to="/admin/productos"
                      className="hover:text-slate-300"
                    >
                      <Settings size={20} />
                    </Link>
                  </Tooltip>
                )}

                <span className="text-sm text-slate-300">
                  Hola, {usuario.nombre}
                </span>

                <Tooltip texto="Cerrar sesión">
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300"
                  >
                    <LogOut size={20} />
                  </button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip texto="Iniciar sesión">
                  <button
                    onClick={() => setMostrarLogin(true)}
                    className="hover:text-slate-300 cursor-pointer"
                  >
                    <LogIn size={20} />
                  </button>
                </Tooltip>

                <Tooltip texto="Registrarse">
                  <Link to="/registro" className="hover:text-slate-300">
                    <UserPlus size={20} />
                  </Link>
                </Tooltip>
              </>
            )}
          </div>

          <div className="">
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
        className={`md:hidden grid transition-all duration-300 ease-in-out ${
          menuAbierto
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 pb-2">
            {/* Buscador también en el menú mobile */}
            <form onSubmit={handleBuscar}>
              <div className="relative">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full rounded-md bg-slate-700 text-white placeholder-slate-400 pl-10 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </form>
            <Link
              to="/"
              className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
            >
              <Store size={18} />
              Catálogo
            </Link>
            {estaLogueado ? (
              <>
                <Link
                  to="/carrito"
                  className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
                  onClick={cerrarMenu}
                >
                  <ShoppingCart size={18} />
                  Carrito
                </Link>
                <Link
                  to="/pedidos"
                  className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
                  onClick={cerrarMenu}
                >
                  <Package size={18} />
                  Pedidos
                </Link>
                {esAdmin && (
                  <Link
                    to="/admin/productos"
                    className="hover:text-slate-300 text-sm"
                    onClick={cerrarMenu}
                  >
                    Admin
                  </Link>
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
                  setMostrarLogin(true);
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
      <LoginModal
        abierto={mostrarLogin}
        onClose={() => setMostrarLogin(false)}
      />
    </nav>
  );
}
