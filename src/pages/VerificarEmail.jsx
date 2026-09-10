import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function VerificarEmail() {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState("cargando"); // cargando | exito | error
  const [mensajeError, setMensajeError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setEstado("error");
      setMensajeError("Enlace inválido");
      return;
    }

    api
      .get("/auth/verificar-email", { params: { token } })
      .then(() => setEstado("exito"))
      .catch((err) => {
        setEstado("error");
        setMensajeError(
          err.response?.data?.mensajes?.[0] || "No se pudo verificar el email"
        );
      });
  }, []);

  return (
    <div className="max-w-sm mx-auto mt-16 px-4 text-center">
      {estado === "cargando" && (
        <p className="text-slate-500">Verificando tu email...</p>
      )}

      {estado === "exito" && (
        <>
          <p className="text-green-600 font-medium mb-4">
            ¡Tu email fue verificado con éxito!
          </p>
          <Link to="/" className="text-blue-600 hover:underline">
            Ir al catálogo
          </Link>
        </>
      )}

      {estado === "error" && (
        <>
          <p className="text-red-600 font-medium mb-4">{mensajeError}</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </>
      )}
    </div>
  );
}
