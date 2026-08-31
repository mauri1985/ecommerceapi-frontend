import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import { useEffect } from "react";

export default function RutaAdmin({ children }) {
  const { estaLogueado, esAdmin } = useAuth();
  const { abrir } = useLoginModal();

  useEffect(() => {
    if (!estaLogueado) abrir();
  }, [estaLogueado, abrir]);

  if (!esAdmin) return <Navigate to="/" replace />;

  return children;
}
