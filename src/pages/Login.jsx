import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function Login({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login, loginConGoogle } = useAuth();
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

  async function handleGoogleSuccess(credentialResponse) {
    setError("");
    setCargando(true);
    try {
      await loginConGoogle(credentialResponse.credential);
      if (onClose) onClose();
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.mensajes?.[0] ||
          "Error al iniciar sesión con Google"
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="relative flex flex-col text-gray-600 gap-3">
      {cargando && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-xl">
          <Loader2 size={32} className="animate-spin text-blue-600" />
        </div>
      )}
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
          disabled={cargando}
          className="border border-slate-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
        />

        <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-slate-400 rounded px-3 py-2 pr-10 w-full outline-none focus:ring-2 focus:ring-blue-500"
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
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded py-2 font-medium cursor-pointer flex items-center justify-center gap-2"
        >
          {cargando ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 border-t"></div>
        <span className="text-xs text-slate-400">O</span>
        <div className="flex-1 border-t"></div>
      </div>

      <div
        className={`flex justify-center ${
          cargando ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Error al iniciar sesión con Google")}
          text="continue_with"
          locale="es"
        />
      </div>

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
