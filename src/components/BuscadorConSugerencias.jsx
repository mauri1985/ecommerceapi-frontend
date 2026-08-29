import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../api/axios";

export default function BuscadorConSugerencias({ onNavegar, claseInput }) {
  const [texto, setTexto] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function manejarClickAfuera(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setMostrar(false);
      }
    }
    document.addEventListener("mousedown", manejarClickAfuera);
    return () => document.removeEventListener("mousedown", manejarClickAfuera);
  }, []);

  useEffect(() => {
    if (!texto.trim()) {
      setSugerencias([]);
      return;
    }

    setCargando(true);
    const timer = setTimeout(() => {
      api
        .get("/productos", { params: { q: texto.trim(), size: 5 } })
        .then((res) => {
          setSugerencias(res.data.contenido);
          setMostrar(true);
        })
        .finally(() => setCargando(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [texto]);

  function irAlCatalogo() {
    if (!texto.trim()) return;
    navigate(`/catalogo?q=${encodeURIComponent(texto.trim())}`);
    setMostrar(false);
    if (onNavegar) onNavegar();
  }

  function irAlProducto(id) {
    navigate(`/productos/${id}`);
    setTexto("");
    setMostrar(false);
    if (onNavegar) onNavegar();
  }

  function handleSubmit(e) {
    e.preventDefault();
    irAlCatalogo();
  }

  return (
    <div className="relative w-full" ref={ref}>
      <form onSubmit={handleSubmit}>
        <div className="relative w-full">
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onFocus={() => texto.trim() && setMostrar(true)}
            placeholder="Buscar productos..."
            className={claseInput}
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </form>

      <div
        className={`absolute z-30 mt-1 w-full bg-white text-slate-800 border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-200 ease-in-out ${
          mostrar && texto.trim()
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none border-0"
        }`}
      >
        {cargando ? (
          <p className="px-4 py-3 text-sm text-slate-400">Buscando...</p>
        ) : sugerencias.length > 0 ? (
          <>
            {sugerencias.map((producto) => (
              <button
                key={producto.id}
                onClick={() => irAlProducto(producto.id)}
                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-slate-50 text-left"
              >
                <img
                  src={
                    producto.imagenes?.[0] || "https://via.placeholder.com/40"
                  }
                  alt=""
                  className="w-10 h-10 object-cover rounded shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm truncate">{producto.nombre}</p>
                  <p className="text-xs text-slate-500">
                    ${producto.precioOferta || producto.precio}
                  </p>
                </div>
              </button>
            ))}

            <button
              onClick={irAlCatalogo}
              className="w-full text-center text-sm text-gray-600 hover:bg-slate-50 py-2.5 border-t font-medium"
            >
              Ver todos los resultados
            </button>
          </>
        ) : (
          <p className="px-4 py-3 text-sm text-slate-400">
            Sin resultados para "{texto}"
          </p>
        )}
      </div>
    </div>
  );
}
