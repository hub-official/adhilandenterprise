/**
 * embed-canonical.mjs — regenerate assets/js/canonical-data.js
 *
 * Why this exists:
 *   The mockup is opened by double-clicking an .html file (file:// protocol).
 *   Chrome blocks fetch() on file:// (CORS), so assets/data/canonical-data.json
 *   never loaded in that mode — leaving every canonical table empty and every
 *   "info" popup showing "Tidak ada data".
 *
 *   This script bakes the same snapshot into a plain <script> so the data is
 *   available regardless of protocol. file:// then behaves like http://.
 *
 * Usage (from project root):
 *   node tools/embed-canonical.mjs
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';

const SRC = 'assets/data/canonical-data.json';
const OUT = 'assets/js/canonical-data.js';

const raw = readFileSync(SRC, 'utf8');
const data = JSON.parse(raw); // fail loudly if the snapshot is corrupt

const banner = `/* canonical-data.js — GENERATED, jangan diedit manual.
 * Sumber: ${SRC} (snapshot database.zip).
 * Alasan ada: fetch() ke file:// diblokir Chrome (CORS), sehingga tabel kanonik
 * tidak pernah termuat saat mockup dibuka dengan klik-ganda. File ini menyuntikkan
 * snapshot yang sama sebagai data global agar perilaku file:// == http://.
 * Regenerasi: node tools/embed-canonical.mjs
 */
window.ADH_CANONICAL=`;

writeFileSync(OUT, `${banner}${JSON.stringify(data)};\n`, 'utf8');

const kb = (statSync(OUT).size / 1024).toFixed(0);
const tables = Object.keys(data.tables || {}).length;
console.log(`wrote ${OUT} (${kb} KB, ${tables} tables)`);
