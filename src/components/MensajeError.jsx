export default function MensajeError({ error, onReintentar }) {
  const esConexion = error?.esErrorDeConexion;

  return (
    <div className="text-center mt-10">
      <p className="text-red-600 mb-3">
        {esConexion
          ? "No se pudo conectar con el servidor. Verificá tu conexión o que el backend esté corriendo."
          : "Ocurrió un error al cargar los datos."}
      </p>
      {onReintentar && (
        <button
          onClick={onReintentar}
          className="border rounded px-4 py-2 text-sm hover:bg-slate-50"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
