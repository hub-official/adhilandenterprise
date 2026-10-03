# Target: Wewenang & Status Machine

## Matrix wewenang (target)

| Aksi | Marketing | Operasional | Legal | Teknik | Finance | Direktur |
|------|-----------|-------------|-------|--------|---------|----------|
| Buat pengajuan | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit draft sendiri | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Review kelengkapan & budget | ❌ | ❌ | ❌ | ❌ | ✅ | ○ lihat |
| Approve final (kas) | ❌ | ❌ | ❌ | ❌ | ❌* | ✅ |
| Tolak final + alasan | ❌ | ❌ | ❌ | ❌ | kembalikan | ✅ |
| Tandai dibayar / posting mock | ❌ | ❌ | ❌ | ❌ | ✅ | ○ |
| Update status legal sel | — | — | ✅ | — | — | lihat |
| Update progres % | — | — | — | ✅ | — | lihat |

\*Opsional: Finance boleh approve di bawah limit nominal (F6).

## Status pengajuan (target)

| Kode | Label UI | Siapa yang menggerakkan |
|------|----------|-------------------------|
| `draft` | Draft | Unit (belum submit) — opsional di F2 |
| `menunggu_review` | Menunggu review Finance | Setelah unit submit (F3) |
| `menunggu` / `menunggu_direktur` | Menunggu Direktur | Finance loloskan; atau langsung jika F3 belum hidup |
| `disetujui` | Disetujui | Direktur |
| `ditolak` | Ditolak | Direktur (wajib alasan) |
| `dikembalikan` | Dikembalikan | Finance → unit revisi |
| `dibayar` | Dibayar | Finance (F4) |

**Kompatibilitas data lama:** status extract `Menunggu` / `Disetujui` tetap dibaca; override sessionStorage boleh memetakan ke label baru.

## Aturan UI

1. Tombol **Setujui/Tolak** hanya di halaman role Direktur (F1).  
2. Tombol **Loloskan / Kembalikan** hanya di layar Finance (F3).  
3. Unit hanya **Ajukan**, **Batal draft** (jika ada), lihat timeline status.  
4. Semua perubahan status mock: label `(mock lokal)` + persist sessionStorage.
