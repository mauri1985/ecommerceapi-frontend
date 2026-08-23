import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingCart, Package, LogIn, Menu, X } from "lucide-react";

export default function Navbar() {
  const { usuario, logout, estaLogueado, esAdmin } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function handleLogout() {
    logout();
    cerrarMenu();
  }

  return (
    <nav className="bg-slate-800 text-white px-6 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold" onClick={cerrarMenu}>
          MiTienda
        </Link>

        {/* Links en desktop */}
        <div className="hidden md:flex items-center gap-5">
          {estaLogueado ? (
            <>
              <Link
                to="/carrito"
                className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
              >
                <ShoppingCart size={18} />
                Carrito
              </Link>
              <Link
                to="/pedidos"
                className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
              >
                <Package size={18} />
                Mis Pedidos
              </Link>
              {esAdmin && (
                <Link
                  to="/admin/productos"
                  className="hover:text-slate-300 text-sm"
                >
                  Admin
                </Link>
              )}
              <span className="text-sm text-slate-300">
                Hola, {usuario.nombre}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
              >
                <LogIn size={18} />
                Iniciar sesión
              </Link>
              <Link
                to="/registro"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón hamburguesa, solo en mobile */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden p-2"
          aria-label="Abrir menú"
        >
          {menuAbierto ? <X size={24} /> : <Menu size={24} />}
        </button>
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
            {estaLogueado ? (
              <>
                <span className="text-sm text-slate-300">
                  Hola, {usuario.nombre}
                </span>
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
                  Mis Pedidos
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
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm text-left"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 hover:text-slate-300 text-sm"
                  onClick={cerrarMenu}
                >
                  <LogIn size={18} />
                  Iniciar sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm w-fit"
                  onClick={cerrarMenu}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
