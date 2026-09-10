import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";

export default function RestablecerPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const navigate = useNavigate();
  const token = searchParams.get("token");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Enlace inválido");
      return;
    }

    setCargando(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        nuevaPassword: password,
      });
      setExito(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.mensajes?.[0] || "No se pudo cambiar la contraseña"
      );
    } finally {
      setCargando(false);
    }
  }

  if (exito) {
    return (
      <div className="max-w-sm mx-auto mt-16 px-4 text-center">
        <p className="text-green-600 font-medium">
          ¡Contraseña actualizada! Redirigiendo...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Elegí tu nueva contraseña
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="border border-gray-400 rounded px-3 py-2 pr-10 w-full outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded py-2 font-medium"
        >
          {cargando ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}
