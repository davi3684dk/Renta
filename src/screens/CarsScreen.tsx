import { Button, FlatList, StyleSheet, View } from "react-native";
import { Car } from "../types/Car";
import CarCard from "../components/CarCard";
import { useNavigation } from "@react-navigation/native";

const cars: Car[] = [
  {
    id: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    pricePerKm: 20,
    location: "5000 Odense C",
    imageUrl: "https://gomore.imgix.net/uploads/car_picture/image/605580/car_a117386e-a1cb-4f07-b39e-a64facffd724.jpg?w=768&h=511&fit=crop&auto=format%2Ccompress&dpr=1",
    owner: {
      id: 1,
      name: "John Doe",
      avatarUrl: "https://cdn-icons-png.freepik.com/512/6858/6858504.png",
      rating: 4.5,
      numberOfReviews: 10,
    },
    carType: "Medium",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
  },
  {
    id: 2,
    make: "Toyota",
    model: "Yaris",
    year: 2012,
    pricePerKm: 5,
    location: "5000 Odense C",
    imageUrl: "https://gomore.imgix.net/uploads/car_picture/image/681176/car_f852641f-82c7-473a-8a7f-fe66116d1030.jpg?w=768&h=511&fit=crop&auto=format%2Ccompress&dpr=1",
    owner: {
      id: 2,
      name: "Jane Smith",
      avatarUrl: "https://cdn-icons-png.freepik.com/512/6858/6858504.png",
      rating: 4.7,
      numberOfReviews: 17,
    },
    carType: "Micro Car",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2019,
    pricePerKm: 8,
    location: "5000 Odense C",
    imageUrl: "https://gomore.imgix.net/uploads/car_picture/image/1505746/car_1757328249.jpg?w=768&h=511&fit=crop&auto=format%2Ccompress&dpr=1",
    owner: {
      id: 3,
      name: "Robert Brown",
      avatarUrl: "https://cdn-icons-png.freepik.com/512/6858/6858504.png",
      rating: 4.1,
      numberOfReviews: 25,
    },
    carType: "Medium",
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
  },
  {
    id: 4,
    make: "Renault",
    model: "Clio",
    year: 2018,
    pricePerKm: 6,
    location: "5000 Odense C",
    imageUrl: "https://gomore.imgix.net/uploads/car_picture/image/682830/car_1670596956.jpg?w=768&h=511&fit=crop&auto=format%2Ccompress&dpr=1",
    owner: {
      id: 4,
      name: "Sarah Johnson",
      avatarUrl: "https://cdn-icons-png.freepik.com/512/6858/6858504.png",
      rating: 5.0,
      numberOfReviews: 2,
    },
    carType: "Medium",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 5,
  }
]


export default function CarsScreen() {
    const navigation = useNavigation();
    
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.carList}
                data={cars}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.carsContainer}
                renderItem={({ item }) => <CarCard car={item as Car} />}
            >
            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  carList: {
    width: '100%',
    padding: 10,
  }
});
