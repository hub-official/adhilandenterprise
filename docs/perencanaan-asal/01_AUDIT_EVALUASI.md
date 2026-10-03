# 01 — AUDIT & EVALUASI MOCKUP ADHILAND FINANCE

## 1. Ringkasan eksekutif
Mockup berisi **846 file** untuk **5 peran**: Direktur (681 file), Legal (75), Teknik (72), Marketing (3), Operasional (3). Inti produk: ERP keuangan pengembang properti (kavling) dengan 5 proyek: EazyKost Joyo Agung, EazyKost Sigura-gura, Lumiera Garden, Mayana II, Mayana Resort.

**Kekuatan (pertahankan):** cakupan fungsional lengkap (CoA, jurnal, buku besar, neraca, laba rugi, budgeting, pengajuan dengan “setujui sebagian”, kavling, legal, konstruksi, inventaris), filter proyek global, export Excel/PDF, riwayat revisi anggaran, dukungan tema gelap, pemisahan peran.

**Masalah utama:** (1) dashboard berupa **kumpulan tabel**, bukan alat keputusan; (2) hampir tidak ada pembanding/ambang/tren; (3) angka tidak konsisten antar halaman; (4) halaman laporan memuat ribuan baris tanpa paginasi; (5) data sensitif terpapar; (6) peran Marketing & Operasional tidak punya dashboard sama sekali; (7) aset JavaScript tidak ikut paket sehingga grafik tidak bisa dirender.

## 2. Inventaris halaman (kondisi saat ini)
| ID | Halaman (file) | Isi sekarang | Masalah ringkas |
|---|---|---|---|
| P-02 | Dashboard `Direktur/index.html` | 9 kartu skor + 8 tabel per-proyek + 1 grafik kombo + tabel 47 baris + tabel anggaran vs realisasi + donut | 4 dari 5 proyek tampil `Rp 0` di hampir semua tabel; tidak ada target/tren/aksi |
| P-03 | Budgeting | Grafik per bulan, 5 tabel anggaran per proyek (tertumpuk), 1 tabel jadwal 22 kolom-baris | Tabel identik berulang; kolom “Spend Sign” tak jelas |
| P-04 | Pengajuan | 12 kolom, 25 baris, 48 form, filter periode | Tidak ada umur antrian, dampak kas, persetujuan massal |
| P-05 | Kavling | 15 kolom × 106 baris, 4 kartu ringkas | Tanpa funnel/peta, tanpa paginasi |
| P-06 | Laporan Legal | Matriks ✓/– 64 kavling × 7 kolom dokumen + kolom Komplit; target 512; 9 selesai | Tanpa tenggat, tanpa prioritas, tanpa SLA |
| P-07 | Laporan Teknik | 14 kolom × 63 kavling; Fasum; Kendala; Action Plan | Mayoritas sel progres “–”; tanpa kurva-S |
| P-08 | Inventaris | Tabel kosong + form + impor | Tanpa ringkasan nilai/kondisi |
| P-09 | Arus Kas | Ringkasan kategori×bulan + 1.878 baris | Tanpa grafik, tanpa saldo akhir/proyeksi |
| P-10 | Jurnal | 1.978 baris, 8 kolom | Tanpa paginasi, tanpa filter akun/tipe |
| P-11 | Buku Besar | 188 tabel (1 per akun), file 2,3 MB | Banyak tabel kosong, berat |
| P-12 | Neraca | 2 tabel (195 + 66 baris), **tanpa `<th>`** | Akun nol ikut tampil; tanpa rasio |
| P-13 | Laba Rugi | 1 tabel 328 baris, **tanpa `<th>`** | Dominan akun nol; tanpa margin/pembanding |
| P-14 | Piutang & Hutang | 10 tabel kecil (akun, saldo, aktivitas terakhir, umur) | Tanpa bucket umur, tanpa top debitur |
| P-15 | Realisasi Biaya | 16 jenis pekerjaan × 12 bulan + Total + % | Padat, tanpa heatmap/peringatan visual |
| P-16 | Master Data | CoA 580 baris/581 form; Rekening Vendor 276 baris/276 form; Cluster; Pengguna | DOM berat; nomor rekening terbuka |
| P-17 | Tempat Sampah | 22 baris, kolom “Data” memuat kunci mentah (`fund_request`) | Kebocoran istilah teknis |
| P-18 | Detail Kavling (`property_N`) | Progres, biaya konstruksi, furnitur, jadwal termin, riwayat | Padat; ada di Legal & Teknik, tak ada di Direktur |
| P-20..P-50 | Legal/Teknik/Marketing/Operasional | Halaman daftar & form; tanpa home | **Tanpa dashboard peran** |

## 3. Angka kunci dari snapshot (dasar insight; per 30 Sep 2026)
| Indikator | Nilai | Catatan |
|---|---|---|
| Saldo kas & bank (konsolidasi) | Rp 75.308.483 | 100% berada di Lumiera Garden; 4 proyek lain Rp 0 |
| Total penjualan (PPJB) | Rp 103.944.800.000 (63 kavling) | |
| Uang masuk | Rp 13.286.720.000 = **12,78%** | Hanya Lumiera Garden > 0 |
| Sisa tagihan PPJB | Rp 90.658.080.000 = **87,22%** | EazyKost ×2 & Mayana Resort = 100% belum masuk |
| Kavling | 106 total: 43 belum terjual, 47 deal–belum bayar, 13 bertahap, 3 cash | Potensi belum laku Rp 61.825.100.000 |
| Hutang (neraca) | Rp 4.857.423.995 | Kas hanya menutup **1,55%** |
| Pengajuan menunggu | 20 item = Rp 818.159.750 | Kas menutup **9,2%** → selisih −Rp 742.851.267 |
| Budgeting jatuh tempo belum lunas | 29 item | Nilai total tidak ditampilkan |
| Anggaran vs realisasi | Rp 125,79 M vs Rp 20,49 M = **16,29%** | Konstruksi hanya **4,40%** (Rp 1,88 M dari Rp 42,68 M) |
| Konstruksi | 63 kavling: 32 on progress, 23 terlambat, 8 close | Rata-rata telat **259 hari**, maksimum **606 hari** |
| Legal | 9 dari 512 dokumen = **1,76%** | |
| Piutang usaha | Rp 151.678.383 | **99,0%** adalah piutang karyawan (Rp 150.216.668); umur piutang lain 405–593 hari |
| Arus kas masuk (periode tampil) | Kavling ≈48,5%, Pendanaan ≈26,4%, **Belum Dikategorikan ≈14,8%**, Antar Proyek ≈10,0% | Dihitung dari total kolom tabel |

**Pesan bisnis yang tidak tertangkap dashboard saat ini:** perusahaan sudah menjual Rp 103,9 M tetapi baru menerima 12,8%, kas nyaris habis, ada antrian pembayaran Rp 818 jt, dan 23 kavling terjual sudah melewati tanggal serah terima. Ini risiko likuiditas + risiko wanprestasi kepada konsumen. Dashboard baru **harus** mengangkat ini ke bagian paling atas.

## 4. Temuan (diurutkan severity)
| ID | Sev | Area | Bukti di mockup | Saran | Ditangani di |
|---|---|---|---|---|---|
| F-001 | S1 | Aset | Folder `assets/js/` (`app.js`, `chart.umd.min.js`) dirujuk tapi **tidak ada** di zip; `<canvas>` tidak bisa tampil | Sertakan JS/vendor; sematkan versi terkunci; self-host (tanpa CDN) | T-001 |
| F-002 | S1 | Keputusan | Dashboard = 8 tabel + 1 grafik; tak ada target, tren, status | Ganti dengan *Pusat Keputusan* + KPI ber-ambang + matriks kesehatan proyek | 04 |
| F-003 | S1 | Konsistensi data | Dashboard “Sisa unit: 0 / Nilai Sisa Stok Rp 0”, sedangkan Kavling: 43 belum laku, potensi Rp 61,8 M | Satu sumber kebenaran (`mv_inventory_stock`); tambah aturan kualitas data DQ-001 | 07 |
| F-004 | S1 | Keamanan | `master-data_rekening-vendor.html` memuat 276 nomor rekening di semua peran (Marketing/Operasional/Legal/Teknik ikut punya halaman ini); NIK, alamat, telepon konsumen di halaman Legal | Masking default (`•••• 3330`), tombol “tampilkan” butuh izin + log audit; batasi per peran | 05, 07 |
| F-005 | S2 | Performa | Jurnal 1.978 baris, Kas 1.878 baris, Buku Besar 188 tabel/2,3 MB, CoA 580 form, Vendor 276 form, Legal property 3.006 input — semua dirender sekaligus | Paginasi/virtualisasi server-side, form edit dimuat on-demand (drawer) | 05 |
| F-006 | S2 | Alur ERP | Pengajuan: tak tampak keterkaitan ke item Budgeting, sisa anggaran, dan dampak kas saat menyetujui | Panel “Dampak” di drawer persetujuan; persetujuan massal; batas wewenang | 05 §P-04 |
| F-007 | S2 | Likuiditas | Tak ada tampilan **cakupan kas** terhadap kewajiban/pengajuan | Widget jembatan kas (waterfall) + rasio cakupan | 04 W-DIR-07 |
| F-008 | S2 | Peran | Marketing & Operasional hanya 3 halaman (Budgeting, Pengajuan, Rekening); tak ada home | Home per peran | 06 |
| F-009 | S2 | Konstruksi | 23 kavling terlambat s.d. 606 hari; sel progres kosong “–” → status hanya dari tanggal; `RK 06` Rencana Serah Terima 06 Aug **2025** vs Rencana BAST 06 Aug **2026** (satu tahun beda) | Validasi tanggal; metrik “umur update progres”; kurva-S; kartu risiko serah terima | 06, 07 DQ-004 |
| F-010 | S2 | Legal | 9/512 dokumen; sel “–” tanpa tenggat/pemilik | Heatmap status 4 warna + tenggat + PIC + prioritas | 06 |
| F-011 | S2 | Aksesibilitas | Neraca & Laba Rugi tanpa `<th>`; status hanya ✓/– tanpa teks; warna sebagai satu-satunya pembeda | `<th scope>`, ikon+teks, kontras ≥4,5:1, navigasi keyboard | 03, 10 |
| F-012 | S2 | Piutang | “Piutang Proyek” bercampur piutang karyawan 99%; umur 405–593 hari tak menonjol | Pisahkan akun (konsumen / karyawan / lain); bucket umur; top 5 | 04 W-DIR-14 |
| F-013 | S3 | Terminologi | Perusahaan / Cluster / Proyek / Company bercampur; “Piutang PPJB” vs “Piutang Proyek” membingungkan; ITJ, PTB tanpa penjelasan | Glosarium + tooltip; istilah standar (README §4) | 00, 03 |
| F-014 | S3 | Format | Tanggal bercampur (`2026-09-30 04:40:28`, `30 Sep`, `30/09/2026`); bulan Inggris (“May”, “Aug”, “Oct”, “Dec”) bercampur “Agu/Ags/Des/Mei” | Satu format (README §4) via helper tunggal | 08 §3 |
| F-015 | S3 | Angka | Rupiah penuh `Rp 103.944.800.000` di semua kartu | Ringkas `Rp 103,94 M`, nilai penuh di tooltip/ekspor | 08 §3 |
| F-016 | S3 | Kebisingan | Tabel per proyek menampilkan 4 dari 5 baris `Rp 0` | Sembunyikan nol (abu-abu), urutkan menurun, tombol “tampilkan semua” | 04 |
| F-017 | S3 | Navigasi | Grup “Laporan” dan “Laporan (Gabungan)” membingungkan; “Master Data” membuka CoA; “Tempat Sampah” sejajar menu utama | IA baru (03 §10): Ringkasan / Portofolio / Keuangan / Pembukuan / Pengaturan | 03 §10 |
| F-018 | S3 | Budgeting | 5 tabel proyek tertumpuk + 5 modal “Edit Total Anggaran” | Tab proyek + kartu ringkas + tabel tunggal terfilter | 05 §P-03 |
| F-019 | S3 | Kavling | 15 kolom, status teks “DEAL — BELUM BAYAR” (47 kavling) tanpa visual | Funnel status + tampilan peta/kisi kavling + kolom ringkas | 05 §P-05 |
| F-020 | S3 | Arus kas | “Belum Dikategorikan” ≈14,8% dan “Pengembalian Piutang Antar Proyek” ≈10% masuk pemasukan konsolidasi | Eliminasi antar-proyek pada tampilan konsolidasi; antrian kategorisasi | 07 DQ-007 |
| F-021 | S3 | Laporan keuangan | Neraca/LR memuat ratusan akun bernilai 0; tanpa pembanding periode/rasio | Sembunyikan nol, grup bisa dilipat, kolom pembanding, rasio utama | 05 |
| F-022 | S3 | Kebocoran teknis | Trash: kolom Jenis menampilkan `fund_request`; teks “Hanya pantau” | Label manusiawi (“Pengajuan”) | 05 §P-17 |
| F-023 | S3 | Typo | “kavking” pada keperluan; “Spend Sign”; “Resume” | Pembersihan teks; ganti “Resume” → “Ringkasan” | T-040 |
| F-024 | S3 | Tema | Dua blok gelap berbeda di `app.css` (`#05080f` via `prefers-color-scheme`, `#0f172a` via `data-theme`); default mengikuti OS; radius 20px terlalu besar untuk tabel padat | Satu palet gelap, default terang, radius 8–12px | 03 |
| F-025 | S3 | Dependensi | Bukti pengajuan merujuk domain eksternal `adhilandpro.com` dan memuat gambar 2550×3504 penuh | Pratinjau terkompresi di drawer; simpan lokal | 05 |
| F-026 | S4 | Dekorasi | Jam dinding di sidebar; badge notifikasi tanpa prioritas | Ganti dengan “Data per: 30 Sep 2026 14:05” + notifikasi berprioritas | 03 |
| F-027 | S4 | Cakupan mockup | Peran Akuntan/Staff ada di Pengguna tetapi **halamannya tidak ada** di mockup | Asumsi: Akuntan memakai halaman Pembukuan (Jurnal, Buku Besar, Inventaris) per proyek; tandai `KONFIRMASI` | 06 §P-60 |
| F-028 | S4 | Ekspor | Export ada tetapi tak ada “paket rapat direksi” | Tombol “Board Pack” (PDF 1 halaman dari dashboard) | 04 |

## 5. Rekomendasi prioritas (urutan eksekusi)
1. **Perbaiki fondasi:** F-001, F-003, F-004, F-005 (T-001…T-008).
2. **Dashboard Direktur baru** (Pusat Keputusan + KPI + matriks proyek + 8 visual keputusan): F-002, F-007, F-012.
3. **Design system 2 tema** + IA baru: F-011, F-013…F-017, F-024.
4. **Home per peran**: F-008, F-009, F-010.
5. **Polesan halaman lain**: F-018…F-023, F-025…F-028.
