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

  return (
    <div className="mb-6 pb-6 border-b">
      <h3 className="font-medium text-sm mb-3">{titulo}</h3>
      <div className="flex flex-col gap-2 text-gray-700">
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
                className="peer h-4 w-4 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-blue-600 checked:border-blue-600"
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
    </div>
  );
}
