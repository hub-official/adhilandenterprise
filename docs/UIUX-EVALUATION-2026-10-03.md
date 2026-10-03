# Adhiland ERP Mockup V3 — UI/UX Evaluation Report

**Tanggal:** 3 Oktober 2026
**Evaluator:** Advance UI/UX Developer & Designer (ERP Specialist)
**Scope:** 36 file HTML, 2 CSS, 8 JS — dari login sampai seluruh dashboard & submenu
**Versi:** V3 (Database Integrated)

---

## 1. Executive Summary

| Dimensi | Skor | Catatan |
|---------|------|---------|
| Design System & Tokens | 9/10 | Disiplin, centralized, dark/light lengkap |
| Login & Onboarding | 7/10 | Fungsional, minim; no loading state |
| App Shell (Sidebar/Topbar) | 8/10 | Grid layout solid, collapsible sidebar, mobile overlay |
| Dashboard Direktur | 9/10 | 16 widget data-driven, 5 chart, periode control |
| Dashboard per-Divisi | 6/10 | Finance underdeveloped; Legal/Teknik ada hardcoded |
| Sub-menu Pages | 7/10 | Workflow lengkap, tapi drawer pattern tidak konsisten |
| Data Tables | 8/10 | Enhanced toolbar powerful, tapi duplicate pagination |
| Charts & Visualization | 7/10 | Theme-aware, tapi CDN dependency, no fallback |
| Responsive | 7/10 | Breakpoint overlap, mobile sidebar OK |
| Accessibility | 6/10 | Foundation ada, tapi focus trap & live region hilang |
| Consistency | 6/10 | Inline styles, rag-danger bug, alert() vs toast |
| **Overall** | **7.3/10** | **SOLID foundation, butuh polish & bug fix** |

---

## 2. Design System & Tokens

### Strengths
- `tokens.css` adalah **single source of truth** — aturan "NO #hex in app.css" ditegakkan dengan komentar eksplisit.
- **Dark & light theme** lengkap: setiap token punya variant `:root[data-theme="dark"]`, dengan `color-scheme` proper.
- **FOUC prevention**: inline script di `<head>` sebelum CSS load — tema diterapkan sebelum paint.
- Spacing scale 7-step (4/8/12/16/20/32/48px), typography scale 7-step (12–32px), radius 3-step, shadow 3-level.
- Semantic colors: success/warning/danger/info + soft variants untuk RAG status.
- **Project-specific color series** (`--proj-joyo`, `--proj-sigura`, dll) — konsisten di chart dan bar.
- Font stack Inter → system-ui, dengan `font-variant-numeric: tabular-nums` untuk alignment angka.

### Issues
- **Tidak ada token untuk z-index** — nilai hardcoded di CSS (40, 30, 100, 101, 200, 300, 1000). Rentan konflik.
- `--sidebar-w-collapsed: 0px` — sidebar hilang total saat collapse, bukan icon-only rail. Pilihan design, tapi kurang ideal untuk ERP.
- Dark theme `--text-on-primary: #0B1220` (dark text) — benar untuk primary yang terang, tapi perlu verifikasi kontras pada semua surface.

---

## 3. Login Page (`login.html`)

### Strengths
- Clean, minimal, centered card. Logo + title + role selector + email/password.
- **Role-based entry** (6 role: Direktur, Legal, Teknik, Marketing, Operasional, Finance) — email auto-fill berdasarkan role.
- Enter key pada password field → trigger login.
- Theme toggle tersedia di footer login.
- `lang="id"` proper, `autocomplete` attributes pada input.

### Issues
- Password field `value="••••••••"` — hardcoded bullet, bukan placeholder. Tidak ada validasi. Mockup acceptable, tapi label "Mockup UI/UX 2.0" sudah jujur.
- **No loading state** pada tombol "Masuk" — click langsung redirect, tidak ada feedback visual.
- **No "lupa password" link** — bahkan sebagai mockup, absennya terasa.
- Theme toggle icon terlalu kecil (17px) dan tuck di footer — kurang prominent.
- Role grid 2×3 — pada layar sangat sempit bisa sempit, tapi acceptable.
- `window.location.replace` di `index.html` + `meta refresh` + inline script — triple redirect, redundant tapi aman.

---

## 4. App Shell — Sidebar & Topbar

### Strengths
- **CSS Grid layout**: `grid-template-columns: var(--sidebar-w) 1fr` dengan `grid-template-rows: var(--topbar-h) 1fr`. ERP-style viewport: body `overflow: hidden`, main owns scroll, sidebar owns nav scroll.
- **100dvh** untuk mobile browser dynamic viewport — modern approach.
- Sidebar collapse dari **dua tempat**: topbar toggle button + sidebar brand collapse button. State persisted di `localStorage`.
- **Nested navigation** dengan tree expand/collapse — `nav-tree-item`, `nav-children`, chevron rotation.
- **Badge counts** pada nav items — data-driven dari `AdhData.PENGAJUAN` (pengajuan menunggu, review, siap-bayar).
- Topbar lengkap: sidebar toggle, page title + context, **global project picker**, notification button + count, theme toggle, user pill (avatar + role).
- **Skip link** `Lewati ke konten` — a11y foundation.
- Custom scrollbar styling (webkit).
- `overscroll-behavior: contain` pada main — prevents scroll bleed.
- Print styles: sidebar/topbar hidden, main expands.

### Issues
- **Topbar date hardcoded**: `shell.js` line 93 menulis `'03 Okt 2026'` sebagai literal string — tidak dinamis.
- **No breadcrumb** — kedalaman navigasi tidak terlihat di main content. Sidebar highlight aktif, tapi konteks "di mana saya" kurang.
- Sidebar collapse di breakpoint 1100px: `--sidebar-w-collapsed: 0px` artinya sidebar **hilang total**, bukan icon-only rail. Breakpoint otomatis tanpa kontrol user.
- Notification modal hanya menampilkan 30 item pertama (`rows.slice(0,30)`) — count badge bisa show "99+" tapi modal terbatas.
- Mobile sidebar overlay pakai `::after` pseudo-element pada `.app-shell` — unusual, bisa konflik z-index dengan konten lain.
- No tooltip pada nav items saat collapsed (labels hidden) — tapi karena collapse = visibility hidden, ini less relevant.

---

## 5. Dashboard Direktur (Executive)

### Strengths
- **16 widget** dalam satu halaman, fully data-driven dari `canonical-data.json`:
  1. Decision Center (Pusat Keputusan) — severity-coded cards
  2. KPI Strip — 8 KPI dengan RAG status + detail modal
  3. Project Health Matrix — table with in-cell progress bars
  4. Funnel Kavling — staged bar visualization
  5. Sales vs Cash Combo — Chart.js bar+line
  6. Celah Tagih — collection gap table
  7. Cash Bridge + Runway — waterfall bar + runway calculation
  8. Cash Quality — doughnut chart
  9. Budget Burn — bar chart (project-aware)
  10. Due Items — jatuh tempo visualization
  11. Pay vs Progress Scatter — P0 quadrant analysis
  12. Late ST — construction delay summary
  13. Legal Heatmap — progress bar + legend
  14. AR Aging — bar visualization
  15. AP Aging — bar visualization
  16. Data Quality — DQ indicators
- **Period & comparison controls** that actually re-render (`viewPeriod`, `compareMode`).
- **Project picker** synchronized globally — budget chart becomes project-aware.
- KPI status buttons open **detail modals** with real data tables.
- Chart colors read from CSS variables — **theme-aware**.
- Board Pack uses `window.print()` — honest, no fake alert.
- `requestAnimationFrame` for chart init — proper DOM timing.
- Theme change re-inits charts via `themechange` event listener.
- `sr-only` caption pada project matrix table.

### Issues
- **16 widget = very long page**. No tab/accordion system. Scroll jauh. Recommend grouping: "Overview", "Cash & Budget", "Sales & Property", "Risk & DQ".
- 8 KPI in 4-column grid — cards sempit di laptop (1366px). Responsive 1279px → 2 columns = 4 rows KPI.
- **Chart.js from CDN** (`cdn.jsdelivr.net`) — no local fallback. If CDN down, charts silently fail. README acknowledges this.
- Scatter chart (W-DIR-11) — only 5 project points, no collision/jitter, but manageable.
- Cash runway number (32px, danger color) — **visual weight doesn't match the "historical benchmark" caveat** in fine print. Could alarm without context.
- **No loading skeleton** — `.skeleton` class defined but unused. Dashboard renders blank until `AdhData.load()` resolves.
- Decision Center action buttons navigate away — no inline action capability.
- `detailConfig()` function truncated in shell.js — the `notifications` column config is cut off mid-array. Needs verification.

---

## 6. Dashboard per-Divisi

### Finance (`Finance/index.html`)
- **Underdeveloped** — only 4 KPIs + text explanation of authority + 3 link buttons. No charts, no tables.
- `var(--text-muted, #666)` — **hardcoded hex fallback** in inline style. Violates "no hex" rule.
- Missing `global-bar` header that other divisi dashboards have.
- Content is plain HTML string concatenation — inconsistent with template literal approach elsewhere.

### Legal (`Legal/index.html`)
- Has `global-bar`, 4 KPIs, priority queue table, heatmap, quick actions.
- **Heatmap is hardcoded** — only 5 kavlings with inline-style color arrays. Not data-driven from `legal.json`.
- Heatmap grid uses inline `style` extensively — not using component system.
- `loadReport('legal')` called but only used for `butuhAjb` count — heatmap itself doesn't use it.

### Teknik (`Teknik/index.html`)
- Has `global-bar`, 4 KPIs, risk table (data-driven from kavling), S-curve, progress table.
- **S-curve is hardcoded** — `[10,18,28,35,42,48,55,58,62,65,68,70]` inline. Note says "indikatif — belum ada time-series". Honest but visual is misleading.
- Risk table properly derived from `kavling.json` — good.
- Progress table from `progres.json` — good, with empty state fallback.

### Marketing (`Marketing/index.html`)
- Has `global-bar`, 4 KPIs, deal follow-up table, stok per project.
- **Solid** — data-driven, proper tables, KPIs meaningful.
- Funnel data from `D.STOK.funnel` — consistent with dashboard.

### Operasional (`Operasional/index.html`)
- Has `global-bar`, 4 KPIs, pengajuan table.
- **BUG**: `statusBadge()` uses `'rag-danger'` class — CSS only defines `rag-bad` (not `rag-danger`). Badge for "ditolak" will have no styling. **CONFIRMED BUG**.
- Anggaran calculation from `budgeting_item.json` — good.
- Jatuh tempo calculation from `budgeting_item` with 7-day horizon — good.

### Cross-divisi consistency
- Finance doesn't have `global-bar` — outlier.
- Legal & Teknik have hardcoded visuals — inconsistent with data-driven approach elsewhere.
- KPI grid columns: Direktur=4, Legal=4, Teknik=4, Marketing=4, Operasional=4, Finance=4, Pengajuan=3, ArusKas=3, TataKelola=4. **Inconsistent**.
- Footer note format varies across pages.

---

## 7. Sub-menu Pages

### Direktur/Pengajuan (`pengajuan.html`)
- **Best-in-class** page: status filter chips, role chips, bulk approve/reject, reject drawer with required reason, cash impact KPI, kas coverage KPI.
- **BUT**: reject drawer uses inline-styled overlay (`style="display:none;position:fixed;..."`) instead of existing `.drawer-overlay` + `.drawer` component. Inconsistent with Legal & Teknik which use the proper component.
- `confirm()` dialog for mass approve — native browser dialog, not styled. Inconsistent with toast pattern.

### Direktur/Siap Bayar (`siap-bayar.html`)
- Same pattern as pengajuan — well-built with mass pay, CSV export, bank account column.
- Also uses inline-styled overlay pattern.
- Uses `confirm()` for mass pay.

### Direktur/Tata Kelola (`tata-kelola.html`)
- Budget vs Actual vs Commit KPIs — comprehensive.
- Cash forecast 30/60/90 days — properly labeled "indikatif".
- Audit log table — good governance feature.
- Three CSV export buttons — good.
- Uses `h3` inline-styled headers — should use a component class.

### Direktur/Neraca (`neraca.html`)
- Simple read-only report — KPIs + two tables (Aktiva, Kewajiban).
- Honest: labels proxy vs snapshot, no dummy fixed assets.
- **No chart** — could benefit from a balance bar visualization.

### Direktur/Budgeting (`budgeting.html`)
- Chart.js bar chart + tables + jatuh tempo items.
- **Well done** — data from `budgeting_item.json`, per-jenis aggregation, per-project summary.
- In-cell progress bars with project-specific colors.

### Direktur/Master Data (`master.html`)
- Tab system (COA, Vendor, Project, User) — good.
- Filter bar, pagination, drawer for edit — comprehensive.
- **BUG**: Export button uses `alert()` — inconsistent with toast pattern used everywhere else.
- Drawer properly uses `.drawer-overlay` + `.drawer` component — good.
- Inline `<style>` block in HTML head — page-specific styles. Acceptable but could be tokenized.

### Direktur/Tempat Sampah (`sampah.html`)
- **Hardcoded dummy rows** — `for (var i=1;i<=10;i++)` with fake data. Not data-driven.
- Buttons are mock but no toast feedback — just static buttons.

### Direktur/Arus Kas (`arus-kas.html`)
- Manual pagination (prev/next) **+** enhanced table toolbar = **duplicate pagination controls**.
- Uses `?.` optional chaining — modern but all other pages use `&&` guard. Inconsistent.
- Otherwise clean — KPIs + table + source note.

### Finance/Review (`review.html`)
- Limit-based approval logic — excellent. ≤ limit: Setujui (limit), > limit: Loloskan ke Direktur.
- Return drawer with required reason — good.
- Same inline overlay pattern as pengajuan — inconsistent with `.drawer` component.

### Legal/Dokumen (`dokumen.html`)
- **Best drawer implementation** — properly uses `.drawer-overlay` + `.drawer` component.
- Interactive heatmap matrix — click cell to edit status via drawer.
- sessionStorage override — honest mock.
- KPIs properly counted from cell states.

### Teknik/Progres (`progres.html`)
- Also uses `.drawer` component properly — good.
- Update progres with drawer, sessionStorage override.
- Risk calculation from `kavling.json` + `tglSerahTerima` — data-driven.
- In-cell progress bars — consistent with budgeting page.

### Marketing/Stok (`stok.html`)
- Basic — KPIs + one table. No chart, no interactivity beyond enhanced table.
- Could benefit from a funnel visualization.

### Operasional/Anggaran (`anggaran.html`)
- Basic — KPIs + one table. No chart.
- Filter logic same as dashboard — consistent.

---

## 8. Data Tables & Interactions

### Strengths
- `enhanceTable()` in shell.js adds: **search, pagination, column toggle, density toggle, currency mode (compact/full)**.
- Sticky headers with `box-shadow` separator.
- Tabular numerals for alignment.
- In-cell progress bars (`in-cell-bar`).
- Zero-value styling (subtle text color).
- CSV export from tables.
- Project filtering on tables (`filterTablesByProject`).
- `wireMockButtons()` — auto-wires export/import/dead-end buttons with toast feedback.

### Issues
- **Duplicate pagination** — `arus-kas.html` has manual prev/next + enhanced table adds its own. Conflict.
- **No column sorting** — significant gap for ERP tables. Users expect sortable columns.
- Column toggle menu doesn't close on scroll — minor.
- Table search is client-side only — fine for mockup.
- Money compact mode uses abbreviations (T, M, jt, rb) — could confuse non-finance users.
- `data-table` `min-width: 760px` — always horizontal scroll on mobile. Acceptable for ERP.

---

## 9. Charts & Visualizations

### Strengths
- Chart.js 4.4.1 — modern, responsive, `maintainAspectRatio: false`.
- 5 chart types in Direktur dashboard: bar, line (combo), bar (waterfall), doughnut, scatter.
- Colors read from `getComputedStyle().getPropertyValue()` — **fully theme-aware**.
- Tooltip callbacks with proper IDR formatting.
- Legend with theme-correct text colors.
- `requestAnimationFrame` init — proper timing.

### Issues
- **CDN dependency** — `cdn.jsdelivr.net`. No local fallback. If offline, charts silently fail (canvas stays empty, no message).
- **No chart loading state** — canvas is empty between DOM render and chart init.
- **No error handling** — if `typeof Chart === 'undefined'`, function returns early with no user feedback.
- Tooltip formatting inconsistent: some "Rp X M", some "X jt", some full IDR.
- No `role="img"` + `aria-label` on canvas — screen readers skip charts entirely.
- Theme re-init causes brief flash — no transition.

---

## 10. Responsive Design

### Strengths
- Mobile sidebar: `position: fixed`, `translateX(-100%)`, overlay backdrop via `::after`.
- Three collapse modes: full sidebar (desktop), auto-collapse at 1100px, mobile overlay at 900px.
- KPI grid: 4→2→1 columns across breakpoints.
- Zone grids: multi-column → 1fr at 1279px.
- Print styles: hide shell, expand main.
- `prefers-reduced-motion` support.

### Issues
- **Breakpoint overlap/conflict**: 1279px, 1100px, 900px, 767px, 760px — five breakpoints, some very close together (767 vs 760). Messy.
- 1100px auto-collapse: sidebar width → 0px (hidden), labels hidden, but nav items become `justify-content: center` with no labels visible. If sidebar is hidden anyway, this is dead CSS.
- Mobile overlay `::after` pseudo-element — unusual, could have z-index issues with fixed elements.
- `@media (max-width: 1100px)` and `@media (max-width: 900px)` both target sidebar — conflicting rules.
- `--sidebar-w-collapsed: 0px` means no icon rail — ERP users typically expect icon-only sidebar.

---

## 11. Accessibility

### Strengths
- Skip link (`Lewati ke konten`) → `#main`.
- ARIA labels on navigation, buttons, dialogs.
- `role="navigation"`, `role="banner"`, `role="main"`, `role="dialog"`, `aria-modal="true"`.
- `aria-expanded` on tree nav items and sidebar toggle.
- `sr-only` class for screen reader text.
- `focus-visible` outlines on buttons and inputs.
- `prefers-reduced-motion` support.
- `aria-hidden="true"` on decorative SVG icons.
- Escape key closes modals/drawers.

### Issues
- **No focus trap** in modals/drawers — focus can leave the dialog. Critical for a11y compliance.
- **No focus management** — focus doesn't move to drawer/modal when opened.
- **No ARIA live region** for toasts — screen readers won't announce them.
- Color-only status indicators: RAG badges have text (good), but heatmap cells use only color + icon character (✓/!/⏱/–) — no text alternative.
- Form inputs lack `aria-required` and `aria-invalid`.
- Charts (canvas) have no text alternative — need `role="img"` + `aria-label` or table fallback.
- `lang="id"` is set — good, but some English terms mixed in labels.

---

## 12. Dark/Light Theme

### Strengths
- Comprehensive token coverage — every token has dark variant.
- Chart colors theme-aware via CSS variable reads.
- Theme toggle on login + all dashboard pages.
- `aria-pressed` on theme toggle button.
- `themechange` event dispatched — charts re-init.
- `color-scheme` set on `:root` — native form controls follow theme.

### Issues
- Sidebar is dark (`--nav-bg: #0F1D3D`) in **both** themes — design choice, but some users expect light sidebar in light theme.
- Dark theme `--primary: #8FA6EA` (light blue) — `--text-on-primary: #0B1220` (dark text). Contrast ratio needs verification.
- Theme switch causes chart flash — no smooth transition.

---

## 13. Confirmed Bugs (Code-Level)

| # | File | Line | Bug | Severity |
|---|------|------|-----|----------|
| B1 | `Operasional/index.html` | 57 | `rag-danger` class used — CSS only defines `rag-bad`. "Ditolak" badge unstyled. | **High** |
| B2 | `Finance/index.html` | 62 | `var(--text-muted, #666)` — hardcoded hex fallback in inline style, violates no-hex rule | Medium |
| B3 | `Direktur/arus-kas.html` | 53-63 | Manual pagination buttons + enhanced table toolbar = duplicate controls | Medium |
| B4 | `Direktur/master.html` | 329 | `alert()` for export — inconsistent with toast pattern | Low |
| B5 | `Direktur/sampah.html` | 21-22 | Hardcoded dummy rows (`for i=1 to 10`) — not data-driven | Low |
| B6 | `shell.js` | 93 | Topbar date hardcoded `'03 Okt 2026'` — not dynamic | Low |
| B7 | `shell.js` | 99 | `detailConfig()` function truncated mid-array for `notifications` column config | Medium |
| B8 | `Legal/index.html` | 90-101 | Heatmap hardcoded 5 kavlings with inline color arrays — not data-driven | Medium |
| B9 | `Teknik/index.html` | 122-128 | S-curve hardcoded values `[10,18,28,...]` — not from data | Low (honest label) |
| B10 | CSS | 867-889 | Breakpoint overlap: 1100px hides sidebar, 900px also targets sidebar — conflicting | Medium |

---

## 14. Recommendations (Prioritized)

### P0 — Must Fix (Production Blockers)
1. **Fix `rag-danger` → `rag-bad`** in `Operasional/index.html` line 57. One-word fix.
2. **Add focus trap** to modals/drawers — use a simple `focusin`/`focusout` guard or a library like `focus-trap-js`.
3. **Add ARIA live region** for toasts — `role="status"` or `aria-live="polite"` on toast container.

### P1 — Should Fix (Quality Impact)
4. **Vendor Chart.js locally** — download `chart.umd.min.js` to `assets/js/vendor/`. CDN dependency is unacceptable for production ERP.
5. **Add table column sorting** — click header to sort. Essential ERP table feature.
6. **Fix duplicate pagination** on `arus-kas.html` — remove manual buttons, let enhanced table handle it.
7. **Replace `alert()` with toast** in `master.html` export button.
8. **Remove hardcoded hex** `#666` from `Finance/index.html` — use `var(--text-muted)` without fallback.
9. **Replace inline overlay** in pengajuan.html & review.html with proper `.drawer-overlay` + `.drawer` component (like Legal/Teknik do).
10. **Add loading skeleton** to dashboard — use existing `.skeleton` class during `AdhData.load()`.
11. **Group dashboard widgets into tabs** — "Overview", "Cash & Budget", "Sales & Property", "Risk & DQ". 16 widgets is too long.
12. **Make Legal heatmap data-driven** — read from `legal.json`, not hardcoded arrays.
13. **Fix topbar date** — make it dynamic from `AdhData.AS_OF`.
14. **Add breadcrumb** to topbar or main content header.

### P2 — Nice to Have (Polish)
15. **Add `role="img"` + `aria-label`** to all chart canvases.
16. **Add `aria-required`** to required form inputs.
17. **Consolidate breakpoints** — reduce from 5 to 3 (desktop, tablet, mobile).
18. **Add icon-only sidebar rail** mode (`--sidebar-w-collapsed: 64px` instead of `0px`).
19. **Add transition** on theme switch to prevent chart flash.
20. **Add Neraca chart** — balance bar visualization.
21. **Add Marketing funnel chart** — visualize the stok funnel.
22. **Replace `confirm()` dialogs** with styled modal for mass actions.
23. **Standardize KPI grid columns** — use default 4 everywhere, only override when truly needed.
24. **Add `data-sortable`** attribute to table headers for sorting UX.
25. **Extract inline styles** to CSS classes — reduce maintenance burden.

---

## 15. Architecture Assessment

```
┌─────────────────────────────────────────────────────┐
│                    LOGIN PAGE                        │
│  Role selector → route to divisi dashboard           │
└──────────────────────┬──────────────────────────────┘
                       │
    ┌──────────────────┴──────────────────┐
    │           APP SHELL (shell.js)       │
    │  ┌─────────┐  ┌──────────────────┐   │
    │  │ SIDEBAR  │  │     TOPBAR        │   │
    │  │ nav tree │  │ project picker    │   │
    │  │ badges   │  │ notifications     │   │
    │  │ collapse  │  │ theme toggle      │   │
    │  └─────────┘  └──────────────────┘   │
    │  ┌─────────────────────────────────┐ │
    │  │         MAIN (scrollable)        │ │
    │  │  ┌──────────────────────────┐    │ │
    │  │  │  PAGE CONTENT (per-page)   │    │ │
    │  │  │  KPIs / Tables / Charts    │    │ │
    │  │  │  Drawers / Modals         │    │ │
    │  │  └──────────────────────────┘    │ │
    │  └─────────────────────────────────┘ │
    └──────────────────────────────────────┘
```

**Data flow:**
```
canonical-data.json → AdhData.load() → AdhShell.mount() → page content
                                     → enhanceTables() → toolbar, search, pagination
                                     → filterTablesByProject() → project scope
                                     → wireMockButtons() → toast feedback
```

**State layers:**
- `localStorage`: theme, sidebar collapsed, last role
- `sessionStorage`: pengajuan overrides, legal status, progres overrides, audit log, paid markers

---

## 16. Conclusion

Mockup V3 ini punya **foundation arsitektur yang sangat solid** — design token system yang disiplin, app shell yang proper, data-driven approach yang honest, dan table enhancement yang powerful. Dashboard Direktur dengan 16 widget adalah centerpiece yang impressive.

Namun, ada **gap konsistensi** yang harus ditutup: drawer pattern tidak seragam, beberapa divisi dashboard underdeveloped (terutama Finance), bug `rag-danger`, dan accessibility gaps (focus trap, live region). Inline styles di mana-masa membuat maintenance sulit.

**Prioritas fix:**
1. B1 (rag-danger bug) — 1 menit
2. P0 #2-3 (a11y: focus trap + live region)
3. P1 #4 (vendor Chart.js)
4. P1 #5 (table sorting)
5. P1 #11 (dashboard tabs)

Setelah fix tersebut, mockup ini siap untuk dijadikan basis production dengan integrasi backend nyata.
