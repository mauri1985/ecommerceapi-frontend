import { Check } from "lucide-react";
import { COLORES_HEX } from "../data/camposPorCategoria";

export default function FiltroColor({
  titulo,
  clave,
  opciones,
  seleccionados,
  onChange,
}) {
  const activos = seleccionados
    .filter((s) => s.startsWith(`${clave}:`))
    .map((s) => s.split(":")[1]);

  function toggle(valor) {
    const entrada = `${clave}:${valor}`;
    if (seleccionados.includes(entrada)) {
      onChange(seleccionados.filter((s) => s !== entrada));
    } else {
      onChange([...seleccionados, entrada]);
    }
  }

  function limpiarFiltroColores() {
    onChange(seleccionados.filter((s) => !s.startsWith(`${clave}:`)));
  }

  return (
    <div className="mb-6 pb-6 border-b border-gray-400">
      <h3 className="font-medium text-sm mb-3">{titulo}</h3>
      <div className="grid grid-cols-6 gap-y-5 gap-x-1 place-items-center">
        {opciones.map((op) => {
          const activo = activos.includes(op);
          const esClaro =
            op === "Blanco" ||
            op === "Amarillo" ||
            op === "Lima" ||
            op === "Beige" ||
            op === "Caqui";

          return (
            <button
              key={op}
              onClick={() => toggle(op)}
              title={op}
              aria-label={op}
              className={`w-10 h-10 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-transform ${
                activo ? "ring-1 ring-blue-500 scale-110" : "hover:scale-105"
              } ${esClaro ? "border border-gray-300" : ""}`}
              style={{ backgroundColor: COLORES_HEX[op] }}
            >
              {activo && (
                <Check
                  size={16}
                  className={
                    esClaro || op === "Blanco" ? "text-slate-700" : "text-white"
                  }
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>
      <button
        className={`flex justify-center w-full font-semibold text-sm mt-3 p-3 rounded-md ${
          activos.length > 0
            ? "bg-blue-500 hover:bg-blue-600  hover:font-bold  text-white cursor-pointer"
            : "bg-gray-300 text-gray-400"
        }`}
        onClick={() => limpiarFiltroColores()}
        disabled={!activos}
      >
        <span className="">Quitar filtro de colores</span>
      </button>
    </div>
  );
}
