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
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { DateData, MarkedDates } from "react-native-calendars/src/types";

const hour = 1000 * 60 * 60;

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

  const [marked, setMarkedDays] = useState<MarkedDates>({});

  const [selectedPeriod, setSelectedPeriod] = useState<{
    from?: DateData;
    to?: DateData;
  }>({});

  function handleCalendarPress(date: DateData): void {
    setSelectedPeriod(prev => {
      const { from, to } = prev;

      if (!from && !to) {
        return { from: date, to: date };
      }

      if (from && to && from.timestamp === to.timestamp) {
        if (date.timestamp < from.timestamp) {
          return { from: date, to: from };
        } else {
          return { from, to: date };
        }
      }

      return { from: date, to: date };
    });
  }

  function updateCalendarMarkings() {
    const markedDates: MarkedDates = {};

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

  useEffect(() => {
    props.onDateChange( new Date(selectedPeriod.from?.timestamp || props.pickupDate.getTime()), new Date(selectedPeriod.to?.timestamp || props.dropOffDate.getTime()));
    updateCalendarMarkings();
  }, [selectedPeriod]);

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
            props.onDateChange(newDate, newDate > props.dropOffDate ? new Date(newDate.getTime() + hour) : props.dropOffDate);
            break;
          }
          case "dropoff": {
            const newDate = new Date(props.dropOffDate);
            newDate.setFullYear(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            );
            props.onDateChange(newDate < props.pickupDate ? new Date(newDate.getTime() - hour) : props.pickupDate, newDate);
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
            props.onDateChange(newDate, newDate > props.dropOffDate ? new Date(newDate.getTime() + hour) : props.dropOffDate);
            break;
          }
          case "dropoff": {
            const newDate = new Date(props.dropOffDate);
            newDate.setHours(
              selectedDate.getHours(),
              selectedDate.getMinutes()
            );
            props.onDateChange(newDate < props.pickupDate ? new Date(newDate.getTime() - hour) : props.pickupDate, newDate);
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

      <Calendar
        markedDates={marked}
        markingType="period"
        theme={{
          todayTextColor: "#00adf5",
          todayBackgroundColor: "#00acf55d",
        }}
        onDayPress={handleCalendarPress}
      ></Calendar>

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
