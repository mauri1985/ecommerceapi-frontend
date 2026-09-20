import React from "react";

export default function OrdenPrecio({ orden, onCambiarOrden }) {
  return (
    <div className="flex flex-1 justify-between gap-2 w-full md:w-64 shrink-0">
      <button
        onClick={() =>
          onCambiarOrden(orden === "precio_asc" ? "" : "precio_asc")
        }
        className={`flex flex-row h-10 md:h-9 rounded-md border  w-1/2 cursor-pointer items-center justify-center ${
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
        className={`flex flex-row h-10 md:h-9 rounded-md border w-1/2 cursor-pointer items-center justify-center ${
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
