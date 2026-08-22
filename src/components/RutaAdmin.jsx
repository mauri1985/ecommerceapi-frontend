import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RutaAdmin({ children }) {
  const { estaLogueado, esAdmin } = useAuth();

  if (!estaLogueado) return <Navigate to="/login" replace />;
  if (!esAdmin) return <Navigate to="/" replace />;

  return children;
}
