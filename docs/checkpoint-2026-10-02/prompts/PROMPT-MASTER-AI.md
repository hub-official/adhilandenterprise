# PROMPT MASTER — Lanjutkan Adhiland Finance Mockup (End-to-End)

Salin **seluruh isi file ini** ke AI baru. Lampirkan / extract ZIP repo `adhiland-mockup-v2`.

---

## Identitas tugas
Anda melanjutkan **Adhiland Finance UIUX mockup v2**: static HTML/JS/CSS + JSON data dari extract production.  
Bukan rewrite dari nol. Bukan backend production penuh (kecuali diminta eksplisit).

## Baca wajib sebelum coding
1. `docs/checkpoint-2026-10-02/README.md`
2. `docs/checkpoint-2026-10-02/assessments/00-RINGKASAN-PENILAIAN.md`
3. `docs/checkpoint-2026-10-02/plans/01-ROADMAP-PRIORITAS.md`
4. `docs/checkpoint-2026-10-02/plans/02-DASHBOARD-PER-ROLE.md`
5. `docs/checkpoint-2026-10-02/plans/03-SIDEBAR-MENU-CRUD-BREAD.md`
6. `docs/checkpoint-2026-10-02/specs/04-DESIGN-SYSTEM-UX.md`
7. `docs/checkpoint-2026-10-02/specs/05-DATA-LAYER.md`

## Tujuan produk
Tampilan **Corporate, Compact, Best practice, User Friendly**.  
Fungsionalitas sesuai peran. **CRUD/BREAD hanya di area relevan — jangan over-fitur.**

## Constraint keras (dilarang dilanggar)
1. Jangan hardcode KPI yang bertentangan dengan `assets/data/aggregate.json`.
2. Jangan menghidupkan lagi 318 file `kavling-detail/property_*.html` — detail = `detail.html?id=N`.
3. Semua halaman dinamis: `await AdhData.load()` dulu.
4. Role sidebar: Direktur, Legal, Teknik, Marketing, Operasional (Finance = menu di Direktur).
5. Tombol tanpa fungsi dilarang — implement mock eksplisit atau sembunyikan.
6. Bahasa UI Indonesia; uang/tanggal lewat `fmt.js`.
7. Jangan menambah dependency framework (React/Vue) tanpa permintaan user.
8. Tetap static-hostable (`python -m http.server`).

## Urutan kerja default (jika user tidak mempersempit)
**Fase 1** — Compact dashboard semua role (lihat `02-DASHBOARD-PER-ROLE.md`), prioritaskan Operasional home + Direktur padat.  
**Fase 2** — BREAD minimal: Pengajuan approve/reject state lokal → Legal status dokumen → Teknik update progres.  
**Fase 3** — Bersihkan dummy menyesatkan di Neraca/LR/Budgeting list penuh.  
**Fase 4** — Polish density + empty/loading states merata.

## Definition of Done setiap PR/batch
- [ ] Angka konsisten dengan data layer
- [ ] Role topbar/sidebar benar
- [ ] Tidak ada console error di halaman yang disentuh
- [ ] Sesuai matriks BREAD (tidak menambah Create di mana ✗)
- [ ] Compact: tidak menambah whitespace sia-sia
- [ ] Catat perubahan singkat di `docs/checkpoint-2026-10-02/CHANGELOG-LANJUTAN.md` (buat jika belum ada)

## Cara verifikasi
```bash
cd adhiland-mockup-v2 && python3 -m http.server 8765
# Uji: login → tiap role home → pengajuan → kavling → detail?id=1 → master CoA
```

## Output yang diharapkan dari Anda
1. Patch file konkret di repo  
2. Ringkasan apa yang berubah  
3. Daftar yang sengaja **tidak** dikerjakan (out of scope / defer)

Mulai dengan membaca dokumen di atas, lalu kerjakan **Fase 1** kecuali user meminta fase lain.
