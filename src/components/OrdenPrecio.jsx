import React from "react";

export default function OrdenPrecio({ orden, onCambiarOrden }) {
  return (
    <div className="flex justify-between gap-2 w-full">
      <button
        onClick={() =>
          onCambiarOrden(orden === "precio_asc" ? "" : "precio_asc")
        }
        className={`flex flex-row items-center justify-center rounded-md border border-slate-400 md:p-2 w-1/2 cursor-pointer ${
          orden === "precio_asc"
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-slate-400 hover:bg-slate-200 text-slate-600"
        }`}
      >
        <p className="w-full text-center">Precio Menor</p>
      </button>
      <button
        onClick={() =>
          onCambiarOrden(orden === "precio_desc" ? "" : "precio_desc")
        }
        className={`flex flex-row items-center justify-center rounded-md border border-slate-400 md:p-2 w-1/2 cursor-pointer ${
          orden === "precio_desc"
            ? "bg-blue-600 border-blue-600 text-white"
            : "bg-white border-slate-400 hover:bg-slate-100 text-slate-600"
        }`}
      >
        <p className="w-full text-center ">Precio Mayor</p>
      </button>
    </div>
  );
}
