import { createContext, useContext, useState } from "react";

const LoginModalContext = createContext(null);

export function LoginModalProvider({ children }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <LoginModalContext.Provider
      value={{
        abierto,
        abrir: () => setAbierto(true),
        cerrar: () => setAbierto(false),
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  return useContext(LoginModalContext);
}
