import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";

interface LocationAndTimeProps {
  pickupDate: Date;
  dropOffDate: Date;
  location?: string;
  onDateChange: (pickUpDate: Date, dropOffDate: Date) => void;
  onLocationChange: (place: {location: string, lat: number, long: number}) => void;
}

export type Place = {
    location: string;
    lat: number;
    long: number;
}

export default function LocationAndTimeComponent(props: LocationAndTimeProps) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" });

  const [showPicker, setShowPicker] = useState<{
    type: "pickup" | "dropoff" | null;
    mode: "date" | "time";
  }>({ type: null, mode: "date" });

  const openPicker = (type: "pickup" | "dropoff", mode: "date" | "time") => {
    setShowPicker({ type, mode });
  };

  const onChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate || e.type === "dismissed") {
      setShowPicker({ type: null, mode: "date" });
      return;
    }

    switch (showPicker.mode) {
      case "date": {
        switch (showPicker.type) {
          case "pickup": {
            const newDate = new Date(props.pickupDate);
            newDate.setFullYear(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            );
            props.onDateChange(newDate, newDate > props.dropOffDate ? newDate : props.dropOffDate);
            break;
          }
          case "dropoff": {
            const newDate = new Date(props.dropOffDate);
            newDate.setFullYear(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            );
            props.onDateChange(newDate < props.pickupDate ? newDate : props.pickupDate, newDate);
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
            const newDate = new Date(props.pickupDate);
            newDate.setHours(
              selectedDate.getHours(),
              selectedDate.getMinutes()
            );
            props.onDateChange(newDate, newDate > props.dropOffDate ? newDate : props.dropOffDate);
            break;
          }
          case "dropoff": {
            const newDate = new Date(props.dropOffDate);
            newDate.setHours(
              selectedDate.getHours(),
              selectedDate.getMinutes()
            );
            props.onDateChange(newDate < props.pickupDate ? newDate : props.pickupDate, newDate);
            break;
          }
        }
        setShowPicker({ type: null, mode: "date" });
        break;
      }
    }
  };

  return (
    <View>
      <GooglePlacesTextInput
        apiKey="AIzaSyD4u6t9lGaCT9nAh74ILpgLdFNFbj8MV7c"
        fetchDetails={true}
        detailsFields={["location"]}
        placeHolderText="Search for a location"
        onPlaceSelect={(place) => {
          if (place.structuredFormat.mainText) {
            props.onLocationChange({location: place.structuredFormat.mainText.text, lat: place.details!.location.latitude, long: place.details!.location.longitude});
          }
        }}
        value={props.location}
      />

      <Text style={styles.label}>Pick-up</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => openPicker("pickup", "date")}
        >
          <Text>{formatDate(props.pickupDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => openPicker("pickup", "time")}
        >
          <Text>{formatTime(props.pickupDate)}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Drop-off</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => openPicker("dropoff", "date")}
        >
          <Text>{formatDate(props.dropOffDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => openPicker("dropoff", "time")}
        >
          <Text>{formatTime(props.dropOffDate)}</Text>
        </TouchableOpacity>
      </View>

      {showPicker.type && (
        <DateTimePicker
          value={showPicker.type === "pickup" ? props.pickupDate : props.dropOffDate}
          mode={showPicker.mode}
          display={showPicker.mode === "date" ? "default" : "spinner"}
          minimumDate={showPicker.type === "pickup" ? new Date() : props.pickupDate}
          onChange={onChange}
          is24Hour
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
