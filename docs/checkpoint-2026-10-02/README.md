# Checkpoint Perencanaan — Adhiland Finance UIUX v2
**Tanggal:** 2026-10-02  
**Status repo:** Mockup data-driven (static HTML + JS + JSON dari extract DB adhilandpro.com)  
**Tujuan folder ini:** AI / developer lain dapat melanjutkan **end-to-end** tanpa salah konteks.

> **Update 2026-10-02 (lanjutan):** Audit hardcode menyeluruh telah diintegrasikan ke  
> `assessments/00-RINGKASAN-PENILAIAN.md`, `plans/01-ROADMAP-PRIORITAS.md`, dan `plans/02-DASHBOARD-PER-ROLE.md`.  
> Fase 0 sekarang berisi checklist hardcode kritis (Operasional home = prioritas #1).

> **Checkpoint stop 2026-10-03:** Fase 0.2 + Fase 1 selesai.  
> Status detail: `STATUS-CHECKPOINT.md` · Lanjut = **Fase 2 BREAD**.


## Baca berurutan
1. `README.md` (file ini)
2. `assessments/00-RINGKASAN-PENILAIAN.md` — hasil audit seluruh area
3. `plans/01-ROADMAP-PRIORITAS.md` — urutan kerja wajib
4. `plans/02-DASHBOARD-PER-ROLE.md` — spesifikasi dashboard
5. `plans/03-SIDEBAR-MENU-CRUD-BREAD.md` — menu + BREAD per halaman
6. `specs/04-DESIGN-SYSTEM-UX.md` — corporate / compact / best practice
7. `specs/05-DATA-LAYER.md` — sumber data JSON & aturan konsistensi
8. `prompts/PROMPT-MASTER-AI.md` — **paste ini ke AI berikutnya**
9. `prompts/PROMPT-FASE-*.md` — prompt per fase

## Prinsip produk (wajib diikuti)
- **Corporate, Compact, Best practice, User Friendly**
- **Fungsional** sesuai peran — **jangan over-fitur**
- CRUD/BREAD **hanya di area yang relevan** (lihat matriks di plan 03)
- Satu sumber angka (aggregate / JSON) — **larangan hardcode KPI**
- Role: Direktur | Legal | Teknik | Marketing | Operasional  
  *(Finance = modul di bawah Direktur; belum ada role Finance terpisah)*

## Struktur repo (penting)
```
adhiland-mockup-v2/
  login.html
  Direktur/   Legal/   Teknik/   Marketing/   Operasional/
  assets/css/  assets/js/  assets/data/
  docs/checkpoint-2026-10-02/   ← dokumen ini
```

## Menjalankan mockup
```bash
cd adhiland-mockup-v2 && python3 -m http.server 8765
# buka http://127.0.0.1:8765/login.html
```

## Catatan ZIP
Folder `*/kavling-detail/` (318 HTML statis deprecated) **tidak** disertakan agar arsip ringan. Detail kavling memakai `detail.html?id=N`.
