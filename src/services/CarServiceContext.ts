import React from "react";
import CarService from "../types/CarService";

export const CarServiceContext = React.createContext<CarService | null>(null);