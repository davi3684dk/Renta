import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet } from "react-native";

export default function SettingsScreen() {
    const navigation = useNavigation();

    return (
        <View>
            <Text>Setting</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});