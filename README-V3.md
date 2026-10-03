# ADHILAND ERP MOCKUP — DATABASE INTEGRATED V3

## What changed in V3

This package is a re-audit and UX/interaction correction of the previous database-integrated mockup.

### Workspace behavior
- Fixed ERP-style viewport: no generic body/page scrolling.
- Main content owns vertical scrolling.
- Sidebar owns its own navigation scroll.
- Sidebar can be fully hidden and restored from the topbar; a dedicated sidebar control is also present before hiding.
- Mobile sidebar uses an overlay and closes cleanly.

### Executive Dashboard
- Project name remains a scalable dropdown.
- Global project context is synchronized with the dashboard project selector.
- Project changes update the dashboard without a full browser reload.
- KPI info/status controls open data-driven detail dialogs.
- All Dashboard `Detail` controls are wired.
- PPJB and cash-in series are shown separately.
- Budget chart becomes project-aware when a project is selected.
- Due/notification/AR/AP/cash-quality views respect project context where source dimensions exist.
- Hardcoded KPI deltas and narrative amounts were removed.
- Period and comparison controls now perform real UI updates.
- Board Pack uses the browser print flow rather than a duplicate mock alert.

### Data
- `assets/data/canonical-data.json` is the browser-side canonical source.
- `database/source/database-original.zip` preserves the supplied source database artifact.
- SQL files remain under `database/mysql/`.
- Empty source datasets are surfaced honestly rather than filled with invented historical records.

## Start

Open `login.html` through a local/static web server. Some pages use Chart.js from jsDelivr and therefore require network access for charts unless Chart.js is later vendored locally.

See:
- `docs/QA-RECHECK-2026-10-03-V3.md`
- `docs/INTERACTION-AUDIT-2026-10-03-V3.md`
- `docs/DATABASE-INTEGRATION.md`
