import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoritosProvider } from "./context/FavoritosContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { LoginModalProvider } from "./context/LoginModalContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <FavoritosProvider>
            <LoginModalProvider>
              <App />
            </LoginModalProvider>
          </FavoritosProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);
