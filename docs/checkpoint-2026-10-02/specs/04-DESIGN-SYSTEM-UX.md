# Design System & UX Rules

## Tokens
- Hanya ubah warna di `assets/css/tokens.css`
- Komponen layout: `assets/css/app.css`
- Jangan hardcode hex di HTML halaman

## Compact corporate checklist
- [ ] Padding card konsisten (token spacing)
- [ ] KPI value tidak berukuran berlebihan di mobile
- [ ] Tabel: sticky header, hover row, mono untuk kode/nominal
- [ ] Max 1 primary CTA per card decision
- [ ] Density: prefer 1.5–1.7 line-height body; tabel lebih rapat

## User friendly
- Bahasa UI: Indonesia
- Format uang: `fmt.IDR` / compact
- Tanggal: `fmt.date` / `dateTime`
- Role di topbar harus cocok folder (DR/LG/TK/MK/OP)
- Badge pengajuan = jumlah menunggu real

## Aksesibilitas minimal
- Focus ring pada chip/button
- Drawer: ESC / overlay click menutup
- Jangan andalkan warna saja (badge + teks status)

## Yang dilarang
- KPI angka magic bertentangan aggregate
- Link ke 318 HTML statis detail
- Math.random untuk angka bisnis
- Fitur yang tidak ada di matriks BREAD
