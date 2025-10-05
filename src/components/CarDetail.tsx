import { View, Text, Image, StyleSheet } from "react-native";
import { Car } from "../types/Car";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

interface CarProps {
  car: Car;
}

function getCarTypeIcon(carType: Car["carType"]) {
  switch (carType) {
    case "Truck":
      return <FontAwesome5 name="truck" size={12} color="black" />;
    case "Mini Bus":
      return <FontAwesome5 name="bus" size={12} color="black" />;
    case "Van":
      return <FontAwesome5 name="shuttle-van" size={12} color="black" />;
    default:
      return <FontAwesome5 name="car-side" size={12} color="black" />;
  }
}

function getFuelTypeIcon(fuelType: Car["fuelType"]) {
  switch (fuelType) {
    case "Electric":
      return <MaterialCommunityIcons name="battery-charging-high" size={12} color="black" />;
    default:
      return <FontAwesome5 name="gas-pump" size={12} color="black" />;
  }
}

export default function CarDetail({ car }: CarProps) {
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
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="car-shift-pattern" size={12} color="black" />
          </View>
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
        {/*<MapView
          style={styles.map}
          initialRegion={{
            latitude: car.longitude,
            longitude: car.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: car.longitude, longitude: car.latitude }}
            title={"Pick-up Location"}
            description={car.location}
          />
        </MapView>*/}
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
          <Text style={styles.ratingNumber}>4.7</Text>
          <Text style={styles.starRating}>⭐</Text>
          <Text style={styles.reviewCount}>61 reviews</Text>
        </View>

        {/* Rating Bars */}
        <View style={styles.ratingBarsContainer}>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>5 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "80%", backgroundColor: "#FFD700" }]} />
            </View>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>4 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "15%", backgroundColor: "#FFD700" }]} />
            </View>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>3 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "5%", backgroundColor: "#FFD700" }]} />
            </View>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>2 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "0%", backgroundColor: "#FFD700" }]} />
            </View>
          </View>
          <View style={styles.ratingBar}>
            <Text style={styles.starLabel}>1 stars</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "0%", backgroundColor: "#FFD700" }]} />
            </View>
          </View>
        </View>

        {/* Individual Reviews */}
        <View style={styles.reviewsList}>
          <View style={styles.reviewItem}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.avatarText}>L</Text>
            </View>
            <View style={styles.reviewContent}>
              <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.reviewAuthor}>Lene - 24. september 2025</Text>
            </View>
          </View>

          <View style={styles.reviewItem}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.avatarText}>S</Text>
            </View>
            <View style={styles.reviewContent}>
              <Text style={styles.reviewStars}>⭐⭐⭐⭐</Text>
              <Text style={styles.reviewAuthor}>Søren - 22. september 2025</Text>
            </View>
          </View>

          <View style={styles.reviewItem}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={styles.reviewContent}>
              <Text style={styles.reviewStars}>⭐⭐⭐⭐</Text>
              <Text style={styles.reviewAuthor}>Astrid - 12. september 2025</Text>
            </View>
          </View>

          <View style={styles.reviewItem}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.avatarText}>P</Text>
            </View>
            <View style={styles.reviewContent}>
              <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.reviewAuthor}>Paul - 6. september 2025</Text>
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
    padding: 10,
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
