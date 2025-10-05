import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, StyleSheet, ScrollView } from "react-native";
import { Car } from "../types/Car";
import { CarServiceContext } from "../services/CarServiceContext";
import CarDetail from "../components/CarDetail";

export default function DetailScreen({ route }: any) {
  const navigation = useNavigation();

  const { car } = route.params;

  const [modalVisible, setModalVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: "#fff",
    },
  });

  return <ScrollView style={styles.container}>{<CarDetail car={car as Car} />}</ScrollView>;
}
