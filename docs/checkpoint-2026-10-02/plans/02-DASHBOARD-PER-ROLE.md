# Spesifikasi Dashboard per Role

**Update:** 2026-10-02 — catatan hardcode dari audit ditambahkan di tiap role.

## Prinsip layout (semua role)
```
[ Global bar: filter kontekstual + timestamp ]
[ Decision / Action strip — max 3–4 kartu kritis ]   ← hanya jika ada isu
[ KPI strip — 4 metrik max, compact ]
[ Zona utama 2 kolom: tabel prioritas | ringkas sekunder ]
[ Footer meta: sumber data ]
```
- Hindari >8 KPI di atas fold.
- Semua angka dari `AdhData` setelah `load()`.
- **Dilarang** hardcode angka bisnis yang bertentangan dengan `aggregate.json`.

---

## Direktur (`Direktur/index.html` + `dashboard.js`)
**Tujuan:** keputusan kas, persetujuan, kesehatan proyek.

**Wajib tampil:**
- Decision: pengajuan menunggu (n + nilai + tertua), cash cover, jatuh tempo budgeting, legal %
- KPI: Kas, PPJB, Uang masuk, Sisa tagihan, Stok belum, Hutang, Piutang, Serapan
- Matriks PROJECT_HEALTH + Funnel STOK
- Filter proyek harus memfilter KPI/matriks (perbaiki jika masih kosmetik)

**Perbaikan compact:**
- Decision cards lebih pendek (1 baris title + 1 baris meta + 1 CTA)
- KPI grid max 4+4 atau 4 utama + “lainnya” collapse

**Hardcode yang harus dibersihkan (audit):**
- Legal insight 1,8% (9/512) → ganti ke `D.LEGAL` (9/448)
- “23 kavling terlambat ST / 259 hari” → bertentangan `KONSTRUKSI.terlambat=0`; hapus atau ganti data real
- Insight 14,8% / 16,3% / daily burn 9,5 jt → label jelas “(indikatif)” atau hitung dari data
- Chart anggaran array hardcode → dari data atau label indikatif

**Jangan:** tambah chart banyak; MONTHLY boleh tetap indikasi jika dilabeli “indikatif”.

---

## Legal (`Legal/index.html`)
**Tujuan:** antrean dokumen & risiko keterlambatan.

**Wajib:** kelengkapan LEGAL, tertunda, pengajuan Legal, tabel prioritas dari data real, link `detail.html?id=`

**Hardcode yang harus dibersihkan (audit):**
- KPI hardcode `18` (kemungkinan “butuh AJB”) → hapus atau hitung dari `legal.json`

**Perbaikan:** heatmap dari `legal.json`; tanpa angka ajaib.

---

## Teknik (`Teknik/index.html`)
**Tujuan:** progres & keterlambatan konstruksi.

**Wajib:** KONSTRUKSI onProgress/terlambat/close, serapan konstruksi

**Hardcode yang harus dibersihkan (audit):**
- Tabel risiko (JA-007 606 hari, SG-004 412 hari, dll.) full hardcode → ganti data real dari `progres.json` jika ada, atau label “(contoh)”
- Kurva-S array hardcode → tetap boleh, wajib label “indikatif”

**Perbaikan:** tabel risiko dari progres real jika ada; kurva-S dilabeli indikatif atau diganti data.

---

## Marketing (`Marketing/index.html`)
**Tujuan:** stok & follow-up deal.

**Wajib:** funnel belum/deal/bertahap/cash, stok per proyek

**Hardcode yang harus dibersihkan (audit):**
- Teks “47 deal belum bayar” hardcode di string → pakai `D.STOK.funnel.dealBelumBayar` dinamis

**Perbaikan:** list top-N deal belum bayar sebagai tabel (Browse only) dari `kavling.json`.

---

## Operasional (`Operasional/index.html`)
**Tujuan:** antrian bayar & anggaran ops.

**Wajib:** tarik dari budgeting_item (jenis Operasional) + pengajuan role Operasional + jatuh tempo

**Hardcode kritis (audit) — prioritas #1 Fase 0:**
| KPI / elemen | Hardcode saat ini | Ganti ke |
|--------------|-------------------|----------|
| Anggaran Operasional | `35.2e9` | `D.BUDGET.anggaran` |
| Realisasi Ops | `8.2e9` | `D.BUDGET.realisasi` |
| Serapan | 23,3% | hitung dari realisasi/anggaran |
| Jatuh tempo ops | `6` | `D.BUDGET.jatuhTempo.n` |
| Tabel pengajuan | 3 baris statis PGJ-… | `filterPengajuan({role:'Operasional'})` |

**Perbaikan (prioritas tinggi):** hilangkan semua KPI hardcode di atas; samakan dengan `anggaran.html`.

---

## Finance
Tidak ada `Finance/index.html`. Gunakan dashboard Direktur + menu laporan.  
Jika kelak role Finance: home = antrian jurnal belum posting, rekonsiliasi kas, jatuh tempo AP (Browse only dulu).
