import { useEffect, useState } from "react";
import api from "../api/axios";
import ModalConfirmacion from "../components/ModalConfirmacion";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";
import SubidaImagen from "../components/SubidaImagen";
import EditorDescripcion from "../components/EditorDescripcion";
import { obtenerCamposDeCategoria } from "../data/camposPorCategoria";
import { Settings } from "lucide-react";
import TituloAnimado from "../components/TituloAnimado";
import CheckboxPersonalizado from "../components/CheckboxPersonalizado";
import CategoriasArbol from "../components/CategoriasArbol";

const vacio = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoriaId: "",
  atributos: {},
  destacado: false,
  precioOferta: "",
};

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const { mostrarToast } = useToast();
  const [imagenesProducto, setImagenesProducto] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  useEffect(() => {
    cargarProductos();
    api.get("/categorias").then((res) => setCategorias(res.data));
  }, []);

  function cargarProductos() {
    api
      .get("/productos", { params: { size: 1000 } })
      .then((res) => setProductos(res.data.contenido));
  }

  async function confirmarEliminacion() {
    const id = productoAEliminar.id;
    setProductoAEliminar(null);
    await api.delete(`/productos/${id}`);
    mostrarToast("¡Producto eliminado con exito!");
    cargarProductos();
  }

  function editar(producto) {
    setEditandoId(producto.id);
    setImagenesProducto(producto.imagenesCompletas || []);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      stock: producto.stock,
      precioOferta: producto.precioOferta || "",
      categoriaId:
        categorias.find((c) => c.nombre === producto.categoriaNombre)?.id || "",
      atributos: producto.atributos || {},
      destacado: producto.destacado || false,
    });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setImagenesProducto([]);
    setForm(vacio);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores([]);
    setGuardando(true);

    const body = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      categoriaId: parseInt(form.categoriaId),
      atributos: form.atributos,
      destacado: form.destacado,
      precioOferta: form.precioOferta ? parseFloat(form.precioOferta) : null,
    };

    try {
      if (editandoId) {
        await api.put(`/productos/${editandoId}`, body);
      } else {
        const { data } = await api.post("/productos", body);
        setEditandoId(data.id); // así el usuario puede subir imágenes al producto recién creado, sin cerrar el formulario
        setImagenesProducto([]);
        cargarProductos();
        return; // no reseteamos el form todavía, para que pueda subir imágenes
      }
      cancelarEdicion();
      cargarProductos();
    } catch (err) {
      setErrores(
        err.response?.data?.mensajes || ["Error al guardar el producto"]
      );
    } finally {
      setGuardando(false);
    }
  }

  function cambiarAtributo(clave, valor) {
    setForm((prev) => ({
      ...prev,
      atributos: { ...prev.atributos, [clave]: valor },
    }));
  }

  function cambiarCategoria(categoriaId) {
    setForm((prev) => ({ ...prev, categoriaId, atributos: {} }));
  }

  const productosFiltrados = categoriaFiltro
    ? productos.filter(
        (p) =>
          p.categoriaNombre ===
          categorias.find((c) => c.id === Number(categoriaFiltro))?.nombre
      )
    : productos;

  async function toggleDestacado(producto) {
    try {
      await api.put(`/productos/${producto.id}`, {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoriaId: categorias.find(
          (c) => c.nombre === producto.categoriaNombre
        )?.id,
        atributos: producto.atributos || {},
        destacado: !producto.destacado,
        precioOferta: producto.precioOferta || null,
      });
      mostrarToast(
        !producto.destacado ? "Producto destacado" : "Producto ya no destacado"
      );
      cargarProductos();
    } catch {
      mostrarToast("No se pudo actualizar", "error");
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-svh">
      <TituloAnimado
        className="flex items-center h-15 text-2xl font-bold pb-6"
        timeout={400}
      >
        <div className="flex flex-row gap-3 items-center">
          <div>Administrar productos</div>
          <div>
            <Settings size={25} />
          </div>
        </div>
      </TituloAnimado>

      <form
        onSubmit={handleSubmit}
        className="border border-slate-300 rounded-lg p-5 mb-8 flex flex-col gap-3 bg-white"
      >
        <h2 className="font-semibold">
          {editandoId && (
            <SubidaImagen
              productoId={editandoId}
              imagenes={imagenesProducto}
              onImagenSubida={(img) =>
                setImagenesProducto([...imagenesProducto, img])
              }
              onImagenEliminada={(id) =>
                setImagenesProducto(imagenesProducto.filter((i) => i.id !== id))
              }
              onPortadaCambiada={() => {
                api
                  .get(`/productos/${editandoId}`)
                  .then((res) =>
                    setImagenesProducto(res.data.imagenesCompletas)
                  );
              }}
            />
          )}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            className="border border-slate-300  rounded px-3 py-2"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            required
            className="border border-slate-300  rounded px-3 py-2"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio de oferta (opcional)"
            value={form.precioOferta}
            onChange={(e) => setForm({ ...form, precioOferta: e.target.value })}
            className="border border-slate-300 rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
            className="border border-slate-300 rounded px-3 py-2"
          />
          <div>
            <div className="border border-slate-300 rounded px-3 py-2 max-h-56 overflow-y-auto">
              <p className="font-semibold text-slate-600 mb-2">Categoría</p>
              <CategoriasArbol
                categorias={categorias}
                seleccionUnica
                categoriaSeleccionadaUnica={
                  form.categoriaId ? Number(form.categoriaId) : null
                }
                onSeleccionarUnica={(id) => cambiarCategoria(id)}
              />
            </div>
          </div>
        </div>

        <EditorDescripcion
          value={form.descripcion}
          onChange={(html) => setForm({ ...form, descripcion: html })}
        />

        {form.categoriaId &&
          obtenerCamposDeCategoria(form.categoriaId, categorias).length > 0 && (
            <div className="grid md:grid-cols-2 gap-3">
              {obtenerCamposDeCategoria(form.categoriaId, categorias).map(
                (campo) =>
                  campo.opciones ? (
                    <select
                      key={campo.clave}
                      value={form.atributos[campo.clave] || ""}
                      onChange={(e) =>
                        cambiarAtributo(campo.clave, e.target.value)
                      }
                      className="border border-slate-300  rounded px-3 py-2"
                    >
                      <option value="">{campo.etiqueta}</option>
                      {campo.opciones.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      key={campo.clave}
                      type="text"
                      placeholder={campo.etiqueta}
                      value={form.atributos[campo.clave] || ""}
                      onChange={(e) =>
                        cambiarAtributo(campo.clave, e.target.value)
                      }
                      className="border border-slate-300 rounded px-3 py-2"
                    />
                  )
              )}
            </div>
          )}
        <CheckboxPersonalizado
          checked={form.destacado}
          onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
          label="Destacado"
        />

        {errores.length > 0 && (
          <ul className="text-red-600 text-sm list-disc list-inside">
            {errores.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={guardando}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2 rounded font-medium flex items-center gap-1.5"
          >
            {editandoId ? (
              <>
                <Pencil size={16} />
                {guardando ? "Guardando..." : "Actualizar"}
              </>
            ) : (
              <>
                <Plus size={16} />
                {guardando ? "Guardando..." : "Crear producto"}
              </>
            )}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="border border-slate-300 px-5 py-2 rounded font-medium"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex items-center border border-slate-300 mb-3 p-5 bg-white rounded-lg">
        <div className="flex justify-between items-start mb-3 gap-4">
          <div className="w-full">
            <h2 className="font-semibold text-lg mb-2">
              Buscar por categoría ({productosFiltrados.length})
            </h2>
            {categoriaFiltro && (
              <button
                onClick={() => setCategoriaFiltro("")}
                className="text-xs text-blue-600 hover:underline mb-2"
              >
                Ver todas las categorías
              </button>
            )}
            <CategoriasArbol
              categorias={categorias}
              seleccionUnica
              categoriaSeleccionadaUnica={
                categoriaFiltro ? Number(categoriaFiltro) : null
              }
              onSeleccionarUnica={(id) => setCategoriaFiltro(id)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            className="flex items-center gap-4 border border-slate-300 rounded-lg p-3 bg-white"
          >
            <img
              src={producto.imagenes?.[0] || ""}
              alt={producto.nombre}
              className="w-16 h-16 object-contain bg-slate-50 rounded border border-slate-200 shrink-0"
              onError={(e) => (e.target.style.visibility = "hidden")}
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{producto.nombre}</p>
              <p className="text-sm text-slate-500">
                {producto.categoriaNombre} · Stock: {producto.stock}
              </p>
              {producto.precioOferta ? (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-600">
                    ${producto.precioOferta}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ${producto.precio}
                  </span>
                </div>
              ) : (
                <span className="font-semibold">${producto.precio}</span>
              )}
            </div>

            <CheckboxPersonalizado
              checked={producto.destacado}
              onChange={() => toggleDestacado(producto)}
              label="Destacado"
              className="shrink-0"
            />

            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => editar(producto)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Pencil size={16} />
                <span className="text-sm hidden sm:inline">Editar</span>
              </button>
              <button
                onClick={() => setProductoAEliminar(producto)}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={16} />
                <span className="text-sm hidden sm:inline">Eliminar</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <ModalConfirmacion
        abierto={productoAEliminar !== null}
        titulo="Eliminar producto"
        mensaje={`¿Seguro que querés eliminar "${productoAEliminar?.nombre}"?`}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setProductoAEliminar(null)}
      />
    </div>
  );
}
