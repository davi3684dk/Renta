import {
  Button,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Car,
  carTypeOptions,
  fuelTypeOptions,
  transmissionOptions,
} from "../types/Car";
import CarCard from "../components/CarCard";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useContext, useEffect, useState } from "react";
import MultiSelectChips from "../components/MultiSelectChips";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RadioGroup from "react-native-radio-buttons-group";
import { CarServiceContext } from "../services/CarServiceContext";
import { CarFilter, CarSort } from "../types/CarService";
import LocationAndTimeComponent from "../components/LocationAndTimePicker";

export default function CarsScreen({ route }: any) {
  const carService = useContext(CarServiceContext);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [cars, setCars] = useState<Car[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingFilter, setEditingFilter] = useState<string | null>(null);
  const [sorting, setSorting] = useState<CarSort>();

  const { fromDate, toDate, place } = route.params;

  const [filters, setFilters] = useState<CarFilter>({
    fromDate: fromDate,
    toDate: toDate,
    location: place.location,
    lat: place.lat,
    long: place.long,
  });

  useEffect(() => {
    if (carService) {
      carService.getCars(filters, sorting).then((c) => setCars(c));
    }
  }, [sorting, filters]);

  const updateFilter = (type: string, value: any) => {
    if (Array.isArray(value) && value.length === 0) value = undefined;

    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: insets.bottom,
    },
    searchContainer: {
      width: "100%",
      boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
      display: "flex",
      flexDirection: "column",
      padding: 17,
    },
    filterContainer: {
      display: "flex",
      flexDirection: "row",
      gap: 10,
    },
    chip: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 10,
      paddingLeft: 10,
      gap: 4,
      borderWidth: 2,
      borderColor: "#ccc",
      borderRadius: 20,
      padding: 5,
    },
    carsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      paddingBottom: 30,
    },
    carList: {
      width: "100%",
      padding: 17,
    },
    modalContainer: {
      flex: 1,
    },
    modalContent: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
      padding: 20,
      boxShadow: "0 -4px 6px rgba(0,0,0,0.4)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      zIndex: 1000,
    },
    textInput: {
      borderRadius: 10,
      borderColor: "lightgrey",
      borderWidth: 1,
    },
    locationContainer: {
      backgroundColor: "lightgrey",
      borderRadius: 10,
      padding: 10,
    },
    dateText: {
      color: "grey",
    },
    locationText: {
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  function getChipStyle(selected: boolean) {
    return [styles.chip, { borderColor: selected ? "#00a6db" : "#ccc" }];
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => {
            setEditingFilter("Location");
            setModalVisible(true);
          }}
        >
          <Text style={styles.locationText}>{filters.location}</Text>
          <Text style={styles.dateText}>
            {(filters.fromDate as Date).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}{" "}
            -{" "}
            {(filters.toDate as Date).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </Text>
        </TouchableOpacity>
        <Text>Filter by</Text>
        <ScrollView horizontal contentContainerStyle={styles.filterContainer}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEditingFilter("Price");
            }}
          >
            <View
              style={getChipStyle(
                filters.priceMin !== undefined || filters.priceMax !== undefined
              )}
            >
              <FontAwesome5 name="dollar-sign" size={24} color="black" />
              <Text>Price</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEditingFilter("Car type");
            }}
          >
            <View style={getChipStyle(filters.carType !== undefined)}>
              <FontAwesome5 name="car-side" size={24} color="black" />
              <Text>Car Type</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEditingFilter("Distance");
            }}
          >
            <View style={getChipStyle(filters.distance !== undefined)}>
              <FontAwesome5 name="map-marker-alt" size={24} color="black" />
              <Text>Distance</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEditingFilter("Gear");
            }}
          >
            <View style={getChipStyle(filters.transmission !== undefined)}>
              <MaterialCommunityIcons
                name="car-shift-pattern"
                size={24}
                color="black"
              />
              <Text>Gear</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEditingFilter("Seats");
            }}
          >
            <View style={getChipStyle(filters.moreThan5Seats !== undefined)}>
              <MaterialCommunityIcons name="car-seat" size={24} color="black" />
              <Text>Seats</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEditingFilter("Brand");
            }}
          >
            <View style={getChipStyle(filters.brand !== undefined)}>
              <FontAwesome5 name="tags" size={24} color="black" />
              <Text>Brand</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEditingFilter("Rating");
            }}
          >
            <View style={getChipStyle(filters.minRating !== undefined)}>
              <FontAwesome5 name="star" size={24} color="black" />
              <Text>Rating</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setEditingFilter("Fuel");
            }}
          >
            <View style={getChipStyle(filters.fuelType !== undefined)}>
              <FontAwesome5 name="gas-pump" size={24} color="black" />
              <Text>Fuel</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <Text>Sort by</Text>
        <ScrollView horizontal contentContainerStyle={styles.filterContainer}>
          <TouchableOpacity onPress={() => setSorting("Cheapest")}>
            <View style={getChipStyle(sorting === "Cheapest")}>
              <FontAwesome5 name="dollar-sign" size={24} color="black" />
              <Text>Cheapest</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSorting("Closest")}>
            <View style={getChipStyle(sorting === "Closest")}>
              <FontAwesome5 name="map-marker-alt" size={24} color="black" />
              <Text>Closest</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSorting("Rating")}>
            <View style={getChipStyle(sorting === "Rating")}>
              <FontAwesome5 name="star" size={24} color="black" />
              <Text>Rating</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <FlatList
        style={styles.carList}
        data={cars}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.carsContainer}
        renderItem={({ item }) => <CarCard car={item as Car} />}
      ></FlatList>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
          style={styles.modalContainer}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            {editingFilter === "Price" && (
              <>
                <Text style={{ fontSize: 24 }}>Price Range</Text>
                <View>
                  <Text>Min Price</Text>
                  <TextInput
                    style={styles.textInput}
                    inputMode="numeric"
                    value={filters.priceMin?.toString() ?? "0"}
                    onChangeText={(text) => updateFilter("priceMin", text)}
                  />
                </View>
                <View>
                  <Text>Max Price</Text>
                  <TextInput
                    style={styles.textInput}
                    inputMode="numeric"
                    value={filters.priceMax?.toString() ?? "100"}
                    onChangeText={(text) => updateFilter("priceMax", text)}
                  />
                </View>
              </>
            )}
            {editingFilter === "Gear" && (
              <>
                <Text style={{ fontSize: 24 }}>Gear</Text>
                <MultiSelectChips
                  options={transmissionOptions}
                  selected={filters.transmission}
                  onChange={(arr: any) => updateFilter("transmission", arr)}
                />
              </>
            )}
            {editingFilter === "Fuel" && (
              <>
                <Text style={{ fontSize: 24 }}>Fuel</Text>
                <MultiSelectChips
                  options={fuelTypeOptions}
                  selected={filters.fuelType ?? []}
                  onChange={(arr: any) => updateFilter("fuelType", arr)}
                />
              </>
            )}
            {editingFilter === "Car type" && (
              <>
                <Text style={{ fontSize: 24 }}>Car type</Text>
                <MultiSelectChips
                  options={carTypeOptions}
                  selected={filters.carType ?? []}
                  onChange={(arr: any) => updateFilter("carType", arr)}
                />
              </>
            )}
            {editingFilter === "Distance" && (
              <>
                <Text style={{ fontSize: 24 }}>Distance</Text>
                <MultiSelectChips
                  options={[0.5, 1, 2, 3, 5]}
                  selected={filters.distance}
                  onChange={(arr: any) => updateFilter("distance", arr)}
                  anyText="10 km"
                  suffix="km"
                />
              </>
            )}
            {editingFilter === "Seats" && (
              <>
                <Text style={{ fontSize: 24 }}>Seats</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text>Only show cars with more than 5 seats</Text>
                  <Switch
                    value={filters.moreThan5Seats ?? false}
                    onValueChange={(val) => updateFilter("moreThan5Seats", val)}
                  />
                </View>
              </>
            )}
            {editingFilter === "Brand" && (
              <>
                <Text style={{ fontSize: 24 }}>Brand</Text>
                <MultiSelectChips
                  options={[...new Set(dummyCars.map((car) => car.make))]}
                  selected={filters.brand ?? []}
                  onChange={(arr: any) => updateFilter("brand", arr)}
                  anyText="Any"
                />
              </>
            )}
            {editingFilter === "Rating" && (
              <View>
                <Text style={{ fontSize: 24 }}>Minumum Rating</Text>
                <RadioGroup
                  radioButtons={[
                    { id: "4", label: "★★★★☆" },
                    { id: "3", label: "★★★☆☆" },
                    { id: "2", label: "★★☆☆☆" },
                    { id: "1", label: "★☆☆☆☆" },
                  ]}
                  onPress={(id) => updateFilter("minRating", id)}
                  selectedId={filters.minRating?.toString()}
                ></RadioGroup>
              </View>
            )}
            {editingFilter === "Location" && (
              <LocationAndTimeComponent
                pickupDate={filters.fromDate}
                dropOffDate={filters.toDate}
                location={filters.location}
                onDateChange={(pickupDate: Date, dropoffDate: Date) => {
                  updateFilter("fromDate", pickupDate);
                  updateFilter("toDate", dropoffDate);
                }}
                onLocationChange={(place) => {
                  setFilters((prev) => ({
                    ...prev,
                    location: place.location,
                    lat: place.lat,
                    long: place.long,
                  }));
                }}
              />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
