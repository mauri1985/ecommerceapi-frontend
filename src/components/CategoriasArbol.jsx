import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CheckboxPersonalizado from "./CheckboxPersonalizado";

export default function CategoriasArbol({
  categorias,
  categoriasSeleccionadas,
  onToggleCategoria,
}) {
  const [expandidas, setExpandidas] = useState(new Set());

  const raiz = categorias.filter((c) => !c.categoriaPadreId);
  const hijasDe = (padreId) =>
    categorias.filter((c) => c.categoriaPadreId === padreId);

  function toggleExpandida(id) {
    setExpandidas((prev) => {
      const nuevo = new Set(prev);
      nuevo.has(id) ? nuevo.delete(id) : nuevo.add(id);
      return nuevo;
    });
  }

  return (
    <div className="flex flex-col gap-1 text-gray-700">
      {raiz.map((cat) => {
        const hijas = hijasDe(cat.id);
        const tieneHijas = hijas.length > 0;
        const expandida = expandidas.has(cat.id);

        return (
          <div key={cat.id}>
            <div className="flex items-center gap-2 py-0.5">
              <CheckboxPersonalizado
                checked={categoriasSeleccionadas.includes(cat.id)}
                onChange={() => onToggleCategoria(cat.id)}
                label={cat.nombre}
                className="flex-1"
              />

              {tieneHijas && (
                <button
                  onClick={() => toggleExpandida(cat.id)}
                  aria-label={expandida ? "Contraer" : "Expandir"}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      expandida ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            {tieneHijas && (
              <div
                className={`grid transition-all duration-300 ease-in-out pl-5 ${
                  expandida
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="flex flex-col gap-1 py-1 border-l border-slate-300 pl-3">
                    {hijas.map((hija) => (
                      <CheckboxPersonalizado
                        key={hija.id}
                        checked={categoriasSeleccionadas.includes(hija.id)}
                        onChange={() => onToggleCategoria(hija.id)}
                        label={hija.nombre}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
