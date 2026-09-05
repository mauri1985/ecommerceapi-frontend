import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import MensajeError from "../components/MensajeError";
import FiltrosSidebar from "../components/FiltrosSidebar";
import CarruselImagenes from "../components/CarruselImagenes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import BotonFavorito from "../components/BotonFavorito";

const TAMANIO_PAGINA = 20;
const TALLES_DISPONIBLES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORES_DISPONIBLES = [
  "Blanco",
  "Negro",
  "Azul",
  "Rojo",
  "Verde",
  "Gris",
];

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [agregandoId, setAgregandoId] = useState(null);
  const [searchParams] = useSearchParams();
  const busqueda = searchParams.get("q") || "";
  const { mostrarToast } = useToast();
  const [precioMinInput, setPrecioMinInput] = useState("");
  const [precioMaxInput, setPrecioMaxInput] = useState("");
  const [precioMinAplicado, setPrecioMinAplicado] = useState("");
  const [precioMaxAplicado, setPrecioMaxAplicado] = useState("");
  const [atributosSeleccionados, setAtributosSeleccionados] = useState([]);

  const { usuario, estaLogueado } = useAuth();
  const { abrir: abrirLogin } = useLoginModal();

  // el useEffect que resetea la página:
  useEffect(() => {
    setPagina(0);
  }, [
    categoriasSeleccionadas.join(","),
    busqueda,
    atributosSeleccionados.join(","),
  ]);

  // el useEffect que carga productos:
  useEffect(() => {
    cargarProductos();
  }, [
    categoriasSeleccionadas.join(","),
    pagina,
    busqueda,
    precioMinAplicado,
    precioMaxAplicado,
    atributosSeleccionados.join(","),
  ]);

  useEffect(() => {
    api.get("/categorias").then((res) => setCategorias(res.data));
  }, []);

  function cargarProductos() {
    setCargando(true);
    setError(null);

    const params = { page: pagina, size: TAMANIO_PAGINA };
    if (categoriasSeleccionadas.length > 0)
      params.categoriaIds = categoriasSeleccionadas;
    if (busqueda) params.q = busqueda;
    if (precioMinAplicado) params.precioMin = precioMinAplicado;
    if (precioMaxAplicado) params.precioMax = precioMaxAplicado;
    if (atributosSeleccionados.length > 0)
      params.atributos = atributosSeleccionados;

    api
      .get("/productos", { params })
      .then((res) => {
        setProductos(res.data.contenido);
        setTotalPaginas(res.data.totalPaginas);
      })
      .catch((err) => setError(err))
      .finally(() => setCargando(false));
  }

  async function agregarAlCarrito(productoId) {
    if (!estaLogueado) {
      abrirLogin();
      return;
    }

    setAgregandoId(productoId);

    try {
      await api.post("/carrito", {
        usuarioId: usuario.id,
        productoId,
        cantidad: 1,
      });
      mostrarToast("¡Producto agregado al carrito!");
    } catch (err) {
      setError(err);
    } finally {
      setAgregandoId(null);
    }
  }

  function aplicarPrecio() {
    setPrecioMinAplicado(precioMinInput);
    setPrecioMaxAplicado(precioMaxInput);
    setPagina(0);
  }

  function toggleCategoria(id) {
    setCategoriasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function limpiarTodo() {
    setCategoriasSeleccionadas([]);
    setPrecioMinInput("");
    setPrecioMaxInput("");
    setPrecioMinAplicado("");
    setPrecioMaxAplicado("");
    setAtributosSeleccionados([]);
    setPagina(0);
  }

  return (
    <div>
      <div className="max-w-350 mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Catálogo</h1>
        </div>

        {busqueda && (
          <p className="text-sm text-slate-500 mb-4">
            Resultados para: <span className="font-medium">"{busqueda}"</span>
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <FiltrosSidebar
            categorias={categorias}
            categoriasSeleccionadas={categoriasSeleccionadas}
            onToggleCategoria={toggleCategoria}
            onLimpiarCategorias={() => setCategoriasSeleccionadas([])}
            precioMin={precioMinInput}
            precioMax={precioMaxInput}
            onCambiarPrecioMin={setPrecioMinInput}
            onCambiarPrecioMax={setPrecioMaxInput}
            onAplicarPrecio={aplicarPrecio}
            onLimpiarTodo={limpiarTodo}
            atributosSeleccionados={atributosSeleccionados}
            onCambiarAtributos={setAtributosSeleccionados}
          />

          <div className="flex-1">
            {cargando ? (
              <p className="text-center mt-10">Cargando productos...</p>
            ) : error ? (
              <MensajeError error={error} onReintentar={cargarProductos} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {productos.map((producto) => (
                    <div
                      key={producto.id}
                      className="border border-gray-400 shadow-md hover:shadow-xl rounded-lg flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:border-gray-500"
                    >
                      <div className="relative rounded-t-lg overflow-hidden">
                        <CarruselImagenes
                          imagenes={producto.imagenes}
                          alt={producto.nombre}
                        />
                        {producto.porcentajeDescuento && (
                          <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                            -{producto.porcentajeDescuento}%
                          </span>
                        )}
                        <div className="absolute top-2 right-2 z-10">
                          <BotonFavorito productoId={producto.id} />
                        </div>
                      </div>

                      <div className="p-2">
                        <Link to={`/productos/${producto.id}`} className="mt-3">
                          <h2 className="font-semibold text-lg hover:text-blue-600">
                            {producto.nombre}
                          </h2>
                        </Link>
                        <p className="text-slate-500 text-sm mb-2">
                          {producto.categoriaNombre}
                        </p>
                        <p className="text-slate-700 mb-3 flex-1 line-clamp-3">
                          {producto.descripcion}
                        </p>
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            {producto.porcentajeDescuento ? (
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-green-600">
                                  ${producto.precioOferta}
                                </span>
                                <span className="text-sm text-slate-400 line-through">
                                  ${producto.precio}
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-lg">
                                ${producto.precio}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-slate-400">
                            Stock: {producto.stock}
                          </span>
                        </div>
                        <button
                          onClick={() => agregarAlCarrito(producto.id)}
                          disabled={
                            agregandoId === producto.id || producto.stock === 0
                          }
                          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded py-2 text-sm font-medium"
                        >
                          {producto.stock === 0
                            ? "Sin stock"
                            : agregandoId === producto.id
                            ? "Agregando..."
                            : "Agregar al carrito"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {productos.length === 0 && (
                  <p className="text-center text-slate-500 mt-10">
                    No hay productos que coincidan con los filtros.
                  </p>
                )}

                {totalPaginas > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      onClick={() => setPagina((p) => Math.max(0, p - 1))}
                      disabled={pagina === 0}
                      className="p-2 border rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <span className="text-sm text-slate-600">
                      Página {pagina + 1} de {totalPaginas}
                    </span>

                    <button
                      onClick={() =>
                        setPagina((p) => Math.min(totalPaginas - 1, p + 1))
                      }
                      disabled={pagina === totalPaginas - 1}
                      className="p-2 border rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
