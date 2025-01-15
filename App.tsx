import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import SplashSc from './src/screens/SplashSc';
import SplashSc2 from './src/screens/SplashSc2';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashSc} />
        <Stack.Screen name="Splash2" component={SplashSc2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
