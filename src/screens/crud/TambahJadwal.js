import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as h,
  widthPercentageToDP as w,
} from '../../utils/responsive';
import {StatusBar} from 'react-native';
import Buttons from '../../components/Buttons';
import {Picker} from '@react-native-picker/picker';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
// import {pickDirectory} from 'react-native-document-picker';
import DocumentPicker, {types} from 'react-native-document-picker';
import {PermissionsAndroid} from 'react-native';

const TambahJadwal = () => {
  const [namaMataKuliah, setNamaMataKuliah] = useState('');
  const [hari, setHari] = useState('');
  const [kelas, setKelas] = useState('');
  const [ruangan, setRuangan] = useState('');
  const [jamMulai, setJamMulai] = useState('');
  const [jamSelesai, setJamSelesai] = useState('');
  const [tipeJadwal, setTipeJadwal] = useState('');
  const [nadaDering, setNadaDering] = useState('');
  const [linkGrup, setLinkGrup] = useState('');
  const [timePickerAktif, setTimePickerAktif] = useState(false);

  const input = () => {
    const data = [
      {
        label: 'Nama Mata Kuliah',
        placeholder: 'Masukkan Nama Mata Kuliah',
      },
      {
        label: 'Hari',
        placeholder: 'Pilih Hari',
      },
      {
        label: 'Kelas',
        placeholder: 'Masukkan Nama Kelas',
      },
      {
        label: 'Ruangan',
        placeholder: 'Masukkan Ruangan',
      },
      {
        label: 'Jam Mulai',
        placeholder: 'Masukkan Jam Mulai',
      },
      {
        label: 'Jam Selesai',
        placeholder: 'Masukkan Jam Selesai',
      },
      {
        label: 'Tipe Kelas',
        placeholder: 'Pilih Tipe Jadwal',
      },

      {
        label: 'Nada Dering',
        placeholder: 'Pilih Nada Dering',
      },

      {
        label: 'Link Group Wa kelas',
        placeholder: 'Masukkan Link',
      },
    ];

    return data.map(({label, placeholder}, key) => {
      return inputView(label, placeholder, key);
    });
  };
  const inputView = (label, placeholder, key) => {
    let content;
    if (label == 'Hari') {
      content = (
        <Picker
          selectedValue={hari}
          style={styles.picker}
          onValueChange={itemValue => setHari(itemValue)}>
          <Picker label="--Pilih Hari--" value="" style={{color: 'black'}} />
          <Picker.Item label="Senin" value="Senin" style={{color: 'black'}} />
          <Picker.Item label="Selasa" value="Selasa" style={{color: 'black'}} />
          <Picker.Item label="Rabu" value="Rabu" style={{color: 'black'}} />
          <Picker.Item label="Kamis" value="Kamis" style={{color: 'black'}} />
          <Picker.Item label="Jumat" value="Jumat" style={{color: 'black'}} />
        </Picker>
      );
    } else if (label == 'Tipe Kelas') {
      content = (
        <Picker
          selectedValue={tipeJadwal}
          style={styles.picker}
          onValueChange={itemValue => setTipeJadwal(itemValue)}>
          <Picker.Item
            label="--Pilih Tipe Kelas--"
            value=""
            style={{color: 'black'}}
          />
          <Picker.Item label="Utama" value="Utama" style={{color: 'black'}} />
          <Picker.Item
            label="Tambahan"
            value="Tambahan"
            style={{color: 'black'}}
          />
        </Picker>
      );
    } else if (label == 'Jam Mulai' || label == 'Jam Selesai') {
      content = (
        <TextInput
          value={label == 'Jam Mulai' ? jamMulai : jamSelesai}
          placeholder={placeholder}
          keyboardType="default"
          style={styles.textInput}
          onPress={() => validasiDate(label)}
        />
      );
    } else if (label == 'Nada Dering') {
      content = (
        <Button
          title="Pilih Nada Dering"
          onPress={pickMusicFile}
          style={{
            backgroundColor: '#0F4473',
            width: w(5),
            height: h(2),
          }}></Button>
      );
    } else {
      content = (
        <TextInput
          placeholder={placeholder}
          style={styles.textInput}
          onChangeText={value => validasiInput(value, label)}
        />
      );
    }

    return (
      <View key={key} style={{marginTop: h(2.5)}}>
        <Text
          style={{
            marginLeft: w(8),
            marginBottom: h(1),
            fontWeight: 'bold',
            fontSize: w(4),
          }}>
          {label}
        </Text>
        <View
          style={{
            width: w(85),
            backgroundColor: '#ffffff',
            elevation: 1,
            borderTopRightRadius: w(6),
            borderBottomRightRadius: w(6),
            marginLeft: w(8),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {content}
          {label == 'Nada Dering' ? (
            <Text
              style={{
                color: 'black',
                marginLeft: w(2),
                justifyContent: 'center',
              }}>
              {nadaDering}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  // TIPE Inputan Jadwal
  const validasiDate = label => {
    DateTimePickerAndroid.open({
      mode: 'time',
      value: new Date(),
      onChange: (event, selectedTime) => {
        if (selectedTime) {
          label == 'Jam Mulai'
            ? setJamMulai(formatTime(selectedTime))
            : setJamSelesai(formatTime(selectedTime));
        }
      },
    });
  };

  // Format Inputan jadwal
  const formatTime = time => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes} WITA`;
  };

  // Fungsi untuk memilih file audio
  const pickMusicFile = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Izin Ditolak', 'Aplikasi tidak bisa mengakses penyimpanan.');
      return;
    }

    try {
      const res = await DocumentPicker.pick({
        type: [types.audio], // Hanya file audio yang bisa dipilih
      });

      setNadaDering(res[0].name);
      Alert.alert('Berhasil', `File terpilih: ${res[0].name}`);
      console.log(res[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Pemilihan file dibatalkan.');
      } else {
        console.error(err);
      }
    }
  };

  // Meminta izin di Android
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, // Tambahan
        ]);

        return (
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.READ_MEDIA_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED ||
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const validasiInput = (value, label) => {
    if (label == 'Nama Mata Kuliah') {
      setNamaMataKuliah(value);
    } else if (label == 'Kelas') {
      setKelas(value);
    } else if (label == 'Ruangan') {
      setRuangan(value);
    } else if (label == 'Nada Dering') {
      setNadaDering(value);
    } else if (label == 'Link Group Wa kelas') setLinkGrup(value);
  };

  return (
    <View style={{marginTop: h(20), flex: 1}}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent={true}
        barStyle={'light-content'}
      />
      <View style={{position: 'absolute', top: h(-20)}}>
        <Image
          source={require('../../assets/images/mengajarTeknologi.jpg')}
          style={{width: w('100%'), height: h(40)}}
          resizeMode={'cover'}
        />
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: w(5.5),
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginTop: h(3),
              marginBottom: h(1.5),
            }}>
            Buat Jadwal Mengajar
          </Text>
          {input()}
          <View
            style={{
              alignItems: 'center',
              marginTop: h(3.6),
              marginBottom: h(4),
            }}>
            <Buttons teks={'Buat'} navigasi={'Dashboard'} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TambahJadwal;

const styles = StyleSheet.create({
  container: {
    width: w('100%'),
    backgroundColor: '#F0F4FF',
    borderTopLeftRadius: w(8),
    borderTopRightRadius: w(8),
  },
  picker: {
    paddingHorizontal: w('100%'),
    height: h(7),
  },
  textInput: {
    marginVertical: h(1),
    marginLeft: w(2),
    width: w(80),
    color: 'black',
  },
});
