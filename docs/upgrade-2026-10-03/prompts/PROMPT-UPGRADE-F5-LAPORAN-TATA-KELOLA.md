# Prompt eksekusi — F5 Laporan Finance & Tata Kelola

Baca: master + `assessments/03-FITUR-FINANCE.md`. Boleh setelah F1; ideal setelah F4 untuk angka commit.

## Tujuan
Memperkuat keputusan kas tanpa mengarang jurnal penuh.

## Scope (pilih yang feasible di mockup; minimal 3 item)
1. **Budget vs Actual vs Commit** — KPI atau tabel: rencana, terbayar, committed (disetujui belum dibayar dari local-state + data).
2. **Cash forecast sederhana** — kas − pengajuan menunggu − jatuh tempo (+ opsional proxy uang masuk); label indikatif.
3. **Audit log** — array di sessionStorage: `{id, aksi, by, at, alasan}`; halaman kecil atau panel di pengajuan Direktur.
4. **Export CSV mock** — download blob text untuk antrian menunggu atau log hari ini (bukan toast kosong).

## Larangan
- Mengisi neraca/LR dengan angka fiktif agar seimbang.
- Menambah chart berlebihan.

## DoD
- [ ] Minimal satu KPI commit/forecast tertampil dari data+state.
- [ ] Minimal satu jalur audit atau export berguna.
