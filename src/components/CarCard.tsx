import { View, Text, Image, StyleSheet, TouchableOpacity, Button, Alert } from "react-native";
import { Car } from "../types/Car";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { getCarTypeIcon, getFuelTypeIcon } from "../utils/IconUtils";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { CarServiceContext } from "../services/CarServiceContext";

type CarCardProps = {
    car: Car;
    managing?: boolean;
}

export default function CarCard({ car, managing = false }: CarCardProps) {
    const navigation = useNavigation<any>();
    const carService = useContext(CarServiceContext);

    function handleRemove() {
      Alert.alert(
        "Remove Car",
        "Are you sure you want to remove the car?",
        [
          {
            text: "Yes",
            onPress: () => {
              carService?.removeCar(car.id.toString()).then(() => {
                navigation.navigate("myRentedCars");
              });
            },
          },
          { text: "Cancel" },
        ]
      );
    }

    function handleEdit(): void {
      navigation.navigate("addCar", {carId: car.id})
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("manageCar", {car})}>
            <View style={styles.topRow}>
                <View style={styles.generalInfo}>
                    <Text style={styles.carHeader}>{car.make} {car.model}</Text>
                    <View style={styles.ownerContainer}>
                        <View style={styles.ownerName}>
                            <Image 
                                source={{uri: car.owner.avatarUrl}}
                                style={{ width: 24, height: 24, borderRadius: 12 }}
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
                <Text style={styles.priceText}>{car.pricePerKm} kr. / km</Text>
            </View>

            {managing && 
            <View style={{flexDirection: "row", justifyContent: "flex-end", gap: 10}}>
              <TouchableOpacity 
                style={styles.editBtn}
                onPress={() => handleEdit()}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removeBtn}
                onPress={() => handleRemove()}>
                <Text style={styles.btnText}>Remove</Text>
              </TouchableOpacity>
            </View>}
        </TouchableOpacity>
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
        width: "50%"
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
    },
    priceText: {
        paddingTop: 10,
        fontSize: 16,
        fontWeight: "bold"
    },
    removeBtn: {
      backgroundColor: "rgba(221, 0, 0, 1)",
      padding: 10,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    editBtn: {
      backgroundColor: "rgba(3, 197, 3, 1)",
      padding: 10,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    btnText: {
      color: "white", 
      fontWeight: "bold"
    }
});