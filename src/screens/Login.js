import {Image, StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useState} from 'react';
import {
  heightPercentageToDP as h,
  widthPercentageToDP as w,
} from '../utils/responsive';
import {StatusBar} from 'react-native';
import Buttons from '../components/Buttons';
import {useNavigation} from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const input = () => {
    const data = [
      {label: 'Username', icon: require('../assets/icons/User.png')},
      {label: 'Password', icon: require('../assets/icons/Password.png')},
    ];

    return data.map(({label, icon}, key) => (
      <View key={key} style={{marginTop: h(4)}}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{marginRight: w(67.9), fontWeight: 'bold'}}>
            {label}
          </Text>
          <View
            style={{
              width: w(85),
              height: h(6),
              marginTop: h(1.5),
              backgroundColor: '#ffffff',
              elevation: 1.5,
              borderTopRightRadius: w(5),
              borderBottomRightRadius: w(5),
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icon}
              style={{width: w(8), height: h(2), marginLeft: w(2)}}
              resizeMode="center"
            />
            {label == 'Username' ? (
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan Username Anda"
                keyboardType="default"
                onChangeText={value => validasiInput(value, label)}
              />
            ) : (
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan Password Anda"
                secureTextEntry={true}
                onChangeText={value => validasiInput(value, label)}
              />
            )}
          </View>
        </View>
      </View>
    ));
  };

  const validasiInput = (value, label) => {
    if (label == 'Username') {
      setUsername(value);
    } else if (label == 'Password') {
      setPassword(value);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <View style={{position: 'absolute'}}>
        <Image
          source={require('../assets/images/dosenMengajar.jpg')}
          style={{height: h(40), width: w('100%')}}
          resizeMode="cover"
        />
      </View>
      <View
        style={{
          height: h('100%'),
          backgroundColor: '#F0F4FF',
          marginTop: h(35),
          borderTopLeftRadius: w(10),
          borderTopRightRadius: w(10),
        }}>
        <Text
          style={{
            fontSize: w(10),
            fontWeight: 'bold',
            textTransform: 'uppercase',
            textAlign: 'center',
            marginTop: h(3),
          }}>
          Login
        </Text>
        {input()}

        <View style={{alignItems: 'center', marginTop: h(5)}}>
          <Buttons teks={'Login'} navigasi={'Dashboard'} />
          <Text style={{marginTop: h(2)}}>
            Belum Punya Akun?
            <Text
              style={{color: '#251EDE'}}
              onPress={() => navigation.navigate('BuatAkun')}>
              {' '}
              Buat Akun
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    color: 'black',
    width: w(80),
  },
});