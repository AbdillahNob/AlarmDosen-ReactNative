import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as h,
  widthPercentageToDP as w,
} from '../../utils/responsive';
import {StatusBar} from 'react-native';
import Buttons from '../../components/Buttons';

const BuatAkun = () => {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nidn, setNidn] = useState('');
  const [namaPerguruan, setNamaPerguruan] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [konfirPass, setKonfirPass] = useState('');

  const input = () => {
    const data = [
      {
        label: 'Nama Lengkap',
        placeholder: 'Masukkan Nama Lengkap Anda',
        icon: require('../../assets/icons/namaLengkap.png'),
      },
      {
        label: 'Nidn',
        placeholder: 'Masukkan Nidn Anda',
        icon: require('../../assets/icons/Nidn.png'),
      },
      {
        label: 'Nama Perguruan Tinggi/Institut',
        placeholder: 'Masukkan Nama Perguruan Anda',
        icon: require('../../assets/icons/perguruanTinggi.png'),
      },
      {
        label: 'Username',
        placeholder: 'Masukkan Username Anda',
        icon: require('../../assets/icons/User.png'),
      },
      {
        label: 'Password',
        placeholder: 'Masukkan Password Anda',
        icon: require('../../assets/icons/Password.png'),
      },
      {
        label: 'Konfirmasi Password',
        placeholder: 'Konfirmasi Password Anda',
        icon: require('../../assets/icons/Password.png'),
      },
    ];

    return data.map(({label, placeholder, icon}, key) => (
      <View key={key} style={{marginTop: h(2.4)}}>
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
            height: h(5),
            backgroundColor: '#ffffff',
            elevation: 1,
            borderTopRightRadius: w(6),
            borderBottomRightRadius: w(6),
            marginLeft: w(8),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={icon}
            style={{width: w(4), height: h(4), marginLeft: w(3)}}
            resizeMode={'center'}
          />
          {label == 'Password' || label == 'Konfirmasi Password' ? (
            <TextInput
              placeholder={placeholder}
              style={styles.textInput}
              onChangeText={value => validasiInput(value, label)}
              secureTextEntry={true}
            />
          ) : (
            <TextInput
              placeholder={placeholder}
              style={styles.textInput}
              onChangeText={value => validasiInput(value, label)}
            />
          )}
        </View>
      </View>
    ));
  };

  const validasiInput = (value, label) => {
    if (label == 'Nama Lengkap') {
      setNamaLengkap(value);
    } else if (label == 'Nidn') {
      setNidn(value);
    } else if (label == 'Nama Perguruan Tinggi/Institut') {
      setNamaPerguruan(value);
    } else if (label == 'Username') {
      setUsername(value);
    } else if (label == 'Password') {
      setPassword(value);
    } else if (label == 'Konfirmasi Password') {
      setKonfirPass(value);
    }
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
          source={require('../../assets/images/dosenMengajar.jpg')}
          style={{width: w('100%'), height: h(40)}}
          resizeMode={'cover'}
        />
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text
            style={{
              fontSize: w(7),
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginTop: h(3),
              paddingBottom: h(2),
            }}>
            Buat Akun
          </Text>
          {input()}
          <View
            style={{
              alignItems: 'center',
              marginBottom: h(4),
              marginTop: h(3.4),
            }}>
            <Buttons teks={'Buat'} navigasi={'Login'} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default BuatAkun;

const styles = StyleSheet.create({
  container: {
    width: w('100%'),
    backgroundColor: '#F0F4FF',
    borderTopLeftRadius: w(8),
    borderTopRightRadius: w(8),
  },
  textInput: {
    marginLeft: w(2),
    color: 'black',
    width: w(80),
  },
});
