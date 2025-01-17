import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import notifee, {
  AndroidImportance,
  AndroidColor,
  EventType,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
// import {acquireWakeLock, releaseWakeLock} from 'react-native-android-wake-lock';
import {StackActions, useNavigation} from '@react-navigation/native';
import {Screen} from 'react-native-screens';

const Coba = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const navigation = useNavigation();

  const daysOfWeek = [
    {label: 'Minggu', value: 0},
    {label: 'Senin', value: 1},
    {label: 'Selasa', value: 2},
    {label: 'Rabu', value: 3},
    {label: 'Kamis', value: 4},
    {label: 'Jumat', value: 5},
    {label: 'Sabtu', value: 6},
  ];

  useEffect(() => {
    requestPermissionNotifee();
    createNotificationChannel();

    // Foreground Event
    const unsubscribeForeground = notifee.onForegroundEvent(
      ({type, detail}) => {
        if (type === EventType.ACTION_PRESS) {
          if (detail.pressAction.id === 'stop') {
            stopAlarm();
            navigation.navigate('Notifikasi');
          } else if (detail.pressAction.id === 'open_modal') {
            stopAlarm();
            navigation.navigate('Notifikasi'); // Arahkan ke Notifikasi
          }
        }
      },
    );

    // Background Event
    const unsubscribeBackground = notifee.onBackgroundEvent(
      async ({type, detail}) => {
        if (type === EventType.ACTION_PRESS) {
          if (detail.pressAction.id === 'stop') {
            stopAlarm();
            navigation.navigate('Notifikasi');
          } else if (detail.pressAction.id === 'open_modal') {
            stopAlarm();
            navigation.navigate('Notifikasi'); // Arahkan ke Notifikasi
          }
        }
      },
    );

    return () => {
      unsubscribeForeground;
      unsubscribeBackground;
    };
  }, []);

  // Minta izin notifikasi
  const requestPermissionNotifee = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        await notifee.requestPermission(),
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Izin notifikasi diberikan');
      } else {
        console.log('Izin notifikasi ditolak');
      }
    }
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
    const now = new Date();
    const today = now.getDay(); // 0 (Minggu) - 6 (Sabtu)
    let daysUntilAlarm = selectedDay - today;
    console.log(today);

    // Kalau hari sudah lewat, jadwalkan untuk minggu depan
    if (daysUntilAlarm < 0 || (daysUntilAlarm === 0 && selectedTime < now)) {
      daysUntilAlarm += 7;
    }

    // Hitung waktu alarm berikutnya
    const nextAlarmDate = new Date(now);
    nextAlarmDate.setDate(now.getDate() + daysUntilAlarm);
    nextAlarmDate.setHours(
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0,
      0,
    );

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: nextAlarmDate.getTime(), // Waktu alarm
      alarmManager: {allowWhileIdle: true},
    };

    // Mulai alarm sebagai Foreground Service
    await notifee.createTriggerNotification(
      {
        title: '⏰ Alarm Berbunyi!',
        body: `Jadwal Mengajar Kelas : 3-TALGO ${
          daysOfWeek.find(day => day.value === selectedDay).label
        }`,
        android: {
          channelId: 'alarm-channel-v3',
          color: AndroidColor.RED,
          sound: 'alarm_tone',
          ongoing: true, // Notifikasi tidak bisa di-swipe
          loopSound: true,
          importance: AndroidImportance.HIGH,
          fullScreenAction: {
            id: 'default',
            launchActivity: 'default',
          },
          pressAction: {
            id: 'open_modal',
            launchActivity: 'default',
          },
          actions: [
            {
              title: '🛑 Matikan Alarm',
              pressAction: {
                id: 'stop',
                launchActivity: 'default',
              },
            },
          ],
        },
      },
      trigger,

      Alert.alert(
        'Alarm Dijadwalkan',
        `Alarm akan berbunyi pada Hari : ${
          daysOfWeek.find(day => day.value === selectedDay).label
        } Pukul : ${selectedTime.toLocaleTimeString()} `,
      ),
    );
  }

  //   Fungsi untuk menghentikan alarm
  const stopAlarm = async () => {
    await notifee.cancelAllNotifications();
    // Alert.alert('Alarm Dimatikan', 'Alarm berhasil dimatikan.');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: 'black'}}>PILIH Hari</Text>
      {daysOfWeek.map((day, key) => (
        <TouchableOpacity
          key={key}
          onPress={() => setSelectedDay(day.value)}
          style={styles.button}>
          <Text style={{color: 'white'}}>{day.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={showTimePicker} style={styles.button}>
        <Text style={{color: 'white'}}>PILIH WAKTU</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={scheduleAlarm} style={styles.button}>
        <Text style={{color: 'white'}}>JADWALKAN ALARM</Text>
      </TouchableOpacity>

      <Text style={{marginTop: 20}}>
        Hari: {daysOfWeek.find(day => day.value === selectedDay).label}
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
