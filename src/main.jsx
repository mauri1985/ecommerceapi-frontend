import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoritosProvider } from "./context/FavoritosContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { LoginModalProvider } from "./context/LoginModalContext.jsx";
import { CarritoProvider } from "./context/CarritoContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <FavoritosProvider>
            <CarritoProvider>
              <LoginModalProvider>
                <GoogleOAuthProvider
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                >
                  <App />
                </GoogleOAuthProvider>
              </LoginModalProvider>
            </CarritoProvider>
          </FavoritosProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
