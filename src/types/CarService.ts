import { Car } from "./Car";

export default interface CarService {
  getCars(filter?: CarFilter, sort?: CarSort): Promise<Car[]>;

  getCar(id: string): Promise<Car[]>;

  getMyCars(id: number): Promise<Car[]>;

  addCar(car: NewCarBody): Promise<Car>;

  removeCar(id: string): Promise<void>;

  addAvailability(carId: string, fromDate: Date, toDate: Date): Promise<void>;

  removeAvailability(id: string): Promise<void>;

  addBooking(carId: string, fromDate: Date, toDate: Date): Promise<void>;

  removeBooking(bookingId: string): Promise<void>;
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
  lat: number;
  long: number;
};

export type CarFilter = {
  priceMin?: number;
  priceMax?: number;
  carType?: Car["carType"][];
  fuelType?: Car["fuelType"][];
  brand?: string;
  transmission?: Car["transmission"];
  moreThan5Seats?: boolean;
  minRating?: number;
  distance?: number;
  location?: string;
  lat?: number;
  long?: number;
  fromDate: Date;
  toDate: Date;
};

export type CarSort = "Cheapest" | "Closest" | "Rating";
