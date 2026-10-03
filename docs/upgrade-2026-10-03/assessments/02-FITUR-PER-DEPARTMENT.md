# Assessment: Fitur per Department

## Operasional

| Fitur | Ada di mockup? | Tujuan | Target best practice |
|-------|----------------|--------|----------------------|
| Home KPI (antrian, serapan, tempo) | ✅ | Prioritas bayar harian | Pertahankan; tautkan ke jatuh tempo |
| Anggaran operasional | ✅ browse | Kontrol belanja ops | + sisa budget & commit |
| List pengajuan Ops | ✅ | Lihat antrian sendiri | Read-only status setelah submit |
| Setujui/Tolak | ✅ (salah wewenang) | — | **Hapus**; ganti Create |
| Create pengajuan | ❌ | Ajukan biaya ke pusat | **Wajib** |
| Konfirmasi realisasi bayar | ❌ | Tutup loop setelah approve | Tahap lanjut |

## Marketing

| Fitur | Ada di mockup? | Tujuan | Target best practice |
|-------|----------------|--------|----------------------|
| Funnel & stok | ✅ | Pipeline jual | Pertahankan |
| Top deal belum bayar | ✅ | Follow-up | + link ke piutang (nanti) |
| Stok & penjualan | ✅ | Inventori unit | Pertahankan |
| Pengajuan promosi (list) | ✅ UI; **data 0** | Budget marketing | Seed data + Create |
| Setujui/Tolak | ✅ (salah wewenang) | — | **Hapus** |
| Create pengajuan promosi | ❌ | Ajukan event/iklan/komisi | **Wajib** |
| CRM detail konsumen | ❌ | — | Defer |

## Legal

| Fitur | Ada di mockup? | Tujuan | Target best practice |
|-------|----------------|--------|----------------------|
| Home + KPI legal | ✅ | Antrian dokumen | Pertahankan |
| Matriks dokumen + edit status | ✅ mock | Operasional legal | Pertahankan; audit trail nanti |
| Pengajuan Legal | ✅ | Biaya notaris/AJB | Create + read status |
| Setujui/Tolak | ✅ (salah wewenang) | — | **Hapus** |
| Kavling + detail | ✅ | Konteks unit | Pertahankan |
| Upload berkas | ❌ | Bukti untuk Finance review | Mock upload metadata |

## Teknik (ringkas, terkait integrasi)

| Fitur | Ada? | Target |
|-------|------|--------|
| Progres + update % | ✅ | Pertahankan |
| Pengajuan Teknik | ✅ list | Create + no self-approve |
| Rekap konstruksi | ✅ | Pertahankan |

## Direktur (ringkas — detail di plans/03)

Dashboard, persetujuan all-role, budgeting, laporan keuangan ringkas, master, kavling: **ada**.  
Perlu: filter role di persetujuan, enforce wewenang, audit log, (opsional) submenu Finance.
