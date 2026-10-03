import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../api/axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function MiCuenta() {
  const { usuario } = useAuth();
  const { mostrarToast } = useToast();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccionCalle: "",
    ciudad: "",
  });
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [erroresPerfil, setErroresPerfil] = useState([]);

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPasswordNueva, setConfirmarPasswordNueva] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [erroresPassword, setErroresPassword] = useState([]);

  useEffect(() => {
    if (!usuario) return;
    api.get(`/usuarios/${usuario.id}`).then((res) => {
      setForm({
        nombre: res.data.nombre || "",
        apellido: res.data.apellido || "",
        telefono: res.data.telefono || "",
        direccionCalle: res.data.direccionCalle || "",
        ciudad: res.data.ciudad || "",
      });
      setCargandoPerfil(false);
    });
  }, [usuario]);

  async function handleSubmitPerfil(e) {
    e.preventDefault();
    setErroresPerfil([]);
    setGuardandoPerfil(true);
    try {
      await api.put(`/usuarios/${usuario.id}/perfil`, form);
      mostrarToast("Datos actualizados");
    } catch (err) {
      setErroresPerfil(err.response?.data?.mensajes || ["Error al guardar"]);
    } finally {
      setGuardandoPerfil(false);
    }
  }

  async function handleSubmitPassword(e) {
    e.preventDefault();
    setErroresPassword([]);

    if (passwordNueva !== confirmarPasswordNueva) {
      setErroresPassword(["Las contraseñas no coinciden"]);
      return;
    }

    setGuardandoPassword(true);
    try {
      await api.put(`/usuarios/${usuario.id}/cambiar-password`, {
        passwordActual,
        passwordNueva,
      });
      mostrarToast("Contraseña actualizada");
      setPasswordActual("");
      setPasswordNueva("");
      setConfirmarPasswordNueva("");
    } catch (err) {
      setErroresPassword([
        err.response?.data?.mensajes?.[0] || "Error al cambiar la contraseña",
      ]);
    } finally {
      setGuardandoPassword(false);
    }
  }

  if (cargandoPerfil) {
    return <p className="text-center mt-10">Cargando tu cuenta...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Mi cuenta</h1>

      <form
        onSubmit={handleSubmitPerfil}
        className="border border-slate-300 rounded-lg p-5 bg-white flex flex-col gap-3"
      >
        <h2 className="font-semibold text-lg mb-1">Mis datos</h2>

        <div>
          <label className="text-sm text-slate-500">Email</label>
          <input
            type="email"
            value={usuario.email}
            disabled
            className="w-full border border-slate-300 bg-slate-100 text-slate-500 rounded px-3 py-2 mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            className="border border-slate-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            className="border border-slate-300 rounded px-3 py-2"
          />
        </div>

        <input
          type="tel"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          className="border border-slate-300 rounded px-3 py-2"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Calle y número"
            value={form.direccionCalle}
            onChange={(e) =>
              setForm({ ...form, direccionCalle: e.target.value })
            }
            className="border border-slate-300 rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
            className="border border-slate-300 rounded px-3 py-2"
          />
        </div>

        {erroresPerfil.length > 0 && (
          <ul className="text-red-600 text-sm list-disc list-inside">
            {erroresPerfil.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={guardandoPerfil}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded py-2 font-medium flex items-center justify-center gap-2"
        >
          {guardandoPerfil && <Loader2 size={18} className="animate-spin" />}
          {guardandoPerfil ? "Guardando..." : "Guardar datos"}
        </button>
      </form>

      <form
        onSubmit={handleSubmitPassword}
        className="border border-slate-300 rounded-lg p-5 bg-white flex flex-col gap-3"
      >
        <h2 className="font-semibold text-lg mb-1">Cambiar contraseña</h2>

        <input
          type={mostrarPassword ? "text" : "password"}
          placeholder="Contraseña actual"
          value={passwordActual}
          onChange={(e) => setPasswordActual(e.target.value)}
          required
          className="border border-slate-300 rounded px-3 py-2"
        />

        <div className="relative">
          <input
            type={mostrarPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            required
            minLength={6}
            className="border border-slate-300 rounded px-3 py-2 pr-10 w-full"
          />
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <input
          type={mostrarPassword ? "text" : "password"}
          placeholder="Confirmar nueva contraseña"
          value={confirmarPasswordNueva}
          onChange={(e) => setConfirmarPasswordNueva(e.target.value)}
          required
          className="border border-slate-300 rounded px-3 py-2"
        />

        {erroresPassword.length > 0 && (
          <ul className="text-red-600 text-sm list-disc list-inside">
            {erroresPassword.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={guardandoPassword}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded py-2 font-medium flex items-center justify-center gap-2"
        >
          {guardandoPassword && <Loader2 size={18} className="animate-spin" />}
          {guardandoPassword ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </form>
    </div>
  );
}
