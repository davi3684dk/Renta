import { View, Text, Image, StyleSheet, DimensionValue } from "react-native";
import { Car } from "../types/Car";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { getCarTypeIcon, getFuelTypeIcon, getTransmissionIcon } from "../utils/IconUtils";
import { useContext, useEffect, useState } from "react";
import { CarServiceContext } from "../services/CarServiceContext";

interface CarProps {
  car: Car;
}

export default function CarDetail({ car }: CarProps) {
  const carService = useContext(CarServiceContext);
  const [reviews, setReviews] = useState<Record<number,number>>({});

  useEffect(() => {
    carService?.getReviewDistribution(car.owner.id)
      .then((data) => {
        setReviews(data);
      });
  }, []);

  function getRatingPercentage(star: number) {
    if (reviews[5] === 0 || car.owner.numberOfReviews === 0)
      return "0%"

    return ((reviews[5] / car.owner.numberOfReviews * 100) + "%") as DimensionValue;
  }

  return (
    <View style={styles.container}>
      {/* Car Title and Image */}
      <Image source={{ uri: car.imageUrl }} style={styles.carImage} resizeMode="contain" />
      <View style={styles.titleContainer}>
        <Text style={styles.carTitle}>
          {car.make} {car.model}
        </Text>
        <Text style={styles.carSubtitle}>{car.year}</Text>
      </View>

      {/* Owner Info */}
      <View style={styles.ownerContainer}>
        <View style={styles.ownerName}>
          <Image
            source={{ uri: car.owner.avatarUrl }}
            style={{ width: 24, height: 24, borderRadius: 12 }}
            resizeMode="cover"
          />
          <Text>{car.owner.name}</Text>
        </View>

        <Text>
          {car.owner.rating} ⭐ ({car.owner.numberOfReviews})
        </Text>
        <FontAwesome5 name="map-marker-alt" size={24} color="black" />
        <Text>{car.location}</Text>
      </View>

      {/* Features section*/}
      <View style={styles.featuresContainer}>
        <View style={styles.featurePin}>
          <View style={styles.featureIcon}>{getCarTypeIcon(car.carType)}</View>
          <Text>{car.carType}</Text>
        </View>
        <View style={styles.featurePin}>
          <View style={styles.featureIcon}>{getFuelTypeIcon(car.fuelType)}</View>
          <Text>{car.fuelType}</Text>
        </View>
        <View style={styles.featurePin}>
          <View style={styles.featureIcon}>{getTransmissionIcon(car.transmission)}</View>
          <Text>{car.transmission}</Text>
        </View>
        <View style={styles.featurePin}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="car-seat" size={12} color="black" />
          </View>
          <Text>{car.seats} seats</Text>
        </View>
      </View>

      {/* Accessories section */}
      <View style={styles.paragraphContainer}>
        <Text style={styles.paragraphTitle}>Accessories</Text>
        <View style={styles.accessoriesList}>
          <View style={styles.accessoryItem}>
            <MaterialCommunityIcons name="tire" size={28} color="black" />
            <Text style={styles.accessoryText}>Winter Tires</Text>
          </View>
          <View style={styles.accessoryItem}>
            <MaterialCommunityIcons name="snowflake" size={28} color="black" />
            <Text style={styles.accessoryText}>Aircondition</Text>
          </View>
          <View style={styles.accessoryItem}>
            <MaterialCommunityIcons name="car-seat-heater" size={28} color="black" />
            <Text style={styles.accessoryText}>Heated Seats</Text>
          </View>
          <View style={styles.accessoryItem}>
            <MaterialCommunityIcons name="map-marker-radius" size={28} color="black" />
            <Text style={styles.accessoryText}>GPS Navigation</Text>
          </View>
        </View>
      </View>

      {/* Pick-up & Drop-off Location with Map */}
      <View style={styles.paragraphContainer}>
        <Text style={styles.paragraphTitle}>Pick-up & Drop-off Location</Text>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: car.lat ?? 0,
            longitude: car.lon ?? 0,
            latitudeDelta: 0.0522,
            longitudeDelta: 0.0221,
          }}
        >
          <Marker
            coordinate={{ latitude: car.lat, longitude: car.lon }}
            title={"Pick-up Location"}
            description={car.location}
          />
        </MapView>
      </View>

      {/* Benefits Included section*/}
      <View style={styles.paragraphContainer}>
        <Text style={styles.paragraphTitle}>Benefits Included</Text>
        <View style={styles.benefitItem}>
          <MaterialCommunityIcons name="shield-check-outline" size={28} color="black" />
          <Text style={styles.paragraphTitle2}>Insurance and Roadside Assistance</Text>
        </View>
        <Text style={styles.paragraphText}>
          All rentals include comprehensive insurance and 24/7 roadside assistance for a worry-free experience.
        </Text>
        <View style={styles.benefitItem}>
          <MaterialCommunityIcons name="speedometer" size={28} color="black" />
          <Text style={styles.paragraphTitle2}>Discount on Pre-paid Kilometers</Text>
        </View>
        <Text style={styles.paragraphText}>
          Save more when you pre-pay for kilometers. Enjoy discounted rates for longer distances.
        </Text>
      </View>

      {/* Reviews Section */}
      <View style={styles.paragraphContainer}>
        <Text style={styles.paragraphTitle}>Reviews</Text>

        {/* Rating Summary */}
        <View style={styles.ratingSummary}>
          <Text style={styles.ratingNumber}>{car.owner.rating}</Text>
          <Text style={styles.starRating}>⭐</Text>
          <Text style={styles.reviewCount}>{car.owner.numberOfReviews} reviews</Text>
        </View>

        {/* Rating Bars */}
        <View style={styles.ratingBarsContainer}>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>5 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: getRatingPercentage(5), backgroundColor: "#FFD700" }]} />
            </View>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>4 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: getRatingPercentage(4), backgroundColor: "#FFD700" }]} />
            </View>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>3 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: getRatingPercentage(3), backgroundColor: "#FFD700" }]} />
            </View>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>2 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: getRatingPercentage(2), backgroundColor: "#FFD700" }]} />
            </View>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>1 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: getRatingPercentage(1), backgroundColor: "#FFD700" }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 10,
    padding: 20,
    width: "100%",
  },
  paragraphContainer: {
    display: "flex",
    flexDirection: "column",
    marginVertical: 10,
  },
  paragraphTitle: {
    fontSize: 24,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  paragraphText: {
    fontSize: 16,
    fontFamily: "Roboto",
    color: "black",
  },
  map: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  carTitle: {
    fontSize: 30,
    fontFamily: "Roboto",
    color: "black",
    marginRight: 10,
    marginBottom: 5,
    alignSelf: "center",
  },
  carSubtitle: {
    fontSize: 20,
    fontFamily: "Roboto",
    color: "black",
    alignSelf: "center",
  },
  carImage: {
    width: "100%",
    aspectRatio: 1.3,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },

  ownerContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    marginVertical: 5,
  },
  ownerName: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  featuresContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    borderTopColor: "lightgray",
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  featurePin: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  featureIcon: {
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderColor: "lightgray",
    borderWidth: 1,
  },
  accessoriesList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  accessoryItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  accessoryText: {
    fontSize: 18,
    fontFamily: "Roboto",
    color: "black",
  },
  paragraphTitle2: {
    fontSize: 20,
    fontFamily: "Roboto",
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
    marginTop: 5,
  },
  benefitItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  // Reviews section styles
  ratingSummary: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  ratingNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
  starRating: {
    fontSize: 24,
  },
  reviewCount: {
    fontSize: 16,
    color: "gray",
  },
  ratingBarsContainer: {
    marginBottom: 20,
  },
  ratingBar: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 10,
  },
  starLabel: {
    fontSize: 14,
    color: "black",
    width: 50,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  reviewsList: {
    gap: 15,
  },
  reviewItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8A2BE2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  reviewContent: {
    flex: 1,
  },
  reviewStars: {
    fontSize: 16,
    marginBottom: 2,
  },
  reviewAuthor: {
    fontSize: 14,
    color: "gray",
  },
});
