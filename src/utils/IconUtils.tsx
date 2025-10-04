import { Car } from "../types/Car";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export function getCarTypeIcon(carType: Car["carType"]) {
    switch (carType) {
        case "Truck":
            return <FontAwesome5 name="truck" size={12} color="black" />;
        case "Mini Bus":
            return <FontAwesome5 name="bus" size={12} color="black" />;
        case "Van":
            return <FontAwesome5 name="shuttle-van" size={12} color="black" />;
        default:
            return <FontAwesome5 name="car-side" size={12} color="black" />;
    }
}

export function getFuelTypeIcon(fuelType: Car["fuelType"]) {
    switch (fuelType) {
        case "Electric":
            return <MaterialCommunityIcons name="battery-charging-high" size={12} color="black" />;
        default:
            return <FontAwesome5 name="gas-pump" size={12} color="black" />;
    }
}

export function getTransmissionIcon(transmission: Car["transmission"]) {
    return <MaterialCommunityIcons name="car-shift-pattern" size={12} color="black" />
}