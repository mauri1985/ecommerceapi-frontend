import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import MensajeError from "../components/MensajeError";
import FiltrosSidebar from "../components/FiltrosSidebar";
import OrdenPrecio from "../components/OrdenPrecio";
import BuscadorConSugerencias from "../components/BuscadorConSugerencias";
import CarruselImagenes from "../components/CarruselImagenes";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import BotonFavorito from "../components/BotonFavorito";
import TituloAnimado from "../components/TituloAnimado";
import DOMPurify from "dompurify";
import { useCarrito } from "../context/CarritoContext";
import { obtenerAtributosFiltrables } from "../data/filtrosPorCategoria";

const TAMANIO_PAGINA = 20;

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
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [orden, setOrden] = useState("");
  const { cargarCarrito } = useCarrito();
  const navigate = useNavigate();
  const atributosFiltrables = obtenerAtributosFiltrables(
    categoriasSeleccionadas,
    categorias
  );

  const { usuario, estaLogueado } = useAuth();
  const { abrir: abrirLogin } = useLoginModal();

  // el useEffect que resetea la página:
  useEffect(() => {
    setPagina(0);
  }, [
    categoriasSeleccionadas.join(","),
    busqueda,
    atributosSeleccionados.join(","),
    orden,
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
    orden,
  ]);

  useEffect(() => {
    api.get("/categorias").then((res) => setCategorias(res.data));
  }, []);

  useEffect(() => {
    setAtributosSeleccionados((prev) =>
      prev.filter((entrada) => {
        const clave = entrada.split(":")[0];
        return atributosFiltrables.includes(clave);
      })
    );
  }, [categoriasSeleccionadas.join(",")]);

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
    if (orden) params.orden = orden;

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
      cargarCarrito();
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
    setOrden("");
    setPagina(0);
    navigate("/catalogo"); // limpia también el ?q= de la búsqueda por texto
  }

  return (
    <div>
      <div className="max-w-350 mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <TituloAnimado className="text-2xl font-bold" timeout={300}>
            Catálogo
          </TituloAnimado>
        </div>

        {busqueda && (
          <p className="text-sm text-slate-500 mb-4">
            Resultados para: <span className="font-medium">"{busqueda}"</span>
          </p>
        )}

        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <div className="md:hidden">
              <div className="flex flex-1 max-w-lg pb-4 min-w-0">
                <BuscadorConSugerencias claseInput="w-full h-12 rounded-xl bg-white ring-2 ring-gray-400 placeholder-slate-600 pl-10 pr-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:text-black" />
              </div>
              <div>
                <OrdenPrecio orden={orden} onCambiarOrden={setOrden} />
              </div>
            </div>
            <div className="flex flex-1 md:hidden py-4 gap-2">
              <button
                className="flex flex-row h-12 gap-2 p-3 rounded-xl bg-blue-600 w-full justify-center shadow/50"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <p className="text-white">Mostrar filtros</p>
                <Filter className="text-white" />
              </button>
            </div>
            <div
              className={`grid md:grid-rows-[1fr]! md:opacity-100! transition-all duration-300 ease-in-out ${
                mostrarFiltros
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden min-h-0">
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
                  orden={orden}
                  onCambiarOrden={setOrden}
                  atributosFiltrables={atributosFiltrables}
                />
              </div>
            </div>
          </div>

          <div className="flex-1">
            {cargando ? (
              <p className="text-center mt-10">Cargando productos...</p>
            ) : error ? (
              <MensajeError error={error} onReintentar={cargarProductos} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {productos.map((producto) => (
                    <Link
                      to={`/productos/${producto.id}`}
                      key={producto.id}
                      className="border bg-white border-slate-300 shadow-md hover:shadow-xl rounded-2xl flex flex-col transition-all duration-300 ease-in-out hover:scale-105 hover:border-slate-400"
                    >
                      <div className="relative rounded-xl overflow-hidden border border-slate-300 m-3">
                        <CarruselImagenes
                          imagenes={producto.imagenes}
                          alt={producto.nombre}
                        />
                        {producto.porcentajeDescuento && (
                          <span className="absolute top-2 left-2 bg-green-600/85 text-white text-xs font-bold px-2 py-1 rounded z-10">
                            -{producto.porcentajeDescuento}%
                          </span>
                        )}
                        <div
                          className="absolute top-2 right-2 z-10"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <BotonFavorito productoId={producto.id} />
                        </div>
                      </div>

                      <div className="p-3">
                        <h2 className="font-semibold text-lg hover:text-blue-600 mt-3">
                          {producto.nombre}
                        </h2>
                        <p className="text-slate-500 text-sm mb-2">
                          {producto.categoriaNombre}
                        </p>
                        <div
                          className="prose prose-sm max-w-none text-slate-700 mb-3 flex-1 line-clamp-1 h-6"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(producto.descripcion),
                          }}
                        />
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            agregarAlCarrito(producto.id);
                          }}
                          disabled={
                            agregandoId === producto.id || producto.stock === 0
                          }
                          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-lg py-2 text-sm font-medium cursor-pointer"
                        >
                          {producto.stock === 0
                            ? "Sin stock"
                            : agregandoId === producto.id
                            ? "Agregando..."
                            : "Agregar al carrito"}
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>

                {productos.length === 0 && (
                  <div className="text-center mt-10">
                    <p className="text-slate-500 mb-3">
                      No hay productos que coincidan con los filtros.
                    </p>
                    <button
                      onClick={limpiarTodo}
                      className="text-blue-600 hover:underline text-sm cursor-pointer"
                    >
                      Limpiar filtros
                    </button>
                  </div>
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
