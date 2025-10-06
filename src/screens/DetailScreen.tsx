import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert, Modal, Button } from "react-native";
import { Car } from "../types/Car";
import { CarServiceContext } from "../services/CarServiceContext";
import CarDetail from "../components/CarDetail";
import { formatDate, formatTime } from "../utils/DateUtils";

export default function DetailScreen({ route }: any) {
  const carService = useContext(CarServiceContext);
  const navigation = useNavigation<any>();

  const { car, fromDate, toDate }: {car: Car, fromDate: Date, toDate: Date} = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  function handleRentPressed() {
    setModalVisible(true);   
  }

  function confirmBooking(): void {
    carService?.addBooking(car.id, fromDate, toDate);
    navigation.popToTop();
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={styles.container}>
          {<CarDetail car={car as Car} />}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.priceText}>{car.pricePerKm} kr. / km</Text>
          <TouchableOpacity 
            style={styles.rentButton}
            onPress={() => handleRentPressed()}>
            <Text style={styles.rentButtonText}>Rent Car</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modal}>
            <View style={styles.modalCard}>
              <Text>Confirm Booking Time</Text>

              <Text style={styles.label}>Pick-up</Text>
              <View style={styles.row}>
                <View
                  style={styles.chip}
                >
                  <Text>{formatDate(fromDate)}</Text>
                </View>
                <View
                  style={styles.chip}
                >
                  <Text>{formatTime(fromDate)}</Text>
                </View>
              </View>

              <Text style={styles.label}>Drop-off</Text>
              <View style={styles.row}>
                <View
                  style={styles.chip}
                >
                  <Text>{formatDate(toDate)}</Text>
                </View>
                <View
                  style={styles.chip}
                >
                  <Text>{formatTime(toDate)}</Text>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <Button title="Confirm" onPress={() => confirmBooking()}></Button>
                <Button title="Cancel" onPress={() => {setModalVisible(false)}}></Button>
              </View>
            </View>
          </View>

        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row", 
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    boxShadow: "0px -5px 5px rgba(0,0,0,0.4)"
  },
  rentButton: {
    alignSelf: "flex-end",
    backgroundColor: "#29c924ff",
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    borderRadius: 5
  },
  rentButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 50
  },
  modal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3030308a"
  },
  modalCard: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 10
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
  modalButtons: {
    flexDirection: "row",
    gap: 20
  }
});
