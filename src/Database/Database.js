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

// Buat Tabel
export const buatTabel = async () => {
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
          console.log('Berhasil membuat tabel :', results);
        },
        (tx, error) => {
          console.log('Gagal membuat tabel :', error);
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
  console.log(data);
};

// Create Data
export const insertData = async (
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
            console.log('Data berhasil ditambahkan');
          }
        },
        (tx, error) => {
          console.log('Gagal menambahkan Data : ', error);
        },
      );
    });
  } catch (err) {
    console.log(`Error : ${err}`);
    throw err;
  }
};

// Read Data
export const getData = async () => {
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
              console.log(`Berhasil tarik Data ${data.namaLengkap}`);
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

// Hapus tabel tertentu
export const hapusTabel = async () => {
  const db = await openDb();
  db.transaction(tx => {
    tx.executeSql(
      `DROP TABLE IF EXISTS buatAkun;`,
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
