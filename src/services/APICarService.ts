import axios from "axios";
import { Car } from "../types/Car";
import CarService, { CarFilter, CarSort } from "../types/CarService";

export default class APICarService implements CarService {
  async getCars(filter?: CarFilter, sort?: CarSort): Promise<Car[]> {
    const result = await axios.get("https://car-api-315066655553.europe-west1.run.app/cars", {
      params: {...filter, 
        carType: JSON.stringify(filter?.carType), 
        brand: JSON.stringify(filter?.brand),
        fuelType: JSON.stringify(filter?.fuelType),
        sort: sort}});
    
    return result.data;
  }
}