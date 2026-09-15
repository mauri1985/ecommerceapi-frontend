import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

function Pregunta({ pregunta, respuesta }) {
  const [abierta, setAbierta] = useState(false);

  return (
    <div className="border-b py-3">
      <button
        onClick={() => setAbierta(!abierta)}
        className="w-full flex justify-between items-center text-left font-medium"
      >
        {pregunta}
        <ChevronDown
          size={18}
          className={`transition-transform shrink-0 ml-2 ${
            abierta ? "rotate-180" : ""
          }`}
        />
      </button>
      {abierta && <p className="text-slate-600 text-sm mt-2">{respuesta}</p>}
    </div>
  );
}

export default function PreguntasFrecuentes() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          100
        );
      }
    }
  }, [location]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10">Preguntas frecuentes</h1>

      <section id="general" className="mb-12">
        <h2 className="text-xl font-semibold mb-4">General</h2>
        <Pregunta
          pregunta="¿Cómo hago un pedido?"
          respuesta="Agregá los productos que quieras al carrito y seguí los pasos del checkout. Vas a poder pagar con tarjeta a través de Mercado Pago."
        />
        <Pregunta
          pregunta="¿Necesito crear una cuenta para comprar?"
          respuesta="Sí, necesitás registrarte o iniciar sesión con Google para poder agregar productos al carrito y hacer un pedido."
        />
      </section>

      <section id="envios" className="mb-12 scroll-mt-20">
        <h2 className="text-xl font-semibold mb-4">Envíos y entregas</h2>
        <Pregunta
          pregunta="¿Cuánto tarda en llegar mi pedido?"
          respuesta="Los tiempos de entrega dependen de tu ubicación. Te contactamos por WhatsApp o email para coordinar los detalles apenas confirmamos tu pago."
        />
        <Pregunta
          pregunta="¿Hacen envíos a todo el país?"
          respuesta="Consultanos por WhatsApp la disponibilidad de envío a tu zona."
        />
      </section>

      <section id="cambios" className="mb-12 scroll-mt-20">
        <h2 className="text-xl font-semibold mb-4">Cambios y devoluciones</h2>
        <Pregunta
          pregunta="¿Puedo devolver un producto?"
          respuesta="Sí, contactanos dentro de los primeros días luego de recibir tu compra si el producto tiene algún problema o no era lo que esperabas."
        />
        <Pregunta
          pregunta="¿Cómo hago un cambio?"
          respuesta="Escribinos por WhatsApp o email contándonos el motivo del cambio y coordinamos los siguientes pasos."
        />
      </section>
    </div>
  );
}
