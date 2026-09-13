import FiltroAtributo from "./FiltroAtributo";
import { TALLES, COLORES, MARCAS, EDADES } from "../data/camposPorCategoria";
import FiltroColor from "./FiltroColor";

export default function FiltrosSidebar({
  categorias,
  categoriasSeleccionadas,
  onToggleCategoria,
  onLimpiarCategorias,
  precioMin,
  precioMax,
  onCambiarPrecioMin,
  onCambiarPrecioMax,
  onAplicarPrecio,
  onLimpiarTodo,
  atributosSeleccionados,
  onCambiarAtributos,
  orden,
  onCambiarOrden,
  atributosFiltrables,
}) {
  return (
    <aside className="flex flex-col w-full md:w-64 shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Filtros</h2>
        <button
          onClick={onLimpiarTodo}
          className="text-sm text-gray-600 hover:underline hover:text-red-700 cursor-pointer"
        >
          Limpiar todo
        </button>
      </div>
      <div className="flex flex-1 justify-between gap-2 pb-5">
        <button
          onClick={() =>
            onCambiarOrden(orden === "precio_asc" ? "" : "precio_asc")
          }
          className={`flex flex-row px-2 py-1 rounded-xl border w-1/2 cursor-pointer shadow ${
            orden === "precio_asc"
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-gray-300 hover:bg-gray-100 text-gray-600"
          }`}
        >
          <p className="w-full text-center">Precio Menor</p>
        </button>
        <button
          onClick={() =>
            onCambiarOrden(orden === "precio_desc" ? "" : "precio_desc")
          }
          className={`flex flex-row px-2 py-1 rounded-xl border w-1/2 cursor-pointer shadow ${
            orden === "precio_desc"
              ? "bg-blue-600 border-blue-600 text-white"
              : "border-gray-300 hover:bg-gray-100 text-gray-600"
          }`}
        >
          <p className="w-full text-center">Precio Mayor</p>
        </button>
      </div>
      {/* Filtros de categorias */}
      <div className="mb-6 pb-6 border-b border-gray-400">
        <h3 className="font-medium text-sm mb-3">Categorías</h3>
        <div className="flex flex-col gap-2 text-gray-700">
          {categorias.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <label className="flex items-center cursor-pointer relative">
                <input
                  type="checkbox"
                  checked={categoriasSeleccionadas.includes(cat.id)}
                  onChange={() => onToggleCategoria(cat.id)}
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
              {cat.nombre}
            </label>
          ))}
        </div>
        {categoriasSeleccionadas.length > 0 && (
          <button
            onClick={onLimpiarCategorias}
            className="text-xs text-blue-600 hover:underline mt-2"
          >
            Quitar filtro de categorías
          </button>
        )}
      </div>

      {atributosFiltrables.includes("talle") && (
        <FiltroAtributo
          titulo="Talle"
          clave="talle"
          opciones={TALLES}
          seleccionados={atributosSeleccionados}
          onChange={onCambiarAtributos}
        />
      )}

      {atributosFiltrables.includes("color") && (
        <FiltroColor
          titulo="Color"
          clave="color"
          opciones={COLORES}
          seleccionados={atributosSeleccionados}
          onChange={onCambiarAtributos}
        />
      )}

      {atributosFiltrables.includes("marca") && (
        <FiltroAtributo
          titulo="Marca"
          clave="marca"
          opciones={MARCAS}
          seleccionados={atributosSeleccionados}
          onChange={onCambiarAtributos}
        />
      )}

      {atributosFiltrables.includes("edad") && (
        <FiltroAtributo
          titulo="Edad"
          clave="edad"
          opciones={EDADES}
          seleccionados={atributosSeleccionados}
          onChange={onCambiarAtributos}
        />
      )}

      {/* Filtro de precios */}
      <div className="mb-6 pb-6 border-b border-gray-400">
        <h3 className="font-medium text-sm mb-3">Precio</h3>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="number"
            placeholder="Mín"
            min="0"
            value={precioMin}
            onChange={(e) => onCambiarPrecioMin(e.target.value)}
            className="w-full border border-gray-400 rounded px-2 py-1.5 text-sm"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            placeholder="Máx"
            min="0"
            value={precioMax}
            onChange={(e) => onCambiarPrecioMax(e.target.value)}
            className="w-full border border-gray-400 rounded px-2 py-1.5 text-sm"
          />
        </div>
        <button
          onClick={onAplicarPrecio}
          className="w-full bg-slate-700 hover:bg-slate-800 text-white text-sm py-1.5 rounded"
        >
          Aplicar
        </button>
      </div>
    </aside>
  );
}
