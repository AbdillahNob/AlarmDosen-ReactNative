/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// Handler untuk notifikasi saat aplikasi di background/terminated
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Pesan diterima di background:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
