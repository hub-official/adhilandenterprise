# Sidebar Menu & Matriks BREAD

Legenda: **B** Browse · **R** Read · **E** Edit/Update · **A** Add/Create · **D** Delete  
`●` wajib fase berikutnya · `○` boleh defer · `✗` jangan (over-fitur)

---

## Direktur — sidebar

| Menu | File | B | R | E | A | D | Catatan UI |
|------|------|---|---|---|---|---|------------|
| Dashboard | index.html | — | ● | ✗ | ✗ | ✗ | Compact executive |
| Persetujuan | pengajuan.html | ● | ● | ● approve | ✗ | ✗ | Filter status/role; impact kas |
| Budgeting | budgeting.html | ● | ● | ○ | ○ | ✗ | List item + jatuh tempo |
| Kavling | kavling.html | ● | ● detail | ✗ | ✗ | ✗ | Funnel filter |
| Detail kavling | detail.html?id= | — | ● | ✗ | ✗ | ✗ | 1 template |
| Arus Kas | arus-kas.html | ● | ● | ✗ | ✗ | ✗ | Paginasi |
| Jurnal | jurnal.html | ● | ● | ✗ | ○ entry | ✗ | Paginasi |
| Buku Besar | buku-besar.html | ● | ● | ✗ | ✗ | ✗ | Paginasi |
| Neraca | neraca.html | ● | ● | ✗ | ✗ | ✗ | Kurangi dummy |
| Laba Rugi | laba-rugi.html | ● | ● | ✗ | ✗ | ✗ | Kurangi dummy |
| Piutang & Hutang | piutang-hutang.html | ● | ● | ✗ | ✗ | ✗ | |
| Realisasi Biaya | realisasi.html | ● | ● | ✗ | ✗ | ✗ | |
| Inventaris | inventaris.html | ○ | ○ | ○ | ○ | ○ | Defer jika data kosong |
| Master Data | master.html | ● | ● drawer | ● mock | ● mock | ✗ | CoA 579 real |
| Tempat Sampah | sampah.html | ○ | ○ | restore ○ | ✗ | ○ | Defer |

## Legal
| Menu | File | B | R | E | A | D |
|------|------|---|---|---|---|---|
| Home | index.html | — | ● | ✗ | ✗ | ✗ |
| Matriks Dokumen | dokumen.html | ● | ● | ● status | ✗ | ✗ |
| Pengajuan | pengajuan.html | ● | ● | ● approve | ✗ | ✗ |
| Detail / Kavling | detail.html, kavling.html | ● | ● | ✗ | ✗ | ✗ |

## Teknik
| Menu | File | B | R | E | A | D |
|------|------|---|---|---|---|---|
| Home | index.html | — | ● | ✗ | ✗ | ✗ |
| Progres | progres.html | ● | ● | ● % | ✗ | ✗ |
| Rekap | property_rekap-konstruksi.html | ● | ● | ✗ | ✗ | ✗ |
| Pengajuan | pengajuan.html | ● | ● | ● approve | ✗ | ✗ |
| Detail | detail.html | — | ● | ✗ | ✗ | ✗ |

## Marketing
| Menu | File | B | R | E | A | D |
|------|------|---|---|---|---|---|
| Home | index.html | — | ● | ✗ | ✗ | ✗ |
| Stok | stok.html | ● | ● | ✗ | ✗ | ✗ |
| Pengajuan | pengajuan.html | ● | ● | ● | ✗ | ✗ |

## Operasional
| Menu | File | B | R | E | A | D |
|------|------|---|---|---|---|---|
| Home | index.html | — | ● | ✗ | ✗ | ✗ |
| Anggaran | anggaran.html | ● | ● | ✗ | ✗ | ✗ |
| Pengajuan | pengajuan.html | ● | ● | ● | ○ buat | ✗ |

## Aturan interaksi BREAD (wajib)
1. **Approve/Reject** boleh ubah state di `sessionStorage` / memori — tulis label “(mock lokal)”.
2. Setiap list: search/filter + empty state + jumlah baris.
3. Jangan tambah modal wizard multi-step kecuali diminta.
4. Tombol tanpa fungsi **dilarang** — sembunyikan atau implement mock eksplisit.
