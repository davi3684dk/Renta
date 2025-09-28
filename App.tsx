import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CarsScreen from './src/screens/CarsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='home'>
        <Stack.Screen name='home' component={HomeScreen}/>
        <Stack.Screen name='cars' component={CarsScreen}/>
      </Stack.Navigator> 
    </NavigationContainer>
  );
}