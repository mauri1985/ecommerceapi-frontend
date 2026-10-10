export default function FiltroAtributo({
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

  function limpiarFiltro() {
    onChange(seleccionados.filter((s) => !s.startsWith(`${clave}:`)));
  }

  return (
    <div className="mb-6 pb-6 border-b border-slate-400">
      <h3 className="font-medium text-sm mb-3">{titulo}</h3>
      <div className="flex flex-col gap-2 text-slate-700">
        {opciones.map((op) => (
          <label
            key={op}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <label className="flex items-center cursor-pointer relative">
              <input
                type="checkbox"
                checked={activos.includes(op)}
                onChange={() => toggle(op)}
                className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-400 checked:bg-blue-600 checked:border-blue-600"
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
            {op}
          </label>
        ))}
      </div>
      <button
        className={`flex justify-center w-full text-sm font-semibold mt-3 p-3 rounded-md ${
          activos.length > 0
            ? "bg-blue-500 hover:bg-blue-600 hover:font-bold  text-white cursor-pointer"
            : "bg-gray-300 text-gray-400"
        }`}
        onClick={() => limpiarFiltro()}
        disabled={!activos}
      >
        <span className="">Quitar filtro de talles</span>
      </button>
    </div>
  );
}
