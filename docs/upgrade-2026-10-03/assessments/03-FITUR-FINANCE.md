# Assessment: Fitur Finance

## Posisi di mockup

Finance **bukan role login**. Fitur keuangan berada di sidebar **Direktur**.

## Sudah ada (laporan & keputusan)

| Fitur | Lokasi | Catatan |
|-------|--------|---------|
| KPI kas, PPJB, hutang, piutang | Dashboard | Snapshot aggregate |
| Persetujuan + impact kas | pengajuan.html | Mock; wewenang belum ketat |
| Budgeting + jatuh tempo | budgeting.html | Item real extract |
| Arus kas, jurnal, buku besar | halaman masing-masing | Read-only + paginasi |
| Neraca / LR ringkas | neraca, laba-rugi | Proxy jujur, tanpa dummy invent |
| Piutang & hutang | piutang-hutang.html | Aging indikatif |
| Realisasi biaya | realisasi.html | Dari budgeting_item |
| Master CoA / vendor | master.html | Browse |

## Perlu ditambahkan (rekomendasi)

### P1 — Alur & wewenang
- Workspace / antrian **Review Finance**
- Status: Draft → Review Finance → Menunggu Direktur → Disetujui → Dibayar
- Validasi sisa anggaran saat review
- Reject + alasan

### P2 — Transaksi
- Create pengajuan (unit) + lampiran mock
- Rencana bayar (payment run) setelah approve
- Status Dibayar + update serapan/commit
- Draft jurnal mock saat bayar

### P3 — Laporan
- Budget vs Actual vs **Commit**
- Cash forecast 30/60/90
- Margin / P&L per proyek
- Aging berbasis tanggal bila data cukup

### P4 — Tata kelola
- Audit log keputusan
- Limit wewenang (opsional)
- Badge risiko terpecah
- Export CSV antrian/keputusan (mock file)

### Defer
- Host-to-host bank, e-Faktur, payroll, depresiasi penuh, multi-entity
