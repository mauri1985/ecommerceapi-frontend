import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useLoginModal } from "../context/LoginModalContext";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import TituloAnimado from "../components/TituloAnimado";
import { UserRoundPlus } from "lucide-react";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const { loginConGoogle } = useAuth();

  const { abrir: abrirLogin } = useLoginModal();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores([]);

    if (password !== confirmarPassword) {
      setErrores(["Las contraseñas no coinciden"]);
      return;
    }

    setCargando(true);

    try {
      await api.post("/usuarios", { nombre, apellido, email, password });
      setExito(true);
      setTimeout(() => abrirLogin(), 1500);
    } catch (err) {
      const mensajes = err.response?.data?.mensajes || ["Error al registrarse"];
      setErrores(mensajes);
    } finally {
      setCargando(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    setErrores([]);
    try {
      await loginConGoogle(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      setErrores([
        err.response?.data?.mensajes?.[0] ||
          "Error al iniciar sesión con Google",
      ]);
    }
  }

  if (exito) {
    return (
      <div className="max-w-sm mx-auto mt-16 px-4 text-center min-h-70">
        <p className="text-green-600 font-medium">
          ¡Cuenta creada con éxito! Iniciá sesión para continuar.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-16 px-4 min-h-svh">
      <TituloAnimado
        className="flex items-center h-15 text-2xl font-bold pb-6"
        timeout={400}
      >
        <div className="flex flex-row gap-3 items-center">
          <div>Registrarse</div>
          <div>
            <UserRoundPlus size={25} />
          </div>
        </div>
      </TituloAnimado>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border border-slate-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Apellido"
          value={apelldio}
          onChange={(e) => setApellido(e.target.value)}
          required
          className="border border-slate-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-slate-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-slate-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          required
          className="border border-slate-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {errores.length > 0 && (
          <ul className="text-red-600 text-sm list-disc list-inside">
            {errores.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded py-2 font-medium"
        >
          {cargando ? "Creando cuenta..." : "Registrarse"}
        </button>

        <p className="text-sm text-center text-slate-500">
          ¿Ya tenés cuenta?{" "}
          <button
            type="button"
            onClick={abrirLogin}
            className="text-blue-600 hover:underline"
          >
            Iniciá sesión
          </button>
        </p>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 border-t border-slate-400"></div>
        <span className="text-xs text-slate-400">O</span>
        <div className="flex-1 border-t border-slate-400"></div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Error al iniciar sesión con Google")}
          text="continue_with"
          locale="es"
        />
      </div>
    </div>
  );
}
