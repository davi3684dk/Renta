import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Text>Press Here</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#000000ff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5
  }
});