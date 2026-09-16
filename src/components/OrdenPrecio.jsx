import React from "react";

export default function OrdenPrecio({ orden, onCambiarOrden }) {
  return (
    <div className="flex flex-1 justify-between gap-3 w-full md:w-64 shrink-0">
      <button
        onClick={() =>
          onCambiarOrden(orden === "precio_asc" ? "" : "precio_asc")
        }
        className={`flex flex-row h-12 md:h-10 px-2 py-2 rounded-xl border-2  w-1/2 cursor-pointer items-center justify-center shadow ${
          orden === "precio_asc"
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-gray-400 hover:bg-gray-200 text-gray-600"
        }`}
      >
        <p className="w-full text-center">Precio Menor</p>
      </button>
      <button
        onClick={() =>
          onCambiarOrden(orden === "precio_desc" ? "" : "precio_desc")
        }
        className={`flex flex-row h-12 md:h-10 px-2 py-2 rounded-xl border-2 w-1/2 cursor-pointer items-center justify-center shadow  ${
          orden === "precio_desc"
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-gray-400 hover:bg-gray-100 text-gray-600"
        }`}
      >
        <p className="w-full text-center ">Precio Mayor</p>
      </button>
    </div>
  );
}
