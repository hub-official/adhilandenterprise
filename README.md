# Adhiland Finance — ERP Mockup (Database Integrated)

Upgrade: 03 October 2026

This package is a data-driven property/finance ERP mockup built from the supplied `database.zip` snapshot.

## Run locally

Because the mockup uses `fetch()` for JSON data, serve the folder through a local HTTP server instead of opening HTML directly from `file://`.

```bash
python -m http.server 8000
```

Then open:

`http://localhost:8000/Direktur/index.html`

## Key architecture

`database/csv` → `assets/data/canonical-data.json` → `AdhData` → AppShell / role pages.

Legacy normalized JSON files remain for compatibility with existing pages.

## Main upgraded capabilities

- Scalable project dropdown.
- Persistent sidebar collapse/expand.
- Global project context.
- Project-aware tables.
- Universal KPI/detail popup.
- Critical/Waspada status click-through.
- Notification center.
- Deadline / overdue detection.
- Database-derived cash quality.
- Database-derived PPJB vs cash-in.
- Database-derived budget vs realization.
- Historical cash runway benchmark.
- Database-derived AR/AP aging.
- Functional CSV export.
- Browser print Board Pack.

## Documentation

- `docs/DATABASE-INTEGRATION.md`
- `docs/QA-CHECKLIST-2026-10-03.md`
- `docs/UPGRADE-EXECUTION-REPORT-2026-10-03.md`
- `database/README.md`

## Backend migration

The UI is intentionally separated from the source format. For production, replace the canonical-data adapter with API/MySQL queries while preserving the `AdhData` contract.
