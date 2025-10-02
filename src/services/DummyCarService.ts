import dummyCars from "../dummy-data";
import { Car } from "../types/Car";
import CarService, { CarFilter, CarSort } from "../types/CarService";

export default class DummyCarService implements CarService {
    async getCars(filter?: CarFilter, sort?: CarSort): Promise<Car[]> {
        let filteredCars = [...dummyCars];
        filteredCars = filteredCars.filter(car => car.available);

        if (filter) {
            filteredCars = this.filterCars(filteredCars, filter);
        }

        if (sort) {
            this.sortCars(filteredCars, sort);
        }

        return filteredCars;
    }

    private sortCars(cars: Car[], sorting: CarSort) {
        if (sorting) {
            switch (sorting) {
                case 'Cheapest':
                    cars.sort((a,b) => a.pricePerKm - b.pricePerKm);
                    break;
                case 'Closest':
                    break;
                case 'Rating':
                    cars.sort((a,b) => b.owner.rating - a.owner.rating);
                    break;
            }
        }
    }


    private filterCars(filteredCars: Car[], filter: CarFilter): Car[] {
        if (filter.fromDate !== undefined && filter.toDate) {
            filteredCars = filteredCars.filter(car => car.bookings.find(b => (filter.fromDate! < b.to && b.from < filter.toDate!)) === undefined)
        }

        if (filter.priceMin !== undefined) {
            filteredCars = filteredCars.filter(car => car.pricePerKm >= filter.priceMin!);
        }

        if (filter.priceMax !== undefined) {
            filteredCars = filteredCars.filter(car => car.pricePerKm <= filter.priceMax!);
        }

        if (filter.transmission) {
            filteredCars = filteredCars.filter(car => car.transmission === filter.transmission);
        }

        if (filter.carType) {
            filteredCars = filteredCars.filter(car => filter.carType?.includes(car.carType));
        }

        if (filter.fuelType) {
            filteredCars = filteredCars.filter(car => filter.fuelType?.includes(car.fuelType));
        }

        if (filter.brand) {
            filteredCars = filteredCars.filter(car => filter.brand?.includes(car.make));
        }

        if (filter.moreThan5Seats) {
            filteredCars = filteredCars.filter(car => car.seats > 5);
        }

        if (filter.minRating) {
            filteredCars = filteredCars.filter(car => car.owner.rating >= (filter.minRating ?? 0))
        }

        return filteredCars;
    }
    
}