# Status setelah Checkpoint (2026-10-03)

## Upgrade progress — SEMUA TAHAP

| Tahap | Isi | Status |
|-------|-----|--------|
| **F1** | Wewenang approval | ✅ |
| **F2** | Create pengajuan unit | ✅ |
| **F3** | Review Finance (submenu Direktur) | ✅ |
| **F4** | Siap bayar & status Dibayar | ✅ |
| **F5** | Laporan + tata kelola | ✅ |
| **F6** | Role Finance & limit | ✅ 2026-10-03 |

### F6 changelog (ringkas)

- **`login.html`**: role **Finance** → `Finance/index.html`
- **`Finance/`**: Home, `review.html` (antrian + limit), `siap-bayar.html`
- **`shell.js`**: NAV Finance (Home / Antrian Review / Siap Bayar) — tanpa laporan penuh Direktur
- **`LIMIT_APPROVE_FINANCE = 10_000_000` (Rp 10 jt)** di `local-state.js`
  - ≤ limit: Finance boleh **Setujui (limit)** → `Disetujui`
  - \> limit: hanya **Loloskan** → `Menunggu` Direktur
- Badge Review / Siap bayar tetap di shell (Direktur & Finance)

### Alur lengkap (F1–F6)

```
Unit Ajukan → Menunggu review
  → Finance: Loloskan | Setujui (≤limit) | Kembalikan
  → Direktur: Setujui / Tolak (antrian Menunggu)
  → Siap Bayar: Tandai dibayar → Dibayar
  → Tata Kelola: KPI commit/forecast + audit + CSV
```
