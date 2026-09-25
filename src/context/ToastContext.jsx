import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const mostrarToast = useCallback((mensaje, tipo = "exito") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ mensaje, tipo });
    timerRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const cerrarToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}

      {toast && (
        <div
          className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 text-white text-center py-2 md:py-4 pl-6 md:pl-10 pr-3 md:pr-6 border-2 rounded-xl font-bold shadow-lg flex items-center gap-3 ${
            toast.tipo === "error"
              ? "bg-red-500 border-red-600"
              : "bg-green-500 border-green-600"
          }`}
        >
          <span>{toast.mensaje}</span>
          <button
            onClick={cerrarToast}
            aria-label="Cerrar"
            className="hover:opacity-70 shrink-0 font-bold"
          >
            <X size={22} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
