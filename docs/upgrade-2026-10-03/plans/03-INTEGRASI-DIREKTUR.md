# Integrasi Unit → Direktur

## Peta event

| Dari | Event | Muncul di Direktur |
|------|-------|-------------------|
| Ops / Mkt / Legal / Teknik | Submit pengajuan | Persetujuan + badge + decision “pengajuan menunggu” |
| Finance | Loloskan review | Antrian “Menunggu Direktur” |
| Direktur | Approve/Reject | Status di list unit; audit log |
| Finance | Tandai dibayar | Realisasi, serapan, kas (mock), status unit |
| Legal | Update matriks dokumen | KPI legal %, risiko proyek |
| Teknik | Update progres % | KPI konstruksi, PROJECT_HEALTH |
| Marketing | Funnel / deal | Funnel stok, sisa tagihan (data stok) |
| Ops | Jatuh tempo item | Widget jatuh tempo budgeting |

## Fitur Direktur — ada vs tambahan

### Sudah ada (pertahankan)

- Dashboard eksekutif + decision widgets  
- Persetujuan all-role + impact kas  
- Budgeting, kavling, detail  
- Laporan: arus kas, jurnal, BB, neraca, LR, AR/AP, realisasi  
- Master data, (sampah/inventaris defer)

### Tambahan target

| Fitur | Tahap | Fungsi |
|-------|-------|--------|
| Filter/chip per `sumberRole` | F1 | Prioritas antar department |
| Reject + alasan | F1 | Feedback ke unit |
| Enforce hanya Direktur approve | F1 | Wewenang kas |
| Inbox “Menunggu saya” | F3 | Fokus setelah Finance review |
| Link baris pengajuan → detail proyek/unit | F2–F3 | Konteks keputusan |
| Audit log keputusan | F5 | Tata kelola |
| Submenu / role Finance | F3/F6 | Review & bayar |
| Badge terpecah | F6 | pengajuan / tempo / legal |
| Cash forecast & commit | F5 | Keputusan kas lebih aman |

## Prinsip desain Direktur

1. **Keputusan** di atas, **laporan** di bawah (sudah di compact dashboard).  
2. Angka bisnis dari `AdhData` / override lokal — tidak hardcode baru.  
3. Proxy/indikatif tetap dilabeli jujur (warisan Fase 3).
