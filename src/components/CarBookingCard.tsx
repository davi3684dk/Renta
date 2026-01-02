import { View, Text, Image, StyleSheet, TouchableOpacity, Button, Alert } from "react-native";
import { Booking, Car } from "../types/Car";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { getCarTypeIcon, getFuelTypeIcon } from "../utils/IconUtils";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { CarServiceContext } from "../services/CarServiceContext";

type CarCardProps = {
  booking: Booking;
  managing?: boolean;
  onPress: (car: Car) => void;
  onRemove: (booking: Booking) => void;
}

export default function CarCard({ booking, managing = false, onPress, onRemove }: CarCardProps) {
  const navigation = useNavigation<any>();
  const carService = useContext(CarServiceContext);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(booking.car)}>
      <View style={styles.topRow}>
        <View style={styles.generalInfo}>
          <Text style={styles.carHeader}>
            {booking.car.make} {booking.car.model}
          </Text>
          <View style={styles.ownerContainer}>
            <View style={styles.ownerName}>
              <Image
                source={{ uri: booking.car.owner.avatarUrl }}
                style={{ width: 24, height: 24, borderRadius: 12 }}
                resizeMode="cover"
              />
              <Text>{booking.car.owner.name}</Text>
            </View>
          </View>
          <Text>
            {booking.car.owner.rating} ⭐ ({booking.car.owner.numberOfReviews})
          </Text>
          <View style={styles.locationContainer}>
            <FontAwesome5 name="map-marker-alt" size={24} color="black" />
            <Text>{booking.car.location}</Text>
          </View>
        </View>

        <Image source={{ uri: booking.car.imageUrl }} style={styles.carImage} resizeMode="cover" />
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featurePin}>
          <View style={styles.featureIcon}>{getCarTypeIcon(booking.car.carType)}</View>
          <Text>{booking.car.carType}</Text>
        </View>
        <View style={styles.featurePin}>
          <View style={styles.featureIcon}>{getFuelTypeIcon(booking.car.fuelType)}</View>
          <Text>{booking.car.fuelType}</Text>
        </View>
        <View style={styles.featurePin}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="car-shift-pattern" size={12} color="black" />
          </View>
          <Text>{booking.car.transmission}</Text>
        </View>
        <View style={styles.featurePin}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="car-seat" size={12} color="black" />
          </View>
          <Text>{booking.car.seats} seats</Text>
        </View>
      </View>
      <View style={styles.datePriceContainer}>
        <View style={styles.featurePin}>
          <FontAwesome5 name="calendar-alt" size={16} color="black" />
          <Text>
            {booking.from.toLocaleDateString()} - {booking.to.toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.priceText}>{booking.car.pricePerKm} kr. / km</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => onRemove(booking)}>
        <Text style={styles.buttonText}>Cancel booking</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: "#e03f00ff",
    padding: 6,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  },
  datePriceContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  }
});
