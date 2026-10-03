# Roadmap Prioritas Perbaikan & Pengembangan

**Update:** 2026-10-02 — diintegrasikan dengan hasil audit hardcode (lihat `assessments/00-RINGKASAN-PENILAIAN.md`)

## Fase 0 — Stabilisasi (wajib dulu)

### 0.1 Data integrity & link
- [ ] Pastikan semua halaman `await AdhData.load()` sebelum render KPI
- [ ] Tidak ada link `kavling-detail/property_*.html` (hanya `detail.html?id=`)
- [ ] Loading / empty / error state minimal di setiap list page

### 0.2 Hardcode kritis (hasil audit — prioritas tertinggi) — SELESAI 2026-10-03
| # | File | Tindakan | Status |
|---|------|----------|--------|
| 1–4 | `Operasional/index.html` | KPI + tabel dari budgeting_item / filterPengajuan | ✅ |
| 5–6 | `assets/js/dashboard.js` | Legal D.LEGAL; terlambat ST dari KONSTRUKSI | ✅ |
| 7 | `Legal/index.html` | Butuh AJB dari legal.json | ✅ |
| 8 | `Direktur/budgeting.html` | Ringkasan + due + chart dari budgeting_item | ✅ |

**DoD Fase 0.2:** Tidak ada lagi KPI kritis yang bertentangan dengan data layer. ✅

## Fase 1 — Compact Corporate Dashboard (semua role)

Urutan kerja (disesuaikan prioritas risiko hardcode):

1. **Operasional `index.html`** — selesaikan sisa setelah Fase 0; samakan kualitas dengan `anggaran.html`; padatkan layout.
2. **Direktur `index.html` + `dashboard.js`** — padatkan executive strip + filter proyek yang benar-benar mengubah angka; bersihkan insight yang menyesatkan.
3. **Legal `index.html`** — antrian dari `legal.json` real; hilangkan sisa hardcode.
4. **Teknik `index.html`** — ganti tabel risiko hardcode (atau label “contoh”); kurva-S tetap indikatif + label jelas.
5. **Marketing `index.html`** — jadikan “47 deal belum bayar” dinamis + tabel top-N (browse only).

Target UX: **satu viewport utama** berisi keputusan + KPI; scroll baru untuk tabel.

## Fase 2 — BREAD minimal (hanya yang relevan)

| Modul | B | R | E | A | D | Catatan |
|-------|---|---|---|---|---|---------|
| Pengajuan | ✓ | ✓ | Approve/Reject mock→state lokal | — | — | Prioritas #1 |
| Legal dokumen | ✓ | ✓ | Update status dokumen | — | — | Prioritas #2 |
| Teknik progres | ✓ | ✓ | Update % progres | — | — | Prioritas #3 |
| Master CoA/Vendor | ✓ | ✓ | Edit nama (lokal) | Add mock | — | Sudah sebagian |
| Kavling | ✓ | ✓ | — | — | — | Tidak perlu full CRUD fase ini |
| Jurnal | ✓ | ✓ | — | Entry form sederhana opsional | — | Fase 3 |
| Inventaris | ✓ | — | — | — | — | Defer jika data kosong |
| Sampah | ✓ | — | Restore mock | — | Hard delete mock | Defer |

## Fase 3 — Finance depth & cleanup dummy menyesatkan

- [ ] `Direktur/budgeting.html` — list penuh dari `budgeting_item.json` + filter jatuh tempo; ringkasan per proyek dari data (bukan hardcode)
- [ ] `neraca.html` / `laba-rugi.html` — hilangkan kesan angka palsu: pakai data real yang ada; sisanya label “estimasi/proxy” atau sembunyikan baris dummy
- [ ] `realisasi.html` — hapus atau label jelas heatmap dummy
- [ ] `Legal/dokumen.html` — KPI Lewat tenggat / Berjalan / Belum dari data real jika memungkinkan
- [ ] `Teknik/progres.html` + rekap — ganti kolom nilai dummy
- Opsional: form jurnal entry (Create) sangat sederhana

## Fase 4 — Polish UX Merata

- Empty state, loading skeleton ringkas di list pages
- Sticky table header + row hover (jika belum)
- Samakan density spacing antar role home
- Pastikan tidak ada dead button
- Audit link `detail.html?id=`
- Inventaris / Sampah tetap defer kecuali diminta

## Fase 5 — Production handoff (di luar mockup murni)

- API backend, auth JWT, permission matrix per aksi
- Audit log approve/reject
- Soft delete nyata

## Definition of Done (per halaman)

1. Corporate + compact (jarak & font konsisten tokens)
2. Data dari JSON/AdhData, **bukan angka ajaib** (khususnya yang bertentangan aggregate)
3. BREAD sesuai matriks (tidak memaksa Create di mana tidak perlu)
4. Empty/loading state
5. Role sidebar & topbar benar
6. Tidak merusak halaman lain
7. Dummy yang tersisa **wajib** dilabeli jelas “(dummy)” / “(indikatif)” / “(proxy)”
