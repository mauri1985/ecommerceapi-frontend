import React from "react";
import Catalogo from "../pages/Catalogo";
import CarruselOfertas from "./CarruselOfertas";
import BannerOfertas from "./BannerOfertas";

const Portada = () => {
  return (
    <div className="min-h-[60vh]">
      <BannerOfertas />
      <CarruselOfertas />
      <Catalogo />
    </div>
  );
};

export default Portada;
