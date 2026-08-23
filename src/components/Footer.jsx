export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-3">MiTienda</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Sobre nosotros
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Términos y condiciones
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Política de privacidad
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Ayuda</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Preguntas frecuentes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Envíos y entregas
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Cambios y devoluciones
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Cuenta</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Iniciar sesión
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Mis pedidos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Seguinos</h3>
          <div className="flex gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-white  transition-all duration-300 ease-in-out hover:scale-120"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-white transition-all duration-300 ease-in-out hover:scale-120"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43-.26.66-.6 1.21-1.15 1.76-.5.5-1.1.9-1.76 1.15-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47-.66-.26-1.21-.6-1.76-1.15-.5-.5-.9-1.1-1.15-1.76-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76.5-.5 1.1-.9 1.76-1.15.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.4-8.4a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="hover:text-white transition-all duration-300 ease-in-out hover:scale-120"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} MiTienda. Todos los derechos reservados. /
        Desarrollador: Mauricio Hernandez
      </div>
    </footer>
  );
}
