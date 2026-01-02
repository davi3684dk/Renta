import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import LocationAndTimeComponent, { Place } from "../components/LocationAndTimePicker";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const [location, setLocation] = useState<Place | undefined>();
  const [pickUpDate, setPickUpDate] = useState(new Date((new Date().getTime() + 1000 * 60 * 60)));
  const [dropOffDate, setDropOffDate] = useState(new Date((new Date().getTime() + 1000 * 60 * 60 * 2)));

  function handleSearch() {
    if (!pickUpDate || !dropOffDate || !location) {
      Alert.alert("Search", "Please input Location and Dates");
      return;
    }

    navigation.navigate("cars", {
      fromDate: pickUpDate,
      toDate: dropOffDate,
      place: location
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <LocationAndTimeComponent
          location={location?.location ?? ""}
          pickupDate={pickUpDate}
          dropOffDate={dropOffDate}
          onDateChange={(pickupDate: Date, dropOffDate: Date) => {
            setPickUpDate(pickupDate);
            setDropOffDate(dropOffDate);
          }}
          onLocationChange={(place) => setLocation(place)}
        />
        <TouchableOpacity
          style={styles.findBtn}
          onPress={handleSearch}
        >
          <Text style={styles.findBtnText}>Find Rental</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    padding: 16
  },
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
    backgroundColor: "#009de0",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  findBtnText: { color: "white", fontWeight: "bold" },
  bottom: { alignItems: "center", marginTop: 40 },
  rentBtn: {
    position: "absolute",
    alignItems: "center",
    bottom: 100,
    right: 30,
  },
  circleBtn: {
    backgroundColor: "#009de0",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  bookingsButton: {
    backgroundColor: "#009de0",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
