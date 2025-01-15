import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from '../utils/responsive';

const HeaderDashboard = () => {
  const schedule = () => {
    const data = [
      {label: 'Jadwal Hari ini', jumlahJadwal: 4},
      {label: 'Total Jadwal', jumlahJadwal: 20},
    ];

    return data.map(({label, jumlahJadwal}, key) => (
      <View
        key={key}
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          paddingHorizontal: w(1.5),
        }}>
        <Text style={{color: '#ffffff', fontSize: w(4), fontWeight: 'bold'}}>
          {jumlahJadwal}
        </Text>
        <Text style={{color: '#ffffff', fontSize: w(3.2)}}>{label}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.header}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: h(2),
        }}>
        <Text
          style={{
            color: '#ffffff',
            fontSize: w(5),
            fontWeight: 'bold',
            marginLeft: w(3.5),
            marginTop: h(-1),
            textTransform: 'capitalize',
            letterSpacing: w(0.1),
          }}>
          Hai, Abdillah P Al-Iman
        </Text>
        <Image
          source={require('../assets/images/logoAlarm.png')}
          style={{
            width: w(16),
            height: h(8),
            marginLeft: w(19),
          }}
          resizeMode="cover"
        />
      </View>
      <Text
        style={{
          color: '#ffffff',
          fontWeight: '300',
          fontSize: w(2.6),
          marginLeft: w(3.5),
          marginTop: h(-2.5),
        }}>
        Dosen Universitas Dipa Makassar
      </Text>
      <View
        style={{
          marginTop: h(5),
          paddingLeft: w(3.5),
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/icons/alarm-clock.png')}
          style={{width: w(5), height: h(4)}}
          resizeMode="center"
        />
        <Text
          style={{
            color: '#ffffff',
            fontSize: w(2.7),
            width: w(45),
            paddingLeft: w(2),
          }}>
          Anda akan diingatkan sebanyak 3X dari setiap jadwal mengajar anda
        </Text>
        {schedule()}
      </View>

      <View
        style={{
          top: h(5.7),
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            width: w(70),
            height: h(0.3),
            borderRadius: w(5),
            elevation: 4,
          }}
        />
      </View>
    </View>
  );
};

export default HeaderDashboard;

const styles = StyleSheet.create({
  header: {
    width: w('100%'),
    height: h(32),
    backgroundColor: '#0F4473',
    justifyContent: 'center',
  },
});
