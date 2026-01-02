import { useContext, useEffect, useState } from "react";
import { CarServiceContext } from "../services/CarServiceContext";
import { AuthProvider } from "../contexts/AuthContext";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Booking } from "../types/Car";
import CarCard from "../components/CarCard";
import { useNavigation } from "@react-navigation/native";
import { formatDate, formatTime } from "../utils/DateUtils";
import CarBookingCard from "../components/CarBookingCard";

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
    <View>
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <CarBookingCard 
                  booking={item} 
                  onPress={(car) => handleBookingPress(item)}
                  onRemove={(booking) => removeBooking(booking)}
                />
            )}
            contentContainerStyle={styles.listContainer}
          />
    </View>
    )
}

const styles = StyleSheet.create({
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
    gap: 25,
  },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 6, alignSelf: "flex-start" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#d4d4d4ff",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
});
