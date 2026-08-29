import { useState } from "react";
import { Phone, Mail, Clock, MapPin, MessageCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { INFO_CONTACTO } from "../data/InfoContacto";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    mensaje: "",
  });
  const [enviando, setEnviando] = useState(false);
  const { mostrarToast } = useToast();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);

    // Simulación de envío por ahora — más adelante se conecta a un endpoint real
    setTimeout(() => {
      mostrarToast("¡Mensaje enviado! Te vamos a responder a la brevedad.");
      setForm({ nombre: "", telefono: "", email: "", mensaje: "" });
      setEnviando(false);
    }, 800);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-slate-500 mb-10">
        ¿Tenés alguna consulta? Escribinos o comunicate por estos medios.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Datos de contacto */}
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <Phone size={20} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Teléfono</p>
              <a
                href={`tel:${INFO_CONTACTO.telefono}`}
                className="text-slate-600 hover:text-blue-600"
              >
                {INFO_CONTACTO.telefono}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageCircle
              size={20}
              className="text-green-600 mt-0.5 shrink-0"
            />
            <div>
              WhatsApp
              <a
                href={`https://wa.me/${INFO_CONTACTO.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-green-600"
              >
                <p className="font-medium">Enviar mensaje</p>
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail size={20} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Email</p>
              <a
                href={`mailto:${INFO_CONTACTO.email}`}
                className="text-slate-600 hover:text-blue-600"
              >
                {INFO_CONTACTO.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock size={20} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Horario</p>
              <p className="text-slate-600">{INFO_CONTACTO.horario}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Domicilio</p>
              <p className="text-slate-600">{INFO_CONTACTO.domicilio}</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border border-gray-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            required
            className="border border-gray-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-gray-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="mensaje"
            placeholder="Mensaje"
            value={form.mensaje}
            onChange={handleChange}
            required
            rows={5}
            className="border border-gray-400 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded py-2.5 font-medium"
          >
            {enviando ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}
