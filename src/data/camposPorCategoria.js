export const TALLES = ["XS", "S", "M", "L", "XL", "XXL"];
export const COLORES = ["Blanco", "Negro", "Azul", "Rojo", "Verde", "Gris"];
export const MARCAS = ["Samsung", "Apple", "Xiaomi", "Huawei", "Motorola"];
export const EDADES = ["0 - 3", "3 - 6", "6 - 12"];

export const COLORES_HEX = {
  Blanco: "#ffffff",
  Negro: "#18181b",
  Azul: "#3b82f6",
  Rojo: "#ef4444",
  Verde: "#22c55e",
  Gris: "#9ca3af",
};

// Cada campo ahora define sus "opciones" — si tiene opciones, se renderiza como select.
// Si no tiene "opciones" (undefined), se renderiza como input de texto libre.
export const CAMPOS_POR_CATEGORIA = {
  Ropa: [
    { clave: "talle", etiqueta: "Talle", opciones: TALLES },
    { clave: "color", etiqueta: "Color", opciones: COLORES },
  ],
  Celulares: [
    { clave: "marca", etiqueta: "Marca", opciones: MARCAS },
    { clave: "modelo", etiqueta: "Modelo" }, // texto libre, no hay lista fija de modelos
    { clave: "almacenamiento", etiqueta: "Almacenamiento" },
  ],
  Tecnologia: [
    { clave: "marca", etiqueta: "Marca", opciones: MARCAS },
    { clave: "modelo", etiqueta: "Modelo" },
  ],
  Juguetes: [
    {
      clave: "edadRecomendada",
      etiqueta: "Edad recomendada",
      opciones: EDADES,
    },
  ],
};

export function obtenerCamposDeCategoria(categoriaId, categorias) {
  const categoria = categorias.find((c) => c.id === Number(categoriaId));
  if (!categoria) return [];
  return CAMPOS_POR_CATEGORIA[categoria.nombre] || [];
}
