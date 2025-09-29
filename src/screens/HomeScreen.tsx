import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const [location, setLocation] = useState("");
  const [pickUpDate, setPickUpDate] = useState(new Date());
  const [dropOffDate, setDropOffDate] = useState(new Date());

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const [showPicker, setShowPicker] = useState<{
    type: "pickup" | "dropoff" | null;
    mode: "date" | "time";
  }>({ type: null, mode: "date" });

  const openPicker = (type: "pickup" | "dropoff") => {
    setShowPicker({ type, mode: "date" });
  };

  const onChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowPicker({ type: null, mode: "date" });
      return;
    }

    switch (showPicker.mode) {
      case "date": {
        switch (showPicker.type) {
          case "pickup": {
            const newDate = new Date(pickUpDate);
            newDate.setFullYear(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            );
            setPickUpDate(newDate);
            break;
          }
          case "dropoff": {
            const newDate = new Date(dropOffDate);
            newDate.setFullYear(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            );
            setDropOffDate(newDate);
            break;
          }
        }
        setShowPicker((prev) =>
          prev.type ? { ...prev, mode: "time" } : { type: null, mode: "date" }
        );
        break;
      }

      case "time": {
        switch (showPicker.type) {
          case "pickup": {
            const newDate = new Date(pickUpDate);
            newDate.setHours(
              selectedDate.getHours(),
              selectedDate.getMinutes()
            );
            setPickUpDate(newDate);
            break;
          }
          case "dropoff": {
            const newDate = new Date(dropOffDate);
            newDate.setHours(
              selectedDate.getHours(),
              selectedDate.getMinutes()
            );
            setDropOffDate(newDate);
            break;
          }
        }
        setShowPicker({ type: null, mode: "date" });
        break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Pick-up</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => openPicker("pickup")}
          >
            <Text>{formatDate(pickUpDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => openPicker("pickup")}
          >
            <Text>{formatTime(pickUpDate)}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Drop-off</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => openPicker("dropoff")}
          >
            <Text>{formatDate(dropOffDate)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => openPicker("dropoff")}
          >
            <Text>{formatTime(dropOffDate)}</Text>
          </TouchableOpacity>
        </View>

        {showPicker.type && (
          <DateTimePicker
            value={showPicker.type === "pickup" ? pickUpDate : dropOffDate}
            mode={showPicker.mode}
            display="default"
            onChange={onChange}
          />
        )}

        <TouchableOpacity
          style={styles.findBtn}
          onPress={() => navigation.navigate("cars")}
        >
          <Text style={styles.findBtnText}>Find Rental</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <Text style={{ marginBottom: 8 }}>Rent your car</Text>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => navigation.navigate("cars")}
        >
          <Text style={{ color: "white", fontSize: 18 }}>{">"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 6 },
  dateBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  findBtn: {
    backgroundColor: "#8e44ad",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  findBtnText: { color: "white", fontWeight: "bold" },
  bottom: { alignItems: "center", marginTop: 40 },
  circleBtn: {
    backgroundColor: "#8e44ad",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
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
});
