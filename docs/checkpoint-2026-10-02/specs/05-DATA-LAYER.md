# Data Layer

## Entry point
- `assets/js/data.js` → singleton `AdhData`
- Wajib: `await AdhData.load()` di setiap halaman yang menampilkan KPI/list dinamis

## API helper penting
- `AdhData.getKavling(id)`
- `AdhData.filterPengajuan({ role, status })`
- `AdhData.cashImpact(ids[])`
- `AdhData.paginate(rows, page, size)`
- `AdhData.loadReport('coa'|'vendors'|'users'|'jurnal'|...)`

## File JSON (`assets/data/`)
| File | Fungsi |
|------|--------|
| aggregate.json | KPI dashboard, PROJECTS, STOK, LEGAL, BUDGET, DECISIONS |
| kavling.json | 106 kavling |
| pengajuan.json | 88 pengajuan |
| legal.json | status dokumen |
| coa.json | 579 akun |
| vendors.json | 275 rekening |
| users.json | 9 user |
| budgeting_item.json | item anggaran |
| jurnal.json, kas_mutasi.json, buku_besar.json | laporan (sample/paginated) |

## Konsistensi angka (sumber kebenaran)
- Kas ~ 75,31 jt · PPJB ~ 103,94 M · Funnel 43/47/13/3
- Pengajuan menunggu 80 · Legal 9/448 · CoA 579

## Setelah ubah CSV sumber
Regenerasi JSON; jangan edit angka di HTML.

## Shell
- `assets/js/shell.js` — NAV per role, badge `pengajuan` dinamis, topbar role
