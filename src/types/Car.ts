export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  pricePerKm: number;
  location: string;
  lat: number;
  lon: number;
  imageUrl: string;
  owner: CarOwner;

  carType: "Micro Car" | "Medium" | "SUV" | "Mini Bus" | "Truck" | "Van";
  fuelType: "Electric" | "Petrol" | "Diesel" | "Hybrid";
  transmission: "Automatic" | "Manual";
  seats: number;

  bookings: Booking[];

  availability: Availability[]; //Used by the owner to unlist the car without removing it from the app
};

export type Availability = {
  id: number;
  from: Date;
  to: Date;
}

export type CarOwner = {
  id: number;
  name: string;
  avatarUrl: string;
  rating: number;
  numberOfReviews: number;
};

export type Booking = {
  id: number;
  from: Date;
  to: Date;
}


export const carTypeOptions: Car['carType'][] = ["Micro Car", "Medium", "SUV", "Mini Bus", "Truck", "Van"];
export const fuelTypeOptions: Car['fuelType'][] = ["Electric", "Petrol", "Diesel", "Hybrid"];
export const transmissionOptions: Car['transmission'][] = ["Automatic", "Manual"];