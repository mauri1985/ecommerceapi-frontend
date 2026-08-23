import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const mostrarToast = useCallback((mensaje, tipo = "exito") => {
    setToast({ mensaje, tipo });
    setTimeout(() => setToast(null), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}

      {toast && (
        <div
          className={`fixed top-25 left-1/2 -translate-x-1/2 z-50 text-white text-center py-2 px-6 border-2 rounded-xl font-bold shadow-lg opacity-90 ${
            toast.tipo === "error"
              ? "bg-red-500 border-red-600 "
              : "bg-green-500 border-green-600"
          }`}
        >
          {toast.mensaje}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
