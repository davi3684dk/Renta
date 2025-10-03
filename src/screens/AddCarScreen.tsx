import { useContext, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Car } from "../types/Car";
import { getCarTypeIcon, getFuelTypeIcon, getTransmissionIcon } from "../utils/IconUtils";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { CarServiceContext } from "../services/CarServiceContext";

interface CarForm {
  make?: string;
  model?: string;
  year?: string;
  location?: string;
  carType?: Car["carType"];
  transmission?: Car["transmission"];
  fuelType?: Car["fuelType"];
  seats?: string;
  price?: string;
}

export default function AddCarScreen() {
  const carService = useContext(CarServiceContext);

  const [car, setCar] = useState<CarForm>();
  const [image, setImage] = useState<string | null>(null);

  const getCarChip = (carType: Car["carType"]) => {
    return (
      <TouchableOpacity
        style={car?.carType === carType ? styles.buttonActive : styles.buttonInactive}
        onPress={() => { setCar(prev => ({ ...prev, carType: carType })) }}>
        {getCarTypeIcon(carType)}
        <Text>{carType}</Text>
      </TouchableOpacity>
    )
  }

  const getFuelChip = (fuelType: Car["fuelType"]) => {
    return (
      <TouchableOpacity
        style={car?.fuelType === fuelType ? styles.buttonActive : styles.buttonInactive}
        onPress={() => { setCar(prev => ({ ...prev, fuelType: fuelType })) }}>
        {getFuelTypeIcon(fuelType)}
        <Text>{fuelType}</Text>
      </TouchableOpacity>
    )
  }

  const getTransmissionChip = (transmission: Car["transmission"]) => {
    return (
      <TouchableOpacity
        style={car?.transmission === transmission ? styles.buttonActive : styles.buttonInactive}
        onPress={() => { setCar(prev => ({ ...prev, transmission: transmission })) }}>
        {getTransmissionIcon(transmission)}
        <Text>{transmission}</Text>
      </TouchableOpacity>
    )
  }

  const handleSubmit = () => {
    const requiredFields: (keyof CarForm)[] = [
      "make",
      "model",
      "year",
      "location",
      "carType",
      "transmission",
      "fuelType",
      "seats",
    ];

    // Check missing fields
    const missing = requiredFields.filter(
      (field) => !car?.[field] || car[field]?.toString().trim() === ""
    );

    if (missing.length > 0 || !image) {
      Alert.alert(
        "Missing Information",
        `Please fill in all required fields.${!image ? " And upload a car photo." : ""}`
      );
      return;
    }

    if (carService && car)
      carService.addCar(
        {
          make: car.make!,
          model: car.model!,
          year: Number.parseInt(car.year!),
          location: car.location!,
          carType: car.carType!,
          transmission: car.transmission!,
          fuelType: car.fuelType!,
          seats: Number.parseInt(car.seats!),
          price: Number.parseFloat(car.price!),
          ownerId: "1" //TODO, use AuthContext to get UserID
        }
      )
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.main}>
          <View>
            <Text>Car Brand</Text>
            <TextInput style={styles.input} value={car?.make} onChangeText={(text) => { setCar(prev => ({ ...prev, make: text })) }} />
          </View>
          <View>
            <Text>Car Model</Text>
            <TextInput style={styles.input} value={car?.model} onChangeText={(text) => { setCar(prev => ({ ...prev, model: text })) }} />
          </View>
          <View>
            <Text>Car Year</Text>
            <TextInput style={styles.input} value={car?.year} inputMode="numeric" onChangeText={(text) => { setCar(prev => ({ ...prev, year: text })) }} />
          </View>

          <View>
            <Text>Location</Text>
            <TextInput style={styles.input} onChangeText={(text) => { setCar(prev => ({ ...prev, location: text })) }} />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text>Car Type</Text>
            <View style={styles.chipContainer}>
              {getCarChip("Micro Car")}
              {getCarChip("Medium")}
              {getCarChip("SUV")}
              {getCarChip("Van")}
              {getCarChip("Truck")}
              {getCarChip("Mini Bus")}
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text>Transmission</Text>
            <View style={styles.chipContainer}>
              {getTransmissionChip("Manual")}
              {getTransmissionChip("Automatic")}
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text>Fuel Type</Text>
            <View style={styles.chipContainer}>
              {getFuelChip("Petrol")}
              {getFuelChip("Diesel")}
              {getFuelChip("Hybrid")}
              {getFuelChip("Electric")}
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text>Seats</Text>
            <TextInput inputMode="numeric" style={styles.input} onChangeText={(text) => { setCar(prev => ({ ...prev, seats: text })) }} />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text>Car Photo</Text>
            <TouchableOpacity
              onPress={() => {
                ImagePicker.launchCameraAsync({
                  mediaTypes: ['images'],
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
                  
                }).then((value) => {
                  if (!value.canceled)
                    setImage(value.assets[0].uri);
                });
              }}
              >
              {!image && 
              <View style={styles.imageSelect}>
                <Text>Click to Take Picture</Text>
              </View>
              }
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </TouchableOpacity>
          </View>

          <View>
            <Text>Price per km</Text>
            <TextInput style={styles.input} value={car?.year} inputMode="numeric" onChangeText={(text) => { setCar(prev => ({ ...prev, price: text })) }} />
          </View>

          <View>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitText}>Put car up for Rent</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "white",
    padding: 20,
    display: "flex",
    gap: 10
  },
  input: {
    borderColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 10
  },
  chipContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5
  },
  buttonInactive: {
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  buttonActive: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderColor: "#00a6db",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10
  },
  image: {
    width: "100%",
    aspectRatio: 4/3,
    borderRadius: 10,
  },
  imageSelect: {
    display: "flex",
    width: "100%",
    aspectRatio: 4 / 3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#00CD3D",
    borderRadius: 20
  },
  submitText: {
    color: "white",
    fontWeight: "bold"
  }
})