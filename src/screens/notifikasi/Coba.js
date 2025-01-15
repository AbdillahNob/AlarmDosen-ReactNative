import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import notifee, {
  AndroidImportance,
  AndroidColor,
  EventType,
} from '@notifee/react-native';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';

const Coba = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  useEffect(() => {
    requestPermissionNotifee();
    createNotificationChannel();

    // Listen event ketika tombol "Matikan Alarm" ditekan
    const unsubscribe = notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.ACTION_PRESS && detail.pressAction.id === 'stop') {
        stopAlarm();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Minta izin notifikasi
  const requestPermissionNotifee = async () => {
    await notifee.requestPermission();
  };

  // Buat channel notifikasi
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'alarm-channel-v3', // GANTI ID CHANNEL
      name: 'Alarm Pengingat Jadwal',
      importance: AndroidImportance.HIGH,
      sound: 'alarm_tone',
      vibration: true,
    });
  };

  // Tampilkan Date Picker
  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: selectedDate,
      mode: 'date',
      is24Hour: true,
      onChange: (event, date) => {
        if (date) setSelectedDate(date);
      },
    });
  };

  // Tampilkan Time Picker
  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: selectedTime,
      mode: 'time',
      is24Hour: true,
      onChange: (event, time) => {
        if (time) setSelectedTime(time);
      },
    });
  };

  // Jadwalkan alarm
  async function scheduleAlarm() {
    const combinedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0,
    );

    const now = new Date();
    const delay = combinedDateTime.getTime() - now.getTime();

    if (delay <= 0) {
      Alert.alert('Error', 'Waktu yang dipilih sudah lewat!');
      return;
    }

    setTimeout(async () => {
      // Mulai alarm sebagai Foreground Service
      await notifee.displayNotification({
        title: '⏰ Alarm Berbunyi!',
        body: 'Tekan untuk mematikan alarm.',
        android: {
          channelId: 'alarm-channel-v3',
          color: AndroidColor.RED,
          sound: 'alarm_tone',
          ongoing: true, // Notifikasi tidak bisa di-swipe
          loopSound: true,
          importance: AndroidImportance.HIGH,
          fullScreenAction: {
            id: 'default',
          },
          actions: [
            {
              title: '🛑 Matikan Alarm',
              pressAction: {
                id: 'stop',
              },
            },
          ],
        },
      });

      console.log('Alarm berbunyi!');
    }, delay);

    Alert.alert(
      'Alarm Dijadwalkan',
      `Alarm akan berbunyi pada: ${combinedDateTime}`,
    );
  }

  //   Fungsi untuk menghentikan alarm
  const stopAlarm = async () => {
    await notifee.cancelAllNotifications();
    Alert.alert('Alarm Dimatikan', 'Alarm berhasil dimatikan.');
  };

  //   const stopRepeatAlarm = async () => {
  //     await notifee.stopForegroundService();
  //     console.log('Alarm diHENTIKAN');
  //     Alert.alert('Alarm dimatikan', 'Alarm berhasil dimatikan');
  //   };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={showDatePicker} style={styles.button}>
        <Text style={{color: 'white'}}>PILIH TANGGAL</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={showTimePicker} style={styles.button}>
        <Text style={{color: 'white'}}>PILIH WAKTU</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={scheduleAlarm} style={styles.button}>
        <Text style={{color: 'white'}}>JADWALKAN ALARM</Text>
      </TouchableOpacity>

      <Text style={{marginTop: 20}}>
        Tanggal: {selectedDate.toDateString()}
      </Text>
      <Text>Waktu: {selectedTime.toLocaleTimeString()}</Text>
    </View>
  );
};

export default Coba;

const styles = StyleSheet.create({
  button: {
    width: '60%',
    height: 50,
    backgroundColor: '#0F4473',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
