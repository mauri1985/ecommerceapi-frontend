export default function TerminosCondiciones() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold mb-2">Términos y condiciones</h1>
      <p className="text-sm text-slate-400 mb-10">
        Última actualización: {new Date().toLocaleDateString("es-UY")}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          1. Aceptación de los términos
        </h2>
        <p>
          Al acceder y utilizar el sitio Easy Shop, aceptás estos Términos y
          Condiciones en su totalidad. Si no estás de acuerdo con alguna parte,
          te pedimos que no utilices este sitio.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Productos y precios</h2>
        <p>
          Los precios publicados están expresados en pesos uruguayos e incluyen
          los impuestos correspondientes, salvo que se indique lo contrario. Nos
          reservamos el derecho de modificar precios y disponibilidad de
          productos sin previo aviso. Las imágenes de los productos son
          ilustrativas y pueden diferir levemente del producto real.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Cuentas de usuario</h2>
        <p>
          Para realizar una compra es necesario registrarse en el sitio. Sos
          responsable de mantener la confidencialidad de tu contraseña y de toda
          la actividad que ocurra bajo tu cuenta.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Proceso de compra y pago
        </h2>
        <p>
          Los pagos se procesan a través de Mercado Pago. Easy Shop no almacena
          ni tiene acceso a los datos de tu tarjeta en ningún momento. Una vez
          confirmado el pago, recibirás una notificación y podrás ver el estado
          de tu pedido en la sección "Mis pedidos".
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Envíos</h2>
        <p>
          Los tiempos y costos de envío se coordinan de forma personalizada
          luego de confirmada la compra. Para más información, consultá nuestra
          sección de{" "}
          <a
            href="/preguntas-frecuentes#envios"
            className="text-blue-600 hover:underline"
          >
            Preguntas frecuentes
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          6. Cambios y devoluciones
        </h2>
        <p>
          Si tenés algún problema con tu compra, contactanos dentro de los
          primeros días posteriores a la recepción del producto. Más detalles en
          nuestra sección de{" "}
          <a
            href="/preguntas-frecuentes#cambios"
            className="text-blue-600 hover:underline"
          >
            Preguntas frecuentes
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          7. Limitación de responsabilidad
        </h2>
        <p>
          Easy Shop no se responsabiliza por daños indirectos derivados del uso
          del sitio o de los productos adquiridos, más allá de lo establecido
          por la normativa vigente de defensa del consumidor.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">8. Modificaciones</h2>
        <p>
          Podemos actualizar estos Términos y Condiciones en cualquier momento.
          Te recomendamos revisarlos periódicamente.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">9. Contacto</h2>
        <p>
          Si tenés dudas sobre estos términos, podés escribirnos desde nuestra{" "}
          <a href="/contacto" className="text-blue-600 hover:underline">
            página de contacto
          </a>
          .
        </p>
      </section>
    </div>
  );
}
