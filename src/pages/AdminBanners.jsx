import { useEffect, useState } from "react";
import api from "../api/axios";
import ModalConfirmacion from "../components/ModalConfirmacion";
import CheckboxPersonalizado from "../components/CheckboxPersonalizado";
import SubidaImagenUnica from "../components/SubidaImagenUnica";
import { useToast } from "../context/ToastContext";
import { Pencil, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import TituloAnimado from "../components/TituloAnimado";

const vacio = {
  titulo: "",
  subtitulo: "",
  textoBoton: "",
  link: "",
  orden: 0,
  activo: true,
};

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const [errores, setErrores] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [bannerAEliminar, setBannerAEliminar] = useState(null);
  const { mostrarToast } = useToast();

  useEffect(() => {
    cargarBanners();
  }, []);

  function cargarBanners() {
    api.get("/banners/todos").then((res) => setBanners(res.data));
  }

  function editar(banner) {
    setEditandoId(banner.id);
    setImagenUrl(banner.imagenUrl);
    setForm({
      titulo: banner.titulo,
      subtitulo: banner.subtitulo || "",
      textoBoton: banner.textoBoton || "",
      link: banner.link || "",
      orden: banner.orden || 0,
      activo: banner.activo,
    });
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setImagenUrl(null);
    setForm(vacio);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrores([]);
    setGuardando(true);

    const body = { ...form, orden: parseInt(form.orden) };

    try {
      if (editandoId) {
        await api.put(`/banners/${editandoId}`, { ...body, imagenUrl });
        mostrarToast("Banner actualizado");
        cancelarEdicion();
        cargarBanners();
      } else {
        const { data } = await api.post("/banners", body);
        setEditandoId(data.id);
        mostrarToast("Banner creado, ahora subí su imagen");
        cargarBanners();
      }
    } catch (err) {
      setErrores(
        err.response?.data?.mensajes || ["Error al guardar el banner"]
      );
    } finally {
      setGuardando(false);
    }
  }

  async function confirmarEliminacion() {
    const id = bannerAEliminar.id;
    setBannerAEliminar(null);
    await api.delete(`/banners/${id}`);
    mostrarToast("Banner eliminado");
    cargarBanners();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 min-h-svh">
      <TituloAnimado
        className="flex items-center h-15 text-2xl font-bold pb-6"
        timeout={400}
      >
        <div className="flex flex-row gap-3 items-center">
          <div>Administrar Banners de Ofertas</div>
          <div>
            <ImageIcon size={25} />
          </div>
        </div>
      </TituloAnimado>

      <form
        onSubmit={handleSubmit}
        className="border border-slate-300 rounded-lg p-5 mb-8 flex flex-col gap-3 bg-white"
      >
        {editandoId && (
          <SubidaImagenUnica
            bannerId={editandoId}
            imagenUrl={imagenUrl}
            onImagenSubida={(url) => setImagenUrl(url)}
          />
        )}

        <input
          type="text"
          placeholder="Título (ej: 30% OFF)"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          required
          className="border border-slate-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Subtítulo (ej: En toda la colección de temporada)"
          value={form.subtitulo}
          onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
          className="border border-slate-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Texto del botón (ej: Ver ofertas)"
          value={form.textoBoton}
          onChange={(e) => setForm({ ...form, textoBoton: e.target.value })}
          className="border border-slate-300 rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Link (ej: /catalogo?ofertas=true)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          className="border border-slate-300 rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Orden"
          value={form.orden}
          onChange={(e) => setForm({ ...form, orden: e.target.value })}
          className="border border-slate-300 rounded px-3 py-2"
        />

        <CheckboxPersonalizado
          checked={form.activo}
          onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          label="Activo (visible en el carrusel)"
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
            {editandoId ? <Pencil size={16} /> : <Plus size={16} />}
            {guardando
              ? "Guardando..."
              : editandoId
              ? "Actualizar"
              : "Crear banner"}
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

      <div className="flex flex-col gap-2">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="flex items-center gap-4 border border-slate-300 rounded-lg p-3 bg-white"
          >
            {banner.imagenUrl && (
              <img
                src={banner.imagenUrl}
                alt=""
                className="w-20 h-16 object-cover rounded shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium">{banner.titulo}</p>
              <p className="text-sm text-slate-500">
                Orden: {banner.orden} · {banner.activo ? "Activo" : "Inactivo"}
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => editar(banner)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => setBannerAEliminar(banner)}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ModalConfirmacion
        abierto={bannerAEliminar !== null}
        titulo="Eliminar banner"
        mensaje={`¿Seguro que querés eliminar "${bannerAEliminar?.titulo}"?`}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setBannerAEliminar(null)}
      />
    </div>
  );
}
