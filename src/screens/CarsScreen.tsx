import { Button, FlatList, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Car, carTypeOptions, fuelTypeOptions, transmissionOptions } from "../types/Car";
import CarCard from "../components/CarCard";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import MultiSelectChips from "../components/MultiSelectChips";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RadioGroup from 'react-native-radio-buttons-group';
import dummyCars from "../dummy-data";

export default function CarsScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const [cars, setCars] = useState<Car[]>(dummyCars);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingFilter, setEditingFilter] = useState<string | null>(null);
    const [sorting, setSorting] = useState<'cheapest' | 'closest' | 'rating' | undefined>();

    const [filters, setFilters] = useState<{
      price?: {min: string, max: string},
      gear?: Car['transmission'],
      carType?: Car['carType'][],
      distance?: number,
      fuel?: Car['fuelType'][],
      seats?: boolean,
      brand?: string[],
      rating?: number
    }>({});

    //Apply sorting after the state has been applied
    useEffect(() => {
      applySorting([...cars]);
    }, [sorting]);

    const updateFilter = (type: string, value: any) => {
      setFilters(prev => ({...prev, [type]: value}));
    }

    const applyFilters = async () => {
      let filteredCars = dummyCars;

      if (filters.price) {
        const min = parseInt(filters.price.min) || 0;
        const max = parseInt(filters.price.max) || Number.MAX_SAFE_INTEGER;
        filteredCars = filteredCars.filter(car => car.pricePerKm >= min && car.pricePerKm <= max);
      }

      if (filters.gear) {
        filteredCars = filteredCars.filter(car => car.transmission === filters.gear);
      }

      if (filters.carType) {
        filteredCars = filteredCars.filter(car => filters.carType?.includes(car.carType));
      }

      if (filters.distance) {
        // Needs implementation
      }

      if (filters.fuel) {
        filteredCars = filteredCars.filter(car => filters.fuel?.includes(car.fuelType));
      }

      if (filters.brand) {
        filteredCars = filteredCars.filter(car => filters.brand?.includes(car.make));
      }

      if (filters.seats) {
        filteredCars = filteredCars.filter(car => car.seats > 5);
      }

      if (filters.rating) {
        filteredCars = filteredCars.filter(car => car.owner.rating >= (filters.rating ?? 0))
      }

      applySorting(filteredCars);

      setModalVisible(false);
    };

    function applySorting(cars: Car[]) {
      if (sorting) {
        switch (sorting) {
          case 'cheapest':
            cars.sort((a,b) => a.pricePerKm - b.pricePerKm);
            break;
          case 'closest':
            break;
          case 'rating':
            cars.sort((a,b) => b.owner.rating - a.owner.rating);
            break;
        }
      }

      setCars(cars);
    }

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: insets.bottom
      },
      searchContainer: {
        width: '100%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        padding: 17
      },
      filterContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
      },
      chip: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        gap: 4,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 5
      },
      carsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        paddingBottom: 30
      },
      carList: {
        width: '100%',
        padding: 17
      },
      modalContainer: {
        flex: 1,
      },
      modalContent: {
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'white',
        padding: 20, 
        boxShadow: '0 -4px 6px rgba(0,0,0,0.4)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 10,
        zIndex: 1000
      },
      textInput: {
        borderRadius: 10, 
        borderColor: "lightgrey", 
        borderWidth: 1
      }
    });

    function getChipStyle(selected: boolean) {
      return [styles.chip, {borderColor: selected ? '#00a6db' : '#ccc'}];
    }

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <Text>Filter by</Text>
          <ScrollView horizontal contentContainerStyle={styles.filterContainer}>
            <TouchableOpacity onPress={() => {setModalVisible(true); setEditingFilter('Price')}}>
              <View style={getChipStyle(filters.price !== undefined)}>
                <FontAwesome5 name='dollar-sign' size={24} color="black" />
                <Text>Price</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(true); setEditingFilter('Car type')}}>
              <View style={getChipStyle(filters.carType !== undefined)}>
                <FontAwesome5 name='car-side' size={24} color="black" />
                <Text>Car Type</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(true); setEditingFilter('Distance')}}>
              <View style={getChipStyle(filters.distance !== undefined)}>
                <FontAwesome5 name='map-marker-alt' size={24} color="black" />
                <Text>Distance</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(true); setEditingFilter('Gear')}}>
              <View style={getChipStyle(filters.gear !== undefined)}>
                <MaterialCommunityIcons name="car-shift-pattern" size={24} color="black" />
                <Text>Gear</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(true); setEditingFilter('Seats')}}>
              <View style={getChipStyle(filters.seats !== undefined)}>
                <MaterialCommunityIcons name="car-seat" size={24} color="black" />
                <Text>Seats</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(true); setEditingFilter('Brand')}}>
              <View style={getChipStyle(filters.brand !== undefined)}>
                <FontAwesome5 name='tags' size={24} color="black" />
                <Text>Brand</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(true); setEditingFilter('Rating')}}>
              <View style={getChipStyle(filters.rating !== undefined)}>
                <FontAwesome5 name='star' size={24} color="black" />
                <Text>Rating</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {setModalVisible(true); setEditingFilter('Fuel')}}>
              <View style={getChipStyle(filters.fuel !== undefined)}>
                <FontAwesome5 name='gas-pump' size={24} color="black" />
                <Text>Fuel</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          <Text>Sort by</Text>
          <ScrollView horizontal contentContainerStyle={styles.filterContainer}>
            <TouchableOpacity
              onPress={() => setSorting('cheapest')}>
              <View style={getChipStyle(sorting === 'cheapest')}>
                <FontAwesome5 name='dollar-sign' size={24} color="black" />
                <Text>Cheapest</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSorting('closest')}>
              <View style={getChipStyle(sorting === 'closest')}>
                <FontAwesome5 name='map-marker-alt' size={24} color="black" />
                <Text>Closest</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSorting('rating')}>
              <View style={getChipStyle(sorting === 'rating')}>
                <FontAwesome5 name='star' size={24} color="black" />
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
            renderItem={({ item }) => <CarCard car={item as Car} />}>
        </FlatList>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}>

          <TouchableOpacity 
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
            style={styles.modalContainer}>

            <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
              {editingFilter === "Price" && (
              <>
                <Text style={{fontSize: 24}}>Price Range</Text>
                <View>
                  <Text>Min Price</Text>
                  <TextInput 
                    style={styles.textInput} 
                    inputMode="numeric" 
                    value={filters.price?.min ?? '0'} 
                    onChangeText={text => updateFilter("price", {min: text, max: filters.price?.max})}/>
                </View>
                <View>
                  <Text>Max Price</Text>
                  <TextInput 
                    style={styles.textInput} 
                    inputMode="numeric" 
                    value={filters.price?.max ?? '100'} 
                    onChangeText={text => updateFilter("price", {min: filters.price?.min, max: text})}/>
                </View>
              </>
              )}
              {editingFilter === "Gear" && (
              <>
                <Text style={{fontSize: 24}}>Gear</Text>
                <MultiSelectChips
                  options={transmissionOptions}
                  selected={filters.gear}
                  onChange={(arr: any) => updateFilter("gear", arr)}
                />
              </>
              )}
              {editingFilter === "Fuel" && (
              <>
                <Text style={{fontSize: 24}}>Fuel</Text>
                <MultiSelectChips
                  options={fuelTypeOptions}
                  selected={filters.fuel ?? []}
                  onChange={(arr: any) => updateFilter("fuel", arr)}
                />
              </>
              )}
              {editingFilter === "Car type" && (
              <>
                <Text style={{fontSize: 24}}>Car type</Text>
                <MultiSelectChips
                  options={carTypeOptions}
                  selected={filters.carType ?? []}
                  onChange={(arr: any) => updateFilter("carType", arr)}
                />
              </>
              )}
              {editingFilter === "Distance" && (
              <>
                <Text style={{fontSize: 24}}>Distance</Text>
                <MultiSelectChips
                  options={[0.5, 1, 2, 3, 5]}
                  selected={filters.distance}
                  onChange={(arr: any) => updateFilter("distance", arr)}
                  anyText="Any Distance"
                  suffix="km"
                />
              </>
              )}
              {editingFilter === "Seats" && (
              <>
                <Text style={{fontSize: 24}}>Seats</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Text>Only show cars with more than 5 seats</Text>
                  <Switch
                    value={filters.seats ?? false}
                    onValueChange={(val) => updateFilter("seats", val)}/>
                </View>
              </> 
              )}
              {editingFilter === "Brand" && (
                <>
                  <Text style={{fontSize: 24}}>Brand</Text>
                  <MultiSelectChips
                    options={[...new Set(dummyCars.map(car => car.make))]}
                    selected={filters.brand ?? []}
                    onChange={(arr: any) => updateFilter("brand", arr)}
                    anyText="Any"
                  />
                </>
              )}
              {editingFilter === "Rating" && (
                <View>
                  <Text style={{fontSize: 24}}>Minumum Rating</Text>
                  <RadioGroup
                    radioButtons={[
                      {id: '4', label: '★★★★☆'},
                      {id: '3', label: '★★★☆☆'}, 
                      {id: '2', label: '★★☆☆☆'},
                      {id: '1', label: '★☆☆☆☆'}]}
                    onPress={id => updateFilter("rating", id)}
                    selectedId={filters.rating?.toString()}
                  >

                  </RadioGroup>
                </View>
              )}
              <TouchableOpacity
                style={{marginTop: 10, backgroundColor: "#1fb28a", padding: 10, borderRadius: 10}}
                onPress={applyFilters}>

                <Text style={{color: "#fff", textAlign: "center"}}>Apply</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    )
}


