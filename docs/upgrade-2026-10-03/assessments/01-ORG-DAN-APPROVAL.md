# Assessment: Organisasi & Approval

## Harapan bisnis (dari diskusi)

Direktur melakukan approval terhadap pengajuan budget yang diajukan oleh:

- Marketing  
- Operasional  
- Legal  
- Teknik  
- Finance (sebagai pengaju atau checker — perlu dipertegas SOP)

## Kondisi mockup saat assessment

| Aspek | Kondisi | Sesuai harapan? |
|-------|---------|-----------------|
| Direktur melihat semua pengajuan | Ya (`filter` tanpa role) | ✅ |
| Unit hanya melihat `sumberRole` sendiri | Ya | ✅ |
| Direktur Setujui/Tolak + impact kas | Ya (sessionStorage) | ✅ mock |
| Unit juga punya tombol Setujui/Tolak | Ya | ❌ |
| Create pengajuan dari unit | Tidak ada | ❌ |
| Role Finance | Tidak ada di login | ❌ |
| Pengajuan Marketing di data | 0 baris | ❌ |
| Multi-level (unit → Finance → Direktur) | Tidak | ❌ |

## Distribusi data `pengajuan.json` (extract)

| sumberRole | Jumlah | Menunggu (approx) |
|------------|--------|-------------------|
| Direktur | 46 | ~41 |
| Teknik | 37 | ~35 |
| Legal | 4 | ~3 |
| Operasional | 1 | ~1 |
| Marketing | 0 | 0 |
| Finance | 0 | 0 |

## Struktur role login saat ini

`Direktur | Legal | Teknik | Marketing | Operasional`  
(Finance = fungsi di bawah Direktur, bukan login.)

## Kesimpulan

Integrasi **data** (satu `AdhData`) sudah baik. Integrasi **wewenang** belum. Upgrade harus mengunci approval dan menambahkan Create + (opsional) Review Finance.
