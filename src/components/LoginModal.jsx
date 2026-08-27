import { useEffect } from "react";
import { X } from "lucide-react";
import Login from "../pages/Login";

export default function LoginModal({ abierto, onClose }) {
  useEffect(() => {
    function manejarEsc(e) {
      if (e.key === "Escape") onClose();
    }
    if (abierto) document.addEventListener("keydown", manejarEsc);
    return () => document.removeEventListener("keydown", manejarEsc);
  }, [abierto, onClose]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <Login onClose={onClose} />
      </div>
    </div>
  );
}
