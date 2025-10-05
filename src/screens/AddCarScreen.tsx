import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Car } from "../types/Car";
import { getCarTypeIcon, getFuelTypeIcon, getTransmissionIcon } from "../utils/IconUtils";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { CarServiceContext } from "../services/CarServiceContext";
import {ImageManipulator, SaveFormat} from 'expo-image-manipulator';
import GooglePlacesTextInput from "react-native-google-places-textinput";
import { useNavigation } from "@react-navigation/native";

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
  imageBase64?: string;
  lat?: number;
  long?: number;
}

export default function AddCarScreen({route}: any) {
  const carService = useContext(CarServiceContext);

  const navigation = useNavigation<any>();

  const [carForm, setCarForm] = useState<CarForm>();
  const [loading, setLoading] = useState(false);

  const [updateMode, setUpdateMode] = useState(false);
  //const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    //Set car form if routed from Manage Car
    if (!route?.params?.carId || !carService)
      return;

    carService.getCar(route.params.carId).then((carData) => {
      setCarForm({
        make: carData.make,
        model: carData.model,
        year: carData.year.toString(),
        location: carData.location,
        lat: carData.lat,
        long: carData.lon,
        carType: carData.carType,
        transmission: carData.transmission,
        fuelType: carData.fuelType,
        seats: carData.seats.toString(),
        price: carData.pricePerKm.toString(),
        imageBase64: carData.imageUrl.split(',')[1],
      });
    });

    setUpdateMode(true);
  }, [])

  const getCarChip = (carType: Car["carType"]) => {
    return (
      <TouchableOpacity
        style={carForm?.carType === carType ? styles.buttonActive : styles.buttonInactive}
        onPress={() => { setCarForm(prev => ({ ...prev, carType: carType })) }}>
        {getCarTypeIcon(carType)}
        <Text>{carType}</Text>
      </TouchableOpacity>
    )
  }

  const getFuelChip = (fuelType: Car["fuelType"]) => {
    return (
      <TouchableOpacity
        style={carForm?.fuelType === fuelType ? styles.buttonActive : styles.buttonInactive}
        onPress={() => { setCarForm(prev => ({ ...prev, fuelType: fuelType })) }}>
        {getFuelTypeIcon(fuelType)}
        <Text>{fuelType}</Text>
      </TouchableOpacity>
    )
  }

  const getTransmissionChip = (transmission: Car["transmission"]) => {
    return (
      <TouchableOpacity
        style={carForm?.transmission === transmission ? styles.buttonActive : styles.buttonInactive}
        onPress={() => { setCarForm(prev => ({ ...prev, transmission: transmission })) }}>
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
      "imageBase64",
      "lat",
      "long"
    ];

    // Check missing fields
    const missing = requiredFields.filter(
      (field) => !carForm?.[field] || carForm[field]?.toString().trim() === ""
    );

    if (missing.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please fill in all required fields.${!carForm?.imageBase64 ? " And upload a car photo." : ""}`
      );
      return;
    }

    if (carService && carForm) {
      setLoading(true);

        const carParams = {
          make: carForm.make!,
          model: carForm.model!,
          year: Number.parseInt(carForm.year!),
          location: carForm.location!,
          carType: carForm.carType!,
          transmission: carForm.transmission!,
          fuelType: carForm.fuelType!,
          seats: Number.parseInt(carForm.seats!),
          price: Number.parseFloat(carForm.price!),
          image: "data:image/jpeg;base64," + carForm.imageBase64!,
          lat: carForm.lat!,
          long: carForm.long!
        }
        if (updateMode) {
          carService.updateCar(
            route.params.carId,
            carParams
          ).then((car) => {
            setLoading(false);
            navigation.goBack();
          }).catch((e) => {
            setLoading(false);
            alert(e.message)
          });
        } else {
          carService.addCar(
            carParams
          ).then((car) => {
            setLoading(false);
            navigation.goBack();
          }).catch((e) => {
            setLoading(false);
            alert(e.message)
          });
        }

    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        {loading &&
          <View style={styles.loader}>
            <ActivityIndicator size="large"/>
          </View>
        }
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <ScrollView style={{flex: 1}} contentContainerStyle={styles.main} keyboardShouldPersistTaps="handled">
            <View>
              <Text>Car Brand</Text>
              <TextInput style={styles.input} value={carForm?.make} onChangeText={(text) => { setCarForm(prev => ({ ...prev, make: text })) }} />
            </View>
            <View>
              <Text>Car Model</Text>
              <TextInput style={styles.input} value={carForm?.model} onChangeText={(text) => { setCarForm(prev => ({ ...prev, model: text })) }} />
            </View>
            <View>
              <Text>Car Year</Text>
              <TextInput style={styles.input} value={carForm?.year} inputMode="numeric" onChangeText={(text) => { setCarForm(prev => ({ ...prev, year: text })) }} />
            </View>

            <View>
              <Text>Location</Text>
              <GooglePlacesTextInput
                style={{
                  input: styles.input
                }}  
                apiKey={"AIzaSyD4u6t9lGaCT9nAh74ILpgLdFNFbj8MV7c"}
                fetchDetails={true}
                detailsFields={['location']}
                scrollEnabled={false}
                value={carForm?.location}
                onPlaceSelect={(place) => {
                  setCarForm(prev => ({
                    ...prev, 
                    location: place.structuredFormat.mainText.text, 
                    lat: place.details!.location.latitude, 
                    long: place.details!.location.longitude
                  }));
                }}
              />
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
              <TextInput inputMode="numeric" style={styles.input} value={carForm?.seats} onChangeText={(text) => { setCarForm(prev => ({ ...prev, seats: text })) }} />
            </View>

            <View style={{ marginTop: 20 }}>
              <Text>Car Photo</Text>
              <TouchableOpacity
                onPress={async () => {
                  const value = await ImagePicker.launchCameraAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1
                  });

                  if (value.canceled === true) {
                    return;
                  }

                  //Downscale and Compress to not upload 200 Mega Pixel images
                 try {
                   const manipulator = ImageManipulator.manipulate(value.assets[0].uri);
                   manipulator.resize({width: 640, height: 480});
                   const rendered = await manipulator.renderAsync();
                   const compressed = await rendered.saveAsync({
                     compress: 0.5, // 50% quality
                     format: SaveFormat.JPEG,
                     base64: true
                   });

                   setCarForm(prev => ({ ...prev, imageBase64: compressed.base64 ?? undefined }));
                 } catch (e) {
                  console.log(e);
                 }

                }}
                >
                {!carForm?.imageBase64 && 
                <View style={styles.imageSelect}>
                  <Text>Click to Take Picture</Text>
                </View>
                }
                {carForm?.imageBase64 && <Image source={{ uri: "data:image/jpeg;base64,"+carForm.imageBase64 }} style={styles.image} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  borderColor: "lightgrey",
                  borderWidth: 1,
                  borderRadius: 10,
                  backgroundColor: "#e4e4e4ff",
                  marginTop: 10,
                  marginLeft: "auto",
                  marginRight: "auto",
                  boxShadow: ""
                }}
                onPress={async () => {
                  const value = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1
                  });

                  if (value.canceled === true) {
                    return;
                  }

                  //Downscale and Compress to not upload 200 Mega Pixel images
                 try {
                   const manipulator = ImageManipulator.manipulate(value.assets[0].uri);
                   manipulator.resize({width: 640, height: 480});
                   const rendered = await manipulator.renderAsync();
                   const compressed = await rendered.saveAsync({
                     compress: 0.5, // 50% quality
                     format: SaveFormat.JPEG,
                     base64: true
                   });

                   setCarForm(prev => ({ ...prev, imageBase64: compressed.base64 ?? undefined }));
                 } catch (e) {
                  console.log(e);
                 }

                }}>
                <Text>Select image from Gallery</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text>Price per km</Text>
              <TextInput style={styles.input} value={carForm?.price} inputMode="numeric" onChangeText={(text) => { setCarForm(prev => ({ ...prev, price: text })) }} />
            </View>

            <View>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}>
                <Text style={styles.submitText}>{updateMode ? "Update Car" : "Put car up for Rent"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "white",
    padding: 20,
    display: "flex",
    gap: 10,
  },
  loader: {
    height: "100%", 
    width: "100%", 
    backgroundColor: "rgba(0,0,0,0.5)", 
    zIndex: 1000, 
    position: "absolute",
    justifyContent: "center"
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