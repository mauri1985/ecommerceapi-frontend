import React from "react";
import Catalogo from "../pages/Catalogo";
import CarruselOfertas from "./CarruselOfertas";

const Portada = () => {
  return (
    <div className="min-h-[60vh] ">
      <CarruselOfertas />
      <Catalogo />
    </div>
  );
};

export default Portada;
