# ADHILAND FINANCE — PAKET PERENCANAAN UI/UX (v1.0)

> Snapshot sumber: `adhiland-mockup.zip` (data per 30 Sep 2026). Dokumen disusun 2 Okt 2026.
> Bahasa dokumen: Indonesia. Bahasa istilah teknis kode: Inggris.

## 1. Apa isi paket ini

| File | Isi | Dibaca oleh |
|---|---|---|
| `00_README.md` | Panduan, aturan wajib AI, glosarium | Semua |
| `01_AUDIT_EVALUASI.md` | Temuan mockup (ID `F-xxx`), severity, saran | PM, Desainer |
| `02_PRD.md` | Tujuan, persona, kebutuhan (`FR-`/`NFR-`), ruang lingkup | PM, semua |
| `03_SPEC_DESIGN_SYSTEM.md` | Token warna terang+gelap, tipografi, komponen | Desainer, Frontend |
| `04_SPEC_DASHBOARD_DIREKTUR.md` | Dashboard Eksekutif (widget demi widget) | Frontend |
| `05_SPEC_HALAMAN_DIREKTUR.md` | 15 halaman Direktur lainnya | Frontend |
| `06_SPEC_DASHBOARD_ROLE.md` | Home Legal, Teknik, Marketing, Operasional | Frontend |
| `07_SPEC_DATA_ARSITEKTUR.md` | Kamus metrik `M-xxx`, model data, view, aturan kualitas data | Backend, Data |
| `08_SPEC_INFOGRAFIK.md` | Aturan pemilihan grafik, format angka, pola anotasi | Desainer, Frontend |
| `09_TASKS.md` | Daftar task berurutan `T-xxx` + dependensi + DoD | AI pelaksana |
| `10_QA_AKSEPTANSI.md` | Checklist uji | QA |
| `11_PROMPT_PACK.md` | Prompt siap pakai per task | AI pelaksana |

## 2. Urutan baca (WAJIB)
1. `00` → `02` → `03` → file SPEC halaman yang dikerjakan → `07` (hanya metrik yang dipakai) → `08` → `09` (task terkait) → `10`.
2. `01` dibaca hanya untuk memahami alasan sebuah keputusan desain. Jangan jadikan sumber spesifikasi.

## 3. ATURAN EMAS UNTUK AI PELAKSANA (reasoning rendah)
1. **Kerjakan SATU task `T-xxx` per sesi.** Jangan loncat.
2. **Ikuti ID.** Setiap widget punya ID (`W-DIR-03`). Jangan menamai ulang. Jangan menambah widget yang tidak ada di spec.
3. **Jangan mengarang angka.** Angka contoh di dokumen berlabel `CONTOH`. Data nyata hanya dari view di `07`.
4. **Jangan hardcode warna.** Pakai variabel CSS `--*` dari `03`. Dilarang menulis `#hex` di luar file token.
5. **Dua tema wajib.** Setiap komponen harus tampil benar di `data-theme="light"` dan `data-theme="dark"`. Default = `light`.
6. **Format angka wajib** lewat fungsi di `08` §3. Dilarang `toLocaleString` mentah.
7. **Setiap widget wajib 4 keadaan:** `loading`, `empty`, `error`, `ok`. Definisi di `03` §9.
8. **Jika spec ambigu → pilih opsi bertanda `DEFAULT`, lalu catat di `DECISIONS.md`.** Jangan bertanya berulang.
9. **Selesai = lulus semua kriteria `DoD` task** + checklist `10` yang relevan.
10. **Dilarang menghapus fitur mockup** (export, filter proyek, edit anggaran, setujui sebagian, dll). Tugas ini *upgrade*, bukan *reduksi*.

## 4. Konvensi
- Tanggal tampilan: `30 Sep 2026` (bulan 3 huruf Indonesia: Jan Feb Mar Apr Mei Jun Jul Agu Sep Okt Nov Des). Waktu: `14:05`.
- Mata uang: Rupiah, `Rp`, titik ribuan, koma desimal. Ringkas: `Rp 103,94 M` (miliar), `Rp 75,31 jt`.
- Istilah standar (pakai konsisten, jangan campur):
  | Pakai | Jangan pakai |
  |---|---|
  | **Proyek** (= cluster = company di kode) | perusahaan, cluster, company di UI |
  | **Kavling** (unit) | unit, lot |
  | **Persetujuan** (menu) / **Pengajuan** (dokumen) | approval |
  | **Sisa Tagihan PPJB** | “Piutang PPJB” |
  | **Piutang Usaha (Jurnal)** | “Piutang Proyek” |
- Tingkat keparahan: `S1` kritis, `S2` tinggi, `S3` sedang, `S4` rendah.
- Penanda status: `DEFAULT` (pilih ini bila ragu), `KONFIRMASI` (nilai tebakan, minta pemilik produk memastikan).

## 5. Catatan tentang “skill.md” yang diminta
Skill kustom **UIUX Design / Advance ERP Specialist / Advance Data Arsitektur & Data Analyst / Advance Infographic & Corporate Dashboard Specialist** tidak ditemukan di lingkungan kerja saya (hanya skill umum docx/pdf/pptx/xlsx/frontend-design). Karena itu keempatnya diterapkan sebagai **lensa pemeriksaan** (§6) yang tertanam di seluruh dokumen. Jika Anda punya file skill.md aslinya, unggah dan saya selaraskan.

## 6. Empat lensa yang dipakai
| Lensa | Pertanyaan pemeriksa | Dimana diterapkan |
|---|---|---|
| UIUX Design | Apakah tugas utama selesai ≤3 klik? hirarki jelas? aksesibel (kontras ≥4,5:1)? | 01, 03, 05 |
| ERP Specialist | Apakah alur Budgeting→Pengajuan→Jurnal→Laporan konsisten? ada kontrol persetujuan, audit trail, otorisasi per peran? | 01, 05, 06, 07 |
| Data Arsitektur & Analyst | Apakah tiap angka punya definisi, sumber tunggal, rumus, dan aturan kualitas? | 07 |
| Infographic & Corporate Dashboard | Apakah tiap visual menjawab *satu pertanyaan keputusan*, dengan pembanding, ambang, dan aksi? | 04, 06, 08 |

## 7. Glosarium
| Istilah | Arti |
|---|---|
| PPJB | Perjanjian Pengikatan Jual Beli (nilai kontrak jual kavling) |
| Uang Masuk | Kas yang sudah diterima dari konsumen |
| Sisa Tagihan PPJB | PPJB − Uang Masuk (belum ditagih/diterima) |
| SLF, BAST, AJB, BPHTB, PPH, SHGB | Dokumen/pajak legal: Sertifikat Laik Fungsi, Berita Acara Serah Terima, Akta Jual Beli, Bea Perolehan Hak atas Tanah & Bangunan, Pajak Penghasilan, Sertifikat Hak Guna Bangunan |
| Termin / Addendum / Retensi | Cicilan kontrak / pekerjaan tambahan / dana tahanan kontraktor |
| CoA | Chart of Accounts (daftar akun) |
| ITJ, PTB | **KONFIRMASI**: singkatan muncul di mockup tanpa penjelasan. Minta pemilik produk mengisi artinya di `07` §7 sebelum rilis. |
| RAG | Red-Amber-Green (status merah-kuning-hijau) |
| PK-xx | Pertanyaan Keputusan Direktur (02 §4). **Berbeda** dari `DQ-xxx` = aturan Kualitas Data (07 §8) |
| DoD | Definition of Done |
