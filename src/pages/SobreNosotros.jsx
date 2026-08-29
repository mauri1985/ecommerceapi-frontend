import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { INFO_CONTACTO } from "../data/InfoContacto";

export default function SobreNosotros() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Sobre nosotros</h1>
      <p className="text-slate-500 mb-10 max-w-2xl">
        Contale al mundo un poco sobre tu tienda acá: cuándo empezaste, qué te
        apasiona de lo que vendés, y por qué alguien debería elegirte a vos.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-xl font-semibold mb-4">Encontranos acá</h2>

          <div className="rounded-lg overflow-hidden border">
            <iframe
              title="Ubicación"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                INFO_CONTACTO.domicilio
              )}&output=embed`}
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <MapPin size={20} className="text-blue-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Domicilio</p>
              <p className="text-slate-600">{INFO_CONTACTO.domicilio}</p>
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
        </div>
      </div>
    </div>
  );
}
