import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function ProfileBilling() {

    return (
        <View style={styles.container}>
            
            <Text style={styles.headline}>Edit Profile</Text>
            
            <TextInput editable style={styles.input}
                placeholder='Username'
            />

            <TextInput editable style={styles.input}
                placeholder="Password"
            />

            <TextInput editable style={styles.input}
                placeholder="Address"
            />

            <TextInput editable style={styles.input}
                placeholder="Phone Number"
            />

            <Text style={styles.headline}>Payment Info</Text>

            <TouchableOpacity 
                style={styles.input}>  
                <Text>Add Credit Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.input}>  
                <Text>Add Mobile Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.input}>  
                <Text>Add Paypal</Text>
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