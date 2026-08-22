import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, logout, estaLogueado, esAdmin } = useAuth();

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        MiTienda
      </Link>

      <div className="flex items-center gap-4">
        {estaLogueado ? (
          <>
            <Link to="/carrito" className="hover:text-slate-300 text-sm">
              Carrito
            </Link>
            <Link to="/pedidos" className="hover:text-slate-300 text-sm">
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
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-slate-300 text-sm">
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
    </nav>
  );
}
