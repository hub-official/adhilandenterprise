# Roadmap Upgrade (setelah Fase 0–4)

> Prinsip: jangan mengulang cleanup hardcode/dashboard. Fokus **wewenang, Create, Finance review, tutup loop kas**.

## Tahap F1 — Wewenang approval (wajib dulu)

**DoD**
- [ ] Hanya role **Direktur** yang menampilkan Setujui/Tolak pada pengajuan
- [ ] Role unit: list + filter status; tanpa approve final
- [ ] Chip/filter **per sumberRole** di Persetujuan Direktur
- [ ] Reject **wajib alasan** (disimpan mock)
- [ ] Label `(mock lokal)` tetap pada override sessionStorage

**File sentuh (perkiraan):** `*/pengajuan.html`, `assets/js/local-state.js`, opsi `shell.js` badge

## Tahap F2 — Create pengajuan unit

**DoD**
- [ ] Form/drawer “Ajukan” di Operasional, Marketing, Legal, Teknik
- [ ] Field minimal: jenis, proyek/cluster, jumlah, keperluan, rekening (opsional)
- [ ] `sumberRole` otomatis = role login; status awal `Menunggu` (atau `Menunggu review` jika F3 aktif)
- [ ] Persist sessionStorage; muncul di list unit + antrian Direktur
- [ ] Seed/perbaiki beberapa baris Marketing di data atau pure session create

## Tahap F3 — Review Finance (boleh submenu dulu)

**DoD**
- [ ] Status machine: lihat `02-TARGET-WEWENANG-DAN-STATUS.md`
- [ ] Layar antrian Finance (route di bawah Direktur dulu, mis. `Direktur/finance-review.html`) **atau** role login Finance
- [ ] Aksi Finance: Loloskan ke Direktur / Kembalikan ke unit (+ alasan)
- [ ] Direktur hanya melihat yang `Menunggu Direktur` (plus filter Semua untuk admin view)

## Tahap F4 — Rencana bayar & status Dibayar

**DoD**
- [ ] Setelah Disetujui → masuk daftar “Siap bayar”
- [ ] Aksi Tandai dibayar (mock) → status `Dibayar`
- [ ] Update committed/terbayar mock agar Realisasi/Budgeting bergerak
- [ ] Opsional: baris draft jurnal di UI (bukan tulis file JSON server)

## Tahap F5 — Laporan Finance + tata kelola

**DoD**
- [ ] Budget vs Actual vs Commit (satu tabel/KPI)
- [ ] Cash forecast sederhana 30/60/90 (dari kas − tempo − antrian + proxy masuk)
- [ ] Audit log keputusan (sessionStorage)
- [ ] Export CSV mock untuk antrian/keputusan hari ini

## Tahap F6 — Role Finance & limit (opsional produk)

**DoD**
- [ ] Login role Finance di `login.html`
- [ ] Limit nominal (konfig di JS) otomatis route ke Direktur jika di atas threshold
- [ ] Badge terpecah (pengajuan / tempo / legal) di shell Direktur

## Urutan ketergantungan

```
F1 → F2 → F3 → F4
         ↘ F5 (bisa paralel setelah F1)
              → F6
```

## Di luar scope upgrade ini

- Backend API, JWT, DB write sejati  
- Integrasi bank, pajak elektronik, payroll  
- Mengisi neraca dengan angka fiktif agar “balance cantik”
