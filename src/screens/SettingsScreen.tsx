import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('permission')}>
                <Text>Profile & Billing</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('customization')}>
                <Text>App Permissions</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('profilebilling')}>
                <Text>Sounds & Customization</Text>
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
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderColor: '#000000ff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  }
});