import AsyncStorage from "@react-native-async-storage/async-storage";
import { Booking, Car } from "../types/Car";
import CarService, {
  CarFilter,
  CarSort,
  NewCarBody,
} from "../types/CarService";
import { API_URL } from "../constants/Consts";

export default class APICarService implements CarService {
  private onTokenExpired?: () => void;

  constructor(onTokenExpired?: () => void) {
    this.onTokenExpired = onTokenExpired;
  }

  private async fetchWithAuth(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = await AsyncStorage.getItem("jwt");

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    console.log("Making request to:", `${API_URL}${endpoint}`);
    console.log("With token:", token ? "YES" : "NO");

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.status === 401) {
        console.error("401 Unauthorized - Token expired");
        if (this.onTokenExpired) {
          this.onTokenExpired();
        }
        throw new Error("Authentication failed. Please login again.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(JSON.parse(errorText)["message"]);
      }

      const text = await response.text();
      console.log("Response text length:", text.length);
      return text ? JSON.parse(text) : null;
    } catch (error: any) {
      console.error("Fetch error:", error.message);
      if (error.message === "Network request failed") {
        console.error("Cannot connect to server at:", API_URL);
        console.error("Make sure backend is running and IP address is correct");
      }
      throw error;
    }
  }

  private mapCar(car: any): Car {
    return ({
          id: car.id.toString(),
          make: car.make,
          model: car.model,
          year: car.year,
          pricePerKm: car.pricePerKm,
          location: car.location,
          lat: Number.parseFloat(car.latitude),
          lon: Number.parseFloat(car.longitude),
          imageUrl: car.imageBase64 || "",
          carType: car.carType,
          fuelType: car.fuelType,
          transmission: car.transmission,
          seats: car.seats,
          owner: {
            id: car.owner?.id || 0,
            name:
              car.owner?.firstName && car.owner?.lastName
                ? `${car.owner.firstName} ${car.owner.lastName}`
                : car.owner?.username || "Unknown",
            avatarUrl:
              car.owner?.avatarBase64 ||
              "https://cdn-icons-png.flaticon.com/512/8847/8847419.png",
            rating: car.owner?.rating || 0,
            numberOfReviews: car.owner?.numberOfReviews || 0,
          },
          bookings:
            car.bookings?.map((b: any) => ({
              id: b.id,
              from: new Date(b.startDate),
              to: new Date(b.endDate),
            })) || [],
          availability:
            car.availabilities?.map((a: any) => ({
              id: a.id,
              from: new Date(a.startDate),
              to: new Date(a.endDate),
            })) || [],
        })
  }

  async getCars(filter?: CarFilter, sort?: CarSort): Promise<Car[]> {
    try {
      const params: any = {};

      if (filter) {
        if (filter.carType && filter.carType.length > 0) {
          params.carTypes = filter.carType;
        }
        if (filter.fuelType && filter.fuelType.length > 0) {
          params.fuelTypes = filter.fuelType;
        }
        if (filter.transmission) params.transmission = filter.transmission;
        if (filter.priceMin !== undefined) params.minPrice = filter.priceMin;
        if (filter.priceMax !== undefined) params.maxPrice = filter.priceMax;
        if (filter.moreThan5Seats) params.minSeats = 6;
        if (filter.lat !== undefined) params.userLat = filter.lat;
        if (filter.long !== undefined) params.userLng = filter.long;
        if (filter.fromDate !== undefined) params.startDate = filter.fromDate.toISOString();
        if (filter.toDate !== undefined) params.endDate = filter.toDate.toISOString();
        if (filter.brand !== undefined) params.makes = filter.brand
        params.maxDistance =
          filter.distance !== undefined ? filter.distance : 10;
        if (sort !== undefined) params.sort = sort;
      }

      console.log(params);

      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/cars?${queryString}` : "/cars";

      console.log("Fetching cars from:", `${API_URL}${endpoint}`);

      const data = await this.fetchWithAuth(endpoint);

      console.log("Raw data from backend:", data);
      console.log("Number of cars received:", data?.length || 0);

      if (!data || !Array.isArray(data)) {
        console.error("Invalid data format received:", data);
        return [];
      }

      const transformedCars = data.map((car: any) => this.mapCar(car));

      console.log("Transformed cars:", transformedCars.length);
      return transformedCars;
    } catch (error) {
      console.error("Error fetching cars:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return [];
    }
  }

  async getCar(id: string): Promise<Car> {
    try {
      const car = await this.fetchWithAuth(`/cars/${id}`);

      return this.mapCar(car);
    } catch (error) {
      console.error("Error fetching car:", error);
      throw new Error("Failed to fetch car details");
    }
  }

  async getCarsByOwner(ownerId: number): Promise<Car[]> {
    try {
      console.log("Fetching cars for owner:", ownerId);
      const data = await this.fetchWithAuth(`/cars/owner/${ownerId}`);

      console.log("Raw data from backend:", data);
      console.log("Number of owner's cars received:", data?.length || 0);

      if (!data || !Array.isArray(data)) {
        console.error("Invalid data format received:", data);
        return [];
      }

      const transformedCars = data.map((car: any) => this.mapCar(car));

      console.log("Transformed owner's cars:", transformedCars.length);
      return transformedCars;
    } catch (error) {
      console.error("Error fetching owner's cars:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return [];
    }
  }

  async getMyCars(id: number): Promise<Car[]> {
    try {
      console.log("Fetching cars for logged-in user");
      const data = await this.fetchWithAuth(`/cars/owner/${id}`);

      console.log("Raw data from backend:", data);
      console.log("Number of my cars received:", data?.length || 0);

      if (!data || !Array.isArray(data)) {
        console.error("Invalid data format received:", data);
        return [];
      }

      const transformedCars = data.map((car: any) => this.mapCar(car));

      console.log("Transformed my cars:", transformedCars.length);
      return transformedCars;
    } catch (error) {
      console.error("Error fetching my cars:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return [];
    }
  }

  async getReviewDistribution(userId: number): Promise<Record<number, number>> {
    try {
      const data = this.fetchWithAuth(`/reviews/user/${userId}/distribution`);

      if (!data) {
        console.error("Invalid data format received:", data);
        return {};
      }

      return data;

    } catch (error) {
      console.error("Error removing booking:", error);
      throw new Error("Failed to remove booking");
    }
  }

  async addCar(car: NewCarBody): Promise<Car> {
    try {
      console.log(car);
      const carData = {
        make: car.make,
        model: car.model,
        year: car.year,
        pricePerKm: car.price,
        location: car.location,
        imageBase64: car.image,
        carType: car.carType,
        fuelType: car.fuelType,
        transmission: car.transmission,
        seats: car.seats,
        latitude: car.lat,
        longitude: car.long,
      };

      const result = await this.fetchWithAuth("/cars", {
        method: "POST",
        body: JSON.stringify(carData),
      });

      return this.mapCar(result);
    } catch (error) {
      console.error("Error adding car:", error);
      throw error;
    }
  }

  async updateCar(id: number, car: NewCarBody): Promise<Car> {
    try {
      console.log(car);
      const carData = {
        make: car.make,
        model: car.model,
        year: car.year,
        pricePerKm: car.price,
        location: car.location,
        imageBase64: car.image,
        carType: car.carType,
        fuelType: car.fuelType,
        transmission: car.transmission,
        seats: car.seats,
        latitude: car.lat,
        longitude: car.long,
      };

      const result = await this.fetchWithAuth(`/cars/${id}`, {
        method: "PATCH",
        body: JSON.stringify(carData),
      });

      return this.mapCar(result);
    } catch (error) {
      console.error("Error adding car:", error);
      throw error;
    }
  }

  async removeCar(id: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/cars/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error removing car:", error);
      throw new Error("Failed to remove car");
    }
  }

  async addAvailability(
    carId: string,
    fromDate: Date,
    toDate: Date
  ): Promise<void> {
    try {
      await this.fetchWithAuth(`/car-availability`, {
        method: "POST",
        body: JSON.stringify({
          startDate: fromDate.toISOString(),
          endDate: toDate.toISOString(),
          carId: carId,
        }),
      });
    } catch (error) {
      console.error("Error adding availability:", error);
      throw new Error("Failed to add availability");
    }
  }

  async removeAvailability(id: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/cars/availability/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error removing availability:", error);
      throw new Error("Failed to remove availability");
    }
  }

  async addBooking(carId: string, fromDate: Date, toDate: Date): Promise<void> {
    try {
      await this.fetchWithAuth(`/car-bookings`, {
        method: "POST",
        body: JSON.stringify({
          carId: carId,
          startDate: fromDate.toISOString(),
          endDate: toDate.toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error adding booking:", error);
      throw new Error("Failed to add booking");
    }
  }

  async removeBooking(bookingId: string): Promise<void> {
    try {
      await this.fetchWithAuth(`/cars/bookings/${bookingId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error removing booking:", error);
      throw new Error("Failed to remove booking");
    }
  }
}
