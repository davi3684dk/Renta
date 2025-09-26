import { useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View>
            <Text>Hello</Text>
            <Button
                title="Find Rental"
                onPress={() => navigation.navigate('cars')}
            />
        </View>
    );
}