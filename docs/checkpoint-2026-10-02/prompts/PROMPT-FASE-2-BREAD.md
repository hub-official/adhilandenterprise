# Prompt Fase 2 — BREAD Minimal

Baca: `plans/03-SIDEBAR-MENU-CRUD-BREAD.md`.

## Scope wajib
1. **Pengajuan** (semua role): Approve / Reject mengubah status di memori atau sessionStorage; hitung ulang badge; label “(mock lokal)”.
2. **Legal/dokumen.html**: Edit status satu sel dokumen (SLF/AJB/…) via drawer; simpan lokal ke salinan legal rows.
3. **Teknik/progres.html**: Edit persen progres via drawer; simpan lokal.

## Aturan
- Tidak ada API server.
- Tidak bulk-delete.
- Konfirmasi singkat sebelum reject.
- Jangan bangun workflow multi-level approval.

## DoD
User bisa melihat perubahan status setelah reload halaman **hanya jika** Anda memilih persist sessionStorage; jika hanya memori, dokumentasikan bahwa refresh mengembalikan JSON.
