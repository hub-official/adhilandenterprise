# Prompt eksekusi — F4 Rencana Bayar & Dibayar

Baca: master + F3 status. Kerjakan hanya jika Disetujui sudah stabil.

## Tujuan
Menutup loop: **Disetujui ≠ selesai** — ada langkah bayar mock.

## Scope wajib
1. Halaman atau section **Siap bayar**: daftar `status === Disetujui` (belum dibayar).
2. Aksi **Tandai dibayar** → status `Dibayar`; catat waktu di local-state.
3. Opsional ringan: naikkan `terbayar` mock pada ringkasan budgeting di memori (jangan rusak JSON file).
4. List unit & Direktur menampilkan status Dibayar.
5. Jangan integrasi bank.

## DoD
- [ ] Item disetujui bisa ditandai dibayar dan bertahan setelah reload.
- [ ] Filter status memuat opsi Dibayar di halaman yang relevan.
