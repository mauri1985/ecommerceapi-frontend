import { X, MessageCircle, Facebook, Mail, Link2, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function ModalCompartir({
  abierto,
  onCerrar,
  url,
  titulo,
  texto,
}) {
  const [copiado, setCopiado] = useState(false);
  const { mostrarToast } = useToast();

  if (!abierto) return null;

  const urlCodificada = encodeURIComponent(url);
  const textoCodificado = encodeURIComponent(texto || titulo);

  const opciones = [
    {
      nombre: "WhatsApp",
      icono: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      href: `https://api.whatsapp.com/send?text=${textoCodificado}%20${urlCodificada}`,
    },
    {
      nombre: "Facebook",
      icono: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      href: `https://www.facebook.com/sharer/sharer.php?u=${urlCodificada}`,
    },
    {
      nombre: "X (Twitter)",
      icono: () => (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.9 1.153h3.68l-8.04 9.19L23.6 22.846h-7.406l-5.8-7.584-6.638 7.584H.07l8.6-9.83L.4 1.153H7.98l5.24 6.932zM17.61 20.65h2.04L6.486 3.24H4.298z" />
        </svg>
      ),
      color: "bg-black hover:bg-slate-800",
      href: `https://twitter.com/intent/tweet?text=${textoCodificado}&url=${urlCodificada}`,
    },
    {
      nombre: "Email",
      icono: Mail,
      color: "bg-slate-500 hover:bg-slate-600",
      href: `mailto:?subject=${encodeURIComponent(
        titulo
      )}&body=${textoCodificado}%20${urlCodificada}`,
    },
  ];

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      mostrarToast("¡Link copiado!");
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      mostrarToast("No se pudo copiar el link", "error");
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onCerrar}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Compartir</h2>
          <button
            onClick={onCerrar}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-5">
          {opciones.map((op) => (
            <a
              key={op.nombre}
              href={op.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onCerrar}
              className="flex flex-col items-center gap-1.5"
            >
              <div className={`${op.color} text-white rounded-full p-3`}>
                <op.icono size={20} />
              </div>
              <span className="text-xs text-slate-600 text-center">
                {op.nombre}
              </span>
            </a>
          ))}
        </div>

        <button
          onClick={copiarLink}
          className="w-full flex items-center justify-center gap-2 border rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50"
        >
          {copiado ? (
            <Check size={18} className="text-green-600" />
          ) : (
            <Link2 size={18} />
          )}
          {copiado ? "¡Copiado!" : "Copiar link"}
        </button>
      </div>
    </div>
  );
}
