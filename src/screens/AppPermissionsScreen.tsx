import { Text, View, StyleSheet } from "react-native";

export default function AppPermissions() {

    return (
        <View>
            <Text>AppPermission</Text>
        </View>
    );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
  },
  input: {
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderColor: '#000000ff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  headline: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10
  }
});