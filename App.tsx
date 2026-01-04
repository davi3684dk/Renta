import { NavigationContainer, useFocusEffect, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import CarsScreen from "./src/screens/CarsScreen";
import { CarServiceContext } from "./src/services/CarServiceContext";
import APICarService from "./src/services/APICarService";
import SettingsScreen from "./src/screens/SettingsScreen";
import AppPermissions from "./src/screens/AppPermissionsScreen";
import Customization from "./src/screens/CustomizationScreen";
import ProfileBilling from "./src/screens/ProfileBillingScreen";
import { TouchableOpacity, ActivityIndicator, View, Text, StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AddCarScreen from "./src/screens/AddCarScreen";
import ManageCarScreen from "./src/screens/ManageCarScreen";
import MyRentedCarsScreen from "./src/screens/MyRentedCarsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import DetailScreen from "./src/screens/DetailScreen";
import MyBookingsScreen from "./src/screens/MyBookingsScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MyStack() {
  const navigation = useNavigation<any>();

  return (
    <View style={{flex: 1}}>
      <Stack.Navigator
        initialRouteName="home"
        screenOptions={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerRight: () => (
            <TouchableOpacity style={{ paddingRight: 20 }} onPress={() => navigation.navigate("settings")}>
              <Entypo name="cog" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen name="home" component={HomeScreen} options={{ headerTitle: "Home" }} />
        <Stack.Screen name="cars" component={CarsScreen} options={{ headerTitle: "Find Cars" }} />
        <Stack.Screen name="myRentedCars" component={MyRentedCarsScreen} options={{ headerTitle: "My Cars" }} />
        <Stack.Screen name="addCar" component={AddCarScreen} options={{ headerTitle: "Add Car" }} />
        <Stack.Screen name="manageCar" component={ManageCarScreen} options={{ headerTitle: "Manage Car" }} />
        <Stack.Screen name="settings" component={SettingsScreen} options={{ headerTitle: "Settings" }} />
        <Stack.Screen name="permission" component={AppPermissions} options={{ headerTitle: "App Permissions" }} />
        <Stack.Screen name="customization" component={Customization} options={{ headerTitle: "Sound & Customization" }} />
        <Stack.Screen name="profilebilling" component={ProfileBilling} options={{ headerTitle: "Profile & Billing" }} />
        <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ headerTitle: "Car Details" }} />
        <Stack.Screen name="MyBookingsScreen" component={MyBookingsScreen} options={{ headerTitle: "My Bookings" }} />
      </Stack.Navigator>
      <Footer />
    </View>
  );
}

function Navigation() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return token ? <MyStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { handleTokenExpiration } = useAuth();

  return (
      <CarServiceContext.Provider value={new APICarService(handleTokenExpiration)}>
        <SafeAreaView style={{flex: 1}}>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </SafeAreaView>
      </CarServiceContext.Provider>
  );
}

function Footer() {
  const navigation = useNavigation<any>();
  const [currentRoute, setCurrentRoute] = useState<string>("");
  
  navigation.addListener("state", () => {
    const state = navigation.getState();
    if (state && state.routes && state.index >= 0)
      setCurrentRoute(state.routes[state.index].name);
  });

  useEffect(() => {
    const state = navigation.getState();
    if (state && state.routes && state.index >= 0)
      setCurrentRoute(state.routes[state.index].name);
  }, [navigation]);

  const styles = StyleSheet.create({
    footer: {
      borderTopWidth: 1,
      borderColor: "#e0e0e0",
      backgroundColor: "#f9f9f9",
      alignContent: "center",
      justifyContent: "space-around",
      flexDirection: "row",
    },
    footerBtn: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      width: 80,
      height: 80,
    },
    footerBtnText: { color: "black", fontWeight: "bold" },
  });

  const getColor = (routeName: string) => currentRoute === routeName ? "#009de0" : "black";

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerBtn} onPress={() => 
      {
        //Clear navigation stack to prevent going back to previous screens
        navigation.reset({index: 0, routes: [{ name: "MyBookingsScreen" }]});
      }}>
        <FontAwesome5 name="car" size={24} color={getColor("MyBookingsScreen")} />
        <Text style={[styles.footerBtnText, { color: getColor("MyBookingsScreen") }]}>My Cars</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerBtn} onPress={() => {
        //Clear navigation stack to prevent going back to previous screens
        navigation.reset({index: 0, routes: [{ name: "home" }]});
      }}>
        <FontAwesome5 name="home" size={24} color={getColor("home")} />
        <Text style={[styles.footerBtnText, { color: getColor("home") }]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerBtn} onPress={() => {
        //Clear navigation stack to prevent going back to previous screens
        navigation.reset({index: 0, routes: [{ name: "myRentedCars" }]});
      }}>
        <FontAwesome5 name="plus" size={24} color={getColor("myRentedCars")} />
        <Text style={[styles.footerBtnText, { color: getColor("myRentedCars") }]}>Rent</Text>
      </TouchableOpacity>
    </View>
  );
}

