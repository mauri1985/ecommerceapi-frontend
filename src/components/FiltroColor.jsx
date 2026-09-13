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

  return (
    <div className="mb-6 pb-6 border-b border-gray-400">
      <h3 className="font-medium text-sm mb-3">{titulo}</h3>
      <div className="flex flex-wrap gap-3">
        {opciones.map((op) => {
          const activo = activos.includes(op);
          const esClaro = op === "Blanco";

          return (
            <button
              key={op}
              onClick={() => toggle(op)}
              title={op}
              aria-label={op}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                activo
                  ? "ring-2 ring-offset-2 ring-blue-600 scale-110"
                  : "hover:scale-105"
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
    </div>
  );
}
