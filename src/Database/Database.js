import React from 'react';
import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

// Buat Database
export const openDb = async () => {
  try {
    const db = await SQLite.openDatabase({
      name: 'AlarmDosen.db',
      location: 'default',
    });
    // console.log('Berhasil menghubungkan Database :', db);
    return db;
  } catch (err) {
    console.log('Gagal menghubungkan Database : ', err);
    throw err;
  }
};

export const getDatabase = async () => {
  return await openDb();
};

// Buat Tabel Akun
export const buatAkun = async () => {
  try {
    const db = await getDatabase(); //Tunggu getDatabase smpi database selesai dihubungkan
    await db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS AkunUser (
                idUser INTEGER PRIMARY KEY AUTOINCREMENT,
                namaLengkap TEXT,
                nidn TEXT,
                namaPerguruan TEXT,
                username TEXT,
                password TEXT
              );`,
        [],
        (tx, results) => {
          console.log('Berhasil membuat tabel AkunUser :', results);
        },
        (tx, error) => {
          console.log('Gagal membuat tabel AkunUser :', error);
        },
      );
    });
  } catch (error) {
    console.log(
      'Error saat inisialiasi database, tampilkan errornya : ',
      error,
    );
    throw error;
  }
  // console.log(data);
};

// Buat Tabel Jadwal
export const buatJadwal = async () => {
  try {
    const db = await getDatabase(); //Tunggu getDatabase smpi database selesai dihubungkan
    await db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS jadwalMengajar (
                idMengajar INTEGER PRIMARY KEY AUTOINCREMENT,
                idUser INTEGER,
                namaMatkul TEXT,
                semester TEXT,
                hari TEXT,
                kelas TEXT,
                ruangan TEXT,
                jamMulai TEXT,
                jamSelesai TEXT,
                tipeJadwal TEXT,
                aktifkan BOOLEAN DEFAULT 0,
                FOREIGN KEY (idUser) REFERENCES AkunUser (idUser) ON DELETE CASCADE
              );`,
        [],
        (tx, results) => {
          console.log('Berhasil membuat tabel Jadwal :', results);
        },
        (tx, error) => {
          console.log('Gagal membuat tabel Jadwal :', error);
        },
      );
    });
  } catch (error) {
    console.log(
      'Error saat inisialiasi database, tampilkan errornya : ',
      error,
    );
    throw error;
  }
  // console.log(data);
};

// Create AKUN
export const insertAkun = async (
  namaLengkap,
  nidn,
  namaPerguruan,
  username,
  password,
) => {
  try {
    const db = await getDatabase();
    await db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO AkunUser (namaLengkap, nidn, namaPerguruan, username, password) VALUES (?,?,?,?,?)`,
        [namaLengkap, nidn, namaPerguruan, username, password],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Akun berhasil ditambahkan');
          }
        },
        (tx, error) => {
          console.log('Gagal menambahkan Akun : ', error);
        },
      );
    });
  } catch (err) {
    console.log(`Error : ${err}`);
    throw err;
  }
};

// Create Jadwal
export const insertJadwal = async (
  idUser,
  namaMatkul,
  semester,
  hari,
  kelas,
  ruangan,
  jamMulai,
  jamSelesai,
  tipeJadwal,
  aktifkan,
) => {
  try {
    const db = await getDatabase();
    await db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO jadwalMengajar (idUser, namaMatkul, semester, hari, kelas, ruangan, jamMulai, jamSelesai, tipeJadwal, aktifkan) VALUES (?,?,?,?,?,?,?,?,?,?);`,
        [
          idUser,
          namaMatkul,
          semester,
          hari,
          kelas,
          ruangan,
          jamMulai,
          jamSelesai,
          tipeJadwal,
          aktifkan ? 1 : 0,
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log(`Berhasil tambah Jadwal : ${results}`);
          }
        },
        (tx, error) => {
          error.map(err => {
            console.log(`Gagal menambahkan Jadwal : ${err}`);
          });
        },
      );
    });
  } catch (err) {
    console.log(`insertJadwal Error : ${err}`);
    throw err;
  }
};

// Read Data Akun
export const getAkun = async () => {
  try {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM AkunUser`,
          [],
          (tx, results) => {
            const rows = results.rows.raw();
            console.log('Jumlah Data : ', rows.length);
            rows.map(data => {
              console.log(`Berhasil tarik Data : ${data.username}`);
            });

            resolve(rows);
          },
          (tx, error) => {
            console.log(`Error membaca data dari tabel : ${error}`);
            reject(error);
          },
        );
      });
    });
  } catch (err) {
    console.log('Error pada fungsi getData : ', err);
    throw err;
  }
};

// Read Data Jadwal
export const getJadwal = async idUser => {
  try {
    const db = await getDatabase();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM jadwalMengajar WHERE idUser = ?`,
          [idUser],
          (tx, results) => {
            const rows = results.rows.raw();
            console.log('Jumlah Data : ', rows.length);
            rows.map(data => {
              console.log(
                `Berhasil tarik Data Jadwal Mengajar : ${data.idUser}`,
              );
            });

            resolve(rows);
          },
          (tx, error) => {
            console.log(
              `Error membaca data dari tabel jadwalMengajar : ${error}`,
            );
            reject(error);
          },
        );
      });
    });
  } catch (err) {
    console.log('Error pada fungsi getData : ', err);
    throw err;
  }
};

// Hapus Data
export const hapusData = async id => {
  try {
    const db = await getDatabase();
    await db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM jadwalMengajar WHERE idMengajar = ?;`,
        [id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log(`Berhasil Hapus Data dengan id : ${id}`);
          } else {
            console.log(`Data dengan id : ${id} tidak ditemukan`);
          }
        },
        (tx, error) => {
          console.log(`Gagal Menghapus Data : ${error}`);
        },
      );
    });
  } catch (err) {
    console.log(`Fungsi hapusData error : ${err}`);
  }
};

// cek semua tabel dan jumlah
export const cekAllTabel = async () => {
  const db = await getDatabase();
  db.transaction(tx => {
    tx.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table'`,
      [],
      (tx, results) => {
        const rows = results.rows.raw();
        // console.log('Cek Table: ', rows);
        // console.log('cek jumlah:', rows.length);
        rows.map(tabel => {
          console.log(`Nama Tabel : ${tabel.name}`);
        });
      },
      (tx, error) => {
        console.log(`gagal cek tabel : ${error}`);
      },
    );
  });
};

// cek tabel tertentu dan jumlah
export const cekTabel = async () => {
  const db = await getDatabase();
  db.transaction(tx => {
    tx.executeSql(
      `PRAGMA table_info(jadwalMengajar);`,
      [],
      (tx, results) => {
        const rows = results.rows.raw();
        // console.log('Cek Table: ', rows);
        // console.log('cek jumlah:', rows.length);
        rows.map(tabel => {
          console.log(`Nama Field : ${tabel.name}`);
        });
      },
      (tx, error) => {
        console.log(`gagal cek tabel : ${error}`);
      },
    );
  });
};

// Hapus tabel tertentu
export const hapusTabel = async () => {
  const db = await openDb();
  db.transaction(tx => {
    tx.executeSql(
      `DROP TABLE IF EXISTS jadwalDosen`,
      [],
      (tx, results) => {
        console.log('Berhasil Hapus Tabel');
        // CekDatatabel
      },
      (tx, error) => {
        console.log('Gagal Hapus Data : ', error);
      },
    );
  });
};
