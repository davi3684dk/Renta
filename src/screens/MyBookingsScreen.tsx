import { useContext, useEffect, useState } from "react";
import { CarServiceContext } from "../services/CarServiceContext";
import { AuthProvider } from "../contexts/AuthContext";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Booking } from "../types/Car";
import CarCard from "../components/CarCard";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { formatDate, formatTime } from "../utils/DateUtils";
import { useCallback } from "react";

export default function MyBookingsScreen() {
    const carservice = useContext(CarServiceContext);
    const navigation = useNavigation<any>();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    
    const loadBookings = useCallback(() => {
      setLoading(true);
      carservice?.getMyBookings().then(bookings => {
        setBookings(bookings);
        setLoading(false);
      }).catch(error => {
        console.error("Error loading bookings:", error);
        setLoading(false);
      });
    }, [carservice]);

    useFocusEffect(
      useCallback(() => {
        loadBookings();
      }, [loadBookings])
    );

  const handleBookingPress = (booking: Booking) => {
    navigation.navigate("DetailScreen", { car: booking.car });
  };
  const removeBooking = (booking: Booking) => {
    Alert.alert(
      "Remove Booking",
      "Are you sure you want to cancel the booking?",
      [
        {
          text: "Cancel Booking",
          onPress: () => {
            carservice?.removeBooking(booking.id).then(() => {
              setBookings(bookings.filter(b => b.id !== booking.id));
            });
          },
        },
        { text: "Go Back" },
      ]
    );
  }
  
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#009de0" />
          <Text style={styles.loadingText}>Loading your bookings...</Text>
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>Your bookings will appear here after you rent a car</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
              <View style={styles.bookingCard}>
                <CarCard car={item.car} onPress={(car) => handleBookingPress(item)}/>
                <View style={{flexDirection: "row"}}>
                  <View style={styles.date}>
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
                  <View style={styles.date}>
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
                  <Text style={styles.buttonText}>Cancel booking</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContainer}
          />
      )}
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  bookingCard: {
    borderWidth: 1,
    borderColor: "lightgrey",
    padding: 10,
    borderRadius: 10,
    boxShadow: "0px 0px 5px rgba(0,0,0,0.3)"
  },
  date: {
    flex: 1,
    justifyContent: "space-between",
    transform: [{
      scale: 0.8
    }]
  },
  listContainer: {
    padding: 16,
    gap: 50,
  },
  button: {
    backgroundColor: "#e03f00ff",
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
