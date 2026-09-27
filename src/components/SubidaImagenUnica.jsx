import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import api from "../api/axios";

const FORMATOS_ACEPTADOS = [
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/png",
];
const TAMANIO_MAXIMO_MB = 5;

export default function SubidaImagenUnica({
  bannerId,
  imagenUrl,
  onImagenSubida,
}) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function handleSeleccion(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    if (!FORMATOS_ACEPTADOS.includes(archivo.type)) {
      setError("Formato no permitido. Solo JPG, JPEG, PNG o GIF");
      e.target.value = "";
      return;
    }
    if (archivo.size > TAMANIO_MAXIMO_MB * 1024 * 1024) {
      setError(`La imagen no puede superar los ${TAMANIO_MAXIMO_MB} MB`);
      e.target.value = "";
      return;
    }

    setError("");
    setSubiendo(true);

    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const { data } = await api.post(`/banners/${bannerId}/imagen`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onImagenSubida(data.imagenUrl);
    } catch (err) {
      setError(err.response?.data?.mensajes?.[0] || "Error al subir la imagen");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Imagen del banner
      </label>
      <div className="flex items-center gap-3">
        {imagenUrl && (
          <img
            src={imagenUrl}
            alt=""
            className="w-24 h-24 object-cover rounded border border-slate-300"
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          className="w-24 h-24 border-2 border-dashed rounded flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 disabled:opacity-50"
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
        accept="image/jpeg,image/jpg,image/png,image/gif"
        onChange={handleSeleccion}
        className="hidden"
      />
      <p className="text-xs text-slate-400 mt-1">
        JPG, PNG o GIF, máximo {TAMANIO_MAXIMO_MB}MB
      </p>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
