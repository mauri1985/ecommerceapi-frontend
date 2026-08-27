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
      <div className="flex flex-col gap-2">
        {opciones.map((op) => (
          <label
            key={op}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={activos.includes(op)}
              onChange={() => toggle(op)}
            />
            {op}
          </label>
        ))}
      </div>
    </div>
  );
}
