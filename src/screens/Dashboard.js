import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from '../utils/responsive';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderDashboard from '../components/HeaderDashboard';
import {useNavigation} from '@react-navigation/native';
import DocumentPicker, {types} from 'react-native-document-picker';
import {PermissionsAndroid} from 'react-native';

const Dashboard = () => {
  const navigasi = useNavigation();
  const [jadwal, setJadwal] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nadaDering, setNadaDering] = useState('');

  const dataJadwal = [
    {
      id: 1,
      namaMatkul: 'Praktikum Algoritma dan Pemrograman',
      hari: 'kamis',
      kelas: '1-TPAL-H',
      ruangan: 'a101',
      jamMulai: '09-10',
      jamSelesai: '11:00',
      tipeJadwal: 'utama',
      nadaDering: 'sdsadsad',
      linkGrup: 'sadsa',
      ket: true,
    },
    {
      id: 2,
      namaMatkul: 'Sistem Basis Data',
      hari: 'senin',
      kelas: '1-TSMB-A',
      ruangan: 'b206',
      jamMulai: '09-10',
      jamSelesai: '11:00',
      tipeJadwal: 'utama',
      nadaDering: 'sdsadsad',
      linkGrup: 'sadsa',
      ket: false,
    },
    {
      id: 3,
      namaMatkul: 'Elektronika Digital',
      hari: 'rabu',
      kelas: '1-TSMB-A',
      ruangan: 'b206',
      jamMulai: '09-10',
      jamSelesai: '11:00',
      tipeJadwal: 'tambahan',
      nadaDering: 'sdsadsad',
      linkGrup: 'sadsa',
      ket: false,
    },
    {
      id: 4,
      namaMatkul: 'Praktikum Algoritma dan Pemrograman adadsasdsadadsass',
      hari: 'kamis',
      kelas: '1-TPAL-H',
      ruangan: 'a101',
      jamMulai: '09-10',
      jamSelesai: '11:00',
      tipeJadwal: 'utama',
      nadaDering: 'sdsadsad',
      linkGrup: 'sadsa',
      ket: false,
    },
  ];

  useEffect(() => {
    setJadwal(dataJadwal);
    // console.log(jadwal);
  }, []);

  const headerMainView = () => {
    return (
      <View style={styles.headerMain}>
        <Text
          style={{
            color: 'black',
            fontSize: w(4.5),
            fontWeight: 'bold',
            marginLeft: w(5),
          }}>
          Jadwal Mengajar Anda{' '}
        </Text>
        <Image
          source={require('../assets/icons/book.png')}
          style={{width: w(6), height: h(3), marginLeft: w(-26)}}
          resizeMode={'cover'}
        />
        <TouchableOpacity
          style={{
            width: w(10),
            height: h(5),
            backgroundColor: '#0F4473',
            elevation: 3,
            borderRadius: w(5),
            marginRight: w(6),
            opacity: 0.85,
            marginTop: h(-0.6),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => navigasi.navigate('TambahJadwal')}>
          <Image
            source={require('../assets/icons/plus.png')}
            style={{width: w(6), height: h(3)}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const aturAktif = id => {
    let jadwalBaru = jadwal.map(item =>
      item.id === id ? {...item, ket: !item.ket} : item,
    );
    setJadwal(jadwalBaru);
    console.log(jadwalBaru);
  };

  const openModal = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };
  const closeModal = () => {
    setSelectedItem(null);
    setModalVisible(false);
  };

  const buttonModal = item => {
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

    // Fungsi untuk memilih file audio
    const pickMusicFile = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        Alert.alert(
          'Izin Ditolak',
          'Aplikasi tidak bisa mengakses penyimpanan.',
        );
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

    const hapusData = () => {
      // setJadwal(null);
      Alert.alert('Berhasil Hapus Data');
    };

    const dataMatkul = item;
    const data = [
      {
        label: 'atur nada dering alarm',
        icon: require('../assets/icons/music.png'),
        link: pickMusicFile,
      },

      {
        label: 'edit jadwal mengajar',
        icon: require('../assets/icons/jadwalSet.png'),
        link: 'EditJadwal',
      },
      {
        label: 'hapus jadwal mengajar',
        icon: require('../assets/icons/trash.png'),
        link: hapusData,
      },
    ];

    return data.map(({label, icon, link}, key) => (
      <View key={key}>
        <TouchableOpacity
          style={styles.buttonModal}
          onPress={() => {
            if (label == 'edit jadwal mengajar') {
              navigasi.navigate(link, {dataMatkul}, setModalVisible(false));
            } else {
              link();
              setModalVisible(false);
            }
          }}>
          <Image source={icon} style={{width: w(6), height: h(3)}} />
          <Text style={styles.buttonModalText}>{label}</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#0F4473'} barStyle={'light-content'} />
      <HeaderDashboard />
      {headerMainView()}
      <SafeAreaView style={styles.containerScroll}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingLeft: w(2),
            paddingRight: w(2),
          }}>
          {jadwal.map((item, key) => (
            <View key={key} style={styles.card}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginTop: h(1.1),
                  paddingHorizontal: w(2.2),
                }}>
                <View
                  style={{
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      width: w(65),
                      fontSize: w(4),
                      fontWeight: 'bold',
                    }}>
                    {item.namaMatkul}
                  </Text>
                  <View
                    style={{
                      width: w(28),
                      height: h(0.1),
                      backgroundColor: '#0F4473',
                      borderRadius: w(3),
                      marginTop: h(0.6),
                    }}
                  />

                  <Text style={styles.textDescCard}>
                    kelas{' '}
                    <Text
                      style={{
                        color:
                          item.tipeJadwal == 'utama' ? '#E8304E' : '#0F4473',
                      }}>
                      {item.tipeJadwal}
                    </Text>
                  </Text>
                </View>
                <TouchableOpacity
                  style={{marginTop: h(1)}}
                  onPress={() => openModal(item)}>
                  <Image
                    source={require('../assets/icons/settings.png')}
                    style={{width: w(8), height: h(3.6)}}
                    resizeMode={'center'}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginLeft: w(6),
                  marginRight: w(6),
                  justifyContent: 'space-around',
                  marginTop: h(1.5),
                }}>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textDescCard}>{item.hari}</Text>
                  <Text style={styles.textDescCard}>Hari</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textDescCard2}>{item.kelas}</Text>
                  <Text style={styles.textDescCard}>Kelas</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.textDescCard2}>{item.ruangan}</Text>
                  <Text style={styles.textDescCard}>Ruangan</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: h(1.5),
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: 'black',
                    opacity: 0.7,
                    fontSize: w(4),
                    textTransform: 'capitalize',
                    marginLeft: w(16),
                    marginTop: w(4),
                    fontWeight: '500',
                  }}>
                  Jadwal: {item.jamMulai} - {item.jamSelesai}
                </Text>

                <View
                  style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginRight: w(4.2),
                  }}>
                  <Text style={{color: item.ket ? '#00B038' : '#E8304E'}}>
                    {item.ket ? 'Aktif' : 'Tidak Aktif'}
                  </Text>

                  <Switch
                    trackColor={{false: '#767577', true: '#E8304E'}} // Warna track
                    thumbColor={item.ket ? '#f5dd4b' : '#f4f3f4'} // Warna tombol
                    ios_backgroundColor="#3e3e3e" // Warna background untuk iOS
                    onValueChange={() => aturAktif(item.id)} // Fungsi saat switch berubah
                    value={item.ket} // Nilai switch (true/false)
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      {/* MODAL */}
      {selectedItem && (
        <Modal
          animationType="slide" // Animasi modal: 'slide', 'fade', atau 'none'
          transparent={true} // Membuat background modal menjadi transparan
          visible={modalVisible} // Kontrol visibilitas modal
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  fontSize: w(6),
                  marginTop: h(0.5),
                  marginBottom: w(2.2),
                }}>
                setting alarm
              </Text>
              <Text
                style={{
                  marginBottom: h(2),
                  fontSize: w(3.3),
                  color: 'black',
                  opacity: 0.75,
                  fontWeight: '400',
                }}>
                {selectedItem.namaMatkul}
              </Text>
              {buttonModal(selectedItem)}

              {/* Tombol untuk menutup modal */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    fontSize: w(4.4),
                  }}>
                  close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  headerMain: {
    flexDirection: 'row',
    marginTop: h(3),
    justifyContent: 'space-between',
  },
  containerScroll: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingTop: h(-1),
    marginTop: h(1),
  },
  card: {
    width: w('88%'),
    paddingBottom: h(1.8),
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 0},
    elevation: 1,
    marginBottom: h(2.5),
    borderRadius: w(2),
  },
  textDescCard: {
    paddingTop: h(0.2),
    color: 'black',
    opacity: 0.7,
    fontWeight: '450',
    fontSize: w(4),
    textTransform: 'capitalize',
  },
  textDescCard2: {
    color: 'black',
    opacity: 0.7,
    fontWeight: '450',
    fontSize: w(4),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background semi-transparan
  },
  modalContent: {
    width: w('82%'),
    paddingTop: w(2),
    paddingBottom: w(4),
    backgroundColor: '#F0F4FF',
    borderRadius: w(3),
    alignItems: 'center',
    elevation: 5,
  },
  buttonModal: {
    width: w('68%'),
    height: h(5),
    backgroundColor: '#ffffff',
    borderRadius: w(2),
    marginBottom: h(3),
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: w(3),
  },
  buttonModalText: {
    color: 'black',
    fontSize: w(4),
    fontWeight: '500',
    marginLeft: w(2),
    textTransform: 'capitalize',
  },
  modalText: {
    fontSize: w(5),
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#E8304E',
    paddingVertical: h(1.2),
    paddingHorizontal: w(10),
    borderRadius: w(1.5),
    elevation: 3,
    marginTop: h(1),
  },
});
