# Prompt Master — Upgrade Adhiland Mockup (pasca checkpoint)

## Peran
Anda adalah Fullstack + Corporate mini-ERP + Business Management. Kerjakan mockup **static HTML/JS/CSS** di `adhiland-mockup-v2/`. Tidak ada API server.

## Wajib baca dulu (urut)
1. `docs/upgrade-2026-10-03/README.md`
2. `docs/upgrade-2026-10-03/STATUS-SETELAH-CHECKPOINT.md`
3. `docs/upgrade-2026-10-03/plans/01-ROADMAP-UPGRADE.md`
4. `docs/upgrade-2026-10-03/plans/02-TARGET-WEWENANG-DAN-STATUS.md`
5. `docs/upgrade-2026-10-03/plans/03-INTEGRASI-DIREKTUR.md`
6. Prompt tahap yang diminta user (`PROMPT-UPGRADE-F1-…` dst.)

## Konteks produk
- Role login: Direktur, Legal, Teknik, Marketing, Operasional (Finance belum role, kecuali tahap F6).
- Data: `AdhData` + `assets/data/*.json` + `AdhLocalState` (sessionStorage).
- Fase 0–4 mockup **sudah selesai** — jangan mengulang hardcode cleanup kecuali regresi.

## Aturan emas
1. Angka bisnis dari data/override lokal — **dilarang hardcode KPI baru yang menyesatkan**.
2. Perubahan status pengajuan = mock lokal + label `(mock lokal)` bila di-override.
3. **Approve final kas hanya Direktur** (kecuali F6 limit Finance).
4. Jangan multi-wizard rumit; drawer/form satu langkah.
5. Jangan timpa arsip `docs/checkpoint-2026-10-02/` kecuali menambah tautan.
6. Setelah tiap tahap: update `docs/upgrade-2026-10-03/STATUS-SETELAH-CHECKPOINT.md` atau changelog singkat di folder upgrade.

## Urutan eksekusi default
F1 → F2 → F3 → F4; F5 boleh paralel setelah F1; F6 terakhir.

## DoD global upgrade
- Unit mengajukan; Finance (jika ada) mereview; Direktur memutuskan; status terlihat di unit.
- Tidak ada self-approve di Marketing/Ops/Legal/Teknik.
- Laporan keuangan tidak diisi angka invent.

Kerjakan **hanya tahap yang diminta user** dalam satu sesi kecuali user bilang “lanjut semua”.
