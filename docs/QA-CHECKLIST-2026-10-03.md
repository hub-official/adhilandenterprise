# QA Checklist — 03 Oktober 2026

## Automated checks

- [x] Canonical database generated from all 34 CSV tables.
- [x] 11.176 source rows retained in canonical dataset.
- [x] JavaScript syntax check: `data.js`, `shell.js`, `dashboard.js`.
- [x] All HTML pages containing `AdhShell.mount` also load `data.js`.
- [x] Executive hardcoded monthly chart values replaced with canonical-derived data.
- [x] Cash bridge dummy burn removed; uses historical 90-day `kas_mutasi` benchmark.
- [x] Cash quality chart uses `kas_ringkasan_bulanan`.
- [x] Budget chart uses `dashboard_budget_realisasi`.
- [x] AR/AP aging uses `piutang_hutang`.
- [x] Project filter is persistent via localStorage.
- [x] Global notification and detail modal are wired.

## Interaction checks

- [x] Sidebar hide/show.
- [x] Global project dropdown.
- [x] Executive project dropdown.
- [x] KPI info/document buttons.
- [x] Detail buttons in executive cards.
- [x] Notification button.
- [x] Modal close via X, backdrop, and footer button.
- [x] Empty dataset is represented by an explicit empty state.

## Known design behavior

- Static HTML mockup has no real server-side persistence.
- Approval/payment actions remain local-state simulations where the original workflow was intentionally client-side.
- Database snapshot dates and dashboard presentation date are preserved as source metadata; the UI labels historical burn as a benchmark rather than a forecast.
