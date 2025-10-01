import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { TextInput, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface LocationAndTimeProps {
  pickupDate?: Date,
  dropOffDate?: Date,
  location?: string,
  onDateChange: (pickUpDate: Date, dropOffDate: Date) => void,
  onLocationChange: (location: string) => void
}

export default function LocationAndTimeComponent(props: LocationAndTimeProps) {
  const [location, setLocation] = useState(props.location ?? "");
  const [pickUpDate, setPickUpDate] = useState(props.pickupDate ?? new Date());
  const [dropOffDate, setDropOffDate] = useState(props.dropOffDate ?? new Date());

  useEffect(() => {
    props.onDateChange(pickUpDate, dropOffDate);
  }, [pickUpDate, dropOffDate])

  useEffect(() => {
    props.onLocationChange(location);
  }, [location])

  const formatDate = (date: Date) =>
    date.toLocaleDateString("da-DK", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("da-DK", { hour: "numeric", minute: "2-digit" });

  const [showPicker, setShowPicker] = useState<{
    type: "pickup" | "dropoff" | null;
    mode: "date" | "time";
  }>({ type: null, mode: "date" });

  const openPicker = (type: "pickup" | "dropoff", mode: "date" | "time") => {
    setShowPicker({ type, mode });
  };

  const onChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate || e.type === 'dismissed') {
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
            if (newDate > dropOffDate)
              setDropOffDate(newDate);
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
            if (newDate < pickUpDate)
              setPickUpDate(newDate);
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
            if (newDate > dropOffDate)
              setDropOffDate(newDate);
            break;
          }
          case "dropoff": {
            const newDate = new Date(dropOffDate);
            newDate.setHours(
              selectedDate.getHours(),
              selectedDate.getMinutes()
            );
            setDropOffDate(newDate);
            if (newDate < pickUpDate)
              setPickUpDate(newDate);
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
          onPress={() => openPicker("pickup", "date")}
        >
          <Text>{formatDate(pickUpDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => openPicker("pickup", "time")}
        >
          <Text>{formatTime(pickUpDate)}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Drop-off</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => openPicker("dropoff", "date")}
        >
          <Text>{formatDate(dropOffDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => openPicker("dropoff", "time")}
        >
          <Text>{formatTime(dropOffDate)}</Text>
        </TouchableOpacity>
      </View>

      {showPicker.type && (
        <DateTimePicker
          value={showPicker.type === "pickup" ? pickUpDate : dropOffDate}
          mode={showPicker.mode}
          display={showPicker.mode === 'date' ? 'default' : 'spinner'}
          minimumDate={showPicker.type === "pickup" ? new Date() : pickUpDate}
          onChange={onChange}
          is24Hour
        />
      )}
    </View>
  )
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
})