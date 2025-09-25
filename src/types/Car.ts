export type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  pricePerKm: number;
  location: string;
  imageUrl: string;
  owner: CarOwner;

  carType: "Micro Car" | "Medium" | "SUV" | "Mini Bus" | "Truck" | "Van";
  fuelType: "Electric" | "Petrol" | "Diesel" | "Hybrid";
  transmission: "Automatic" | "Manual";
  seats: number;
};

export type CarOwner = {
  id: number;
  name: string;
  avatarUrl: string;
  rating: number;
  numberOfReviews: number;
};