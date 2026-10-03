# Prompt eksekusi — F2 Create Pengajuan Unit

Baca: `PROMPT-MASTER-UPGRADE.md` + selesaikan F1 dulu (atau pastikan F1 sudah ada di kode).

## Tujuan
Unit dapat **mengajukan** budget; item baru masuk antrian Direktur dengan `sumberRole` benar.

## Scope wajib
1. Tombol **+ Ajukan** pada `pengajuan.html` role: Marketing, Operasional, Legal, Teknik.
2. Drawer/form satu langkah, field minimal:
   - jenis (Anggaran / Reimbursement / lain select)
   - proyek atau cluster (text atau select dari data yang ada)
   - jumlah (number)
   - keperluan (textarea)
   - rekening (opsional text)
3. Submit:
   - `id`: generate `PGJ-MOCK-` + timestamp/random
   - `sumberRole`: ROLE halaman
   - `status`: `Menunggu` (atau `Menunggu review` hanya jika F3 sudah live)
   - `pemohon`: label role atau “User Mock”
   - `umur`: 0
   - persist ke sessionStorage **dan** push ke `AdhData.PENGAJUAN` in-memory
4. Item langsung terlihat di list unit (filter menunggu) dan di Direktur (semua / filter role).
5. Direktur tetap satu-satunya yang approve (F1).

## Jangan
- Multi-step wizard, upload file nyata, API.
- Seed mengubah file JSON di disk kecuali user minta; prefer pure session create.

## DoD
- [ ] Marketing bisa create → muncul di list Marketing & Direktur filter Marketing.
- [ ] Reload: pengajuan mock masih ada.
- [ ] Unit tetap tanpa tombol Setujui.
