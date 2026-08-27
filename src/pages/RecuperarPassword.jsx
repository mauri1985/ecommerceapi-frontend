import { Link } from "react-router-dom";

export default function RecuperarPassword() {
  return (
    <div className="max-w-sm mx-auto mt-16 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Recuperar contraseña</h1>
      <p className="text-slate-600 mb-6">
        Esta función todavía no está disponible. Muy pronto vas a poder
        recuperar tu contraseña por email.
      </p>
      <Link to="/" className="text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
