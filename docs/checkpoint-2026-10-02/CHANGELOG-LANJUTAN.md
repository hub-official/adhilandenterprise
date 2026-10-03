# Changelog Lanjutan

## 2026-10-02 — Checkpoint awal (Grok)
- Mockup data-driven: AdhData + JSON dari DB extract
- CoA 579, vendors 275, users 9 di Master Data
- Pengajuan filter role; detail kavling template; badge 80
- Dokumen perencanaan folder `docs/checkpoint-2026-10-02/`

## 2026-10-02 — Audit hardcode + integrasi perencanaan
- Audit menyeluruh semua halaman HTML + JS terhadap hardcode KPI / angka bisnis
- Temuan kritis di `assessments/00-RINGKASAN-PENILAIAN.md`
- Roadmap Fase 0 diperluas dengan checklist hardcode kritis
- Urutan Fase 1 disesuaikan (Operasional prioritas)

## 2026-10-03 — Fase 0 hardcode kritis (implementasi) ✅
- `Operasional/index.html`: KPI + tabel dari budgeting_item / filterPengajuan
- `assets/js/dashboard.js`: Legal D.LEGAL (9/448); terlambat ST dari KONSTRUKSI; serapan/jatuh tempo dinamis
- `Legal/index.html`: butuh AJB dari legal.json
- `Direktur/budgeting.html`: ringkasan + due + chart dari budgeting_item.json

## 2026-10-03 — Fase 1 Compact Dashboard ✅
- CSS: decision-card lebih padat (row layout); KPI value fs-20
- `Marketing/index.html`: top-12 deal belum bayar + stok per proyek dari kavling.json
- `Teknik/index.html`: unit berisiko dari progresBangun/tglSerahTerima; progres.json; kurva-S indikatif
- Review browser: Operasional, Legal, Budgeting, Marketing, Teknik, Direktur — angka konsisten

## 2026-10-03 — Checkpoint stop (lanjut nanti)
- Fase 0.2 + Fase 1 selesai
- Berikutnya: **Fase 2 BREAD** (Approve/Reject pengajuan, Legal status, Teknik progres %)
- Lalu Fase 3 Finance cleanup, Fase 4 Polish

## 2026-10-03 — Fase 2 BREAD minimal ✅
- `assets/js/local-state.js` — sessionStorage untuk status pengajuan, legal sel, progres %
- `assets/js/data.js` — apply override pengajuan saat load
- Semua role `pengajuan.html`: Setujui/Tolak per baris + massal; badge & KPI ter-update; label (mock lokal)
- `Legal/dokumen.html`: heatmap dari legal.json; klik sel → drawer edit status; KPI hitung dari sel
- `Teknik/progres.html`: list dari kavling; Update % via drawer; persist sessionStorage

## 2026-10-03 — Fase 3 Finance cleanup ✅
- `Direktur/neraca.html`: hanya snapshot (kas, piutang, sisa PPJB, stok potensi, hutang); modal residual proxy; dummy aktiva tetap/laba ditahan dihapus
- `Direktur/laba-rugi.html`: pendapatan = uang masuk; HPP = realisasi konstruksi; beban ops = realisasi budget; tanpa gaji/utilitas invent
- `Direktur/realisasi.html`: agregat budgeting_item per jenis & cluster (heatmap dummy 16×12 dihapus)
- `Direktur/piutang-hutang.html`: await load; aging dilabeli indikatif

## 2026-10-03 — Fase 4 Polish UX ✅
- CSS: table-wrap max-height + sticky thead; empty-state; toast
- `shell.js`: wire Export/Impor/dead aksi → toast mock; showToast API
- `kavling.js`: selalu `detail.html?id=` (hapus fallback property_*.html)
- `Legal/index.html`: aksi cepat → link fungsional (dokumen/pengajuan/kavling)
- `inventaris.html` / `sampah.html`: label defer / mock; await load
