import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Car } from "../types/Car";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { DateData, MarkedDates } from "react-native-calendars/src/types";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";
import { CarServiceContext } from "../services/CarServiceContext";
import { useNavigation } from "@react-navigation/native";

function getDateString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let dateString = `${year}-`;
  if (month < 10) {
    dateString += `0${month}-`;
  } else {
    dateString += `${month}-`;
  }
  if (day < 10) {
    dateString += `0${day}`;
  } else {
    dateString += day;
  }

  return dateString;
}

const day = 1000 * 60 * 60 * 24;

export default function ManageCarScreen({ route }: any) {
  const carService = useContext(CarServiceContext);
  const navigation = useNavigation<any>();

  useEffect(() => {
    carService?.getCar(route.params.car.id).then((car) => {
      console.log(car);
      setCar(car);
    });
  }, [])

  const [car, setCar] = useState<Car>(route.params.car);

  const [marked, setMarkedDays] = useState<MarkedDates>({});

  const [selectedPeriod, setSelectedPeriod] = useState<{
    from?: DateData;
    to?: DateData;
  }>({});

  useEffect(() => {
    updateCalendarMarkings();
  }, [selectedPeriod, car]);

  function handleCalenderPress(date: DateData): void {
    if (!selectedPeriod.from || !selectedPeriod.to) {
      setSelectedPeriod((prev) => ({ to: date, from: date }));
    } else if (date.timestamp > selectedPeriod.to.timestamp) {
      setSelectedPeriod((prev) => ({ ...prev, to: date }));
    } else if (date.timestamp < selectedPeriod.from.timestamp) {
      setSelectedPeriod((prev) => ({ ...prev, from: date }));
    } else if (date.timestamp > selectedPeriod.from.timestamp) {
      setSelectedPeriod((prev) => ({ ...prev, from: date }));
    } else if (
      date.timestamp === selectedPeriod.from.timestamp ||
      date.timestamp === selectedPeriod.to.timestamp
    ) {
      setSelectedPeriod((prev) => ({ to: date, from: date }));
    }
  }

  function updateCalendarMarkings() {
    const markedDates: MarkedDates = {};

    car.availability.map((item) => {
      const color = "#1a751aff";

      markedDates[getDateString(item.from)] = {
        startingDay: true,
        color: color,
        selected: true,
      };

      let date = new Date(item.from.getTime() + day);
      while (date < item.to) {
        markedDates[getDateString(date)] = {
          color: color,
          selected: true,
        };

        date = new Date(date.getTime() + day);
      }

      markedDates[getDateString(item.to)] = {
        endingDay: true,
        color: color,
        selected: true,
      };
    });

    car.bookings.map((item) => {
      const color = "#ff4040ff";

      markedDates[getDateString(item.from)] = {
        color: color,
        selected: true,
      };

      let date = new Date(item.from.getTime() + day);
      while (date < item.to) {
        markedDates[getDateString(date)] = {
          color: color,
          selected: true,
        };

        date = new Date(date.getTime() + day);
      }

      markedDates[getDateString(item.to)] = {
        color: color,
        selected: true,
      };
    });

    if (selectedPeriod.from && selectedPeriod.to) {
      const color = "#6baafdff";

      markedDates[selectedPeriod.from.dateString] = {
        color: color,
        selected: true,
        startingDay: true,
      };

      let date = new Date(selectedPeriod.from.timestamp + day);
      while (date.getTime() < selectedPeriod.to.timestamp) {
        markedDates[getDateString(date)] = {
          color: color,
          selected: true,
        };

        date = new Date(date.getTime() + day);
      }

      markedDates[selectedPeriod.to.dateString] = {
        color: color,
        selected: true,
        endingDay: true,
        startingDay:
          selectedPeriod.from.timestamp === selectedPeriod.to.timestamp,
      };
    }

    setMarkedDays(markedDates);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ScrollView>
          <Image style={styles.image} source={{ uri: car.imageUrl }}></Image>
          <View style={styles.content}>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Edit</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {car.make} {car.model}
            </Text>

            <Text>Availability: </Text>
            <Calendar
              markedDates={marked}
              markingType="period"
              theme={{
                todayTextColor: "#00adf5",
                todayBackgroundColor: "#00acf55d",
              }}
              onDayPress={handleCalenderPress}
            ></Calendar>

            <View>
              <TouchableOpacity
                style={styles.addAvailability}
                onPress={() => {
                  if (!selectedPeriod.from || !selectedPeriod.to) return;

                  car.availability.push({
                    from: new Date(selectedPeriod.from.timestamp),
                    to: new Date(selectedPeriod.to.timestamp),
                    id: 1,
                  });
                  carService
                    ?.addAvailability(
                      car.id.toString(),
                      new Date(selectedPeriod.from.timestamp),
                      new Date(selectedPeriod.to.timestamp)
                    )
                    .then((value) => {
                      setSelectedPeriod({});
                      setCar(car);
                    })
                    .catch((reason) => {
                      alert(reason);
                    });
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Mark selected timeframe as available
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => {
                Alert.alert(
                  "Remove Car",
                  "Are you sure you want to remove the car?",
                  [
                    {
                      text: "Yes",
                      onPress: () => {
                        carService?.removeCar(car.id.toString()).then(() => {
                          navigation.navigate("myRentedCars");
                        });
                      },
                    },
                    { text: "Cancel" },
                  ]
                );
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    aspectRatio: 4 / 3,
  },
  content: {
    padding: 20,
    gap: 10,
  },
  removeBtn: {
    backgroundColor: "rgba(221, 0, 0, 1)",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 50,
  },
  editBtn: {
    backgroundColor: "rgba(0, 221, 0, 1)",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  addAvailability: {
    backgroundColor: "rgba(0, 221, 0, 1)",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
