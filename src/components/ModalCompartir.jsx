import { X, MessageCircle, Mail, Link2, Check } from "lucide-react";
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
      icono: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 4.99L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.07h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.19-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.53-3.69 8.21-8.22 8.21zm4.51-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.47-.01a.9.9 0 0 0-.66.31c-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.48-.28z" />
        </svg>
      ),
      color: "bg-green-500 hover:bg-green-600",
      href: `https://api.whatsapp.com/send?text=${textoCodificado}%20${urlCodificada}`,
    },
    {
      nombre: "Facebook",
      icono: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
        </svg>
      ),
      color: "bg-blue-600 hover:bg-blue-700",
      href: `https://www.facebook.com/sharer/sharer.php?u=${urlCodificada}`,
    },
    {
      nombre: "X (Twitter)",
      icono: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
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
