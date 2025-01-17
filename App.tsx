import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import SplashSc from './src/screens/SplashSc';
import SplashSc2 from './src/screens/SplashSc2';
import Login from './src/screens/Login';
import BuatAkun from './src/screens/crud/BuatAkun';
import Dashboard from './src/screens/Dashboard';
import TambahJadwal from './src/screens/crud/TambahJadwal';
import EditJadwal from './src/screens/crud/EditJadwal';
import Notifikasi from './src/screens/notifikasi/Notifikasi';
import Coba from './src/screens/notifikasi/Coba';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Coba"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashSc} />
        <Stack.Screen name="Splash2" component={SplashSc2} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="BuatAkun" component={BuatAkun} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="TambahJadwal" component={TambahJadwal} />
        <Stack.Screen name="EditJadwal" component={EditJadwal} />
        <Stack.Screen
          name="Notifikasi"
          component={Notifikasi}
          options={{presentation: 'modal', headerShown: false}}
        />
        <Stack.Screen name="Coba" component={Coba} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
