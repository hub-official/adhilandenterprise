# Adhiland ERP Mockup — QA Re-check V3

Date: 2026-10-03

## Reason for re-check

The previous package passed static data/code checks, but a visual/UX review identified gaps:
- page-level scrolling felt like a generic webpage rather than an ERP workspace;
- sidebar collapse was not sufficiently discoverable;
- some Dashboard `Detail` actions were not wired because content was rendered after AppShell initialization;
- some detail configurations pointed at raw datasets whose fields did not match the displayed columns;
- project context did not fully propagate to several executive widgets;
- some dashboard labels/percentages were hardcoded rather than derived.

## Fixes implemented

### 1. ERP viewport / scrolling
- App shell now owns the viewport (`100dvh`).
- Body-level scrolling is disabled for the application shell.
- Main workspace has its own vertical scroll container.
- Sidebar navigation has its own scroll container.
- Table/detail containers retain local horizontal/vertical scrolling.
- Sticky headers remain usable inside table containers.
- Added scrollbar gutter and restrained scrollbar treatment.
- Print mode restores document flow.

### 2. Sidebar hide/restore
- Added an explicit collapse control inside the sidebar brand area. When collapsed on desktop, the sidebar fully hides and the topbar control restores it.
- Existing topbar sidebar control remains available.
- Both controls share persistent localStorage state.
- ARIA labels/titles change between `Sembunyikan sidebar` and `Tampilkan sidebar`.
- Collapsed state rotates the sidebar control for visual feedback.
- Mobile uses an overlay and closes the sidebar when the workspace is tapped.

### 3. Project context
- Executive Dashboard project selector remains in the dashboard context bar.
- Topbar also provides the global project selector.
- Changing project no longer performs a full browser reload on the Executive Dashboard.
- Canonical project view is recalculated before the dashboard re-renders.
- KPI, project health, sales, stock funnel, due items, notifications, budget, construction, legal, AR/AP and cash-in classification are recalculated for the selected project where the database has project dimensions.

### 4. Detail / info interactions
- All Dashboard `Detail` buttons now carry explicit `data-detail` actions.
- Added aging detail types for AR/AP.
- Fixed due-date detail mapping so displayed fields match the derived due dataset.
- Fixed PPJB detail to use project-level financial aggregation instead of raw unit rows.
- Funnel detail is now grouped by actual unit status from `kavling_master`.
- Detail modal now identifies source dataset/derived view and current scope.
- Escape key closes detail/notification dialogs.

### 5. Dashboard data quality
Removed/replaced the following hardcoded presentation values:
- hardcoded PPJB growth `+4.2%`;
- hardcoded cash-in growth `+1.1%`;
- hardcoded funnel title values;
- hardcoded collection-gap title;
- hardcoded 25%/75% due bars;
- hardcoded DQ narrative counts;
- hardcoded aging narrative such as `99% karyawan >180 hari`.

### 6. Sales vs cash chart
- Uses canonical monthly sales series for consolidated scope.
- Uses project-specific derived monthly series when a project is selected:
  - PPJB from `kavling_master` sale dates;
  - classified cash-in from `jurnal` cash-in transactions.
- Period selector now supports 3/6/12 available months.
- Comparison selector supports previous-period comparison or no comparison.

### 7. Board Pack
- Removed the duplicate mock alert/print behavior.
- Board Pack now uses the browser print flow and provides a non-blocking toast.

### 8. Source traceability
- Original `database.zip` is included at `database/source/database-original.zip`.
- Canonical browser dataset remains under `assets/data/canonical-data.json`.
- SQL import files remain under `database/mysql/`.

## Validation

- HTML files: 38
- JavaScript files: 8
- JavaScript syntax: PASS (`node --check` on all JS files)
- Canonical projects: 5
- Canonical database tables: 34
- Canonical source rows: 11,176
- No Dashboard `Detail` button remains without an explicit detail action.
- No `9500000` dummy daily burn remains in Dashboard code.
- No hardcoded `+4.2%` / `+1.1%` KPI deltas remain.
- Only non-dashboard pages retain full reload behavior when global project context changes; Dashboard updates in place.

## Known data limitations intentionally preserved

The source snapshot contains zero rows for some datasets such as inventory/payment schedule/payment history. The application exposes these as explicit data-quality/empty-state information rather than inventing historical transactions.

Project-specific cash quality is labelled as a derived account classification. It is not represented as an audited accounting classification.

## Renderer note

A headless Chromium runtime was attempted for a final live DOM/screenshot pass, but the sandbox Chromium process did not complete its page-load cycle in this environment. Therefore this QA does **not** claim pixel-level browser screenshot validation. The viewport, overflow, sidebar, interaction and data changes were rechecked directly against the source, generated structure, JavaScript syntax, local asset references, canonical data and ZIP integrity.
