import { useEffect, useState } from "react";
import api from "../api/axios";
import ModalConfirmacion from "../components/ModalConfirmacion";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";

const vacio = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoriaId: "",
  atributos: "{}",
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
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      stock: producto.stock,
      precioOferta: producto.precioOferta || "",
      categoriaId:
        categorias.find((c) => c.nombre === producto.categoriaNombre)?.id || "",
      atributos: JSON.stringify(producto.atributos || {}),
      destacado: producto.destacado || false,
    });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setForm(vacio);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores([]);
    setGuardando(true);

    let atributosParseados;
    try {
      atributosParseados = JSON.parse(form.atributos || "{}");
    } catch {
      setErrores([
        'Los atributos deben ser un JSON válido, ej: {"talle": "M"}',
      ]);
      setGuardando(false);
      return;
    }

    const body = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio),
      stock: parseInt(form.stock),
      categoriaId: parseInt(form.categoriaId),
      atributos: atributosParseados,
      destacado: form.destacado,
      precioOferta: form.precioOferta ? parseFloat(form.precioOferta) : null,
    };

    try {
      if (editandoId) {
        await api.put(`/productos/${editandoId}`, body);
      } else {
        await api.post("/productos", body);
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-svh">
      <h1 className="text-2xl font-bold mb-6">Administrar Productos</h1>

      <form
        onSubmit={handleSubmit}
        className="border rounded-lg p-5 mb-8 flex flex-col gap-3"
      >
        <h2 className="font-semibold">
          {editandoId ? "Editar producto" : "Nuevo producto"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
          <select
            value={form.categoriaId}
            onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}
            required
            className="border rounded px-3 py-2"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio de oferta (opcional)"
            value={form.precioOferta}
            onChange={(e) => setForm({ ...form, precioOferta: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
        </div>

        <textarea
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="border rounded px-3 py-2"
          rows={2}
        />

        <input
          type="text"
          placeholder='Atributos JSON, ej: {"talle": "M", "color": "azul"}'
          value={form.atributos}
          onChange={(e) => setForm({ ...form, atributos: e.target.value })}
          className="border rounded px-3 py-2 font-mono text-sm"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.destacado}
            onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
          />
          Mostrar en carrusel de ofertas (destacado)
        </label>

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
              className="border px-5 py-2 rounded font-medium"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-2">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="flex justify-between items-center border rounded-lg p-4"
          >
            <div>
              <p className="font-medium">{producto.nombre}</p>
              <p className="text-sm text-slate-500">
                {producto.categoriaNombre} · ${producto.precio} · Stock:{" "}
                {producto.stock}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => editar(producto)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Pencil size={16} />
                <span className="text-sm">Editar</span>
              </button>
              <button
                onClick={() => setProductoAEliminar(producto)}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={16} />
                <span className="text-sm">Eliminar</span>
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
