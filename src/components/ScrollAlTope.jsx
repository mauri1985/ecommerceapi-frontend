import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const posicionesGuardadas = new Map();

export default function ScrollAlTope() {
  const location = useLocation();
  const navigationType = useNavigationType(); // "PUSH", "POP", "REPLACE"
  const claveAnterior = useRef(null);

  useEffect(() => {
    // Guardamos la posición de scroll de la página que estamos dejando
    if (claveAnterior.current) {
      posicionesGuardadas.set(claveAnterior.current, window.scrollY);
    }

    if (navigationType === "POP") {
      // Volver atrás/adelante: restauramos la posición guardada, si existe
      const posicion = posicionesGuardadas.get(location.key);
      window.scrollTo(0, posicion ?? 0);
    } else {
      // Navegación nueva (click en un link): siempre al tope
      window.scrollTo(0, 0);
    }

    claveAnterior.current = location.key;
  }, [location, navigationType]);

  return null;
}
