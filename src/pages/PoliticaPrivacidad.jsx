export default function PoliticaPrivacidad() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-slate-700">
      <h1 className="text-3xl font-bold mb-2">Política de privacidad</h1>
      <p className="text-sm text-slate-400 mb-10">
        Última actualización: {new Date().toLocaleDateString("es-UY")}
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          1. Qué datos recolectamos
        </h2>
        <p>Cuando te registrás y comprás en Mauri Shop, recolectamos:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Nombre y dirección de email</li>
          <li>Historial de pedidos y productos favoritos</li>
          <li>
            Información que compartís voluntariamente al contactarnos (teléfono,
            mensaje, etc.)
          </li>
        </ul>
        <p className="mt-2">
          No almacenamos datos de tarjetas de crédito o débito — esa información
          es procesada exclusivamente por Mercado Pago.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Cómo usamos tus datos</h2>
        <p>Utilizamos tu información para:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Procesar tus pedidos y coordinar envíos</li>
          <li>Enviarte confirmaciones de compra y actualizaciones de estado</li>
          <li>Responder tus consultas de contacto</li>
          <li>Mejorar la experiencia del sitio</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          3. Con quién compartimos tus datos
        </h2>
        <p>
          Compartimos información limitada con proveedores necesarios para
          operar el sitio: Mercado Pago (procesamiento de pagos), servicios de
          email transaccional (envío de confirmaciones), y servicios de
          alojamiento de imágenes. Ninguno de estos proveedores utiliza tus
          datos con fines propios de marketing.
        </p>
        <p className="mt-2">
          No vendemos ni compartimos tu información con terceros para fines
          publicitarios.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Inicio de sesión con Google
        </h2>
        <p>
          Si elegís registrarte con tu cuenta de Google, recibimos tu nombre y
          dirección de email a través de ese servicio, con tu autorización
          explícita en el momento de iniciar sesión.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Seguridad</h2>
        <p>
          Tu contraseña se almacena de forma encriptada y nunca en texto plano.
          Utilizamos conexiones seguras (HTTPS) para toda la comunicación entre
          tu navegador y nuestros servidores.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">6. Tus derechos</h2>
        <p>
          De acuerdo con la Ley N° 18.331 de Protección de Datos Personales de
          Uruguay, tenés derecho a acceder, rectificar o solicitar la
          eliminación de tus datos personales. Podés ejercer estos derechos
          escribiéndonos desde nuestra{" "}
          <a href="/contacto" className="text-blue-600 hover:underline">
            página de contacto
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          7. Cambios en esta política
        </h2>
        <p>
          Podemos actualizar esta Política de Privacidad ocasionalmente. Te
          recomendamos revisarla periódicamente.
        </p>
      </section>
    </div>
  );
}
