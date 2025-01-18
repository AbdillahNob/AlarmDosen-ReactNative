import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Modal,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from '../../utils/responsive';
import {useNavigation} from '@react-navigation/native';
import SendIntentAndroid from 'react-native-send-intent';
import {useRoute} from '@react-navigation/native';

const ModalPesan = () => {
  const route = useRoute();
  const navigasi = useNavigation();
  const [modalVisible, setModalVisible] = useState(true);
  const [modalVisibleDetail, setModalVisibleDetail] = useState(false);
  const [jenisModal, setJenisModal] = useState(null);

  const terimaJenisModal = route.params.jenisModal;

  useEffect(() => {
    setJenisModal(terimaJenisModal);
    // console.log(jenisModal);
  }, []);

  const deskripsi = () => {
    const data = [
      {tipe: 'hari', value: 'kamis'},
      {tipe: 'ruangan', value: 'A103'},
      {tipe: 'kelas', value: '1-TPAL-H'},
    ];

    return data.map(({tipe, value}, key) => (
      <View key={key} style={{}}>
        <Text
          style={{
            color: 'black',
            fontWeight: 'medium',
            marginBottom: h(1),
            textTransform: 'capitalize',
          }}>
          {tipe} :
          <Text
            style={{
              textTransform: tipe == 'kelas' ? 'uppercase' : 'capitalize',
            }}>
            {' '}
            {value}
          </Text>
        </Text>
      </View>
    ));
  };

  const button = ket => {
    let keterangan = ket;
    if (keterangan === 'sekarang') {
      const data = [
        {value: 'Saya Telah Hadir di kelas'},
        {value: 'Saya Sedang perjalanan ke-Kelas'},
        {value: 'Berhalangan Hadir'},
      ];
      return data.map(({value}, key) => (
        <View key={key}>
          <TouchableOpacity
            style={styles.buttonModal}
            onPress={() =>
              value == 'Berhalangan Hadir'
                ? openModalDetail()
                : aturSentWa(value)
            }>
            <Text style={styles.buttonModalText}>{value}</Text>
          </TouchableOpacity>
        </View>
      ));
    } else if (keterangan == 'sebelum 15') {
      const data = [
        {value: 'Nanti saya hadir di Kelas'},
        {value: 'Saya Sedang perjalanan Ke-kelas'},
        {value: 'Berhalangan Hadir'},
      ];
      return data.map(({value}, key) => (
        <View key={key}>
          <TouchableOpacity
            style={styles.buttonModal}
            onPress={() =>
              value == 'Berhalangan Hadir'
                ? openModalDetail()
                : aturSentWa(value)
            }>
            <Text style={styles.buttonModalText}>{value}</Text>
          </TouchableOpacity>
        </View>
      ));
    } else {
      const data = [
        {value: 'Besok saya hadir di kelas'},
        {value: 'Berhalangan Hadir'},
      ];
      return data.map(({value}, key) => (
        <View key={key}>
          <TouchableOpacity
            style={styles.buttonModal}
            onPress={() =>
              value == 'Berhalangan Hadir'
                ? openModalDetail()
                : aturSentWa(value)
            }>
            <Text style={styles.buttonModalText}>{value}</Text>
          </TouchableOpacity>
        </View>
      ));
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalVisibleDetail(false);
    navigasi.goBack();
  };

  const openModalDetail = () => {
    setModalVisible(false);
    setModalVisibleDetail(true);
  };

  const alasanDetail = () => {
    const data = [
      {
        id: 1,
        value: 'Saya Sedang Sakit, jadi tidak bisa masuk di kelas 1-TALGO-H',
      },
      {
        id: 2,
        value:
          'Saya lagi ada kegiatan, jadi tidak bisa masuk di kelas 1-TALGO-H',
      },
    ];
    return data.map(({value, id}, key) => (
      <View key={key}>
        <TouchableOpacity value={value} onPress={() => aturSentWa(value)}>
          <Text
            style={{
              width: w('65%'),
              fontSize: w(4),
              color: 'black',
              fontWeight: 'medium',
            }}>{`${id}. ${value}`}</Text>
        </TouchableOpacity>
      </View>
    ));
  };

  const sendMessageWa = async (groupId, message) => {
    try {
      SendIntentAndroid.sendText({
        text: message,
        type: SendIntentAndroid.TEXT_PLAIN,
        packageName: 'com.whatsapp',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const aturSentWa = async value => {
    const grupKelas = 'https://chat.whatsapp.com/IXKCUISiozMISOtGWpBg6t';
    const grupStafFo = 'https://chat.whatsapp.com/LsIa1zJ3JMVBdCeVsKjpyq';
    const message = value;

    await sendMessageWa(grupKelas, message);
    await sendMessageWa(grupStafFo, message);
  };

  return (
    <View style={{backgroundColor: '#0F4473', flex: 1}}>
      <StatusBar backgroundColor={'#0F4473'} barStyle={'light-content'} />
      {jenisModal == 'sekarang' ? (
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={require('../../assets/images/logoAlarm.png')}
                style={{width: w(16), height: h(8), elevation: 2}}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: '#E8304E',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  fontSize: w(6),
                  marginTop: h(0.5),
                  marginBottom: w(2.2),
                }}>
                kelas mengajar anda
              </Text>
              <Text
                style={{
                  marginBottom: h(1),
                  fontSize: w(5),
                  fontWeight: 'bold',
                  color: 'black',
                  TextAlign: 'center',
                }}>
                09:00-12:00 Wita
              </Text>
              <View
                style={{
                  width: w('70%'),
                  height: h(0.2),
                  backgroundColor: 'black',
                  borderRadius: w(4),
                  marginBottom: h(1.5),
                }}
              />
              <View style={{marginBottom: h(1)}}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    marginBottom: h(1.5),
                    textAlign: 'center',
                  }}>
                  Praktikum Algoritma dan Pemrograman
                </Text>
                {deskripsi()}
              </View>
              {button('sekarang')}
              {/* Tombol untuk menutup modal */}
            </View>
          </View>
        </Modal>
      ) : (
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={require('../../assets/images/logoAlarm.png')}
                style={{width: w(16), height: h(8), elevation: 2}}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: '#E8304E',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  fontSize: w(6),
                  marginTop: h(0.5),
                  marginBottom: w(2.2),
                }}>
                kelas mengajar anda
              </Text>
              <Text
                style={{
                  marginBottom: h(1),
                  fontSize: w(5),
                  fontWeight: 'bold',
                  color: 'black',
                  TextAlign: 'center',
                }}>
                09:00-12:00 Wita
              </Text>
              <View
                style={{
                  width: w('70%'),
                  height: h(0.2),
                  backgroundColor: 'black',
                  borderRadius: w(4),
                  marginBottom: h(1.5),
                }}
              />
              <View style={{marginBottom: h(1)}}>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: 'bold',
                    marginBottom: h(1.5),
                    textAlign: 'center',
                  }}>
                  Praktikum Algoritma dan Pemrograman
                </Text>
                {deskripsi()}
              </View>
              {button(jenisModal)}
              {/* Tombol untuk menutup modal */}
            </View>
          </View>
        </Modal>
      )}

      {/* Modal DETAIL */}
      {modalVisibleDetail ? (
        <Modal
          visible={modalVisibleDetail}
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text
                style={{fontSize: w(5), color: 'black', fontWeight: 'bold'}}>
                Alasan Tidak Hadir
              </Text>
              <View
                style={{
                  width: w('70%'),
                  height: h(0.2),
                  backgroundColor: 'black',
                  marginTop: h(1.2),
                  borderRadius: w(4),
                  marginBottom: h(1.5),
                }}
              />
              {alasanDetail()}
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

export default ModalPesan;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background semi-transparan
  },
  modalContent: {
    width: w('82%'),
    paddingTop: w(4),
    paddingBottom: w(4),
    backgroundColor: '#F0F4FF',
    borderRadius: w(3),
    alignItems: 'center',
    elevation: 5,
  },
  buttonModal: {
    width: w('68%'),
    height: h(5),
    backgroundColor: '#0F4473',
    borderRadius: w(2),
    marginBottom: h(2),
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonModalText: {
    color: 'white',
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
    backgroundColor: '#0F4473',
    paddingVertical: h(1.2),
    paddingHorizontal: w(10),
    borderRadius: w(1.5),
    elevation: 3,
    marginTop: h(1),
  },
});
