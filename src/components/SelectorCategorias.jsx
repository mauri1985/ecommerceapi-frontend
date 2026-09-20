import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function SelectorCategorias({
  categorias,
  seleccionadas,
  onChange,
}) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function manejarClickAfuera(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", manejarClickAfuera);
    return () => document.removeEventListener("mousedown", manejarClickAfuera);
  }, []);

  function toggleCategoria(id) {
    if (seleccionadas.includes(id)) {
      onChange(seleccionadas.filter((c) => c !== id));
    } else {
      onChange([...seleccionadas, id]);
    }
  }

  function limpiar() {
    onChange([]);
  }

  const etiqueta =
    seleccionadas.length === 0
      ? "Todas las categorías"
      : seleccionadas.length === 1
      ? categorias.find((c) => c.id === seleccionadas[0])?.nombre
      : `${seleccionadas.length} categorías seleccionadas`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="border border-gray-400 rounded-md px-3 py-2 text-sm flex items-center gap-2 bg-white min-w-50 justify-between "
      >
        {etiqueta}
        <ChevronDown
          size={16}
          className={`transition-transform ${abierto ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`absolute z-20 mt-1 w-64 bg-white border rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          abierto
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none border-0"
        }`}
      >
        <div className="py-2 max-h-72 overflow-y-auto">
          <div className="px-3 pb-2 mb-1 border-b flex justify-between items-center">
            <span className="text-xs text-slate-500">
              {seleccionadas.length} seleccionadas
            </span>
            <button
              type="button"
              onClick={limpiar}
              className="text-xs text-blue-600 hover:underline"
            >
              Limpiar
            </button>
          </div>

          {categorias.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={seleccionadas.includes(cat.id)}
                onChange={() => toggleCategoria(cat.id)}
              />
              {cat.nombre}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
