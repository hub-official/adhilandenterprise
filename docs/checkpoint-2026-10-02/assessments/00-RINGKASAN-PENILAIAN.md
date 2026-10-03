# Ringkasan Penilaian Keseluruhan (2026-10-02)

**Update audit hardcode:** 2026-10-02 (lanjutan AI)

## Skor area (kasar 1–10)

| Area | Corporate | Compact | Fungsional | B+R list | C/U/D | Hardcode Risk |
|------|-----------|---------|------------|----------|-------|---------------|
| Dashboard Direktur | 7.5 | 6.5 | 8 | — | — | Sedang (insight) |
| Dashboard Legal | 7.5 | 7 | 8 | — | — | Sedang (1 KPI) |
| Dashboard Teknik | 7 | 6.5 | 7 | — | — | Sedang (tabel + kurva) |
| Dashboard Marketing | 7 | 7.5 | 7 | — | — | Rendah |
| Dashboard Operasional | 6 | 6 | **4** | — | — | **Kritis** |
| Modul Finance (laporan) | 7.5 | 6.5 | 7.5 | 8 | 2 | Tinggi (neraca/LR/budgeting) |
| Master Data (CoA dll) | 8 | 7.5 | 8 | 9 | 3 mock | Rendah |
| Kavling + Detail | 8 | 7 | 8 | 8 | 2 | Rendah |
| Pengajuan (semua role) | 8 | 7 | 8 | 8 | 3 mock approve | Rendah |
| Legal dokumen | 7.5 | 7 | 7 | 7 | 2 | Sedang (KPI dummy) |
| Teknik progres | 7 | 6.5 | 7 | 7 | 2 | Sedang (nilai dummy) |
| Inventaris / Sampah | 5 | 5 | 4 | 4 | 2 | Tinggi (full seed) |

## Temuan kunci (asli)
1. **Data layer sudah ada** (`AdhData`, `assets/data/*.json`) — angka kas/PPJB/funnel/pengajuan 80/legal 9/448/CoA 579 konsisten.
2. **B + R kuat**; **C/U/D hampir seluruhnya mock** (alert / drawer tanpa API).
3. **Operasional home** paling tertinggal; **Master CoA** paling dekat best practice list.
4. **318 file property_*.html** di `kavling-detail/` **deprecated** — wajib pakai `detail.html?id=N`.
5. Tidak ada role **Finance** terpisah; laporan finance di sidebar Direktur.
6. Sisa dummy: MONTHLY chart, AR/AP aging contoh, neraca/LR sebagian, kurva-S teknik, beberapa antrian legal.

## Audit Hardcode Detail (2026-10-02)

### Kritis — angka bisnis bertentangan dengan `aggregate.json` / menyesatkan

| File | Temuan | Nilai hardcode | Seharusnya (sumber kebenaran) |
|------|--------|----------------|-------------------------------|
| `Operasional/index.html` | KPI Anggaran Operasional | `35.2e9` (Rp 35,2 M) | `D.BUDGET.anggaran` ≈ **Rp 2,50 M** |
| `Operasional/index.html` | KPI Realisasi Ops | `8.2e9` (Rp 8,2 M) | `D.BUDGET.realisasi` = **0** |
| `Operasional/index.html` | Serapan teks | 23,3% | 0% |
| `Operasional/index.html` | Jatuh tempo ops | `6` | `D.BUDGET.jatuhTempo.n` = **21** |
| `Operasional/index.html` | Tabel pengajuan | 3 baris statis (PGJ-0885 dll) | `filterPengajuan({role:'Operasional'})` |
| `assets/js/dashboard.js` | Legal insight | 1,8% (9/512) | **2,0% (9/448)** dari `D.LEGAL` |
| `assets/js/dashboard.js` | “23 kavling terlambat ST” | 23 / 259 hari | `KONSTRUKSI.terlambat` = **0** |
| `Direktur/budgeting.html` | Ringkasan per proyek | Lumiera 55e9 / 28%, Joyo 28e9 / 8%, dll. | Harus dari `budgeting_item.json` atau agregat real |

### Sedang — dummy yang sudah dilabeli, tapi masih menyesatkan / perlu dibersihkan

| File | Temuan |
|------|--------|
| `Legal/index.html` | KPI hardcode `18` (kemungkinan “butuh AJB”) |
| `Legal/dokumen.html` | KPI Lewat tenggat 12 / Berjalan 28 / Belum 463 (dummy); matriks status pakai `id % 11` |
| `Teknik/index.html` | Tabel risiko (JA-007 606 hari dll.) full hardcode; Kurva-S array hardcode (sudah dilabeli indikatif) |
| `Marketing/index.html` | Teks “47 deal belum bayar” hardcode di string (angka benar, tapi tidak dinamis) |
| `assets/js/dashboard.js` | Insight 14,8% arus kas belum dikategorikan; 16,3% serapan; daily burn 9,5 jt (dummy); chart anggaran array hardcode |
| `Direktur/neraca.html` | Banyak baris (dummy): Aktiva Lainnya, Hutang Kontraktor, Hutang Pajak, Laba Ditahan |
| `Direktur/laba-rugi.html` | Hampir full dummy (pendapatan proxy uang masuk, HPP 8,2 M, beban gaji 2,1 M, dll.) — sudah dilabeli |
| `Direktur/realisasi.html` | Heatmap 16 jenis × 12 bulan full dummy |
| `Teknik/progres.html` + `property_rekap-konstruksi.html` | Kolom nilai formula dummy `(20+(k.id%15))*1e6` |

### Rendah / Defer (dummy eksplisit, data kosong, atau sudah aman)

| File | Temuan |
|------|--------|
| `Direktur/inventaris.html` | Full seed dummy (6 item) + label |
| `Direktur/sampah.html` | Full dummy |
| `assets/js/data.js` | Fallback `MONTHLY` + `AR_AGING` (sudah dilabeli di UI) |
| `Direktur/arus-kas.html`, `jurnal.html`, `buku-besar.html` | Relatif bersih (loadReport + paginasi + label sample) |
| `Direktur/master.html`, `Marketing/stok.html`, `Operasional/anggaran.html` | Sudah pakai data real |

### Halaman relatif bersih
- `login.html`
- `Direktur/master.html` (CoA/Vendors/Users dari JSON)
- `Marketing/stok.html`
- `Operasional/anggaran.html` (lebih baik dari home-nya)
- `Direktur/kavling.html` + `detail.html` (template)
- List yang sudah `AdhData.filter…` / `loadReport`

## Keputusan produk (jangan dilanggar)
- Jangan bangun fitur ERP penuh sekaligus.
- Prioritas: **compact dashboard** + **BREAD minimal di Pengajuan, Legal status, Teknik progres, Master** + **hapus dummy yang menyesatkan**.
- Over-fitur dilarang: tidak perlu workflow engine kompleks, multi-currency, dll. pada fase ini.
- **Angka kritis (Operasional home + Legal 9/512 + terlambat ST + budgeting ringkasan) wajib diganti sebelum polish visual.**
