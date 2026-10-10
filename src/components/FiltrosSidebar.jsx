import FiltroAtributo from "./FiltroAtributo";
import { TALLES, COLORES, MARCAS, EDADES } from "../data/camposPorCategoria";
import FiltroColor from "./FiltroColor";
import OrdenPrecio from "./OrdenPrecio";
import CategoriasArbol from "./CategoriasArbol";

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
    <aside className="flex flex-col w-full md:w-64 shrink-0 ">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">Filtros</h2>
        <button
          onClick={onLimpiarTodo}
          className="text-sm text-gray-600 hover:underline hover:text-red-700 cursor-pointer"
        >
          Limpiar todo
        </button>
      </div>
      <div className="hidden md:flex w-full mb-5 pb-5 border-b border-gray-400">
        <OrdenPrecio orden={orden} onCambiarOrden={onCambiarOrden} />
      </div>
      {/* Filtros de categorias */}
      <div className="mb-6 pb-6 border-b border-gray-400">
        <h3 className="font-medium text-sm mb-3">Categorías</h3>
        <div className="flex flex-col gap-2 text-gray-700">
          <CategoriasArbol
            categorias={categorias}
            categoriasSeleccionadas={categoriasSeleccionadas}
            onToggleCategoria={onToggleCategoria}
          />
          <button
            className={`flex justify-center w-full text-sm font-semibold mt-3 p-3 rounded-md ${
              categoriasSeleccionadas.length > 0
                ? "bg-blue-500 hover:bg-blue-600 hover:font-bold  text-white cursor-pointer"
                : "bg-gray-300 text-gray-400"
            }`}
            onClick={onLimpiarCategorias}
            disabled={!categoriasSeleccionadas.length > 0}
          >
            <span className="">Quitar filtro de talles</span>
          </button>
        </div>
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
      <div className="mb-3 pb-3 border-b border-gray-400">
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
          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold hover:font-bold my-2 py-3 rounded cursor-pointer"
        >
          Aplicar precios
        </button>
      </div>
    </aside>
  );
}
