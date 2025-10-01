import { Car } from "./Car";

export default interface CarService {
    /**
     * GetCars
     * 
     * Returns a list of cars using filters defined
     */
    getCars(filter?: CarFilter, sort?: CarSort): Car[]
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
};

export type CarSort = 'Cheapest' | 'Closest' | 'Rating'