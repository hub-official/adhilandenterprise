# Adhiland ERP Mockup — Database Integration

Tanggal upgrade: 03 Oktober 2026

## Sumber data

Mockup ini sekarang membawa snapshot `database.zip` yang telah diekstrak ke `database/` dan dikompilasi menjadi:

- `assets/data/canonical-data.json` — single browser-side source untuk seluruh 34 tabel + derived views.
- `database/csv/` — arsip CSV hasil ekstraksi.
- `database/mysql/` — SQL siap import ke MySQL/MariaDB.

Total snapshot: **34 tabel / 11.176 baris**.

## Data status

- **Actual**: langsung dari tabel database snapshot.
- **Derived**: agregasi/perhitungan deterministik dari data actual.
- **Indicative**: hanya digunakan jika struktur sumber tidak menyediakan granularitas yang diperlukan; label harus terlihat pada UI.
- Dataset kosong (`inventaris`, `jadwal_pembayaran`, `riwayat_pembayaran`) tidak dipalsukan sebagai transaksi aktual.

## Canonical flow

`database/csv` → `canonical-data.json` → `AdhData` → semua halaman UI.

Legacy JSON di `assets/data/` tetap dipertahankan untuk kompatibilitas halaman lama, tetapi KPI executive, detail popup baru, project context, deadline, notification, aging, cash-quality, dan financial aggregation menggunakan canonical database snapshot.

## Global interactions

- Sidebar collapse/expand persistent.
- Global project selector.
- Executive project selector berbentuk dropdown.
- Notification center.
- Universal detail modal untuk KPI/Detail/Critical/Info.
- Project context dapat mengubah dashboard melalui localStorage.
- Detail modal menampilkan source dan jumlah baris.

## Financial decision flows

### Saldo
`dashboard_proyek` → project/account breakdown.

### Penjualan / PPJB
`kavling_master` + `dashboard_proyek` → PPJB, uang masuk, piutang.

### Kualitas arus kas
`kas_ringkasan_bulanan` → kategori pemasukan aktual.

### Jatuh tempo
`budgeting_item` → due/overdue queue.

### Approval
`pengajuan` → approval queue dan cash impact.

### Aging
`piutang_hutang` → AR/AP aging buckets.

### Cash runway
`kas_mutasi.Kredit` → historical 90-day average outflow benchmark. Ini benchmark historis, bukan forecast.

## Skalabilitas

Jika backend diganti dengan MySQL/API, UI dapat tetap menggunakan kontrak `AdhData`. Adapter baru cukup menggantikan sumber `canonical-data.json` tanpa membongkar komponen UI.
