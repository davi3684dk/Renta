import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import CarsScreen from "./src/screens/CarsScreen";
import { CarServiceContext } from "./src/services/CarServiceContext";
import APICarService from "./src/services/APICarService";
import SettingsScreen from "./src/screens/SettingsScreen";
import AppPermissions from "./src/screens/AppPermissionsScreen";
import Customization from "./src/screens/CustomizationScreen";
import ProfileBilling from "./src/screens/ProfileBillingScreen";
import { TouchableOpacity, ActivityIndicator, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import AddCarScreen from "./src/screens/AddCarScreen";
import ManageCarScreen from "./src/screens/ManageCarScreen";
import MyRentedCarsScreen from "./src/screens/MyRentedCarsScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";

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
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerRight: () => (
          <TouchableOpacity
            style={{ paddingRight: 20 }}
            onPress={() => navigation.navigate("settings")}
          >
            <Entypo name="cog" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{ headerTitle: "Home" }}
      />
      <Stack.Screen
        name="cars"
        component={CarsScreen}
        options={{ headerTitle: "Find Cars" }}
      />
      <Stack.Screen
        name="myRentedCars"
        component={MyRentedCarsScreen}
        options={{ headerTitle: "My Rented Cars" }}
      />
      <Stack.Screen
        name="addCar"
        component={AddCarScreen}
        options={{ headerTitle: "Add Car" }}
      />
      <Stack.Screen
        name="manageCar"
        component={ManageCarScreen}
        options={{ headerTitle: "Manage Car" }}
      />
      <Stack.Screen
        name="settings"
        component={SettingsScreen}
        options={{ headerTitle: "Settings" }}
      />
      <Stack.Screen
        name="permission"
        component={AppPermissions}
        options={{ headerTitle: "App Permissions" }}
      />
      <Stack.Screen
        name="customization"
        component={Customization}
        options={{ headerTitle: "Sound & Customization" }}
      />
      <Stack.Screen
        name="profilebilling"
        component={ProfileBilling}
        options={{ headerTitle: "Profile & Billing" }}
      />
    </Stack.Navigator>
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
    <CarServiceContext.Provider
      value={new APICarService(handleTokenExpiration)}
    >
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </CarServiceContext.Provider>
  );
}
