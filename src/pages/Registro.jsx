import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores([]);
    setCargando(true);

    try {
      await api.post("/usuarios", { nombre, email, password });
      setExito(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const mensajes = err.response?.data?.mensajes || ["Error al registrarse"];
      setErrores(mensajes);
    } finally {
      setCargando(false);
    }
  }

  if (exito) {
    return (
      <div className="max-w-sm mx-auto mt-16 px-4 text-center">
        <p className="text-green-600 font-medium">
          ¡Cuenta creada con éxito! Redirigiendo al login...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
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
          <Link to="/login" className="text-blue-600 hover:underline">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
