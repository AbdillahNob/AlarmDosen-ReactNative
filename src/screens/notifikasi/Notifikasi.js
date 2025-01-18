import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {
  heightPercentageToDP as h,
  widthPercentageToDP as w,
} from '../../utils/responsive';
import React, {useEffect, useState} from 'react';
import notifee, {
  AndroidImportance,
  AndroidColor,
  EventType,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import {StackActions, useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

const Notifikasi = () => {
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
          const jenisModal = detail.notification.data.jenisModal;

          if (detail.pressAction.id === 'stop') {
            console.log(jenisModal);
            stopAlarm();
            navigation.navigate('ModalPesan', {jenisModal});
          } else if (detail.pressAction.id === 'open_modal') {
            console.log(jenisModal);
            stopAlarm();
            navigation.navigate('ModalPesan', {jenisModal}); // Arahkan ke ModalPesan
          }
        }
      },
    );

    // Background Event
    const unsubscribeBackground = notifee.onBackgroundEvent(
      async ({type, detail}) => {
        if (type === EventType.ACTION_PRESS) {
          const jenisModal = detail.notification.data.jenisModal;
          if (detail.pressAction.id === 'stop') {
            console.log(jenisModal);
            stopAlarm();
            navigation.navigate('ModalPesan', {jenisModal}); // Arahkan ke ModalPesan
          } else if (detail.pressAction.id === 'open_modal') {
            console.log(jenisModal);
            stopAlarm();
            navigation.navigate('ModalPesan', {jenisModal}); // Arahkan ke ModalPesan
          }
        }
      },
    );

    return () => {
      unsubscribeForeground;
      unsubscribeBackground;
    };
  }, []);

  // Minta izin ModalPesan
  const requestPermissionNotifee = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        await notifee.requestPermission(),
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Izin Notifikasi diberikan');
      } else {
        console.log('Izin Notifikasi ditolak');
      }
    }
  };

  // Buat channel ModalPesan
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

    const firstNotificationTime = new Date(nextAlarmDate);
    firstNotificationTime.setDate(nextAlarmDate.getDate() - 1);
    const secondNotificationTime = new Date(nextAlarmDate);
    secondNotificationTime.setMinutes(nextAlarmDate.getMinutes() - 15);

    const alarmTimes = [
      {
        label: '1 Hari Sebelumnya',
        time: firstNotificationTime,
        jenisModal: 'sebelum 1',
      },
      {
        label: '15 Menit Sebelumnya',
        time: secondNotificationTime,
        jenisModal: 'sebelum 15',
      },
      {label: 'Saat Jadwal', time: nextAlarmDate, jenisModal: 'sekarang'},
    ];

    alarmTimes.map(async ({label, time, jenisModal}) => {
      // Mulai alarm sebagai Foreground Service
      if (time > now) {
        await notifee.createTriggerNotification(
          {
            title: '⏰ Alarm Berbunyi!',
            body: `${label} : 3-TALGO, PUKUL : ${selectedTime.toLocaleTimeString()} ${
              daysOfWeek.find(day => day.value === selectedDay).label
            }`,
            android: {
              channelId: 'alarm-channel-v3',
              color: AndroidColor.RED,
              sound: 'alarm_tone',
              ongoing: true, // ModalPesan tidak bisa di-swipe
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
            data: {
              jenisModal: jenisModal,
            },
          },
          {
            type: TriggerType.TIMESTAMP,
            timestamp: time.getTime(),
            alarmManager: {allowWhileIdle: true},
          },
        );
      }
    });
    console.log(`Jadwal ke-1 : ${firstNotificationTime}`);
    console.log(`Jadwal ke-2 : ${secondNotificationTime}`);
    console.log(`Jadwal ke-3 : ${nextAlarmDate}`);
    Alert.alert(
      'Alarm Dijadwalkan',
      `Alarm akan berbunyi pada Hari : ${
        daysOfWeek.find(day => day.value === selectedDay).label
      } Pukul : ${selectedTime.toLocaleTimeString()} `,
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
      <View style={styles.picker}>
        <Picker
          selectedValue={selectedDay}
          onValueChange={itemValue => setSelectedDay(itemValue)}>
          {daysOfWeek.map((day, key) => (
            <Picker.Item key={key} label={day.label} value={day.value} />
          ))}
        </Picker>
      </View>

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

export default Notifikasi;

const styles = StyleSheet.create({
  button: {
    width: w('60%'),
    height: h(7),
    backgroundColor: '#0F4473',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  picker: {
    height: h(7),
    width: w('60%'),
    backgroundColor: '#0F4473',
    justifyContent: 'center',
    borderRadius: w(3),
  },
});
