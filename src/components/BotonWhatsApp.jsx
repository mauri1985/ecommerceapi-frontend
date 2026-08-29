import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { INFO_CONTACTO } from "../data/InfoContacto";

const MENSAJE_INICIAL = "¡Hola! Quería consultar por...";

export default function BotonWhatsApp() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState(MENSAJE_INICIAL);
  const ref = useRef(null);

  useEffect(() => {
    function manejarClickAfuera(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", manejarClickAfuera);
    return () => document.removeEventListener("mousedown", manejarClickAfuera);
  }, []);

  function enviar() {
    const texto = encodeURIComponent(mensaje.trim() || MENSAJE_INICIAL);
    window.open(
      `https://wa.me/${INFO_CONTACTO.whatsapp}?text=${texto}`,
      "_blank"
    );
    setAbierto(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-40" ref={ref}>
      {/* Panel del mini chat */}
      <div
        className={`absolute bottom-16 right-0 w-72 bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          abierto
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-green-500 text-white px-4 py-3 flex justify-between items-center">
          <div>
            <p className="font-semibold text-sm">MiTienda</p>
            <p className="text-xs text-green-100">
              Normalmente responde en minutos
            </p>
          </div>
          <button onClick={() => setAbierto(false)} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 bg-slate-50">
          <div className="bg-white rounded-lg rounded-tl-none p-3 text-sm text-slate-700 shadow-sm mb-3">
            ¡Hola! 👋 ¿En qué te podemos ayudar?
          </div>

          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />

          <button
            onClick={enviar}
            className="w-full mt-2 bg-green-500 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-2"
          >
            <Send size={16} />
            Iniciar chat
          </button>
        </div>
      </div>

      {/* Botón flotante circular */}
      <button
        onClick={() => setAbierto(!abierto)}
        aria-label="Abrir chat de WhatsApp"
        className="bg-green-500 hover:bg-green-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.48 1.32 4.99L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.07h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.19-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.82 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.53-3.69 8.21-8.22 8.21zm4.51-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.47-.01a.9.9 0 0 0-.66.31c-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.48-.28z" />
        </svg>
      </button>
    </div>
  );
}
