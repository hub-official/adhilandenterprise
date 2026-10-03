# Adhiland ERP Mockup V3 — Plan PRD & Task Breakdown

**Tanggal:** 3 Oktober 2026
**Dokumen:** Unified Product Requirements Document + Task Breakdown
**Scope:** 39 file HTML, 2 CSS, 9 JS — login sampai seluruh dashboard & submenu, dengan audit khusus tablet & mobile
**Versi Mockup:** V3 (Database Integrated)

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Scorecard](#2-scorecard)
3. [Current State Assessment — UI/UX](#3-current-state-assessment--uiux)
4. [Current State Assessment — Tablet & Mobile](#4-current-state-assessment--tablet--mobile)
5. [Confirmed Bug Register](#5-confirmed-bug-register)
6. [Product Requirements (PRD)](#6-product-requirements-prd)
7. [Design System Requirements](#7-design-system-requirements)
8. [Responsive Design Specification](#8-responsive-design-specification)
9. [Accessibility Requirements](#9-accessibility-requirements)
10. [Task Breakdown](#10-task-breakdown)
11. [Risk Register](#11-risk-register)
12. [Architecture Reference](#12-architecture-reference)
13. [Conclusion](#13-conclusion)

---

## 0. Execution Status — 3 Oktober 2026

**Status: SELESAI (57/57 task dieksekusi).** Semua task pada §10 telah diimplementasikan
ke disk dan diverifikasi dengan bukti runtime (headless Chrome), bukan klaim dokumen.

### Rekap per fase

| Fase | Task | Status | Bukti kunci |
|---|---|---|---|
| Phase 0 — Critical bug fixes | T0-01 … T0-06 | ✅ Selesai | `rag-danger`→`rag-bad`, z-index token, sidebar-collapsed |
| Phase 1 — Responsive & mobile | T1-01 … T1-12 | ✅ Selesai | 4 breakpoint konsolidasi, touch target 44px, drawer + confirmDialog |
| Phase 2 — Data & chart integrity | T2-01 … T2-13 | ✅ Selesai | Chart.js lokal, sorting, skeleton, heatmap & S-curve data-driven |
| Phase 3 — Dashboard & forms | T3-01 … T3-12 | ✅ Selesai | Tab dashboard, breadcrumb, chart Neraca & Funnel, login UX |
| Phase 4 — Mobile interaction | T4-01 … T4-06 | ✅ Selesai | Bottom nav, swipe-close, scroll shadow, pull-to-refresh, sticky bar |
| Phase 5 — Polish & PWA | T5-01 … T5-08 | ✅ Selesai | `.source-note`, `.empty-state`, print A4, prefers-color-scheme, manifest |

### Verifikasi yang dijalankan (bukan asumsi)

| Check | Perintah / metode | Hasil |
|---|---|---|
| Syntax JS modul | `node --check assets/js/*.js` | 9/9 OK |
| Syntax inline script | ekstraksi 77 `<script>` → `node --check` | 77/77 OK, 0 gagal |
| Keseimbangan CSS | brace count `app.css` / `tokens.css` | 453/453 & 3/3 OK |
| Validitas manifest | `json.loads(manifest.json)` | valid |
| Render runtime | headless Chrome 38 halaman nyata | **38/38 mount `app-shell`** |
| Error runtime JS | `window.onerror` + `unhandledrejection` 38 halaman | **0 error** |
| Layout mobile 390px | iframe harness + screenshot | 0 horizontal overflow (`SW == IW`) |
| Bottom nav | probe `getComputedStyle` | `display:grid`, 5 item (Direktur) / 3 item (Marketing) |
| **Ekstraksi inline style (T3-10)** | hitung `style="` di 39 file HTML | **232 → 21** (211 statis terekstraksi; 21 sisa = 16 dinamis JS + 5 tak-terpetakan, disengaja) |
| **Ekstraksi lossless (equivalence)** | computed-style 39 halaman vs inline asli | **877 elemen, 0 diff properti** |
| **Hex di luar token** | grep `#hex` di `app.css` | **0** (token `--text-on-danger` ditambah) |
| Screenshot 3 breakpoint | 390 / 834 / 1440 px | 9 file — lihat `docs/verification-2026-10-03/` |

### Catatan jujur (limitasi)

- **T5-02** — target yang tertulis di plan (`Direktur/arus-kas.html`) ternyata sudah **0** pemakaian `?.`.
  Normalisasi tetap dilakukan pada 3 file lain yang masih memakainya (`buku-besar.html`,
  `jurnal.html`, `master.html`, total 18 titik) agar konsisten.
- **T2-09** — alih-alih menaruh tanggal di topbar, tanggal dinamis dipindah ke `global-bar` tiap
  halaman (`fmt.dateTime(AdhData.AS_OF)`); topbar kini memuat breadcrumb. Tidak ada string tanggal
  hardcoded yang tersisa.
- **T4-04 pull-to-refresh** — implementasi melakukan `AdhData.load()` lalu `location.reload()`
  untuk me-render ulang dengan data segar (halaman mount sekali di `DOMContentLoaded`, tidak ada
  hook render ulang generik yang bisa dipanggil dari shell).
- **T3-10 tidak benar-benar tuntas pada pass pertama.** Audit mandiri menemukan masih ada
  **232 atribut `style=`** di 39 file HTML. Perbaikan: dibangun lapisan utility atomik di `app.css`,
  lalu **211 atribut statis diekstraksi**. Sisa **21** disengaja: **16** adalah style yang
  di-generate dinamis oleh JS (mis. `width:'+progres+'%`) dan **5** tidak punya padanan utility.
- **Dua cacat nyata akibat ekstraksi T3-10, ditemukan oleh verifikasi lalu diperbaiki:**
  (1) *corruption* pada `Direktur/laba-rugi.html` — blok JS terduplikasi ~1.713 karakter karena
  sebuah `style=` di dalam string JS tidak punya `<` terdekat; dideteksi lewat `node --check`
  pada script inline, lalu blok duplikat dibuang. (2) *regresi CSS asli* — `<th class="text-center">`
  terhitung `text-align:left` karena selektor `table.data-table th` (spesifisitas 0-1-1) mengalahkan
  utility class (0-1-0); hanya ketahuan lewat equivalence test di `Legal/dokumen.html`, lalu
  ditambahkan guard `table.data-table th.*` / `td.*` untuk text-align/font-weight/padding/white-space.
- **3 atribut `class` duplikat** (class muncul setelah `style` di tag yang sama) dibersihkan manual.
- **Headless Chrome di Windows** membatasi lebar window minimum ~500px; screenshot 390px
  dihasilkan lewat iframe harness agar viewport CSS benar-benar 390px.
- **Trigger guardian manual & runtime Zcode** tidak diuji di sesi ini (di luar scope mockup ERP).

### File bukti

`docs/verification-2026-10-03/` — **9 screenshot**: mobile 390 (dashboard, neraca+chart, funnel,
pengajuan, login), tablet 834 (neraca), desktop 1440 (neraca, legal-dokumen, master-data).

### Perbaikan pasca-eksekusi — Popup info KPI (3 Oktober 2026, lanjutan)

**Temuan Bos:** nama popup tidak cocok dengan nama kartu, dan data popup tidak terkoneksi ke
sumber yang tepat. Tiap kartu KPI (Kas & Bank, Uang Masuk, Sisa Tagihan PPJB, Piutang Usaha,
Hutang, Stok Belum Terjual) memang mewakili kategori data yang berbeda.

**Root cause (dibuktikan via probe headless, bukan dugaan):**

| Metrik | `file://` | `http://` |
|---|---|---|
| `Object.keys(AdhData.DB).length` | **0** | **34** |
| `detail('penjualan_ppjb').rows` | 0 | 5 |
| `detail('piutang_hutang').rows` | 0 | **0** (bug terpisah) |

Tiga cacat:
1. `fetch()` ke `file://` diblokir Chrome (CORS) → `canonical-data.json` tak pernah termuat →
   `D.DB = {}` → **seluruh popup detail di semua halaman kosong**, padahal kartu menampilkan angka.
2. `piutang_hutang` tidak ada di `map` `D.detail()` (hanya `ar_aging`/`ap_aging` yang menunjuk ke tabel itu).
3. Penamaan tidak cocok; 2 kartu menunjuk dataset yang sama dan salah
   (Uang Masuk = Total Penjualan PPJB; Piutang Usaha = Sisa Tagihan PPJB).

**Efek samping:** 3 kartu menampilkan angka salah di `file://` — Hutang `Rp 0` (asli **Rp 4,86 M**),
Piutang Usaha `Rp 0` (asli **Rp 151,68 jt**), Serapan Anggaran `0,0%` (asli **16,29%**).

**Perbaikan:**
- `assets/js/canonical-data.js` (baru, generated) menyuntikkan snapshot sebagai `window.ADH_CANONICAL`;
  `data.js` memakainya lebih dulu. Disuntik ke 37 halaman pemuat `data.js`. Regenerasi:
  `node tools/embed-canonical.mjs`.
- `data.js`: tambah key `piutang_hutang` + 8 tipe detail baru (1 per kartu), tiap tipe menunjuk
  tabel sumbernya sendiri dengan fallback dari agregat yang sama dengan kartunya.
- `shell.js`: judul per kategori + `openDetail()` menerima `opts.title` (judul popup = label kartu).
- `dashboard.js`: konstanta `KPI_DETAIL` + `data-detail-title="${k.label}"`.

**Peta kartu → sumber (final):** Kas & Bank → `dashboard_proyek` (kolom kas, 5 baris) ·
Total Penjualan (PPJB) → `dashboard_proyek` Nilai PPJB (5) · Uang Masuk → `dashboard_proyek`
Uang Masuk (5) · Sisa Tagihan PPJB → `dashboard_proyek` Piutang PPJB (5) ·
Stok Belum Terjual → `kavling_master` Status Unit=BELUM TERJUAL (43) ·
Hutang → `piutang_hutang` Seksi=Hutang (10) · Piutang Usaha (Jurnal) → `piutang_hutang`
Seksi=Piutang (9) · Serapan Anggaran → `dashboard_budget_realisasi` (15).

**Verifikasi:** probe klik 8 tombol info via `file://` → **8/8 judul MATCH**, semua non-empty ·
nilai kartu konsisten dengan isi popup · `node --check` 9/9 OK · runtime smoke 39 halaman →
**38/38 halaman nyata mount, 0 error JS** · screenshot `popup-hutang.png`, `popup-uang-masuk.png`,
`popup-serapan-anggaran.png` · temp file sisa 0.

**Sapuan lanjutan — semua pemilik popup di proyek:**
- `dashboard.js` hanya dipakai `Direktur/index.html`; 34 halaman divisi punya `.kpi-card` statis
  tetapi **0 `kpi-info-btn`** dan **0 `data-detail`** → popup info memang hanya di dashboard Direktur.
- Tombol "Detail" statis di 3 halaman ternyata `<h2 class="drawer-title">` dan `<a href>` navigasi —
  **bukan tombol modal**, tidak ada tombol mati.
- 2 judul popup bawah dashboard masih mismatch → diperbaiki via `data-detail-title`:
  "Penjualan vs Uang Masuk" (dulu "Penjualan PPJB") dan "Saldo Kas per Proyek" (dulu "Saldo").
- Hasil akhir: **28 tombol `[data-detail]` diprobe satu per satu → semua judul sesuai konteks kartu,
  0 popup kosong.** Runtime smoke ulang **38/38 bersih, 0 error JS**.

**Catatan terbuka (SELESAI):** popup Hutang dulu menampilkan 10 baris termasuk baris `Total Hutang`
dari tabel sumber, sedangkan angka kartu menjumlahkan 9 akun saja. **Diselesaikan:** baris
`Total …` dibuang dari tabel (`dropTotalRows()`) dan nilainya diangkat menjadi chip total di
**atas** tabel — lihat sub-bab berikut.

### Perbaikan lanjutan — Header terkunci, scroll, dan total di ATAS tabel (3 Oktober 2026)

**Permintaan Bos:** (1) apakah header popup sudah terkunci? (2) skalabilitas bila data banyak —
harus bisa di-scroll; (3) **total diletakkan di atas header, bukan di baris bawah tabel**.

**(3) Total di atas tabel — SELESAI.** Tiap tipe detail kini mengembalikan `total` / `totalLabel` /
`totalNote` (bukan baris total di dalam `<tbody>`). Nilai dirender sebagai chip `.detail-total` di
`.detail-summary`, yang berada **di atas tabel** dan `flex:0 0 auto` sehingga tidak ikut tergulir.
`MAXROWS = 500` + label jujur `Menampilkan 500 dari N baris`.

**(1) Header terkunci — SELESAI, dan diagnosis awal saya SALAH.** Sebelumnya saya melaporkan
header *tidak* menempel. Itu **artefak pengukuran**, bukan bug CSS. Penyebab sebenarnya: ada
**dua area scroll bersarang** (`.global-modal-body` yang `overflow:auto` + `.detail-table-wrap`
yang `overflow:auto`). Probe menggulir elemen luar, sehingga `.detail-table-wrap` — pemilik konteks
sticky — tidak bergerak, dan `thead` ikut terangkat bersama pembungkusnya.

Bukti A/B terkontrol pada popup "Jatuh Tempo" (79 baris), setelah perbaikan scroll tunggal:

| scrollTop di-set | dibaca kembali (`used`) | `thead` Δ | `tbody` Δ | putusan |
|---|---|---|---|---|
| 0 | 0 | 0 (base 164) | 0 | baseline |
| 300 | **300** | **0** | tidak diukur | terkunci |
| 600 | **600** | **0** | tidak diukur | terkunci |
| 320 | **320** | **0** | **−320** | terkunci + isi benar-benar bergulir |

`getComputedStyle(th)` → `position=sticky`, `top=0px`, `z-index=3`.
Baris pertama yang terlihat berpindah dari indeks **0 → 8** saat digulir 320 px.

**Koreksi catatan lama:** komentar CSS lama menyatakan `border-collapse:collapse` yang merusak
sticky. **Tidak benar** — A/B pada Chrome build ini: `collapse` maupun `separate` sama-sama
`thead Δ = 0` (terkunci). Yang menentukan adalah **satu** scroll container, bukan nilai
`border-collapse`. Komentar di `app.css` sudah dikoreksi.

**Perbaikan:**
- `app.css`: `.global-modal-body.detail-body` → `overflow:hidden` + flex column (satu scroll saja);
  `.detail-table-wrap` → `flex:1 1 auto; overflow:auto`; selector header dinaikkan ke
  `.global-modal-body .detail-table-wrap thead th` agar `z-index:3` benar-benar menang atas
  `table.data-table thead th` (baris 875, spesifisitas 0-1-3).
- `shell.js`: chip total + hitungan baris jujur; `MAXROWS`.
- `data.js`: `dropTotalRows()` + `sumBy()` + `rp()`; 8 cabang detail mengembalikan `total`.

**Verifikasi:** `verify.py` → `js=10, inline=78, css=2, json=18` · ALL STATIC CHECKS PASSED ·
runtime smoke 39 berkas HTML → **37 halaman pemuat `data.js` semuanya `err=0 / canon=Y / dbkeys=34`**,
`login.html` tanpa data (normal), `index.html` = meta-refresh ke `login.html` (normal) ·
sticky tabel biasa di luar modal juga terverifikasi (`laba-rugi`, `property_rekap-konstruksi` → `sticky=OK`) ·
bukti visual `docs/verification-2026-10-03/popup-scroll-sticky.png` (badge di dalam gambar
mencetak `used=320 | thead Δ=0 | tbody Δ=−320 | pos=sticky z=3 | LOCKED-OK`).

**Pelajaran pengukuran (dicatat agar tidak terulang):** untuk membuktikan `position:sticky`,
**wajib** memastikan tiga hal sekaligus — (a) elemen yang digulir benar-benar bergerak
(`used > 0`), (b) `thead` Δ ≈ 0, (c) `tbody` Δ ≈ −`used`. Hanya (a)+(b) tidak cukup: bila
pembungkus ikut tergulir, keduanya bisa terbaca "terkunci" padahal bukan. Screenshot saja juga
ambigu — dua baris identik di dataset bisa membuat hasil gulir tampak seperti posisi awal.


---

## 1. Executive Summary

Adhiland ERP Mockup V3 adalah mockup interaktif yang mensimulasikan alur kerja ERP
properti dengan 6 divisi (Direktur, Legal, Teknik, Marketing, Operasional, Finance).
Mockup dibangun dengan design token system yang disiplin, app shell berbasis CSS Grid,
data-driven rendering dari `canonical-data.json`, dan table enhancement layer yang
powerful.

**Skor keseluruhan: 7.0/10** (diturunkan dari 7.3 setelah audit mobile menemukan
issue kritis di breakpoint dan touch target).

**Kekuatan utama:** Design token system (9/10), Dashboard Direktur 16 widget (9/10),
app shell grid layout (8/10), table enhancement (8/10).

**Kelemahan utama:** Responsive design tidak konsisten — 5 breakpoint dengan 3 mekanisme
sidebar yang saling konflik, touch target di bawah standar 44px di hampir semua elemen
interaktif, gap navigasi tablet (1100-901px sidebar tidak dapat diakses), accessibility
gaps (no focus trap, no ARIA live region), konsistensi drawer pattern terpecah.

**Prioritas:** 3 P0 fix (rag-danger bug, focus trap, ARIA live region), 9 P1 fix
(breakpoint consolidation, touch target, vendor Chart.js, table sorting, drawer
unification, dashboard tabs, loading skeleton, data-driven heatmap, dynamic date),
13 P2 polish items.

---

## 2. Scorecard

| Dimensi | Skor | Status | Catatan |
|---------|------|--------|---------|
| Design system & tokens | 9/10 | Strong | Single source of truth, dark/light, FOUC prevention |
| Login & onboarding | 7/10 | Acceptable | Fungsional, minim loading state, no lupa password |
| App shell (sidebar/topbar) | 8/10 | Strong | Grid layout, collapsible, mobile overlay |
| Dashboard Direktur | 9/10 | Strong | 16 widget data-driven, 5 chart, theme-aware |
| Dashboard per-divisi | 5/10 | Needs work | Finance underdeveloped; Legal/Teknik hardcoded |
| Sub-menu pages | 7/10 | Acceptable | Workflow lengkap, drawer pattern tidak konsisten |
| Data tables | 8/10 | Strong | Enhanced toolbar powerful, duplicate pagination |
| Charts & visualization | 7/10 | Acceptable | Theme-aware, CDN dependency, no fallback |
| Responsive — desktop | 8/10 | Strong | Grid zones, KPI grid, breakpoint 1279px |
| Responsive — tablet | 4/10 | Critical | Dead zone 1100-901px, no tablet breakpoint |
| Responsive — mobile | 5/10 | Needs work | 3 conflicting sidebar mechanisms, touch targets |
| Accessibility | 5/10 | Needs work | Foundation ada, focus trap & live region hilang |
| Consistency | 6/10 | Needs work | Inline styles, rag-danger bug, alert() vs toast |
| **Overall** | **7.0/10** | | **Solid foundation, butuh responsive & a11y fix** |

---

## 3. Current State Assessment — UI/UX

### 3.1 Design System & Tokens

**Strengths:**
- `tokens.css` adalah single source of truth — aturan "NO #hex in app.css" ditegakkan.
- Dark & light theme lengkap: setiap token punya variant `:root[data-theme="dark"]`.
- FOUC prevention: inline script di `<head>` sebelum CSS load.
- Spacing scale 7-step (4/8/12/16/20/32/48px), typography scale 7-step (12-32px).
- Semantic colors: success/warning/danger/info + soft variants untuk RAG status.
- Project-specific color series — konsisten di chart dan bar.
- `font-variant-numeric: tabular-nums` untuk alignment angka.

**Issues:**
- Tidak ada token untuk z-index — nilai hardcoded di CSS (40, 30, 100, 101, 200, 300, 1000).
- `--sidebar-w-collapsed: 0px` — sidebar hilang total saat collapse, bukan icon-only rail.
- Dark theme `--text-on-primary: #0B1220` (dark text) — perlu verifikasi kontras.

### 3.2 Login Page

**Strengths:**
- Clean, minimal, centered card. Role selector 6 peran dengan auto-fill email.
- Enter key pada password trigger login. Theme toggle tersedia.
- `lang="id"` proper, `autocomplete` attributes pada input.

**Issues:**
- Password field `value="••••••••"` — hardcoded bullet, no show/hide toggle.
- No loading state pada tombol "Masuk" — click langsung redirect.
- No "lupa password" link.
- Theme toggle icon 17px — terlalu kecil untuk touch.
- `index.html` triple redirect (meta refresh + inline script + replace) — redundant.

### 3.3 App Shell — Sidebar & Topbar

**Strengths:**
- CSS Grid: `grid-template-columns: var(--sidebar-w) 1fr` dengan `grid-template-rows: var(--topbar-h) 1fr`.
- 100dvh untuk mobile dynamic viewport.
- Sidebar collapse dari dua tempat: topbar toggle + sidebar brand button. localStorage persistence.
- Nested navigation dengan tree expand/collapse — chevron rotation, `aria-expanded`.
- Badge counts data-driven dari `AdhData.PENGAJUAN`.
- Topbar: sidebar toggle, page title + context, global project picker, notification + count, theme toggle, user pill.
- Skip link untuk a11y. Custom scrollbar. `overscroll-behavior: contain`. Print styles.

**Issues:**
- Topbar date hardcoded: `shell.js` line 93 menulis `'03 Okt 2026'` sebagai literal.
- No breadcrumb — kedalaman navigasi tidak terlihat.
- Sidebar collapse di 1100px: `--sidebar-w-collapsed: 0px` artinya sidebar hilang total.
- Notification modal hanya 30 item pertama.
- Mobile sidebar overlay pakai `::after` pseudo-element — unusual, z-index risk.

### 3.4 Dashboard Direktur

**Strengths:**
- 16 widget fully data-driven dari `canonical-data.json`:
  Decision Center, KPI Strip (8 KPI + detail modal), Project Health Matrix,
  Funnel Kavling, Sales vs Cash Combo, Celah Tagih, Cash Bridge + Runway,
  Cash Quality, Budget Burn, Due Items, Pay vs Progress Scatter, Late ST,
  Legal Heatmap, AR Aging, AP Aging, Data Quality.
- Period & comparison controls yang re-render (`viewPeriod`, `compareMode`).
- Project picker synchronized globally.
- Chart colors read from CSS variables — theme-aware.
- Board Pack uses `window.print()` — honest.
- `requestAnimationFrame` for chart init. Theme change re-inits charts.
- `sr-only` caption pada project matrix.

**Issues:**
- 16 widget = very long page. No tab/accordion system.
- 8 KPI in 4-column grid — sempit di laptop 1366px.
- Chart.js from CDN — no local fallback.
- No loading skeleton — `.skeleton` class defined but unused.
- `detailConfig()` function truncated in shell.js.
- No `role="img"` + `aria-label` on canvas.

### 3.5 Dashboard per-Divisi

| Divisi | Komponen | Skor | Issue kunci |
|--------|---------|------|-------------|
| Finance | 4 KPI + teks + 3 link | 3/10 | Underdeveloped, hardcoded `#666`, no `global-bar`, no chart |
| Legal | global-bar + 4 KPI + table + heatmap + actions | 6/10 | Heatmap hardcoded 5 kavling, inline styles |
| Teknik | global-bar + 4 KPI + risk table + S-curve + table | 6/10 | S-curve hardcoded `[10,18,...]`, honest label |
| Marketing | global-bar + 4 KPI + deal table + stok table | 7/10 | Solid, data-driven |
| Operasional | global-bar + 4 KPI + pengajuan table | 5/10 | BUG: `rag-danger` class, anggaran good |

Cross-divisi inconsistency:
- Finance lacks `global-bar` — outlier.
- Legal & Teknik have hardcoded visuals.
- KPI grid columns vary: Direktur=4, Finance=4, others=4, Pengajuan=3, ArusKas=3, TataKelola=4.
- Footer note format varies.

### 3.6 Sub-menu Pages

| Page | Skor | Pattern | Issue |
|------|------|---------|-------|
| Pengajuan | 8/10 | Inline overlay | Best-in-class workflow, but inline overlay not `.drawer` |
| Siap Bayar | 7/10 | Inline overlay | Mass pay + CSV, same overlay pattern |
| Tata Kelola | 7/10 | Card | Budget vs Actual, cash forecast, audit log, 3 CSV |
| Neraca | 6/10 | Read-only | Honest, but no chart |
| Budgeting | 7/10 | Chart + table | Chart.js bar, per-jenis aggregation |
| Master Data | 7/10 | `.drawer` | Tab system, filter, pagination. BUG: `alert()` export |
| Sampah | 4/10 | Table | Hardcoded dummy rows, no interactivity |
| Arus Kas | 5/10 | Manual pagination + enhanced table | Duplicate pagination, `?.` optional chaining |
| Finance Review | 7/10 | Inline overlay | Limit-based approval, return drawer |
| Legal Dokumen | 8/10 | `.drawer` | Best drawer implementation, interactive heatmap |
| Teknik Progres | 7/10 | `.drawer` | Proper drawer, update progres, risk calculation |
| Marketing Stok | 5/10 | Table | Basic, no chart |
| Operasional Anggaran | 5/10 | Table | Basic, no chart |

### 3.7 Data Tables

**Strengths:** `enhanceTable()` adds search, pagination, column toggle, density toggle, currency mode.
Sticky headers. Tabular numerals. In-cell progress bars. CSV export. Project filtering. `wireMockButtons()`.

**Issues:**
- Duplicate pagination on `arus-kas.html`.
- No column sorting — significant gap for ERP.
- Column menu doesn't close on scroll.
- Money compact mode abbreviations could confuse.

### 3.8 Charts & Visualizations

**Strengths:** Chart.js 4.4.1, responsive, theme-aware via CSS variables, tooltip callbacks, `requestAnimationFrame`.

**Issues:**
- CDN dependency — no local fallback. Silent fail if offline.
- No chart loading state.
- No error handling if `typeof Chart === 'undefined'`.
- Tooltip formatting inconsistent.
- No `role="img"` + `aria-label` on canvas.
- Theme re-init causes brief flash.

### 3.9 Dark/Light Theme

**Strengths:** Comprehensive token coverage. Chart colors theme-aware. `aria-pressed` on toggle. `themechange` event. `color-scheme` set.

**Issues:**
- Sidebar is dark (`#0F1D3D`) in both themes — design choice.
- Dark theme contrast ratio needs verification.
- Theme switch causes chart flash — no transition.

---

## 4. Current State Assessment — Tablet & Mobile

### 4.1 Viewport Meta Tags

Semua 36 file HTML memiliki `<meta name="viewport" content="width=device-width, initial-scale=1">`.
Tidak ada `maximum-scale` atau `user-scalable=no` — baik, tidak melarang pinch zoom.

### 4.2 Breakpoint Analysis

Mockup memiliki **6 media query breakpoint** yang tumpang tindih dan saling konflik:

| # | Breakpoint | Efek | Masalah |
|---|-----------|------|--------|
| 1 | `1279px` | KPI 4→2 cols, decision 2 cols, zones → 1fr | OK, tapi KPI 2-col cramped di tablet portrait |
| 2 | `1180px` | Sidebar toggle text hidden | Minor |
| 3 | `1100px` | Sidebar → `--sidebar-w-collapsed: 0px` (hidden), labels hidden, nav centered | **CRITICAL**: Dead zone 1100-901px — sidebar hidden via `visibility: hidden` tapi mobile overlay belum aktif. Tidak ada akses navigasi |
| 4 | `900px` | Grid 1fr, sidebar → fixed overlay + `transform`, `::after` backdrop, project picker label hidden, modal footer stacks | Mobile behavior OK, tapi konflik dengan 767px |
| 5 | `767px` | Grid 1fr, sidebar fixed, `.sidebar.open` class to show | **DEAD CODE**: Uses `.sidebar.open` tapi shell.js pakai `.sidebar-collapsed`. Aturan ini tidak pernah trigger |
| 6 | `760px` | Grid 0 1fr, `app-shell:not(.sidebar-collapsed)` mechanism | **CONFLICT dengan 767px**: Mekanisme berbeda untuk show sidebar |

**Konflik utama:**
- 767px vs 760px: 7px beda, dua mekanisme berbeda. `767px` pakai `.sidebar.open` (dead code), `760px` pakai `app-shell:not(.sidebar-collapsed)`.
- 900px (V3 section) vs 760px (corporate section): Kedua aturan aktif di range 760-900px dengan selectivity berbeda.
- Hasil: perilaku sidebar tidak dapat diprediksi di range 760-900px.

### 4.3 Touch Target Audit

Standar: WCAG 2.2 SC 2.5.8 — minimum 44x44px untuk touch target.

| Elemen | CSS Height | Status | Fix |
|--------|-----------|--------|-----|
| `.btn-icon` | 36px | Below 44px | Tinggikan ke 40px min (44px ideal) |
| `.nav-item` | 40px | Below 44px | Tinggikan ke 44px |
| `.nav-child` | 34px min | Below 44px | Tinggikan ke 40px min |
| `.chip` | 28px | Below 44px | Tinggikan ke 36px pada mobile |
| `.btn-sm` | 28px | Below 44px | Tinggikan ke 36px pada mobile |
| `.kpi-info-btn` | 25x25px | Below 44px | Tinggikan ke 36x36px |
| `.role-btn` | 40px | Below 44px | Tinggikan ke 44px |
| `.sidebar-collapse-btn` | 30x30px | Below 44px | Tinggikan ke 40x40px |
| `.select-sm` | 32px | Below 44px | Tinggikan ke 40px pada mobile |
| `.table-search input` | 30px | Below 44px | Tinggikan ke 40px pada mobile |
| `.notification-count` | 16px | Below 44px | OK (badge, bukan primary target) |
| `.btn-lg` (login) | 44px | Meets | OK |
| `.btn` (default) | 36px | Below 44px | Tinggikan ke 40px min |

**Ringkasan:** 11 dari 13 elemen interaktif berada di bawah standar 44px. Hanya `btn-lg` yang memenuhi.

### 4.4 Tablet-specific Issues (768-1024px)

| Issue | Severity | Detail |
|-------|----------|--------|
| Dead zone navigasi 1100-901px | **Critical** | Sidebar `visibility: hidden` tapi mobile overlay belum aktif. User tidak dapat mengakses menu navigasi |
| KPI 2-col cramped di portrait | Medium | Dari 1279px ke bawah, KPI grid 2 cols. Pada 800px portrait, card sangat sempit |
| Table toolbar cramped | Medium | Search + controls dalam satu row. Pada 760-900px belum stack (baru stack di ≤760px) |
| Chart height fixed | Low | Chart container 260px tidak adaptif. OK di tablet, tapi bisa lebih fleksibel |
| Global bar chip overflow | Medium | Filter chips pada pengajuan (7 chip status + 6 chip role) bisa 3-4 baris di tablet |
| No tablet-specific layout | Medium | Tidak ada breakpoint untuk tablet portrait (768-1024px). Lompat dari desktop ke mobile tanpa transisi |
| Drawer takes 60%+ screen | Low | `width: min(560px, 100vw)` — pada tablet portrait 768px, drawer = 560px (73% layar) |

### 4.5 Mobile-specific Issues (320-767px)

| Issue | Severity | Detail |
|-------|----------|--------|
| 3 mekanisme sidebar konflik | **Critical** | 767px (`.sidebar.open` dead code), 760px (`app-shell:not(.sidebar-collapsed)`), 900px (same). Perilaku tidak dapat diprediksi |
| Touch target di bawah 44px | **High** | 11/13 elemen interaktif di bawah standar. Hampir mustahil digunakan dengan jari |
| 16-widget dashboard = scroll panjang | **High** | No tab system. User harus scroll sangat jauh. Bounce rate tinggi di mobile |
| Toast position bottom-right | Medium | `bottom: 24px; right: 24px; max-width: 320px` — pada 320px screen, toast mengisi 82% lebar |
| No safe-area insets | Medium | Tidak ada `env(safe-area-inset-*)` untuk iPhone notch/home indicator. Konten tertutuk notch |
| No bottom navigation | Medium | ERP mobile biasanya pakai bottom nav untuk primary sections. Hanya hamburger sidebar |
| No swipe-to-close sidebar/drawer | Low | Hanya tap backdrop atau Escape. No gesture support |
| No `touch-action` declarations | Low | Bisa bantu gesture handling, prevent double-tap zoom |
| `100dvh` no fallback | Low | Browser lama tidak support `dvh`. Perlu `vh` fallback |
| Table horizontal scroll | Acceptable | `min-width: 760px` forces scroll. OK untuk ERP, tapi no scroll hint/indicator |
| Login card OK | Good | `max-width: 400px` fits well. Role grid 2x3 OK |
| Global modal OK | Good | `width: min(1100px, 96vw)` full width mobile. `max-height: 90vh` at ≤900px |
| Topbar cramped at ≤760px | Medium | `padding: 0 12px`. User role hidden. Project picker label hidden. Icons cramped |
| Table toolbar stacks at ≤760px | Good | `table-tools-left` dan `table-tools-right` stack vertically |
| Chart canvas no a11y | High | Screen readers skip charts entirely — no `role="img"` or `aria-label` |
| No chart resize on orientation change | Low | Charts resize on theme change tapi tidak on `orientationchange` |
| `confirm()` native dialog | Medium | `pengajuan.html` dan `siap-bayar.html` pakai `confirm()` — tidak mobile-friendly |
| Inline reject overlay no focus management | High | `pengajuan.html` reject overlay: `display:none` → `display:flex`. No focus trap, no focus management |

### 4.6 Mobile Responsive — Component Detail

**Login page (mobile):**
- Card max-width 400px — fits well.
- Role grid 2x3 — acceptable on 360px.
- Form input height 40px — below 44px.
- Login button 44px (`btn-lg`) — meets target.
- Theme toggle 17px — too small for touch.
- No `inputmode="email"` on email field.

**Dashboard Direktur (mobile):**
- 16 widgets in vertical stack — extremely long scroll.
- KPI grid → 1 col at 767px — good, but 8 KPI cards in one column = very long.
- Chart containers 260px fixed — reasonable for mobile width.
- Global bar filter chips wrap to multiple rows — takes too much vertical space.
- Decision grid → 1 col — OK.
- Zones → 1 col — OK.

**Pengajuan page (mobile):**
- Global bar with 7 status chips + 6 role chips = 13 chips — wraps to 4-5 rows on 360px.
- KPI grid 3 cols → stays 3 cols (inline style overrides) — cramped on mobile.
- Table with 10 columns — horizontal scroll required.
- Reject overlay `min(420px, 92vw)` — OK on mobile.
- `confirm()` native dialog — not styled.

**Table toolbar (mobile):**
- Stacks at ≤760px — good.
- Search input `min-width: 180px; flex: 1` — good.
- Column toggle menu `position: absolute; right: 10px; top: 48px` — could overflow on mobile.
- Pagination buttons 28px (`btn-sm`) — below 44px.

---

## 5. Confirmed Bug Register

| ID | File | Line(s) | Bug | Severity | Category |
|----|------|---------|-----|----------|----------|
| B1 | `Operasional/index.html` | 57 | `rag-danger` class doesn't exist — CSS defines `rag-bad`. "Ditolak" badge unstyled | **High** | CSS |
| B2 | `Finance/index.html` | 62 | `var(--text-muted, #666)` — hardcoded hex fallback violates no-hex rule | Medium | Token |
| B3 | `Direktur/arus-kas.html` | 53-63 | Manual pagination + enhanced table toolbar = duplicate controls | Medium | UX |
| B4 | `Direktur/master.html` | 329 | `alert()` for export — inconsistent with toast pattern | Low | UX |
| B5 | `Direktur/sampah.html` | 21-22 | Hardcoded dummy rows `for (var i=1;i<=10;i++)` — not data-driven | Low | Data |
| B6 | `shell.js` | 93 | Topbar date hardcoded `'03 Okt 2026'` — not dynamic | Low | Data |
| B7 | `shell.js` | 99 | `detailConfig()` function truncated mid-array for `notifications` column config | Medium | Code |
| B8 | `Legal/index.html` | 90-101 | Heatmap hardcoded 5 kavlings with inline color arrays | Medium | Data |
| B9 | `Teknik/index.html` | 122-128 | S-curve hardcoded `[10,18,28,35,42,48,55,58,62,65,68,70]` | Low | Data |
| B10 | CSS | 867-889 | Breakpoint overlap: 767px & 760px use conflicting sidebar mechanisms | **Critical** | Responsive |
| B11 | CSS | 867-875 | Breakpoint 1100px hides sidebar but mobile overlay not active until 900px — dead zone | **Critical** | Responsive |
| B12 | CSS | 627-640 | `@media 767px` uses `.sidebar.open` class — dead code, shell.js uses `.sidebar-collapsed` | **High** | Responsive |
| B13 | `pengajuan.html` | 197 | Inline-styled overlay instead of `.drawer-overlay` + `.drawer` component | Medium | Consistency |
| B14 | `pengajuan.html` | 241 | `confirm()` for mass approve — not styled, not mobile-friendly | Medium | UX |
| B15 | `shell.js` | 122 | `window.innerWidth<=900` auto-close — only triggers at ≤900px, not tablet range | Medium | Responsive |
| B16 | `dashboard.js` | — | No chart resize on `orientationchange` event | Low | Responsive |
| B17 | CSS | — | No `env(safe-area-inset-*)` for iPhone notch/home indicator | Medium | Mobile |
| B18 | CSS | — | 11/13 interactive elements below 44px touch target minimum | **High** | Mobile/a11y |
| B19 | CSS | — | No `touch-action` declarations for better touch handling | Low | Mobile |
| B20 | CSS | 928 | `100dvh` used without `vh` fallback for older browsers | Low | Compatibility |

---

## 6. Product Requirements (PRD)

### 6.1 Functional Requirements

| ID | Requirement | Priority | Current State |
|----|------------|----------|---------------|
| FR-01 | Login dengan role selector (6 peran) | Met | Implemented |
| FR-02 | App shell dengan sidebar + topbar | Met | Implemented |
| FR-03 | Collapsible sidebar dengan localStorage | Met | Implemented (collapse = 0px, need icon rail) |
| FR-04 | Nested tree navigation dengan badge | Met | Implemented |
| FR-05 | Dashboard Direktur 16 widget | Met | Implemented (need tabs) |
| FR-06 | Per-divisi dashboard (6 divisi) | Partial | Finance underdeveloped |
| FR-07 | Pengajuan workflow (approve/reject/bulk) | Met | Implemented |
| FR-08 | Finance review with limit-based approval | Met | Implemented |
| FR-09 | Siap bayar with mass pay + CSV | Met | Implemented |
| FR-10 | Tata kelola (budget vs actual, cash forecast, audit log) | Met | Implemented |
| FR-11 | Neraca (read-only) | Partial | No chart |
| FR-12 | Budgeting with chart | Met | Implemented |
| FR-13 | Master data (COA, Vendor, Project, User) | Met | Implemented |
| FR-14 | Legal matriks dokumen + heatmap | Partial | Heatmap hardcoded |
| FR-15 | Teknik progres konstruksi | Met | Implemented |
| FR-16 | Marketing stok & penjualan | Partial | No chart |
| FR-17 | Table enhanced (search, pagination, column toggle, density, currency) | Partial | No column sorting |
| FR-18 | Dark/light theme | Met | Implemented |
| FR-19 | Global project picker | Met | Implemented |
| FR-20 | Notification system | Partial | Only 30 items, no live region |

### 6.2 Non-Functional Requirements

| ID | Requirement | Target | Current |
|----|------------|--------|---------|
| NFR-01 | Responsive — desktop (≥1280px) | Full grid layout | Met |
| NFR-02 | Responsive — tablet landscape (1024-1279px) | KPI 2-4 cols, zones stack | Partial — KPI 2 cols cramped |
| NFR-03 | Responsive — tablet portrait (768-1023px) | Adaptive layout, sidebar accessible | **Not met** — dead zone 1100-901px |
| NFR-04 | Responsive — mobile (320-767px) | Single column, overlay sidebar, stacked controls | Partial — 3 conflicting mechanisms |
| NFR-05 | Touch target minimum | 44x44px (WCAG 2.2 SC 2.5.8) | **Not met** — 11/13 below 44px |
| NFR-06 | Safe-area insets | `env(safe-area-inset-*)` on body/topbar | **Not met** |
| NFR-07 | Loading state | Skeleton during data load | **Not met** — `.skeleton` unused |
| NFR-08 | Chart fallback | Local Chart.js vendor + error message | **Not met** — CDN only |
| NFR-09 | Focus trap in modals/drawers | Focus stays within dialog | **Not met** |
| NFR-10 | ARIA live region for toasts | `role="status"` or `aria-live="polite"` | **Not met** |
| NFR-11 | Chart accessibility | `role="img"` + `aria-label` on canvas | **Not met** |
| NFR-12 | Breakpoint count | ≤4 well-defined breakpoints | **Not met** — 6 overlapping |
| NFR-13 | Z-index token system | `--z-*` tokens | **Not met** — hardcoded values |

---

## 7. Design System Requirements

### 7.1 Token System (existing — keep)

| Category | Tokens | Status |
|----------|--------|--------|
| Colors (surface/text/brand/semantic/project/viz/heatmap) | 40+ tokens | Complete |
| Typography (7-step + 2 line-height) | 9 tokens | Complete |
| Spacing (7-step) | 7 tokens | Complete |
| Shape (3-step radius) | 3 tokens | Complete |
| Shadow (3-level) | 3 tokens | Complete |
| Layout (`--sidebar-w`, `--topbar-h`, `--row-h`) | 5 tokens | Complete |
| Motion (2 duration + 1 easing) | 3 tokens | Complete |

### 7.2 Token System (to add)

| Token | Value | Purpose |
|-------|-------|---------|
| `--z-base` | 1 | Default stacking |
| `--z-sticky` | 10 | Sticky elements |
| `--z-sidebar` | 40 | Sidebar |
| `--z-topbar` | 30 | Topbar |
| `--z-drawer-overlay` | 100 | Drawer backdrop |
| `--z-drawer` | 101 | Drawer panel |
| `--z-toast` | 200 | Toast container |
| `--z-modal-overlay` | 300 | Modal backdrop |
| `--z-modal` | 301 | Modal panel |
| `--z-mobile-sidebar` | 80 | Mobile sidebar overlay |
| `--sidebar-w-collapsed` | 64px (change from 0px) | Icon-only rail |
| `--touch-target-min` | 44px | WCAG touch target minimum |
| `--safe-top` | `env(safe-area-inset-top, 0px)` | iPhone notch |
| `--safe-bottom` | `env(safe-area-inset-bottom, 0px)` | iPhone home indicator |

### 7.3 Component Consistency Requirements

| Component | Current State | Target State |
|-----------|---------------|-------------|
| Drawer (reject, return, edit) | 3 patterns: proper `.drawer`, inline overlay, inline card | Unified: `.drawer-overlay` + `.drawer` everywhere |
| Toast feedback | `showToast()` + `alert()` + `confirm()` | Unified: `showToast()` + styled modal for confirms |
| KPI grid | 3-col, 4-col variants | Default 4-col, responsive auto-collapse |
| Table pagination | Enhanced + manual duplicate | Enhanced only, remove manual |
| Data sourcing | Mix of data-driven + hardcoded | All data from `AdhData` / JSON |

---

## 8. Responsive Design Specification

### 8.1 Proposed Breakpoint System (consolidated from 6 → 4)

| Name | Breakpoint | Target Device | Behavior |
|------|-----------|---------------|----------|
| **Desktop** | ≥1280px | Desktop, large tablet landscape | Full sidebar (248px), 4-col KPI, multi-col zones |
| **Tablet** | 768-1279px | Tablet, small laptop | Icon-rail sidebar (64px) or overlay, 2-col KPI, zones stack |
| **Mobile L** | 481-767px | Large phone, small tablet portrait | Overlay sidebar, 2-col KPI, zones 1-col |
| **Mobile S** | ≤480px | Phone | Overlay sidebar, 1-col KPI, stacked toolbar, safe-area insets |

### 8.2 Breakpoint Migration Plan

**Remove:**
- `@media (max-width: 767px)` — dead code, `.sidebar.open` never triggers
- `@media (max-width: 760px)` — merge into Mobile L
- `@media (max-width: 1100px)` — replace with Tablet breakpoint + icon rail

**Modify:**
- `@media (max-width: 1279px)` → keep, rename to Tablet range
- `@media (max-width: 900px)` → keep, rename to Mobile L range

**Add:**
- `@media (max-width: 480px)` → Mobile S: safe-area, 1-col everything, toast full-width

### 8.3 Sidebar Behavior Spec

| Viewport | Default State | Toggle Mechanism | Backdrop |
|----------|--------------|-----------------|----------|
| Desktop (≥1280px) | Expanded (248px) | Collapse to icon-rail (64px) | None |
| Tablet (768-1279px) | Icon-rail (64px) | Expand to 248px overlay or toggle to hidden | Optional backdrop |
| Mobile L (481-767px) | Hidden | Hamburger → overlay (248px) | `::after` backdrop |
| Mobile S (≤480px) | Hidden | Hamburger → overlay (248px) | `::after` backdrop + safe-area |

### 8.4 Touch Target Spec

| Element | Desktop | Mobile | Method |
|---------|---------|--------|--------|
| `.btn-icon` | 36px | 44px | `@media` override |
| `.btn` | 36px | 40px | `@media` override |
| `.btn-sm` | 28px | 36px | `@media` override |
| `.nav-item` | 40px | 44px | `@media` override |
| `.nav-child` | 34px | 40px | `@media` override |
| `.chip` | 28px | 36px | `@media` override |
| `.select-sm` | 32px | 40px | `@media` override |
| `.role-btn` | 40px | 44px | Direct change |
| `.sidebar-collapse-btn` | 30px | 40px | `@media` override |
| `.kpi-info-btn` | 25px | 36px | `@media` override |
| `.table-search input` | 30px | 40px | `@media` override |

### 8.5 Safe Area Spec

```css
.topbar { padding-top: var(--safe-top); }
.main { padding-bottom: calc(var(--sp-5) + var(--safe-bottom)); }
.toast-host { bottom: calc(24px + var(--safe-bottom)); }
.sidebar { padding-bottom: var(--safe-bottom); }
```

---

## 9. Accessibility Requirements

### 9.1 Current State (foundation exists)

- Skip link to `#main` — done
- ARIA roles: `navigation`, `banner`, `main`, `dialog`, `aria-modal` — done
- `aria-expanded` on tree nav + sidebar toggle — done
- `sr-only` class — done
- `focus-visible` outlines — done
- `prefers-reduced-motion` — done
- `aria-hidden="true"` on decorative SVG — done
- Escape key closes modals — done

### 9.2 Required (gaps)

| ID | Requirement | WCAG SC | Priority |
|----|------------|---------|----------|
| A11Y-01 | Focus trap in modals/drawers | 2.4.3 Focus Order | P0 |
| A11Y-02 | Focus management: focus moves to drawer/modal on open | 2.4.3 Focus Order | P0 |
| A11Y-03 | ARIA live region for toast container | 4.1.3 Status Messages | P0 |
| A11Y-04 | `role="img"` + `aria-label` on all chart canvases | 1.1.1 Non-text Content | P1 |
| A11Y-05 | `aria-required` on required form inputs | 3.3.2 Labels or Instructions | P1 |
| A11Y-06 | `aria-invalid` on invalid form inputs | 3.3.1 Error Identification | P1 |
| A11Y-07 | Heatmap cells: text alternative (not color + icon only) | 1.4.1 Use of Color | P1 |
| A11Y-08 | Touch target minimum 44x44px | 2.5.8 Target Size (Minimum) | P1 |
| A11Y-09 | `inputmode="email"` on email field | 1.3.5 Identify Input Purpose | P2 |
| A11Y-10 | `autocomplete` on all form fields | 1.3.5 Identify Input Purpose | P2 |
| A11Y-11 | Breadcrumb navigation with `aria-label` | 2.4.8 Location | P2 |
| A11Y-12 | Page `title` unique per page | 2.4.2 Page Titled | P2 (partially met) |

---

## 10. Task Breakdown

### Phase 0 — Critical Bug Fixes (P0)

| Task ID | Title | Files | Effort | Acceptance Criteria | Dependencies |
|---------|------|-------|--------|---------------------|-------------|
| T0-01 | Fix `rag-danger` → `rag-bad` | `Operasional/index.html:57` | 5 min | "Ditolak" badge renders with danger styling. Grep finds 0 instances of `rag-danger` | None |
| T0-02 | Implement focus trap | `assets/js/shell.js`, `assets/css/app.css` | 2h | Tab/Shift+Tab stays within open modal/drawer. Focus moves to drawer on open, returns to trigger on close | None |
| T0-03 | Add ARIA live region for toasts | `assets/js/shell.js`, `assets/css/app.css` | 30 min | Toast container has `role="status"` + `aria-live="polite"`. Screen reader announces toast | None |
| T0-04 | Remove dead 767px breakpoint | `assets/css/app.css` | 15 min | `@media (max-width: 767px)` removed. No `.sidebar.open` references | T0-05 |
| T0-05 | Consolidate breakpoints (6→4) | `assets/css/app.css` | 2h | Only 4 breakpoints remain: Desktop, Tablet(768-1279), Mobile L(481-767), Mobile S(≤480). No conflicts between adjacent breakpoints | None |
| T0-06 | Fix tablet dead zone (1100-901px) | `assets/css/app.css` | 1h | Sidebar accessible at all widths ≥768px. No gap where sidebar is hidden without overlay alternative | T0-05 |

### Phase 1 — Responsive & Mobile (P1)

| Task ID | Title | Files | Effort | Acceptance Criteria | Dependencies |
|---------|------|-------|--------|---------------------|-------------|
| T1-01 | Add z-index tokens | `assets/css/tokens.css` | 30 min | `--z-*` tokens defined. All hardcoded z-index values replaced with tokens | None |
| T1-02 | Change `--sidebar-w-collapsed` to 64px (icon rail) | `assets/css/tokens.css`, `app.css` | 2h | Collapsed sidebar shows icon-only rail (64px). Nav items show icons, hover reveals label tooltip | T0-05 |
| T1-03 | Touch target minimum (mobile media query) | `assets/css/app.css` | 2h | All interactive elements ≥44px at ≤767px. All interactive elements ≥40px at 768-1279px | T0-05 |
| T1-04 | Add safe-area insets | `assets/css/app.css`, `tokens.css` | 30 min | `env(safe-area-inset-*)` applied to topbar, main, toast, sidebar. iPhone notch/home indicator doesn't cover content | None |
| T1-05 | Add `100dvh` fallback | `assets/css/app.css` | 15 min | `height: 100vh; height: 100dvh;` pattern used. Older browsers fall back to `vh` | None |
| T1-06 | Add `touch-action` declarations | `assets/css/app.css` | 30 min | `touch-action: manipulation` on buttons, links. `touch-action: pan-y` on table-wrap | None |
| T1-07 | Mobile toast repositioning | `assets/css/app.css` | 30 min | Toast full-width at ≤480px. Positioned above safe-area bottom. `max-width: calc(100vw - 32px)` | T1-04 |
| T1-08 | Chart resize on orientation change | `assets/js/dashboard.js` | 30 min | Charts resize on `orientationchange` event. No chart clipping after rotation | None |
| T1-09 | Replace `confirm()` with styled modal | `Direktur/pengajuan.html`, `siap-bayar.html` | 1h | Mass approve/pay uses styled modal, not native `confirm()`. Modal has cancel + confirm buttons | T0-02 |
| T1-10 | Replace inline overlay with `.drawer` component | `pengajuan.html`, `siap-bayar.html`, `Finance/review.html` | 2h | All reject/return drawers use `.drawer-overlay` + `.drawer` component. No inline-styled overlays | None |
| T1-11 | Add `inputmode` to login form | `login.html` | 5 min | Email field has `inputmode="email"`. Password field has `inputmode="current-password"` or equivalent | None |
| T1-12 | Add `vh` fallback pattern | `assets/css/app.css` | 15 min | All `dvh`/`svh`/`lvh` units have `vh` fallback on preceding line | None |

### Phase 2 — Data & Chart (P1)

| Task ID | Title | Files | Effort | Acceptance Criteria | Dependencies |
|---------|------|-------|--------|---------------------|-------------|
| T2-01 | Vendor Chart.js locally | `assets/js/vendor/chart.umd.min.js`, all HTML with chart | 30 min | Chart.js loaded from local path. CDN script tag removed. Fallback: if local fails, show error message in canvas | None |
| T2-02 | Add table column sorting | `assets/js/shell.js` (`enhanceTable`) | 3h | Click table header to sort ascending/descending. `aria-sort` attribute on th. Visual indicator (arrow) on sorted column | None |
| T2-03 | Fix duplicate pagination on arus-kas | `Direktur/arus-kas.html` | 30 min | Only one pagination control. Enhanced table toolbar handles pagination. Manual prev/next buttons removed | None |
| T2-04 | Replace `alert()` with toast in master.html | `Direktur/master.html` | 15 min | Export button shows toast notification. No `alert()` calls remain | None |
| T2-05 | Remove hardcoded hex from Finance/index.html | `Finance/index.html:62` | 5 min | `var(--text-muted)` without `#666` fallback. Grep finds 0 hex values outside tokens.css | None |
| T2-06 | Add loading skeleton to dashboard | `assets/js/dashboard.js`, `app.css` | 1h | `.skeleton` class used during `AdhData.load()`. Skeleton shows shimmer animation. Replaced by content when data arrives | None |
| T2-07 | Make Legal heatmap data-driven | `Legal/index.html` | 2h | Heatmap reads from `legal.json`. No hardcoded kavling arrays. All 5+ kavlings rendered from data | None |
| T2-08 | Make Teknik S-curve data-driven | `Teknik/index.html` | 1h | S-curve data from time-series JSON. If no data, show honest empty state, not hardcoded values | None |
| T2-09 | Fix topbar date dynamic | `assets/js/shell.js:93` | 15 min | Topbar date reads from `AdhData.AS_OF` via `fmt.date()`. No hardcoded string | None |
| T2-10 | Complete `detailConfig()` function | `assets/js/shell.js:99` | 30 min | `notifications` column config completed. All detail types have full column arrays | None |
| T2-11 | Replace sampah hardcoded rows | `Direktur/sampah.html` | 30 min | Rows from data source or show empty state. No `for (var i=1;i<=10;i++)` dummy loop | None |
| T2-12 | Add `role="img"` + `aria-label` to charts | `assets/js/dashboard.js`, all chart canvases | 30 min | Every `<canvas>` has `role="img"` and descriptive `aria-label`. Fallback text between tags | None |
| T2-13 | Add `aria-required` to required inputs | All form fields | 30 min | Required fields have `aria-required="true"`. Invalid fields have `aria-invalid="true"` | None |

### Phase 3 — UX Polish (P1-P2)

| Task ID | Title | Files | Effort | Acceptance Criteria | Dependencies |
|---------|------|-------|--------|---------------------|-------------|
| T3-01 | Group dashboard widgets into tabs | `assets/js/dashboard.js`, `app.css` | 3h | 4 tabs: "Overview", "Cash & Budget", "Sales & Property", "Risk & DQ". Only active tab visible. URL hash for deep-link | None |
| T3-02 | Add breadcrumb to topbar | `assets/js/shell.js`, `app.css` | 1h | Breadcrumb shows: Divisi > Page. `aria-label="breadcrumb"`. Last item = `aria-current="page"` | None |
| T3-03 | Upgrade Finance dashboard | `Finance/index.html` | 2h | Add `global-bar`, add chart (cash position), add table (review queue), remove inline styles | T2-05 |
| T3-04 | Add Neraca chart | `Direktur/neraca.html` | 1h | Balance bar visualization (assets vs liabilities). `role="img"` + `aria-label` | T2-01 |
| T3-05 | Add Marketing funnel chart | `Marketing/stok.html` | 1h | Funnel chart from `D.STOK.funnel` data. `role="img"` + `aria-label` | T2-01 |
| T3-06 | Standardize KPI grid | All dashboard pages | 30 min | Default `grid-template-columns: repeat(4, 1fr)` everywhere. Override only when truly needed | None |
| T3-07 | Add password show/hide toggle | `login.html` | 30 min | Eye icon button in password field. Toggles `type="password"` ↔ `type="text"`. `aria-label` updates | None |
| T3-08 | Add login loading state | `login.html` | 30 min | Button shows spinner + disabled state on click. 500ms delay before redirect (mock). | None |
| T3-09 | Add "lupa password" link | `login.html` | 15 min | Link below login button. Shows toast "Hubungi admin" (mock) | None |
| T3-10 | Extract inline styles to CSS classes | Multiple files | 2h | Inline `style=""` attributes moved to CSS classes in `app.css`. Maintenance burden reduced | None |
| T3-11 | Add theme transition (prevent chart flash) | `assets/css/app.css`, `dashboard.js` | 1h | Theme switch fades chart container opacity. No jarring flash | None |
| T3-12 | Add orientation change handling | `assets/js/dashboard.js` | 30 min | `window.addEventListener('orientationchange', ...)` triggers chart resize | None |

### Phase 4 — Mobile Enhancement (P2)

| Task ID | Title | Files | Effort | Acceptance Criteria | Dependencies |
|---------|------|-------|--------|---------------------|-------------|
| T4-01 | Add bottom navigation for mobile | `assets/js/shell.js`, `app.css` | 3h | Bottom nav bar at ≤767px with 4-5 primary sections. `role="navigation"`. Safe-area aware | T0-05, T1-04 |
| T4-02 | Add swipe-to-close for sidebar/drawer | `assets/js/shell.js` | 2h | Swipe right-to-left closes sidebar. Swipe left-to-right on drawer closes drawer. Touch events with `passive: true` | T1-06 |
| T4-03 | Add table scroll indicator | `assets/css/app.css` | 30 min | Shadow/gradient on right edge when table is scrollable. Disappears when at end | None |
| T4-04 | Add pull-to-refresh (mobile) | `assets/js/shell.js` | 2h | Pull down on main content triggers `AdhData.load()` + re-render. Shows loading state | None |
| T4-05 | Add sticky table action bar (mobile) | `assets/css/app.css`, `shell.js` | 2h | When rows selected, sticky bottom bar appears with bulk action buttons | None |
| T4-06 | Add chart height responsive scaling | `assets/css/app.css` | 30 min | Chart container height scales: 260px desktop, 200px tablet, 180px mobile | None |

### Phase 5 — Consistency & Polish (P2)

| Task ID | Title | Files | Effort | Acceptance Criteria | Dependencies |
|---------|------|-------|--------|---------------------|-------------|
| T5-01 | Standardize footer note format | All pages | 30 min | Consistent format: `Sumber: [file].json · [note]` | None |
| T5-02 | Replace `?.` optional chaining with `&&` guard | `Direktur/arus-kas.html` | 15 min | No `?.` usage. Consistent with rest of codebase | None |
| T5-03 | Add `data-sortable` attribute UX | `assets/js/shell.js`, `app.css` | 1h | Sortable headers show hover state. Click cycles: none → asc → desc → none. `aria-sort` updates | T2-02 |
| T5-04 | Add empty state component | `assets/css/app.css` | 30 min | `.empty-state` component used everywhere data is empty. Consistent icon + title + sub | None |
| T5-05 | Add print page setup | `assets/css/app.css` | 30 min | `@page { size: A4; margin: 1cm }`. Print-specific font sizes. Table print layout | None |
| T5-06 | Consolidate notification limit | `assets/js/shell.js` | 30 min | Notification modal shows all items (paginated). Or shows "X dari Y" with load more | None |
| T5-07 | Add `prefers-color-scheme` auto-detect | `assets/js/theme.js` | 30 min | On first visit (no localStorage), theme follows OS preference | None |
| T5-08 | Add `manifest.json` for PWA | `manifest.json`, all HTML | 1h | Manifest with name, icons, theme_color, display: standalone. Basic PWA installability | None |

---

## 11. Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Breakpoint consolidation breaks existing layout | Medium | High | Test on real devices at each breakpoint after changes. Screenshot regression |
| Icon-rail sidebar (64px) may not fit all icons | Low | Medium | Test with longest nav labels. Tooltip on hover for hidden labels |
| Chart.js local vendor increases bundle size | Low | Low | ~200KB minified. Acceptable for ERP. Gzip enabled |
| Focus trap library adds dependency | Medium | Medium | Implement custom trap (20 lines JS). No library needed |
| Bottom navigation confuses ERP users | Low | Medium | User testing. Only show on mobile, hide on desktop |
| Touch target increase breaks visual density | Medium | Medium | Apply only on mobile breakpoint. Desktop keeps compact density |
| Safe-area insets not supported on older Android | Low | Low | `env()` with fallback `0px`. Graceful degradation |
| Data-driven heatmap may be slower | Low | Low | Client-side rendering from JSON is fast for <100 cells |

---

## 12. Architecture Reference

### 12.1 Current Architecture

```
LOGIN PAGE
  │  Role selector → route to divisi dashboard
  ▼
APP SHELL (shell.js)
  ├── SIDEBAR (nav tree, badges, collapse)
  ├── TOPBAR (toggle, title, project picker, notifications, theme, user)
  └── MAIN (scrollable)
       └── PAGE CONTENT (per-page: KPIs / Tables / Charts / Drawers)

Data flow:
  canonical-data.json → AdhData.load() → AdhShell.mount() → page content
                                       → enhanceTables() → toolbar, search, pagination
                                       → filterTablesByProject() → project scope
                                       → wireMockButtons() → toast feedback

State layers:
  localStorage: theme, sidebar collapsed, last role
  sessionStorage: pengajuan overrides, legal status, progres overrides, audit log, paid markers
```

### 12.2 Proposed Architecture Changes

1. **Z-index token system** — replace all hardcoded z-index with tokens
2. **Responsive utility classes** — `mobile-only`, `tablet-up`, `desktop-only`
3. **Bottom navigation component** — `role="navigation"` for mobile
4. **Chart vendor** — local `assets/js/vendor/chart.umd.min.js`
5. **Focus trap utility** — `shell.js` function, no library
6. **Sort utility** — `enhanceTable()` extension
7. **Skeleton loading** — `app.css` `.skeleton` activation
8. **Safe-area utilities** — `tokens.css` + `app.css` application

---

## 13. Conclusion

Adhiland ERP Mockup V3 memiliki **fondasi arsitektur yang sangat solid** — design token
system yang disiplin, app shell berbasis CSS Grid yang proper, data-driven approach yang
jujur, table enhancement layer yang powerful, dan Dashboard Direktur 16 widget yang
impressive sebagai centerpiece.

Namun, audit khusus tablet & mobile mengungkap **masalah kritis** yang tidak terlihat
pada evaluasi desktop-only:

1. **Dead zone tablet (1100-901px)** — sidebar tersembunyi tanpa alternatif navigasi
2. **3 mekanisme sidebar konflik** di mobile (767px dead code, 760px, 900px)
3. **11/13 elemen interaktif di bawah standar 44px touch target**
4. **Tidak ada safe-area insets** untuk iPhone notch/home indicator
5. **16-widget dashboard tanpa tab system** — scroll sangat panjang di mobile

Setelah Phase 0 (critical fixes) dan Phase 1 (responsive & mobile) dieksekusi, mockup
ini akan memiliki foundation yang solid untuk production. Total effort estimate:

| Phase | Tasks | Effort | Priority |
|-------|-------|--------|----------|
| Phase 0 — Critical Bugs | 6 tasks | ~6h | P0 |
| Phase 1 — Responsive & Mobile | 12 tasks | ~12h | P1 |
| Phase 2 — Data & Chart | 13 tasks | ~11h | P1 |
| Phase 3 — UX Polish | 12 tasks | ~13h | P1-P2 |
| Phase 4 — Mobile Enhancement | 6 tasks | ~10h | P2 |
| Phase 5 — Consistency & Polish | 8 tasks | ~4h | P2 |
| **Total** | **57 tasks** | **~56h** | |

Urutan eksekusi yang disarankan:
1. T0-01 (rag-danger fix) — 5 menit, immediate
2. T0-04 + T0-05 + T0-06 (breakpoint consolidation) — foundation untuk semua responsive
3. T0-02 + T0-03 (focus trap + ARIA live region) — a11y foundation
4. T1-03 (touch target) — setelah breakpoint konsolidasi
5. T1-02 (icon-rail sidebar) — setelah breakpoint + touch target
6. T2-01 (vendor Chart.js) — eliminasi CDN risk
7. T2-02 (table sorting) — fitur ERP esensial
8. T3-01 (dashboard tabs) — UX mobile improvement terbesar
9. Sisanya mengikuti prioritas P1 → P2
