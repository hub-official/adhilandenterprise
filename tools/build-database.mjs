#!/usr/bin/env node
/**
 * Konversi hasil ekstraksi (extract/raw/*.json) menjadi:
 *   - database/mysql/*.sql        (MySQL 8 / MariaDB 10.6+)
 *   - database/csv/<db>/<table>.csv  (UTF-8 + BOM, RFC4180)
 *   - database/README.md          (inventory + rekomendasi MySQL vs CSV)
 *
 * Jalankan: node tools/build-database.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'D:/data-adhiland';
const RAW = path.join(ROOT, 'extract', 'raw');
const OUT = path.join(ROOT, 'database');
const OUT_SQL = path.join(OUT, 'mysql');
const OUT_CSV = path.join(OUT, 'csv');
const EXTRACT_AT = '2026-10-02';

const read = (name) => JSON.parse(fs.readFileSync(path.join(RAW, name), 'utf8'));

// ---------------------------------------------------------------------------
// util teks
// ---------------------------------------------------------------------------
const clean = (v) => {
  const s = String(v ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // Artefak ekstraksi: sel berisi <span class="realisasi-budget">245.580.160</span>0
  // <span class="realisasi-pct">0%</span> -> textContent "245.580.16000%".
  // Pola sama untuk "Rp 0 0,0%" (angka + persentase menyatu). Hanya nilai
  // angkanya yang diambil; prefix "Rp" pada teks bebas tetap dipertahankan.
  const t = s.replace(/^Rp\s*\.?\s*/i, '').trim();
  let m;
  if ((m = t.match(/^(\d{1,3}(?:\.\d{3})+)00%$/))) return m[1];
  if ((m = t.match(/^(\d[\d.,]*)\s+[\d.,]+%$/))) return m[1];
  return s;
};

const NULLISH = /^[-–—]+$/;
const PLACEHOLDER = /^(belum ada|tidak ada)\b/i;

function slug(header) {
  let s = clean(header).toLowerCase();
  s = s
    .replace(/%/g, ' pct ')
    .replace(/²/g, '2')
    .replace(/³/g, '3')
    .replace(/&/g, ' dan ')
    .replace(/[-/\\.,()]/g, ' ')
    .replace(/:/g, ' ');
  s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, '_');
  return s || 'kolom';
}

// token yang MEMAKSA kolom jadi TEXT (kode, nomor, identitas, teks bebas)
const FORCE_TEXT = new Set([
  'kode', 'code', 'no', 'nomor', 'username', 'rekening', 'telepon', 'telp', 'hp',
  'npwp', 'nik', 'ref', 'umur', 'akun', 'peran', 'status', 'jenis', 'cluster',
  'proyek', 'kavling', 'pembeli', 'marketing', 'spv', 'penawaran', 'vendor',
  'lokasi', 'kondisi', 'sumber', 'alasan', 'label', 'catatan', 'keterangan', 'deskripsi',
  'uraian', 'spesifikasi', 'alamat', 'kota', 'kecamatan', 'kelurahan', 'perusahaan', 'pic',
  'satuan', 'bukti', 'lawan', 'nama', 'kategori', 'level', 'periode', 'tipe', 'bagian',
  'section', 'role', 'opsi', 'entitas', 'grup', 'jabatan', 'kualifikasi', 'agama',
]);

// kolom yang dibuang (UI control / rahasia)
const DROP_HEADER_RE = /^(aksi|hash|password|password_hash|_)$/i;
const DROP_SLUG = new Set(['aksi', 'hash', 'password', 'password_hash', 'kolom']);

const MONTHS = { jan: '01', feb: '02', mar: '03', apr: '04', mei: '05', jun: '06', jul: '07', agu: '08', sep: '09', okt: '10', nov: '11', des: '12' };

function tryDate(v) {
  let m;
  if ((m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/))) return { v: `${m[1]}-${m[2]}-${m[3]}`, t: 'DATE' };
  if ((m = v.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/)))
    return { v: `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}${m[6] ? ':' + m[6] : ''}`, t: 'DATETIME' };
  if ((m = v.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/))) {
    const mo = MONTHS[m[2].toLowerCase()];
    if (mo) return { v: `${m[3]}-${mo}-${m[1].padStart(2, '0')}`, t: 'DATE' };
  }
  if ((m = v.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/))) {
    const mo = MONTHS[m[2].toLowerCase()];
    if (mo) return { v: `${m[3]}-${mo}-${m[1].padStart(2, '0')} ${m[4]}:${m[5]}${m[6] ? ':' + m[6] : ''}`, t: 'DATETIME' };
  }
  return null;
}

const isPct = (v) => /^-?\d+([.,]\d+)?%$/.test(v);

/** Angka format Indonesia: '.' = pemisah ribuan, ',' = desimal. null bila bukan angka. */
function parseAmount(v) {
  v = v.replace(/^Rp\s*\.?\s*/i, '').trim(); // "Rp 20.378.800.000"
  if (v === '' || v === '-' || v === '.') return null;
  if (/^-?\d+$/.test(v)) return v;
  if (v.includes(',')) return /^-?\d{1,3}(\.\d{3})*,\d+$/.test(v) ? v.replace(/\./g, '').replace(',', '.') : v.replace(',', '.');
  if (/^-?\d{1,3}(\.\d{3})+$/.test(v)) return v.replace(/\./g, '');
  if (/^-?\d+\.\d{1,2}$/.test(v)) return v;
  return null;
}

/** Inferensi tipe kolom + fungsi konversi nilai -> literal SQL/CSV. */
function inferColumn(header, values) {
  const name = slug(header);
  const convText = (raw) => (raw === '' || NULLISH.test(raw) ? null : raw);
  const present = values.map(clean).filter((v) => v !== '' && !NULLISH.test(v));

  if (DROP_SLUG.has(name) || isForceText(name)) {
    if (present.length > 0 && present.every((v) => parseAmount(v) !== null)) {
      WARN.push(`${name}: dipaksa TEXT, tetapi seluruh nilai adalah angka (${present[0]})`);
    }
    return { name, type: 'TEXT', conv: convText };
  }
  if (present.length === 0) return { name, type: 'TEXT', conv: convText };

  // tanggal
  if (present.every((v) => tryDate(v))) {
    const allDate = present.every((v) => tryDate(v).t === 'DATE');
    const type = allDate ? 'DATE' : 'DATETIME';
    return { name, type, conv: (raw) => { const r = clean(raw); if (r === '' || NULLISH.test(r)) return null; const d = tryDate(r); return d ? d.v : null; } };
  }
  // persen
  if (present.every(isPct)) {
    return { name, type: 'DECIMAL', conv: (raw) => { const r = clean(raw); if (r === '' || NULLISH.test(r)) return null; const m = r.match(/^(-?\d+(?:[.,]\d+)?)%$/); return m ? m[1].replace(',', '.') : null; } };
  }
  // angka (ribuan/desimal/kampuran) - format Indonesia
  if (present.every((v) => { const p = parseAmount(v); return p !== null && p.replace('-', '').replace(/\./g, '').length <= 18; })) {
    const parsed = present.map(parseAmount);
    const asDec = parsed.some((p) => p.includes('.'));
    const conv = (raw) => {
      const r = clean(raw);
      if (r === '' || NULLISH.test(r)) return null;
      const p = parseAmount(r);
      return p === null || p.replace('-', '').replace(/\./g, '').length > 18 ? null : p;
    };
    return { name, type: asDec ? 'DECIMAL' : 'BIGINT', conv };
  }
  return { name, type: 'TEXT', conv: convText };
}

// token yang menandakan kolom numerik -> membatalkan paksaan TEXT
const MONEY_TOKENS = new Set([
  'nilai', 'harga', 'jumlah', 'biaya', 'total', 'saldo', 'debit', 'kredit', 'terbayar',
  'dibayar', 'sisa', 'rencana', 'realisasi', 'anggaran', 'rp', 'pct', 'persen', 'qty',
  'itj', 'bonus', 'diskon', 'retensi', 'addendum', 'ptb', 'rasio', 'kamar', 'tagihan',
  'bayar', 'pembayaran', 'penjualan', 'pemasukan', 'pengeluaran', 'uang', 'sewa', 'cicilan',
]);

const WARN = [];

/** "10.101.001 - KAS KECIL" / "10.101.001KAS KECIL" -> [kode, nama] */
function splitAccount(s) {
  const v = clean(s);
  const m = v.match(/^(\d[\d.]*)\s*(?:-\s*)?(.*)$/);
  return m ? [m[1], m[2]] : ['', v];
}

function isForceText(name) {
  const toks = name.split('_');
  if (!toks.some((t) => FORCE_TEXT.has(t))) return false;
  if (toks.some((t) => MONEY_TOKENS.has(t))) return false;
  return true;
}

// ---------------------------------------------------------------------------
// builder tabel
// ---------------------------------------------------------------------------
/** @type {Record<string, {name:string, desc:string, columns:any[], rows:any[][], dbName:string}[]>} */
const DBS = {
  adhiland_master: [],
  adhiland_konstruksi: [],
  adhiland_keuangan: [],
  adhiland_operasional: [],
  adhiland_laporan: [],
};

const rowIsEmpty = (cells) => cells.every((c) => clean(c) === '');
const rowIsPlaceholder = (cells) => {
  const first = cells.map(clean).find((c) => c !== '');
  return first !== undefined && PLACEHOLDER.test(first);
};

/**
 * @param {string} dbName
 * @param {string} name nama tabel
 * @param {string} desc deskripsi/sumber
 * @param {string[]} headers
 * @param {any[][]} rows
 * @param {{prefix?:{header:string,values:any[]}[], suffix?:{header:string,values:any[]}[]}} [opts]
 */
function addTable(dbName, name, desc, headers, rows, opts = {}) {
  let cols = headers.map((h, i) => ({ header: clean(h), values: rows.map((r) => (r[i] === undefined ? '' : r[i])) }));
  if (opts.prefix) cols = [...opts.prefix.map((c) => ({ header: c.header, values: c.values })), ...cols];
  if (opts.suffix) cols = [...cols, ...opts.suffix.map((c) => ({ header: c.header, values: c.values }))];

  // buang kolom: header kosong / kontrol UI / rahasia
  cols = cols.filter((c) => {
    if (c.header === '') return false;
    if (DROP_HEADER_RE.test(c.header)) return false;
    if (DROP_SLUG.has(slug(c.header))) return false;
    if (/hash|password/i.test(c.header)) return false;
    return true;
  });

  // buang baris kosong / placeholder
  const keptIdx = rows.map((_, i) => i).filter((i) => !rowIsEmpty(headers.map((_, j) => (rows[i][j] === undefined ? '' : rows[i][j]))) && !rowIsPlaceholder(headers.map((_, j) => (rows[i][j] === undefined ? '' : rows[i][j]))));
  if (keptIdx.length === 0 && rows.length === 0) {
    // tabel kosong: tetap buat tanpa baris
  }
  const valRows = cols.map((c) => keptIdx.map((i) => c.values[i]));

  // inferensi tipe per kolom
  const columns = cols.map((c, i) => {
    const inf = inferColumn(c.header, valRows[i]);
    if (inf.name === 'id') inf.name = 'row_id';
    return { header: c.header, ...inf };
  });
  // hindari duplikasi nama
  const used = new Set(['id']);
  for (const col of columns) {
    let base = col.name;
    let n = 2;
    while (used.has(col.name)) col.name = `${base}_${n++}`;
    used.add(col.name);
  }

  const dataRows = keptIdx.map((_, ri) => columns.map((col, ci) => col.conv(valRows[ci][ri])));

  // jaga-jaga: nilai kolom numerik yang gagal dikonversi akan jadi NULL di SQL
  for (let ci = 0; ci < columns.length; ci++) {
    const col = columns[ci];
    if (col.type !== 'BIGINT' && col.type !== 'DECIMAL' && col.type !== 'DATE' && col.type !== 'DATETIME') continue;
    for (const v of dataRows.map((r) => r[ci])) {
      if (v === null || v === undefined || v === '') continue;
      const ok = (col.type === 'DATE' || col.type === 'DATETIME') ? true : /^-?\d+(\.\d+)?$/.test(String(v));
      if (!ok) { WARN.push(`${name}.${col.name} (${col.type}) tidak valid: ${JSON.stringify(v).slice(0, 60)}`); break; }
    }
  }

  DBS[dbName].push({ name, desc, dbName, columns, rows: dataRows });
  return DBS[dbName][DBS[dbName].length - 1];
}

/** Gabung beberapa view (kolom berbeda) jadi satu tabel, dedupe + kolom sumber_role. */
function unionRoleViews(sources) {
  const headerOrder = [];
  const seen = new Set();
  for (const s of sources) {
    for (const h of s.headers) {
      const k = clean(h);
      if (k === '' || DROP_HEADER_RE.test(k) || /hash|password/i.test(k)) continue;
      if (!seen.has(k)) { seen.add(k); headerOrder.push(k); }
    }
  }
  const map = new Map();
  const roles = new Map();
  for (const s of sources) {
    const pos = s.headers.map((h) => headerOrder.indexOf(clean(h)));
    for (const r of s.rows) {
      const cells = headerOrder.map(() => '');
      for (let i = 0; i < r.length; i++) {
        const p = pos[i];
        if (p >= 0) cells[p] = clean(r[i]);
      }
      if (cells.every((c) => c === '')) continue;
      const key = cells.join('\u0001');
      if (!map.has(key)) { map.set(key, cells); roles.set(key, [s.role]); }
      else if (!roles.get(key).includes(s.role)) roles.get(key).push(s.role);
    }
  }
  const rows = [];
  for (const [key, cells] of map) rows.push([...cells, roles.get(key).join(', ')]);
  return { headers: [...headerOrder, 'Sumber Role'], rows };
}

// ---------------------------------------------------------------------------
// muat sumber
// ---------------------------------------------------------------------------
const A = read('batch_a.json');            // Direktur, 10 halaman
const B = read('batch_b.json');            // Direktur, 9 halaman laporan
const B3 = read('batch_b3.json');          // buku-besar/piutang/neraca/laba-rugi (lebih akurat)
const PH = read('batch_ph.json');          // piutang-hutang + perusahaan + seksi
const LG = read('batch_legal.json');       // view Legal /property
const TK = read('batch_teknik.json');      // rekap konstruksi + view Teknik
const BG = read('batch_budgeting.json');   // /budgeting Direktur + konteks cluster
const OP = read('batch_operasional.json'); // view Operasional
const RB = read('batch_roles_budget.json');// budgeting/pengajuan Teknik-Legal-Marketing
const PL = read('property_links.json');    // pemetaan detail_id <-> kavling

const details = ['details_1.json', 'details_2.json', 'details_3.json', 'details_4.json']
  .flatMap((f) => read(f).items);

const pageOf = (doc, p) => doc.pages.find((x) => x.path === p);
const normH = (s) => clean(s).replace(/[\u2010\u2011\u2012\u2013\u2014\u2212]/g, '-');
const idxOf = (headers, name) => headers.findIndex((h) => normH(h) === normH(name));
const colOf = (headers, rows, name) => {
  const i = idxOf(headers, name);
  if (i < 0) return [];
  return rows.map((r) => (r[i] === undefined ? '' : r[i]));
};

// peta kode kavling -> cluster (dipakai lintas blok)
const t1Hdr = LG.page.tables[1].headers.map(clean);
const codeCluster = new Map();
for (const r of LG.page.tables[1].rows) {
  const code = clean(r[idxOf(t1Hdr, 'Kode Kavling')]);
  const cl = clean(r[idxOf(t1Hdr, 'Cluster')]);
  if (!codeCluster.has(code)) codeCluster.set(code, new Set());
  codeCluster.get(code).add(cl);
}
const clusterOfCode = (code) => {
  const s = codeCluster.get(code);
  return s && s.size === 1 ? [...s][0] : '';
};

// ===========================================================================
// 1) adhiland_master
// ===========================================================================
{
  const p = pageOf(A, '/companies');
  addTable('adhiland_master', 'cluster', 'Master proyek/cluster (/companies)', p.tables[0].headers, p.tables[0].rows);

  const u = pageOf(A, '/users');
  addTable('adhiland_master', 'pengguna', 'Akun pengguna sistem (/users) - kolom hash password DIBUANG', u.tables[0].headers, u.tables[0].rows);

  const acc = pageOf(A, '/accounts');
  // kolom "Kode / Nama Akun" -> pisah jadi kode + nama_akun
  const accHdr = acc.tables[0].headers;
  const accRows = acc.tables[0].rows;
  const iKN = idxOf(accHdr, 'Kode / Nama Akun');
  const kode = [], nama = [];
  for (const r of accRows) {
    const [k, n] = splitAccount(r[iKN]);
    kode.push(k);
    nama.push(n);
  }
  const accRestHdr = accHdr.filter((_, i) => i !== iKN);
  const accRestRows = accRows.map((r) => r.filter((_, i) => i !== iKN));
  addTable('adhiland_master', 'akun_coa', 'Bagan akun / chart of accounts (/accounts)', accRestHdr, accRestRows, {
    prefix: [{ header: 'Kode', values: kode }, { header: 'Nama Akun', values: nama }],
  });

  const rv = pageOf(A, '/master-data/rekening-vendor');
  addTable('adhiland_master', 'rekening_vendor', 'Rekening bank vendor (/master-data/rekening-vendor)', rv.tables[0].headers, rv.tables[0].rows);

  const inv = pageOf(A, '/inventaris');
  addTable('adhiland_master', 'inventaris', 'Inventaris aset (/inventaris)', inv.tables[0].headers, inv.tables[0].rows);

  // ---- kavling_master: view Legal (paling kaya) + tambahan view Direktur ----
  const lt0 = LG.page.tables[0]; // 106 x 50
  const lt1 = LG.page.tables[1]; // 106 x 31
  const baseCols = lt0.headers
    .map((h, i) => ({ h: clean(h), i }))
    .filter((c) => c.h !== '' && !/^riwayat/i.test(c.h));
  const baseHeaders = baseCols.map((c) => c.h);
  const baseRows = lt0.rows.map((r) => baseCols.map((c) => (r[c.i] === undefined ? '' : r[c.i])));

  // index kolom kunci
  const h = baseHeaders;
  const iProyek = idxOf(h, 'Nama Proyek');
  const iKav = idxOf(h, 'Kavling');

  // view Direktur: Harga Jual (daftar) + Code
  const dt = pageOf(A, '/property').tables[1];
  const dHdr = dt.headers.map(clean);
  const dMap = new Map();
  for (const r of dt.rows) {
    const key = `${clean(r[idxOf(dHdr, 'Nama Proyek Baru')])}\u0001${clean(r[idxOf(dHdr, 'No. Kavling')])}`;
    dMap.set(key, { harga: clean(r[idxOf(dHdr, 'Harga Jual')]), code: clean(r[idxOf(dHdr, 'Code')]) });
  }
  // view Legal tabel-2: kolom tagihan yang tidak ada di tabel-1
  const t1Extras = ['Tanggal Pelunasan Sesuai PPJB', 'BPHTB - Tagihan', 'PPH - Tagihan', 'AJB & Balik Nama - Tagihan', 'SLF - Tagihan'];
  const t1ExtraIdx = t1Extras.map((n) => idxOf(t1Hdr, n));
  const t1Map = new Map();
  for (const r of lt1.rows) {
    const key = `${clean(r[idxOf(t1Hdr, 'Cluster')])}\u0001${clean(r[idxOf(t1Hdr, 'Kode Kavling')])}`;
    t1Map.set(key, t1ExtraIdx.map((i) => (i < 0 ? '' : clean(r[i]))));
  }
  // detail_id dari view Teknik
  const plMap = new Map();
  for (const r of PL.rows) plMap.set(`${r.cells[1]}\u0001${r.cells[2]}`, r.detail_id);

  const hargaList = [], codeList = [], detailIds = [];
  const extraRows = t1Extras.map(() => []);
  for (const r of baseRows) {
    const key = `${clean(r[iProyek])}\u0001${clean(r[iKav])}`;
    const d = dMap.get(key) || { harga: '', code: '' };
    hargaList.push(d.harga);
    codeList.push(d.code);
    const pl = plMap.get(key);
    if (pl) detailIds.push(pl);
    else {
      const s = codeCluster.get(clean(r[iKav]));
      detailIds.push(s && s.size === 1 ? details.find((x) => clean(x.sub.split(/[\u2013\u2014-]/)[0]) === clean(r[iKav]))?.id || '' : '');
    }
    const ex = t1Map.get(key) || t1Extras.map(() => '');
    ex.forEach((v, i) => extraRows[i].push(v));
  }

  addTable('adhiland_master', 'kavling_master',
    'Master unit/kavling: gabungan view Legal (identitas+legal), Direktur (harga daftar, kode) dan pemetaan halaman detail',
    baseHeaders, baseRows, {
      suffix: [
        { header: 'Detail ID', values: detailIds },
        { header: 'Harga Jual Daftar', values: hargaList },
        { header: 'Code', values: codeList },
        ...t1Extras.map((n, i) => ({ header: n, values: extraRows[i] })),
      ],
    });

  // ---- kavling_spek: isian form halaman detail ----
  const plById = new Map(PL.rows.map((r) => [String(r.detail_id), r]));
  const spHeaders = ['Detail ID', 'Cluster', 'Kavling', 'Pembeli Detail', 'Marketing Detail', 'SPV Detail'];
  const fieldNames = [];
  for (const it of details) for (const k of Object.keys(it.fields)) if (!fieldNames.includes(k)) fieldNames.push(k);
  const skipFields = new Set(['Tanggal', 'Persentase (%)']);
  const useFields = fieldNames.filter((k) => !skipFields.has(k));
  const spRows = details.map((it) => {
    const code = clean(it.sub.split(/[\u2013\u2014-]/)[0]);
    const pl = plById.get(String(it.id));
    const cluster = pl ? pl.cells[1] : (() => {
      const s = codeCluster.get(code);
      return s && s.size === 1 ? [...s][0] : '';
    })();
    const mk = it.sub.match(/Marketing:\s*(.*?)(?:\s*[·\u2013\u2014-]+\s*SPV:|$)/);
    const sv = it.sub.match(/SPV:\s*(.*)$/);
    return [
      it.id, cluster, code, clean(it.nama), mk ? clean(mk[1]) : '', sv ? clean(sv[1]) : '',
      ...useFields.map((k) => (it.fields[k] === undefined ? '' : it.fields[k])),
    ];
  });
  addTable('adhiland_master', 'kavling_spek',
    'Spesifikasi & kelengkapan per kavling (isian form halaman /property/{id})',
    [...spHeaders, ...useFields], spRows);
}

// ===========================================================================
// 2) adhiland_konstruksi
// ===========================================================================
{
  const rk = TK.pages.find((p) => p.path === '/property/rekap-konstruksi').tables[0];
  addTable('adhiland_konstruksi', 'rekap_konstruksi',
    'Rekap konstruksi per kavling (/property/rekap-konstruksi, role Teknik/Operasional)', rk.headers, rk.rows);

  const kvRows = [], fuRows = [], pgRows = [], ruRows = [], tmRows = [], jpRows = [], rbRows = [];
  for (const it of details) {
    const code = clean(it.sub.split(/[\u2013\u2014-]/)[0]);
    const pl = PL.rows.find((r) => String(r.detail_id) === String(it.id));
    const cluster = pl ? pl.cells[1] : clusterOfCode(code);
    const ref = [it.id, cluster, code];

    const t = (ctxStart, hdr0) => it.tables.find((x) => x.ctx && x.ctx.startsWith(ctxStart) && x.headers[0] === hdr0);

    const kv = t('Realisasi Biaya Konstruksi', 'Field');
    if (kv) {
      const m = new Map(kv.rows.map((r) => [clean(r[0]), clean(r[1])]));
      kvRows.push([...ref, ...[
        'Kontraktor', 'LB / LT / KMR', 'Target BAST', 'Realisasi BAST', 'Nilai Kontrak',
        'Terbayar ke Kontraktor', 'Sisa Bayar Kontraktor', 'PTB Dibayar ke Kontraktor',
        'Addendum Terbayar', 'Retensi Terbayar',
      ].map((k) => m.get(k) ?? '')]);
    }

    const real = (tbl) => (tbl ? tbl.rows.filter((r) => !rowIsEmpty(r) && !rowIsPlaceholder(r)) : []);

    const fu = it.tables.find((x) => x.headers[0] === 'Furniture & Perlengkapan');
    for (const r of real(fu)) fuRows.push([...ref, ...r]);

    const pg = it.tables.find((x) => x.ctx === 'Progres Pembangunan');
    for (const r of real(pg)) pgRows.push([...ref, ...r]);

    const ru = it.tables.find((x) => x.ctx && x.ctx.startsWith('Riwayat Update'));
    for (const r of real(ru)) ruRows.push([...ref, ...r]);

    const tm = it.tables.find((x) => x.ctx && x.ctx.startsWith('Jadwal & Riwayat Termin'));
    for (const r of real(tm)) tmRows.push([...ref, ...r]);

    const jp = it.tables.find((x) => x.ctx === 'Jadwal Pembayaran');
    for (const r of real(jp)) jpRows.push([...ref, ...r]);

    const rb = it.tables.find((x) => x.ctx === 'Riwayat Pembayaran');
    for (const r of real(rb)) rbRows.push([...ref, ...r]);
  }

  const REF = ['Detail ID', 'Cluster', 'Kavling'];
  addTable('adhiland_konstruksi', 'realisasi_biaya', 'Realisasi biaya konstruksi per kavling (halaman detail)',
    [...REF, 'Kontraktor', 'LB / LT / KMR', 'Target BAST', 'Realisasi BAST', 'Nilai Kontrak', 'Terbayar ke Kontraktor', 'Sisa Bayar Kontraktor', 'PTB Dibayar ke Kontraktor', 'Addendum Terbayar', 'Retensi Terbayar'],
    kvRows);
  addTable('adhiland_konstruksi', 'realisasi_furniture', 'Rincian furniture & perlengkapan per kavling',
    [...REF, 'Item', 'Nilai', 'Biaya Pasang', 'Terbayar / Terbeli'], fuRows);
  addTable('adhiland_konstruksi', 'progres_pembangunan', 'Riwayat progres pembangunan per kavling',
    [...REF, 'Tanggal', 'Persentase', 'Dicatat oleh'], pgRows);
  addTable('adhiland_konstruksi', 'riwayat_update_biaya', 'Riwayat update nilai kontrak per kavling',
    [...REF, 'Tanggal', 'Kontraktor', 'Nilai Kontrak', 'Terbayar', 'Sisa', 'Dicatat oleh'], ruRows);
  addTable('adhiland_konstruksi', 'termin_budgeting', 'Termin/addendum/retensi yang ditautkan ke kavling (dari budgeting)',
    [...REF, 'Tanggal', 'Jenis', 'Deskripsi', 'Rencana', 'Terbayar', 'Status'], tmRows);
  addTable('adhiland_konstruksi', 'jadwal_pembayaran', 'Jadwal pembayaran per kavling',
    [...REF, 'Tanggal', 'Label', 'Jumlah', 'Status'], jpRows);
  addTable('adhiland_konstruksi', 'riwayat_pembayaran', 'Riwayat pembayaran per kavling',
    [...REF, 'Tanggal', 'Jumlah', 'Catatan'], rbRows);
}

// ===========================================================================
// 3) adhiland_keuangan
// ===========================================================================
{
  const jn = pageOf(B, '/reports/jurnal');
  addTable('adhiland_keuangan', 'jurnal', 'Jurnal umum (/reports/jurnal)', jn.tables[0].headers, jn.tables[0].rows);

  const kt = pageOf(B, '/reports/kas-tunai');
  addTable('adhiland_keuangan', 'kas_ringkasan_bulanan', 'Ringkasan kas & bank per bulan (/reports/kas-tunai)',
    kt.tables[0].headers, kt.tables[0].rows);
  addTable('adhiland_keuangan', 'kas_mutasi', 'Mutasi kas & bank rinci (/reports/kas-tunai)',
    kt.tables[1].headers, kt.tables[1].rows);

  const bb = B3.pages.find((p) => p.path === '/reports/buku-besar');
  const bbRows = [], bbAkun = [];
  bb.tables.forEach((t, i) => {
    const [code, accName] = splitAccount(t.account);
    bbAkun.push([i + 1, code, accName, clean(t.summary_balance), t.rowCount]);
    t.rows.forEach((r) => bbRows.push([i + 1, code, accName, ...r]));
  });
  addTable('adhiland_keuangan', 'buku_besar', 'Buku besar per akun (/reports/buku-besar, 94 akun)',
    ['Urutan', 'Akun Kode', 'Akun Nama', ...bb.tables[0].headers], bbRows);
  addTable('adhiland_keuangan', 'buku_besar_akun', 'Daftar akun buku besar + saldo awal',
    ['Urutan', 'Akun Kode', 'Akun Nama', 'Saldo Awal', 'Jumlah Baris'], bbAkun);

  const nr = B3.pages.find((p) => p.path === '/reports/neraca');
  const nrRows = [];
  for (const t of nr.tables) for (const r of t.rows) nrRows.push([clean(t.ctx), ...r]);
  addTable('adhiland_keuangan', 'neraca', 'Laporan neraca (/reports/neraca)', ['Seksi', ...nr.tables[0].headers], nrRows);

  const lr = B3.pages.find((p) => p.path === '/reports/laba-rugi');
  const lrRows = [];
  for (const t of lr.tables) for (const r of t.rows) lrRows.push([clean(t.ctx), ...r]);
  addTable('adhiland_keuangan', 'laba_rugi', 'Laporan laba rugi (/reports/laba-rugi)', ['Seksi', ...lr.tables[0].headers], lrRows);

  const phRows = [];
  for (const t of PH.tables) {
    for (const r of t.rows) {
      if (rowIsEmpty(r) || rowIsPlaceholder(r)) continue;
      phRows.push([clean(t.company), clean(t.section), ...r]);
    }
  }
  addTable('adhiland_keuangan', 'piutang_hutang', 'Piutang & hutang per perusahaan (/reports/piutang-hutang)',
    ['Perusahaan', 'Seksi', 'Akun', 'Saldo', 'Aktivitas Terakhir', 'Umur'], phRows);
}

// ===========================================================================
// 4) adhiland_operasional
// ===========================================================================
{
  // ringkasan budgeting per cluster (memakai konteks heading)
  const wkRows = [], jnRows = [];
  for (const t of BG.tables) {
    const ctx = clean(t.ctx);
    if (t.headers[0] === 'Pekerjaan') wkRows.push(...t.rows.map((r) => [ctx, ...r]));
    else if (t.headers[0] === 'Jenis Pekerjaan') {
      const cluster = ctx.replace(/^Edit Total Anggaran\s*-\s*/i, '');
      jnRows.push(...t.rows.map((r) => [cluster, ...r]));
    }
  }
  addTable('adhiland_operasional', 'budgeting_pekerjaan',
    'Rincian anggaran per pekerjaan & cluster (/budgeting)', ['Cluster', ...BG.tables[0].headers], wkRows);
  addTable('adhiland_operasional', 'budgeting_jenis_pekerjaan',
    'Rekap anggaran per jenis pekerjaan (/budgeting)', ['Cluster', ...BG.tables[1].headers], jnRows);

  // union item budgeting antar role
  const budgetSources = [
    { role: 'Direktur', headers: BG.tables[10].headers, rows: BG.tables[10].rows },
    { role: 'Operasional', headers: pageOf(OP, '/budgeting').tables[0].headers, rows: pageOf(OP, '/budgeting').tables[0].rows },
    ...RB.roles.filter((x) => !x.error).map((x) => {
      const t = x.pages.find((p) => p.path === '/budgeting').tables.find((tb) => tb.rowCount > 0);
      return { role: x.role, headers: t.headers, rows: t.rows };
    }),
  ];
  const ub = unionRoleViews(budgetSources);
  addTable('adhiland_operasional', 'budgeting_item',
    'Item budgeting - gabungan semua role (setiap role melihat himpunan berbeda)', ub.headers, ub.rows);

  // union pengajuan antar role
  const pengSources = [
    { role: 'Direktur', headers: pageOf(A, '/pengajuan').tables[0].headers, rows: pageOf(A, '/pengajuan').tables[0].rows },
    { role: 'Operasional', headers: pageOf(OP, '/pengajuan').tables[0].headers, rows: pageOf(OP, '/pengajuan').tables[0].rows },
    ...RB.roles.filter((x) => !x.error).map((x) => {
      const t = x.pages.find((p) => p.path === '/pengajuan').tables.find((tb) => tb.rowCount > 0);
      return { role: x.role, headers: t.headers, rows: t.rows };
    }),
  ];
  const up = unionRoleViews(pengSources);
  addTable('adhiland_operasional', 'pengajuan',
    'Pengajuan dana - gabungan semua role', up.headers, up.rows);

  const tr = pageOf(A, '/trash');
  addTable('adhiland_operasional', 'tempat_sampah', 'Data terhapus (/trash)', tr.tables[0].headers, tr.tables[0].rows);
}

// ===========================================================================
// 5) adhiland_laporan
// ===========================================================================
{
  const rl = pageOf(B, '/reports/legal');
  addTable('adhiland_laporan', 'laporan_legal', 'Laporan progres legal per kavling (/reports/legal)', rl.tables[0].headers, rl.tables[0].rows);

  const rt = pageOf(B, '/reports/teknik');
  addTable('adhiland_laporan', 'laporan_teknik', 'Laporan progres teknik (/reports/teknik)', rt.tables[0].headers, rt.tables[0].rows);
  addTable('adhiland_laporan', 'laporan_teknik_ringkas', 'Ringkasan teknik (/reports/teknik)', rt.tables[1].headers, rt.tables[1].rows);

  const bp = pageOf(B, '/reports/biaya-proyek');
  addTable('adhiland_laporan', 'biaya_proyek_bulanan', 'Biaya proyek per bulan (/reports/biaya-proyek)', bp.tables[0].headers, bp.tables[0].rows);

  // dashboard: 8 tabel bertopik proyek -> digabung pada kunci Proyek
  const home = pageOf(A, '/');
  const dashMap = new Map();
  const dashOrder = [];
  const extraHeaders = [];
  for (let ti = 0; ti <= 7; ti++) {
    const t = home.tables[ti];
    const hdr = t.headers.map(clean);
    const iPr = idxOf(hdr, 'Proyek');
    for (const c of hdr) if (c !== 'Proyek' && !extraHeaders.includes(c)) extraHeaders.push(c);
    for (const r of t.rows) {
      const key = clean(r[iPr]);
      if (!dashMap.has(key)) { dashMap.set(key, { Proyek: key }); dashOrder.push(key); }
      const obj = dashMap.get(key);
      hdr.forEach((c, i) => { if (c !== 'Proyek') obj[c] = clean(r[i]); });
    }
  }
  addTable('adhiland_laporan', 'dashboard_proyek',
    'Ringkasan dashboard per proyek (/) - saldo kas, unit terjual, uang masuk, piutang, rasio, stok, hutang',
    ['Proyek', ...extraHeaders], dashOrder.map((k) => ['Proyek', ...extraHeaders].map((c) => dashMap.get(k)[c] ?? '')));

  const db = home.tables[9];
  addTable('adhiland_laporan', 'dashboard_budget_realisasi', 'Anggaran vs realisasi per jenis pekerjaan (/)',
    db.headers, db.rows);
}

// ===========================================================================
// EMIT
// ===========================================================================
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT_SQL, { recursive: true });

const SQL_TYPE = { TEXT: 'TEXT', DATE: 'DATE', DATETIME: 'DATETIME', BIGINT: 'BIGINT', DECIMAL: 'DECIMAL(18,4)' };

function sqlEscape(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
}

function sqlLiteral(v, type) {
  if (v === null || v === undefined || v === '') return 'NULL';
  if (type === 'TEXT') return `'${sqlEscape(v)}'`;
  if (type === 'DATE' || type === 'DATETIME') return `'${sqlEscape(v)}'`;
  return /^-?\d+(\.\d+)?$/.test(String(v)) ? String(v) : 'NULL';
}

function csvCell(v) {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const manifest = [];
for (const [dbName, tables] of Object.entries(DBS)) {
  const lines = [];
  lines.push('-- ============================================================');
  lines.push(`-- Ekspor database : ${dbName}`);
  lines.push(`-- Sumber          : https://adhilandpro.com (login multi-role)`);
  lines.push(`-- Tanggal ekstrak : ${EXTRACT_AT}`);
  lines.push(`-- Generator       : tools/build-database.mjs`);
  lines.push(`-- Tabel           : ${tables.length}`);
  lines.push('-- ============================================================');
  lines.push('');
  lines.push(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  lines.push(`USE \`${dbName}\`;`);
  lines.push('');

  for (const t of tables) {
    lines.push(`-- ------------------------------------------------------------`);
    lines.push(`-- ${t.name}`);
    lines.push(`-- ${t.desc}`);
    lines.push(`-- ${t.rows.length} baris, ${t.columns.length} kolom`);
    lines.push(`-- ------------------------------------------------------------`);
    lines.push(`CREATE TABLE \`${t.name}\` (`);
    lines.push('  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,');
    t.columns.forEach((c, i) => {
      const comment = c.header === c.name ? '' : ` COMMENT '${sqlEscape(c.header)}'`;
      lines.push(`  \`${c.name}\` ${SQL_TYPE[c.type]} NULL${comment}${i === t.columns.length - 1 ? ',' : ','}`);
    });
    lines.push('  PRIMARY KEY (`id`)');
    lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;');
    lines.push('');

    const colNames = t.columns.map((c) => `\`${c.name}\``).join(', ');
    for (let i = 0; i < t.rows.length; i += 200) {
      const chunk = t.rows.slice(i, i + 200);
      const vals = chunk.map((r) => {
        if (r.length !== t.columns.length) throw new Error(`kolom tidak selaras di ${dbName}.${t.name}: ${r.length} != ${t.columns.length}`);
        return `(${r.map((v, ci) => sqlLiteral(v, t.columns[ci].type)).join(', ')})`;
      });
      lines.push(`INSERT INTO \`${t.name}\` (${colNames}) VALUES`);
      lines.push(vals.join(',\n') + ';');
      lines.push('');
    }
    if (t.rows.length === 0) lines.push('');

    // CSV
    const csvDir = path.join(OUT_CSV, dbName);
    fs.mkdirSync(csvDir, { recursive: true });
    const csv = [
      '\uFEFF' + t.columns.map((c) => csvCell(c.header)).join(','),
      ...t.rows.map((r) => r.map((v) => csvCell(v)).join(',')),
    ].join('\r\n') + '\r\n';
    fs.writeFileSync(path.join(csvDir, `${t.name}.csv`), csv, 'utf8');

    manifest.push({ db: dbName, table: t.name, desc: t.desc, rows: t.rows.length, cols: t.columns.length });
  }

  fs.writeFileSync(path.join(OUT_SQL, `${dbName}.sql`), lines.join('\n'), 'utf8');
}

// ---------------------------------------------------------------------------
// README
// ---------------------------------------------------------------------------
const totalRows = manifest.reduce((s, m) => s + m.rows, 0);
const dbList = Object.keys(DBS);
let md = [];
md.push('# Database hasil ekstraksi adhilandpro.com');
md.push('');
md.push(`Ekstraksi: ${EXTRACT_AT} — sumber: https://adhilandpro.com (semua role: Direktur, Operasional, Teknik, Legal, Marketing).`);
md.push('');
md.push('Data mentah tersimpan di `extract/raw/*.json`. Folder ini adalah hasil konversinya.');
md.push('');
md.push('## Isi folder');
md.push('');
md.push('```');
md.push('database/');
md.push('├── mysql/            # skrip SQL siap import (MySQL 8 / MariaDB 10.6+)');
md.push('│   ├── adhiland_master.sql');
md.push('│   ├── adhiland_konstruksi.sql');
md.push('│   ├── adhiland_keuangan.sql');
md.push('│   ├── adhiland_operasional.sql');
md.push('│   └── adhiland_laporan.sql');
md.push('├── csv/<database>/<tabel>.csv   # satu file CSV per tabel (UTF-8 + BOM)');
md.push('├── import-all.ps1    # helper import ke MySQL');
md.push('└── README.md');
md.push('```');
md.push('');
md.push('## Inventory tabel');
md.push('');
md.push('| Database | Tabel | Baris | Kolom | Keterangan |');
md.push('|---|---|---:|---:|---|');
for (const m of manifest) md.push(`| \`${m.db}\` | \`${m.table}\` | ${m.rows} | ${m.cols} | ${m.desc.replace(/\|/g, '\\|')} |`);
md.push('');
md.push(`**Total: ${dbList.length} database, ${manifest.length} tabel, ${totalRows.toLocaleString('id-ID')} baris.**`);
md.push('');
md.push('## Perubahan terhadap data sumber');
md.push('');
md.push('- Kolom **hash password** pada `/users` **tidak diekspor**.');
md.push('- Kolom tombol UI (`Aksi`), kolom tanpa judul, dan kolom seluruhnya kosong dibuang.');
md.push('- Baris placeholder ("Belum ada ...") dan baris kosong dibuang.');
md.push('- Tipe kolom diinferensi: rupiah/angka → `BIGINT` (titik ribuan dibuang), persen → `DECIMAL(18,4)`, tanggal ISO → `DATE`/`DATETIME`, sisanya `TEXT`.');
md.push('- Tabel `budgeting_item` dan `pengajuan` adalah **gabungan semua role** karena tiap role melihat himpunan baris berbeda; kolom `sumber_role` mencatat role mana yang menampilkan baris tersebut.');
md.push('- `kavling_master` digabung dari view Legal (paling kaya), view Direktur (harga daftar & kode) dan pemetaan ID halaman detail.');
md.push('');
md.push('## Cara import');
md.push('');
md.push('### MySQL (disarankan)');
md.push('');
md.push('```powershell');
md.push('mysql -u root -p < database/mysql/adhiland_master.sql');
md.push('mysql -u root -p < database/mysql/adhiland_konstruksi.sql');
md.push('mysql -u root -p < database/mysql/adhiland_keuangan.sql');
md.push('mysql -u root -p < database/mysql/adhiland_operasional.sql');
md.push('mysql -u root -p < database/mysql/adhiland_laporan.sql');
md.push('');
md.push('# atau otomatis:');
md.push('powershell -File database/import-all.ps1');
md.push('```');
md.push('');
md.push('### CSV');
md.push('');
md.push('- Excel: buka langsung (sudah UTF-8 + BOM).');
md.push('- MySQL: `LOAD DATA INFILE` per tabel, atau lewat wizard Workbench/phpMyAdmin.');
md.push('');
md.push('## MySQL vs CSV — rekomendasi');
md.push('');
md.push('| Aspek | MySQL | CSV |');
md.push('|---|---|---|');
md.push('| Integrasi ke aplikasi | Langsung (SQL, relasi, view, transaksi) | Perlu parser + mapping manual |');
md.push('| Ukuran data | ~ribuan baris/tabel (jurnal 1.977, buku besar 4.142) — ringan | Sama ringan, tapi tanpa tipe data |');
md.push('| Tipe data & validasi | Terpasang (BIGINT/DATE/DECIMAL) | Semua jadi teks |');
md.push('| Query lintas laporan | Mudah (JOIN, GROUP BY, agregasi) | Harus diproses dulu (Power BI/Excel) |');
md.push('| Pertukaran/arsip | Perlu dump | Universal, bisa dibuka siapa saja |');
md.push('| Kolom berevolusi | Perlu migrasi ALTER | Otomatis mengikuti |');
md.push('| Kolaborasi non-teknis | Perlu tool | Excel/Sheets langsung |');
md.push('');
md.push('**Rekomendasi: gunakan MySQL sebagai database utama** untuk integrasi (relasi antar tabel, query laporan, kecepatan, integritas tipe data), **dan simpan CSV sebagai arsip/backup + format pertukaran** yang bisa dibuka di Excel. Keduanya digenerate dari sumber yang sama sehingga selalu bisa dibuat ulang dengan `node tools/build-database.mjs`.');
md.push('');
fs.writeFileSync(path.join(OUT, 'README.md'), md.join('\n'), 'utf8');

// helper import
fs.writeFileSync(path.join(OUT, 'import-all.ps1'), [
  '# Import semua database MySQL dari folder ini',
  '$mysql = (Get-Command mysql -ErrorAction SilentlyContinue)',
  'if (-not $mysql) { Write-Error "mysql CLI tidak ditemukan di PATH"; exit 1 }',
  '$root = Split-Path -Parent $MyInvocation.MyCommand.Path',
  'Get-ChildItem (Join-Path $root "mysql") -Filter *.sql | Sort-Object Name | ForEach-Object {',
  '  Write-Host "Import $($_.Name) ..." -ForegroundColor Cyan',
  '  & mysql --default-character-set=utf8mb4 -u root -p < $_.FullName',
  '  if ($LASTEXITCODE -ne 0) { Write-Error "Gagal import $($_.Name)"; exit 1 }',
  '}',
  'Write-Host "Selesai." -ForegroundColor Green',
].join('\r\n'), 'utf8');

console.log(`Selesai: ${manifest.length} tabel, ${totalRows} baris, ${dbList.length} database`);
for (const m of manifest) console.log(`  ${m.db}.${m.table}: ${m.rows} baris x ${m.cols} kolom`);
if (WARN.length) {
  console.log(`\nPeringatan inferensi (${WARN.length}):`);
  [...new Set(WARN)].forEach((w) => console.log('  - ' + w));
}
