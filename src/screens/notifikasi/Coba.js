import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

const Coba = () => {
  useEffect(() => {
    requestUserPermission();
    getToken();
  });

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('TOKEN = ', token);
  };

  return (
    <View>
      <Text>NOTIFIKASIa</Text>
    </View>
  );
};

export default Coba;

const styles = StyleSheet.create({});
