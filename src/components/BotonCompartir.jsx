import { useState } from "react";
import { Share2 } from "lucide-react";
import ModalCompartir from "./ModalCompartir";

export default function BotonCompartir({ titulo, texto, size = 20 }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  function abrir(e) {
    e.preventDefault();
    e.stopPropagation();
    setModalAbierto(true);
  }

  return (
    <>
      <button
        onClick={abrir}
        aria-label="Compartir"
        className="bg-white/80 hover:bg-white rounded-full p-1.5 shadow"
      >
        <Share2 size={size} className="text-slate-600" />
      </button>

      <ModalCompartir
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        url={window.location.href}
        titulo={titulo}
        texto={texto}
      />
    </>
  );
}
