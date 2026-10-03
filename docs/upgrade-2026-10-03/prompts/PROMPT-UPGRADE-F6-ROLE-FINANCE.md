# Prompt eksekusi — F6 Role Finance & Limit (opsional)

Baca: master. Kerjakan setelah F3 stabil.

## Tujuan
Finance sebagai **role login** + opsional limit wewenang.

## Scope
1. Tombol role **Finance** di `login.html` → `Finance/index.html` (atau reuse finance-review).
2. NAV Finance: Home ringkas, Antrian review, Siap bayar (jika F4 ada).
3. Opsional: `LIMIT_APPROVE_FINANCE` di JS — di bawah limit, Finance boleh Setujui; di atas, hanya Loloskan ke Direktur. Dokumentasikan angka default.
4. Badge shell Direktur: pecah atau tambah hint count review vs menunggu Direktur bila mudah.

## DoD
- [ ] Login Finance masuk workspace tanpa menu laporan penuh Direktur.
- [ ] Alur review (dan limit jika diimplementasi) konsisten dengan `plans/02`.
