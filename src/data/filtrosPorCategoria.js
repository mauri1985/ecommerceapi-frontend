// Mapeo de nombre de categoría -> atributos de filtro que le corresponden.
// Ajustá los nombres para que coincidan EXACTAMENTE con los que tenés cargados en tu base.
export const FILTROS_POR_CATEGORIA = {
  Ropa: ["talle", "color"],
  Remeras: ["talle", "color"],
  Pantalones: ["talle", "color"],
  Tecnologia: ["marca"],
  Celulares: ["marca", "modelo", "color", "pantalla", "camara"],
  Juguetes: ["edad"],
};

export function obtenerAtributosFiltrables(
  categoriasSeleccionadas,
  categorias
) {
  if (categoriasSeleccionadas.length === 0) {
    // Sin categoría elegida: mostramos todos los atributos posibles (comportamiento actual)
    return ["talle", "color"];
  }

  const nombresSeleccionados = categorias
    .filter((c) => categoriasSeleccionadas.includes(c.id))
    .map((c) => c.nombre);

  const atributosPermitidos = new Set();
  nombresSeleccionados.forEach((nombre) => {
    const atributos = FILTROS_POR_CATEGORIA[nombre] || [];
    atributos.forEach((a) => atributosPermitidos.add(a));
  });

  return Array.from(atributosPermitidos);
}
