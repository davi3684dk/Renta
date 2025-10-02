import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CarsScreen from './src/screens/CarsScreen';
import { CarServiceContext } from './src/services/CarServiceContext';
import DummyCarService from './src/services/DummyCarService';
import APICarService from './src/services/APICarService';
import SettingsScreen from './src/screens/SettingsScreen';
import AppPermissions from './src/screens/AppPermissionsScreen';
import Customization from './src/screens/CustomizationScreen';
import ProfileBilling from './src/screens/ProfileBillingScreen';
import { TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';


const Stack = createStackNavigator();

function MyStack() {
  const navigation = useNavigation<any>();
  
  return (
    <Stack.Navigator initialRouteName='home'
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <TouchableOpacity style={{ paddingRight: 20 }}
            onPress={() => navigation.navigate('settings')}>
            <Entypo name="cog" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}>
      <Stack.Screen 
        name='home' component={HomeScreen} 
        options={{ headerTitle: "Home" }}
        />
      <Stack.Screen 
        name='cars' component={CarsScreen}
        options={{ headerTitle: "Find Cars" }}
        />
      <Stack.Screen 
        name='settings' component={SettingsScreen}
        options={{ headerTitle: "Settings" }}
        />
      <Stack.Screen 
        name='permission' component={AppPermissions}
        options={{ headerTitle: "App Permissions"}}
        />
      <Stack.Screen 
        name='customization' component={Customization}
        options={{ headerTitle: "Sound & Customization"}}
        />
      <Stack.Screen 
        name='profilebilling' component={ProfileBilling}
        options={{ headerTitle: "Profile & Billing"}}
        />
    </Stack.Navigator> 
  );
}

export default function App() {
  return (
    <CarServiceContext.Provider value={new APICarService}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </CarServiceContext.Provider>
  );
}