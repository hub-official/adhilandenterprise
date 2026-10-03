# Prompt eksekusi — F1 Wewenang Approval

Baca: `PROMPT-MASTER-UPGRADE.md` + `plans/01` (F1) + `plans/02`.

## Tujuan
Mengunci **final approve/reject hanya di Direktur**; unit hanya melihat antrian & status.

## Scope wajib
1. **Direktur `pengajuan.html`**
   - Pertahankan Setujui / Tolak / massal.
   - **Tolak**: wajib isi alasan (prompt/drawer); simpan di local-state (map id → {status, alasan, at}).
   - **Chip filter `sumberRole`**: Semua | Direktur | Teknik | Legal | Operasional | Marketing (tampilkan count bila mudah).
   - Tetap filter status (Menunggu / Disetujui / Ditolak / Semua).
   - Impact kas + KPI menunggu tetap dari `AdhData` + override.

2. **`Legal|Teknik|Marketing|Operasional/pengajuan.html`**
   - **Hapus** tombol Setujui, Tolak, Setujui massal, Tolak massal.
   - Tabel + filter status tetap; kolom status boleh tampil `(mock lokal)` jika ada override.
   - Opsional teks: “Persetujuan final dilakukan oleh Direktur.”

3. **`assets/js/local-state.js`**
   - Perluas set status pengajuan agar bisa simpan `alasan` (struktur mundur-kompatibel: string status lama masih valid).

4. Jangan implement Create form (itu F2). Jangan role Finance (F3/F6).

## DoD
- [ ] Login unit → tidak ada kontrol approve/reject.
- [ ] Login Direktur → approve/reject jalan; reject tanpa alasan ditolak UI.
- [ ] Filter role di Direktur memfilter list.
- [ ] Reload tab: override + alasan masih ada (sessionStorage).

## Verifikasi
Browser: Direktur approve 1 item → count menunggu turun; unit refresh → status berubah bila item `sumberRole`-nya; unit tidak bisa approve balik.
