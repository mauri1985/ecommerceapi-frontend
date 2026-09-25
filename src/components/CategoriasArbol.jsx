import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CheckboxPersonalizado from "./CheckboxPersonalizado";

export default function CategoriasArbol({
  categorias,
  categoriasSeleccionadas,
  onToggleCategoria,
  seleccionUnica = false,
  categoriaSeleccionadaUnica,
  onSeleccionarUnica,
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

  function estaSeleccionada(id) {
    return seleccionUnica
      ? categoriaSeleccionadaUnica === id
      : categoriasSeleccionadas.includes(id);
  }

  function seleccionar(id) {
    seleccionUnica ? onSeleccionarUnica(id) : onToggleCategoria(id);
  }

  return (
    <div className="flex flex-col gap-1 text-gray-700">
      {raiz.map((cat) => {
        const hijas = hijasDe(cat.id);
        const tieneHijas = hijas.length > 0;
        const expandida =
          expandidas.has(cat.id) ||
          (seleccionUnica &&
            hijas.some((h) => h.id === categoriaSeleccionadaUnica));

        return (
          <div key={cat.id}>
            <div className="flex items-center gap-2 py-0.5">
              {seleccionUnica ? (
                <label className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                  <input
                    type="radio"
                    name="categoria-unica"
                    checked={estaSeleccionada(cat.id)}
                    onChange={() => seleccionar(cat.id)}
                    className="h-4 w-4 cursor-pointer accent-blue-600"
                  />
                  {cat.nombre}
                </label>
              ) : (
                <CheckboxPersonalizado
                  checked={estaSeleccionada(cat.id)}
                  onChange={() => seleccionar(cat.id)}
                  label={cat.nombre}
                  className="flex-1"
                />
              )}

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
                    {hijas.map((hija) =>
                      seleccionUnica ? (
                        <label
                          key={hija.id}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="categoria-unica"
                            checked={estaSeleccionada(hija.id)}
                            onChange={() => seleccionar(hija.id)}
                            className="h-4 w-4 cursor-pointer accent-blue-600"
                          />
                          {hija.nombre}
                        </label>
                      ) : (
                        <CheckboxPersonalizado
                          key={hija.id}
                          checked={estaSeleccionada(hija.id)}
                          onChange={() => seleccionar(hija.id)}
                          label={hija.nombre}
                        />
                      )
                    )}
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
