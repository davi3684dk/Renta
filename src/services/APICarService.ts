import axios from "axios";
import { Booking, Car } from "../types/Car";
import CarService, { CarFilter, CarSort, NewCarBody } from "../types/CarService";

export default class APICarService implements CarService {
  async getCar(id: string): Promise<Car[]> {
    throw new Error("Method not implemented.");
  }

  async addCar(car: NewCarBody): Promise<void> {
    await new Promise(res => setTimeout(res, 1000));
    return
  }

  async getCars(filter?: CarFilter, sort?: CarSort): Promise<Car[]> {
    const result = await axios.get("https://car-api-315066655553.europe-west1.run.app/cars", {
      params: {...filter, 
        carType: JSON.stringify(filter?.carType), 
        brand: JSON.stringify(filter?.brand),
        fuelType: JSON.stringify(filter?.fuelType),
        sort: sort}});
    
    try {
      result.data.forEach((data: any) => {
        data.bookings = data.bookings.map(
          (s: any): Booking => ({
            id: s.id,
            from: new Date(s.from),
            to: new Date(s.to),
          })
        );
      });
  
      return result.data;

    } catch (e) {
      console.log(e);
    }
  }
}