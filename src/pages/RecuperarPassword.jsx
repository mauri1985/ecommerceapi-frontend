import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCargando(true);
    try {
      await api.post("/auth/solicitar-reset", { email });
    } finally {
      setCargando(false);
      setEnviado(true); // mostramos éxito siempre, exista o no el email (por seguridad)
    }
  }

  if (enviado) {
    return (
      <div className="max-w-sm mx-auto mt-16 px-4 text-center min-h-60">
        <p className="text-slate-700">
          Si el email existe en nuestro sistema, te enviamos un enlace para
          restablecer tu contraseña.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Recuperar contraseña
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-slate-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded py-2 font-medium"
        >
          {cargando ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      <p className="text-sm text-center text-slate-500 mt-4">
        <Link to="/" className="text-blue-600 hover:underline">
          Volver al inicio
        </Link>
      </p>
    </div>
  );
}
