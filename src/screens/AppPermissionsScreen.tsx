import { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Switch } from "react-native";

export default function AppPermissions() {

    const [bool, setBool] = useState<boolean>(false)

    return (
        <View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setBool(!bool)}>  
                    <Text style={{paddingLeft:10, fontWeight: 'bold'}}>All Permissions</Text>
                </TouchableOpacity>
                <Switch
                    style={styles.switch}
                    value={bool}
                    onValueChange={(value) => setBool(value)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
   container: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderColor: '#000000ff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    margin: 20,
  },
  headline: {
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10
  },
  switch: {
    margin: 10,
  }
});