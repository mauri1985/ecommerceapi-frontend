import { useState, useRef } from "react";
import { Upload, X, Loader2, Star } from "lucide-react";
import api from "../api/axios";

const FORMATOS_ACEPTADOS = [
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/png",
];
const TAMANIO_MAXIMO_MB = 5;

export default function SubidaImagen({
  productoId,
  imagenes,
  onImagenSubida,
  onImagenEliminada,
  onPortadaCambiada,
}) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  function validarArchivo(archivo) {
    if (!FORMATOS_ACEPTADOS.includes(archivo.type)) {
      return "Formato no permitido. Solo JPG, JPEG, GIF o PNG";
    }
    if (archivo.size > TAMANIO_MAXIMO_MB * 1024 * 1024) {
      return `La imagen no puede superar los ${TAMANIO_MAXIMO_MB} MB`;
    }
    return null;
  }

  async function handleSeleccion(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const errorValidacion = validarArchivo(archivo);
    if (errorValidacion) {
      setError(errorValidacion);
      e.target.value = "";
      return;
    }

    setError("");
    setSubiendo(true);

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const { data } = await api.post(
        `/productos/${productoId}/imagenes`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onImagenSubida(data);
    } catch (err) {
      setError(err.response?.data?.mensajes?.[0] || "Error al subir la imagen");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  async function eliminarImagen(imagenId) {
    try {
      await api.delete(`/productos/${productoId}/imagenes/${imagenId}`);
      onImagenEliminada(imagenId);
    } catch {
      setError("No se pudo eliminar la imagen");
    }
  }

  async function marcarPortada(imagenId) {
    try {
      await api.put(`/productos/${productoId}/imagenes/${imagenId}/portada`);
      onPortadaCambiada(imagenId);
    } catch {
      setError("No se pudo marcar como portada");
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Imágenes del producto
      </label>

      <div className="flex flex-wrap gap-3 mb-3">
        {imagenes?.map((img, i) => (
          <div key={img.id} className="relative w-20 h-20 group">
            <img
              src={img.url}
              alt=""
              className={`w-full h-full object-cover rounded border-2 ${
                i === 0 ? "border-blue-500" : "border-transparent"
              }`}
            />

            <button
              type="button"
              onClick={() => eliminarImagen(img.id)}
              className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5"
              aria-label="Eliminar imagen"
            >
              <X size={12} />
            </button>

            {i === 0 ? (
              <span className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[10px] text-center py-0.5 rounded-b flex items-center justify-center gap-0.5">
                <Star size={9} className="fill-white" />
                Portada
              </span>
            ) : (
              <button
                type="button"
                onClick={() => marcarPortada(img.id)}
                className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5 rounded-b opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Usar como portada
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          className="w-20 h-20 border-2 border-dashed rounded flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50"
        >
          {subiendo ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/gif,image/png"
        onChange={handleSeleccion}
        className="hidden"
      />

      <p className="text-xs text-slate-400">
        JPG, JPEG, GIF o PNG, máximo {TAMANIO_MAXIMO_MB}MB
      </p>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
