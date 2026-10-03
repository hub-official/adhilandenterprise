# Prompt Fase 1 — Compact Corporate Dashboard

Kerjakan **hanya** pemadatan & perbaikan dashboard role.  
Baca: `plans/02-DASHBOARD-PER-ROLE.md`, `specs/04-DESIGN-SYSTEM-UX.md`.

## Scope
1. `Direktur/index.html` + `assets/js/dashboard.js` — compact decision+KPI; filter proyek memengaruhi angka.
2. `Operasional/index.html` — ganti hardcode dengan agregat budgeting_item + pengajuan Operasional.
3. `Legal/index.html` — prioritas dari legal.json; tanpa angka ajaib.
4. `Teknik/index.html` — label indikatif pada data non-real; KPI dari KONSTRUKSI.
5. `Marketing/index.html` — tabel top deal belum bayar (browse) dari kavling.json.

## Out of scope
- Form Create jurnal, backend API, redesign tokens total, fitur baru di luar dashboard.

## DoD
Dashboard tiap role: ≤4 decision (jika ada), ≤8 KPI, data real, tidak error console, tampilan lebih padat dari baseline 2026-10-02.
