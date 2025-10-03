import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LocationAndTimeComponent from "../components/LocationAndTimePicker";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const [location, setLocation] = useState("Odense");
  const [pickUpDate, setPickUpDate] = useState(new Date());
  const [dropOffDate, setDropOffDate] = useState(new Date());

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LocationAndTimeComponent
          location={location}
          onDateChange={(pickupDate: Date, dropOffDate: Date) => {
            setPickUpDate(pickupDate);
            setDropOffDate(dropOffDate);
          }}
          onLocationChange={setLocation}
        />
        <TouchableOpacity
          style={styles.findBtn}
          onPress={() => navigation.navigate("cars", {
            fromDate: pickUpDate,
            toDate: dropOffDate,
            location: location
          })}
        >
          <Text style={styles.findBtnText}>Find Rental</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <Text style={{ marginBottom: 8 }}>Rent your car</Text>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.navigate("addCar")}
        >
          <Text style={{ color: "white", fontSize: 18 }}>{">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  findBtn: {
    backgroundColor: "#8e44ad",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  findBtnText: { color: "white", fontWeight: "bold" },
  bottom: { alignItems: "center", marginTop: 40 },
  circleBtn: {
    backgroundColor: "#8e44ad",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  }
});
