import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { CarServiceContext } from "../services/CarServiceContext";
import { Car } from "../types/Car";
import CarCard from "../components/CarCard";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserIdFromToken = async (): Promise<number | null> => {
  try {
    const token = await AsyncStorage.getItem("jwt");
    if (!token) return null;

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload.sub || payload.userId || payload.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default function MyRentedCarsScreen() {
  const navigation = useNavigation<any>();
  const carService = useContext(CarServiceContext);
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadMyCars();
    }, [])
  );

  const loadMyCars = async () => {
    try {
      setIsLoading(true);
      if (carService) {
        console.log("Loading cars for logged-in user");
        const userId = await getUserIdFromToken();

        if (userId) {
          const myCars = await carService.getMyCars(userId);
          setCars(myCars);
        } else {
          console.error("Could not get user ID from token");
          setCars([]);
        }
      }
    } catch (error) {
      console.error("Error loading my cars:", error);
      setCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCarPress = (car: Car) => {
    navigation.navigate("manageCar", { car });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8e44ad" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {cars.length > 0 && (
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("addCar")}
            >
              <Text style={styles.addButtonText}>Rent out new Car</Text>
            </TouchableOpacity>
          </View>
        )}
        {cars.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              You haven't rented out any cars yet
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate("addCar")}
            >
              <Text style={styles.emptyButtonText}>Add Your First Car</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={cars}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCarPress(item)}>
                <CarCard car={item} onPress={(car) => navigation.navigate("manageCar", { car })}/>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#8e44ad",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
    gap: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: "#8e44ad",
    padding: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
