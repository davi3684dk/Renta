import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CarCard from './src/components/CarCard';
import { Car } from './src/types/Car';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CarsScreen from './src/screens/CarsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AppPermissions from './src/screens/AppPermissionsScreen';
import Customization from './src/screens/CustomizationScreen';
import ProfileBilling from './src/screens/ProfileBillingScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='home'>
        <Stack.Screen name='home' component={HomeScreen}/>
        <Stack.Screen name='cars' component={CarsScreen}/>
        <Stack.Screen name='settings' component={SettingsScreen}/>
        <Stack.Screen name='permission' component={AppPermissions}/>
        <Stack.Screen name='customization' component={Customization}/>
        <Stack.Screen name='profilebilling' component={ProfileBilling}/>
      </Stack.Navigator> 
    </NavigationContainer>
  );
}