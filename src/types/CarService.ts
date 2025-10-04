import { Car } from "./Car";

export default interface CarService {
    /**
     * GetCars
     * 
     * Returns a list of cars using filters defined
     */
    getCars(filter?: CarFilter, sort?: CarSort): Promise<Car[]>;

    getCar(id: string): Promise<Car[]>;

    addCar(car: NewCarBody): Promise<Car>;

    removeCar(id: string): Promise<void>;

    addAvailability(carId: string, fromDate: Date, toDate: Date): Promise<void>;

    removeAvailability(id: string): Promise<void>;
}


export type NewCarBody = {
  make: string;
  model: string;
  year: number;
  location: string;
  carType: Car["carType"];
  transmission: Car["transmission"];
  fuelType: Car["fuelType"];
  seats: number;
  price: number;
  image: string;
  ownerId: string;
}

export type CarFilter = {
    priceMin?: number, 
    priceMax?: number,
    carType?: Car['carType'][];
    fuelType?: Car['fuelType'][];
    brand?: string,
    transmission?: Car['transmission'];
    moreThan5Seats?: boolean;
    location?: string;
    minRating?: number;
    distance?: number;
    fromDate?: Date;
    toDate?: Date;
};

export type CarSort = 'Cheapest' | 'Closest' | 'Rating'