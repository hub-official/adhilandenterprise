# Database hasil ekstraksi adhilandpro.com

Ekstraksi: 2026-10-02 — sumber: https://adhilandpro.com (semua role: Direktur, Operasional, Teknik, Legal, Marketing).

Data mentah tersimpan di `extract/raw/*.json`. Folder ini adalah hasil konversinya.

## Isi folder

```
database/
├── mysql/            # skrip SQL siap import (MySQL 8 / MariaDB 10.6+)
│   ├── adhiland_master.sql
│   ├── adhiland_konstruksi.sql
│   ├── adhiland_keuangan.sql
│   ├── adhiland_operasional.sql
│   └── adhiland_laporan.sql
├── csv/<database>/<tabel>.csv   # satu file CSV per tabel (UTF-8 + BOM)
├── import-all.ps1    # helper import ke MySQL
└── README.md
```

## Inventory tabel

| Database | Tabel | Baris | Kolom | Keterangan |
|---|---|---:|---:|---|
| `adhiland_master` | `cluster` | 5 | 4 | Master proyek/cluster (/companies) |
| `adhiland_master` | `pengguna` | 9 | 5 | Akun pengguna sistem (/users) - kolom hash password DIBUANG |
| `adhiland_master` | `akun_coa` | 579 | 6 | Bagan akun / chart of accounts (/accounts) |
| `adhiland_master` | `rekening_vendor` | 275 | 4 | Rekening bank vendor (/master-data/rekening-vendor) |
| `adhiland_master` | `inventaris` | 0 | 11 | Inventaris aset (/inventaris) |
| `adhiland_master` | `kavling_master` | 106 | 55 | Master unit/kavling: gabungan view Legal (identitas+legal), Direktur (harga daftar, kode) dan pemetaan halaman detail |
| `adhiland_master` | `kavling_spek` | 68 | 27 | Spesifikasi & kelengkapan per kavling (isian form halaman /property/{id}) |
| `adhiland_konstruksi` | `rekap_konstruksi` | 67 | 30 | Rekap konstruksi per kavling (/property/rekap-konstruksi, role Teknik/Operasional) |
| `adhiland_konstruksi` | `realisasi_biaya` | 68 | 13 | Realisasi biaya konstruksi per kavling (halaman detail) |
| `adhiland_konstruksi` | `realisasi_furniture` | 612 | 7 | Rincian furniture & perlengkapan per kavling |
| `adhiland_konstruksi` | `progres_pembangunan` | 10 | 6 | Riwayat progres pembangunan per kavling |
| `adhiland_konstruksi` | `riwayat_update_biaya` | 146 | 9 | Riwayat update nilai kontrak per kavling |
| `adhiland_konstruksi` | `termin_budgeting` | 9 | 9 | Termin/addendum/retensi yang ditautkan ke kavling (dari budgeting) |
| `adhiland_konstruksi` | `jadwal_pembayaran` | 0 | 7 | Jadwal pembayaran per kavling |
| `adhiland_konstruksi` | `riwayat_pembayaran` | 0 | 6 | Riwayat pembayaran per kavling |
| `adhiland_keuangan` | `jurnal` | 1977 | 8 | Jurnal umum (/reports/jurnal) |
| `adhiland_keuangan` | `kas_ringkasan_bulanan` | 9 | 17 | Ringkasan kas & bank per bulan (/reports/kas-tunai) |
| `adhiland_keuangan` | `kas_mutasi` | 1877 | 11 | Mutasi kas & bank rinci (/reports/kas-tunai) |
| `adhiland_keuangan` | `buku_besar` | 4142 | 11 | Buku besar per akun (/reports/buku-besar, 94 akun) |
| `adhiland_keuangan` | `buku_besar_akun` | 94 | 5 | Daftar akun buku besar + saldo awal |
| `adhiland_keuangan` | `neraca` | 261 | 5 | Laporan neraca (/reports/neraca) |
| `adhiland_keuangan` | `laba_rugi` | 328 | 5 | Laporan laba rugi (/reports/laba-rugi) |
| `adhiland_keuangan` | `piutang_hutang` | 21 | 6 | Piutang & hutang per perusahaan (/reports/piutang-hutang) |
| `adhiland_operasional` | `budgeting_pekerjaan` | 75 | 7 | Rincian anggaran per pekerjaan & cluster (/budgeting) |
| `adhiland_operasional` | `budgeting_jenis_pekerjaan` | 75 | 4 | Rekap anggaran per jenis pekerjaan (/budgeting) |
| `adhiland_operasional` | `budgeting_item` | 79 | 11 | Item budgeting - gabungan semua role (setiap role melihat himpunan berbeda) |
| `adhiland_operasional` | `pengajuan` | 88 | 12 | Pengajuan dana - gabungan semua role |
| `adhiland_operasional` | `tempat_sampah` | 33 | 5 | Data terhapus (/trash) |
| `adhiland_laporan` | `laporan_legal` | 64 | 12 | Laporan progres legal per kavling (/reports/legal) |
| `adhiland_laporan` | `laporan_teknik` | 63 | 14 | Laporan progres teknik (/reports/teknik) |
| `adhiland_laporan` | `laporan_teknik_ringkas` | 1 | 7 | Ringkasan teknik (/reports/teknik) |
| `adhiland_laporan` | `biaya_proyek_bulanan` | 15 | 15 | Biaya proyek per bulan (/reports/biaya-proyek) |
| `adhiland_laporan` | `dashboard_proyek` | 5 | 17 | Ringkasan dashboard per proyek (/) - saldo kas, unit terjual, uang masuk, piutang, rasio, stok, hutang |
| `adhiland_laporan` | `dashboard_budget_realisasi` | 15 | 3 | Anggaran vs realisasi per jenis pekerjaan (/) |

**Total: 5 database, 34 tabel, 11.176 baris.**

## Perubahan terhadap data sumber

- Kolom **hash password** pada `/users` **tidak diekspor**.
- Kolom tombol UI (`Aksi`), kolom tanpa judul, dan kolom seluruhnya kosong dibuang.
- Baris placeholder ("Belum ada ...") dan baris kosong dibuang.
- Tipe kolom diinferensi: rupiah/angka → `BIGINT` (titik ribuan dibuang), persen → `DECIMAL(18,4)`, tanggal ISO → `DATE`/`DATETIME`, sisanya `TEXT`.
- Tabel `budgeting_item` dan `pengajuan` adalah **gabungan semua role** karena tiap role melihat himpunan baris berbeda; kolom `sumber_role` mencatat role mana yang menampilkan baris tersebut.
- `kavling_master` digabung dari view Legal (paling kaya), view Direktur (harga daftar & kode) dan pemetaan ID halaman detail.

## Cara import

### MySQL (disarankan)

```powershell
mysql -u root -p < database/mysql/adhiland_master.sql
mysql -u root -p < database/mysql/adhiland_konstruksi.sql
mysql -u root -p < database/mysql/adhiland_keuangan.sql
mysql -u root -p < database/mysql/adhiland_operasional.sql
mysql -u root -p < database/mysql/adhiland_laporan.sql

# atau otomatis:
powershell -File database/import-all.ps1
```

### CSV

- Excel: buka langsung (sudah UTF-8 + BOM).
- MySQL: `LOAD DATA INFILE` per tabel, atau lewat wizard Workbench/phpMyAdmin.

## MySQL vs CSV — rekomendasi

| Aspek | MySQL | CSV |
|---|---|---|
| Integrasi ke aplikasi | Langsung (SQL, relasi, view, transaksi) | Perlu parser + mapping manual |
| Ukuran data | ~ribuan baris/tabel (jurnal 1.977, buku besar 4.142) — ringan | Sama ringan, tapi tanpa tipe data |
| Tipe data & validasi | Terpasang (BIGINT/DATE/DECIMAL) | Semua jadi teks |
| Query lintas laporan | Mudah (JOIN, GROUP BY, agregasi) | Harus diproses dulu (Power BI/Excel) |
| Pertukaran/arsip | Perlu dump | Universal, bisa dibuka siapa saja |
| Kolom berevolusi | Perlu migrasi ALTER | Otomatis mengikuti |
| Kolaborasi non-teknis | Perlu tool | Excel/Sheets langsung |

**Rekomendasi: gunakan MySQL sebagai database utama** untuk integrasi (relasi antar tabel, query laporan, kecepatan, integritas tipe data), **dan simpan CSV sebagai arsip/backup + format pertukaran** yang bisa dibuka di Excel. Keduanya digenerate dari sumber yang sama sehingga selalu bisa dibuat ulang dengan `node tools/build-database.mjs`.
