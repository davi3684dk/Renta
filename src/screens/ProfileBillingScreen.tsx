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
                style={styles.clicker}>  
                <Text style={styles.clickerText}>Add Credit Card</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.clicker}>  
                <Text style={styles.clickerText}>Add Mobile Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.clicker}>  
                <Text style={styles.clickerText}>Add Paypal</Text>
            </TouchableOpacity>

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
    margin: 10
  },
  clicker: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderColor: '#000000ff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    margin: 10,
  },
  clickerText: {
    fontWeight: 'bold'
  }
});