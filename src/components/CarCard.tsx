import { View, Text, Image, StyleSheet } from "react-native";
import { Car } from "../types/Car";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

interface CarCardProps {
    car: Car;
}

function getCarTypeIcon(carType: Car["carType"]) {
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

function getFuelTypeIcon(fuelType: Car["fuelType"]) {
    switch (fuelType) {
        case "Electric":
            return <MaterialCommunityIcons name="battery-charging-high" size={12} color="black" />;
        default:
            return <FontAwesome5 name="gas-pump" size={12} color="black" />;
    }
}

export default function CarCard({ car }: CarCardProps) {

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.generalInfo}>
                    <Text style={styles.carHeader}>{car.make} {car.model}</Text>
                    <View style={styles.ownerContainer}>
                        <View style={styles.ownerName}>
                            <Image 
                                source={{uri: car.owner.avatarUrl}}
                                style={{ width: 24, height: 24 }}
                                resizeMode="cover"/>
                            <Text>{car.owner.name}</Text>
                        </View>
                    </View>
                    <Text>{car.owner.rating} ⭐ ({car.owner.numberOfReviews})</Text>
                    <View style={styles.locationContainer}>
                        <FontAwesome5 name="map-marker-alt" size={24} color="black" />
                        <Text>{car.location}</Text>
                    </View>
                </View>

                <Image 
                    source={{uri: car.imageUrl}}
                    style={styles.carImage}
                    resizeMode="cover"/>
            </View>

            <View style={styles.featuresContainer}>
                <View style={styles.featurePin}>
                    <View style={styles.featureIcon}>
                        {getCarTypeIcon(car.carType)}
                    </View>
                    <Text>{car.carType}</Text>
                </View>
                <View style={styles.featurePin}>
                    <View style={styles.featureIcon}>
                        {getFuelTypeIcon(car.fuelType)}
                    </View>
                    <Text>{car.fuelType}</Text>
                </View>
                <View style={styles.featurePin}>
                    <View style={styles.featureIcon}>
                        <MaterialCommunityIcons name="car-shift-pattern" size={12} color="black" />
                    </View>
                    <Text>{car.transmission}</Text>
                </View>
                <View style={styles.featurePin}>
                    <View style={styles.featureIcon}>
                        <MaterialCommunityIcons name="car-seat" size={12} color="black" />
                    </View>
                    <Text>{car.seats} seats</Text>
                </View>
            </View>

            <View>
                <Text>{car.pricePerKm} kr. / km</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        boxShadow: "0px 0px 5px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        borderRadius: 10,
        padding: 10,
        width: "100%",
    },
    carHeader: {
        fontSize: 18,
        fontWeight: "bold",
        paddingBottom: 10
    },
    topRow: {
        display: "flex",
        flexDirection: "row",
        paddingBottom: 10,
        justifyContent: "space-between",
        gap: 20
    },
    generalInfo: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
        height: 114
    },
    ownerContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 15
    },
    ownerName: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    locationContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingLeft: 3
    },
    carImage: {
        width: "40%",
        borderRadius: 10,
        backgroundColor: "#f0f0f0"
    },
    featuresContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        borderBottomColor: "lightgray",
        borderBottomWidth: 1,
        borderTopColor: "lightgray",
        borderTopWidth: 1,
        paddingVertical: 10,
    },
    featurePin: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    featureIcon: {
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        borderColor: "lightgray",
        borderWidth: 1
    }
});