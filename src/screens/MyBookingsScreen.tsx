import { useContext, useEffect, useState } from "react";
import { CarServiceContext } from "../services/CarServiceContext";
import { AuthProvider } from "../contexts/AuthContext";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Booking } from "../types/Car";
import CarCard from "../components/CarCard";
import { useNavigation } from "@react-navigation/native";
import { formatDate, formatTime } from "../utils/DateUtils";

export default function MyBookingsScreen() {
    const carservice = useContext(CarServiceContext);
    const navigation = useNavigation<any>();
    const [bookings, setBookings] = useState<Booking[]>([]);
    // get user id of current logged in user
    
    useEffect(() => {
      carservice?.getMyBookings().then(bookings => {
        setBookings(bookings);
      });
    }, [])

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate("DetailScreen", { car: booking.car });
  };
  const removeBooking = (booking: Booking) => {
    carservice?.removeBooking(booking.id).then(() => {
      setBookings(bookings.filter(b => b.id !== booking.id));
    });
  }
  
  return (
    <View>
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View>
                <CarCard car={item.car} managing={true} onPress={(car) => handleBookingPress(item)}/>
                <View style={{flexDirection: "column"}}>
                  <View>
                    <Text style={styles.label}>Pick-up</Text>
                    <View style={styles.row}>
                      <View
                        style={styles.chip}
                      >
                        <Text>{formatDate(item.from)}</Text>
                      </View>
                      <View
                        style={styles.chip}
                      >
                        <Text>{formatTime(item.from)}</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.label}>Drop-off</Text>
                    <View style={styles.row}>
                      <View
                        style={styles.chip}
                      >
                        <Text>{formatDate(item.to)}</Text>
                      </View>
                      <View
                        style={styles.chip}
                      >
                        <Text>{formatTime(item.to)}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => removeBooking(item)}>
                  <Text style={styles.buttonText}>Remove booking</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContainer}
          />
    </View>
    )
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    gap: 10,
  },
  button: {
    backgroundColor: "#009de0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 6, alignSelf: "flex-start" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
});
