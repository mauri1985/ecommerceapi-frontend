import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RutaProtegida from "./components/RutaProtegida";
import Catalogo from "./pages/Catalogo";
import Registro from "./pages/Registro";
import Carrito from "./pages/Carrito";
import Pedidos from "./pages/Pedidos";
import RutaAdmin from "./components/RutaAdmin";
import Footer from "./components/Footer";
import AdminProductos from "./pages/AdminProductos";
import DetalleProducto from "./pages/DetalleProducto";
import Portada from "./components/Portada";
import RecuperarPassword from "./pages/RecuperarPassword";
import Contacto from "./pages/Contacto";
import SobreNosotros from "./pages/SobreNosotros";
import Favoritos from "./pages/Favoritos";
import BotonWhatsApp from "./components/BotonWhatsApp";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Portada />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
        <Route
          path="/carrito"
          element={
            <RutaProtegida>
              <Carrito />
            </RutaProtegida>
          }
        />
        <Route
          path="/pedidos"
          element={
            <RutaProtegida>
              <Pedidos />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <RutaAdmin>
              <AdminProductos />
            </RutaAdmin>
          }
        />
        <Route
          path="/favoritos"
          element={
            <RutaProtegida>
              <Favoritos />
            </RutaProtegida>
          }
        />
      </Routes>
      <Footer />
      <BotonWhatsApp />
    </>
  );
}

export default App;
