import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { X, Eye, EyeOff } from "lucide-react";

export default function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Precargar el email guardado, si el usuario había marcado "recordar" antes
  useEffect(() => {
    const emailGuardado = localStorage.getItem("emailRecordado");
    if (emailGuardado) {
      setEmail(emailGuardado);
      setRecordar(true);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await login(email, password);

      if (recordar) {
        localStorage.setItem("emailRecordado", email);
      } else {
        localStorage.removeItem("emailRecordado");
      }

      if (onClose) onClose();
      navigate("/");
    } catch (err) {
      const mensaje =
        err.response?.data?.mensajes?.[0] || "Error al iniciar sesión";
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex flex-col text-gray-600 gap-3">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={22} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-gray-400 rounded px-3 py-2 pr-10 w-full outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label={
              mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="chk-recordar"
            checked={recordar}
            onChange={(e) => setRecordar(e.target.checked)}
          />
          <label htmlFor="chk-recordar" className="text-sm">
            Recordar mi email
          </label>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded py-2 font-medium cursor-pointer"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <div className="flex justify-between items-center text-sm">
        <Link
          to="/recuperar-password"
          onClick={onClose}
          className="hover:underline text-slate-600"
        >
          Olvidé mi contraseña
        </Link>
        <Link
          to="/registro"
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-white"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
