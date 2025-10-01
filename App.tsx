import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import CarsScreen from './src/screens/CarsScreen';
import { CarServiceContext } from './src/services/CarServiceContext';
import DummyCarService from './src/services/DummyCarService';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CarServiceContext.Provider value={new DummyCarService}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='home'>
          <Stack.Screen name='home' component={HomeScreen}/>
          <Stack.Screen name='cars' component={CarsScreen}/>
        </Stack.Navigator> 
      </NavigationContainer>
    </CarServiceContext.Provider>
  );
}