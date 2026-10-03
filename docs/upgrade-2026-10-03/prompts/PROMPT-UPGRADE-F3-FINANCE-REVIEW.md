# Prompt eksekusi — F3 Review Finance

Baca: `PROMPT-MASTER-UPGRADE.md` + `plans/02` status machine. F1+F2 sebaiknya sudah ada.

## Tujuan
Menambah tahap **Review Finance** sebelum antrian keputusan Direktur.

## Scope wajib
1. **Status machine** (UI + local-state):
   - Setelah Create unit → `Menunggu review` (atau kode `menunggu_review`)
   - Finance: **Loloskan** → `Menunggu` / `Menunggu Direktur`
   - Finance: **Kembalikan** → `Dikembalikan` + alasan wajib
   - Direktur: Setujui → `Disetujui`; Tolak → `Ditolak` + alasan
2. **Layar antrian Finance** (pilih salah satu, dokumentasikan pilihan):
   - **Opsi A (disarankan dulu):** `Direktur/finance-review.html` + item menu di NAV Direktur “Review Finance”
   - **Opsi B:** role login Finance di `login.html` (lebih besar; mirip F6)
3. Filter chip status di Direktur pengajuan: default tampilkan yang siap diputuskan (`Menunggu`); sediakan “Semua”.
4. Unit melihat status `Menunggu review` / `Dikembalikan` tanpa bisa approve.

## Validasi budget (minimal)
- Jika ada `jumlah` dan data budgeting, tampilkan peringatan indikatif bila jumlah > sisa agregat cluster (boleh longgar); jangan blok keras jika data tidak lengkap.

## DoD
- [ ] Alur Create → Review → Loloskan → Approve Direktur dapat di-demo di browser.
- [ ] Kembalikan + alasan terlihat di unit.
