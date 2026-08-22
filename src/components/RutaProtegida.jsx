import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaProtegida({ children }) {
  const { estaLogueado } = useAuth();

  if (!estaLogueado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
