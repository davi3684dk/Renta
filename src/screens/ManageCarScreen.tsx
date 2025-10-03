import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Car } from "../types/Car";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { MarkedDates } from "react-native-calendars/src/types";

function getDateString(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate() 

    let dateString = `${year}-`
    if (month < 10) {
        dateString += `0${month}-`
    } else {
        dateString += `${month}-`
    }
    if (day < 10) {
        dateString += `0${day}`
    } else {
        dateString += day
    }

    return dateString
}

const day = (1000 * 60 * 60 * 24);

export default function ManageCarScreen({ route }: any) {
    const { car }: {car: Car} = route.params;

    const markedDates: MarkedDates = {};
    car.availability.map((item) => {
        const color = "#1a751aff"

        markedDates[getDateString(item.from)] = {
            startingDay: true,
            color: color,
            selected: true
        };

        let date = new Date(item.from.getTime() + day);
        while (date < item.to) {
            markedDates[getDateString(date)] = {
                color: color,
                selected: true
            };

            date = new Date(date.getTime() + day);
        }

        markedDates[getDateString(item.to)] = {
            endingDay: true,
            color: color,
            selected: true
        };
    });

    car.bookings.map((item) => {
        const color = "#ff4040ff"

        markedDates[getDateString(item.from)] = {
            color: color,
            selected: true
        };

        let date = new Date(item.from.getTime() + day);
        while (date < item.to) {
            markedDates[getDateString(date)] = {
                color: color,
                selected: true
            };

            date = new Date(date.getTime() + day);
        }

        markedDates[getDateString(item.to)] = {
            color: color,
            selected: true
        };
    });

    console.log(markedDates);

    return (
        <View>
            <Image style={styles.image} source={{uri: car.imageUrl}}></Image>
            <View style={styles.content}>
                <Text style={{fontSize: 24, fontWeight: "bold"}}>{car.make} {car.model}</Text>

                <Calendar
                    markedDates={markedDates}
                    markingType="period"
                    theme={{
                        todayTextColor: '#00adf5',
                        todayBackgroundColor: '#00acf55d',
                    }}
                >

                </Calendar>

                <TouchableOpacity style={styles.removeBtn}>
                    <Text style={{color: "white", fontWeight: "bold"}}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        aspectRatio: 4/3
    },
    content: {
        padding: 20
    },
    removeBtn: {
        backgroundColor: "rgba(221, 0, 0, 1)",
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    }
});