export default function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  onConfirmar,
  onCancelar,
  textoConfirmar = "Eliminar",
}) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold mb-2">{titulo}</h2>
        <p className="text-slate-600 text-sm mb-6">{mensaje}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded border text-sm hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
