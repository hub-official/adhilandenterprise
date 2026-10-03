# Upgrade Execution Report — 03 October 2026

## Status

**Implemented and statically validated.**

## Main changes

1. Integrated `database.zip` into the mockup as a canonical data source.
2. Added `assets/data/canonical-data.json` containing all 34 source tables and deterministic derived views.
3. Added database CSV + MySQL archive under `database/` for future backend migration.
4. Reworked executive project selection from chips to scalable dropdown.
5. Added global project selector to the AppShell; selection persists in localStorage.
6. Added project-aware table filtering where a project/cluster column exists.
7. Added universal detail modal with database-source indicator and tabular drill-down.
8. KPI info/document controls now open data-driven detail views.
9. Critical/Waspada badges are actionable and open the same detail flow.
10. Added global notification center based on due items and pending submissions.
11. Added actual cash-quality categories from `kas_ringkasan_bulanan`.
12. Replaced hardcoded monthly sales chart with database-derived PPJB + actual cash-in series.
13. Replaced hardcoded budget chart with `dashboard_budget_realisasi`.
14. Replaced dummy cash burn with historical 90-day average from `kas_mutasi.Kredit`.
15. Replaced hardcoded AR/AP aging with `piutang_hutang` derived buckets.
16. Added overdue/due-soon queue from `budgeting_item`.
17. Added functional CSV export and file-import interaction fallback in shared shell.
18. Board Pack now invokes browser print rather than an alert-only mock.
19. Added documentation for data provenance, QA, and architecture.

## Database inventory verified

- 5 databases
- 34 tables
- 11,176 source rows
- 106 kavling
- 88 pengajuan
- 4,142 buku besar rows
- 1,977 jurnal rows
- 1,877 kas mutation rows
- 579 COA rows
- 275 vendor accounts
- 612 furniture/realisasi rows

## Important source-derived figures

- PPJB: Rp103.944.800.000
- Uang masuk: Rp13.286.720.000 (dashboard project snapshot)
- Piutang PPJB: Rp90.658.080.000
- Cash: Rp75.308.483
- Pending submissions: 80 / Rp2.767.325.772
- Cash historical 90-day average outflow: Rp101.956.159/day

## Data-quality handling

The following source tables are empty and are **not** fabricated into actual transactions:

- `inventaris`
- `jadwal_pembayaran`
- `riwayat_pembayaran`

Where a UI needs the concept, the mockup uses an empty state or a derived view from another source table.

## Validation performed

- All JavaScript files under `assets/js/` pass `node --check`.
- All 38 HTML pages were scanned; 37 pages use `AdhShell.mount` and all 37 load `data.js`.
- Canonical JSON was regenerated from the supplied database CSV snapshot.
- Source row count was rechecked at 11,176.
- Dashboard hardcoded dummy chart values and dummy cash-burn calculation were removed from the active rendering path.

## Browser smoke-test limitation

A headless Chromium smoke test was attempted in the sandbox, but the installed Chromium process did not terminate within the allotted runtime and did not produce a screenshot. This is an environment limitation; static JavaScript checks and data integrity checks completed successfully.
