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
    console.log('Berhasil menghubungkan Database :', db);
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

// cek semua tabel dan jumlah
export const cekAllTabel = async () => {
  const db = await getDatabase();
  db.transaction(tx => {
    tx.executeSql(
      `SELECT name FROM sqlite_master WHERE type='table'`,
      [],
      (tx, results) => {
        const rows = results.rows.raw();
        console.log('Cek Table: ', rows);
        console.log('cek jumlah:', rows.length);
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
