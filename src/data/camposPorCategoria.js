export const TALLES = ["XS", "S", "M", "L", "XL", "XXL"];
export const COLORES = [
  "Blanco",
  "Gris",
  "Negro",
  "Amarillo",
  "Naranja",
  "Rojo",
  "Verde",
  "Lima",
  "Celeste",
  "Azul",
  "Violeta",
  "Purpura",
  "Beige",
  "Caqui",
  "Rosa",
  "Marron",
  "Oliva",
  "Dorado",
  "Plateado",
];
export const MARCAS = ["Samsung", "Apple", "Xiaomi", "Huawei", "Motorola"];
export const EDADES = ["0 - 3", "3 - 6", "6 - 12"];

export const COLORES_HEX = {
  Blanco: "#ffffff",
  Gris: "#9ca3af",
  Negro: "#18181b",
  Amarillo: "#fff085",
  Naranja: "#ff8904",
  Rojo: "#ff6467",
  Verde: "#05df72",
  Lima: "#bbf451",
  Celeste: "#00bcff",
  Azul: "#2b7fff",
  Violeta: "#8e51ff",
  Purpura: "#ad46ff",
  Beige: "#EDE8D0",
  Caqui: "#D5C58A",
  Rosa: "#fb64b6",
  Marron: "#A52A2A",
  Oliva: "#7c7c67",
  Dorado: "#FFD700",
  Plateado: "#C0C0C0",
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
    { clave: "color", etiqueta: "Color", opciones: COLORES },
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
