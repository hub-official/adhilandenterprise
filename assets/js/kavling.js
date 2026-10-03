/**
 * Kavling list + detail helpers (reads AdhData.KAVLING)
 */
window.AdhKavling = (function () {
  'use strict';

  const STATUS_LABEL = {
    belum: 'Belum terjual',
    deal: 'Deal—belum bayar',
    bertahap: 'Bertahap',
    cash: 'Cash'
  };
  const STATUS_CLASS = {
    belum: 'rag-neutral',
    deal: 'rag-warn',
    bertahap: 'rag-info',
    cash: 'rag-good'
  };

  function statusBadge(st) {
    const label = STATUS_LABEL[st] || st;
    const cls = STATUS_CLASS[st] || 'rag-neutral';
    return `<span class="status-badge ${cls}">${label}</span>`;
  }

  function detailHref(id, roleFolder) {
    // Single template: detail.html?id=N
    const base = roleFolder ? `${roleFolder}/` : '';
    return `${base}detail.html?id=${id}`;
  }

  function renderListRows(list, opts) {
    opts = opts || {};
    const F = window.fmt;
    const roleFolder = opts.detailBase || 'kavling-detail';
    // Prefer single template path relative to current folder
    const useTemplate = opts.useTemplate !== false;
    return list.map(function (k) {
      const href = `detail.html?id=${k.id}`;
      const harga = k.hargaDeal || k.hargaDaftar || 0;
      const dummy = (!k.hargaDeal && k.status === 'belum') ? ' <span class="text-muted">(daftar)</span>' : '';
      return `<tr>
        <td>${k.proyek ? k.proyek.replace('EazyKost ','').replace(' Garden','').replace('Mayana ','') : '—'}</td>
        <td><a href="${href}">${k.kavling || k.code || ('#'+k.id)}</a></td>
        <td>${k.pembeli || '—'}</td>
        <td>${F ? F.IDR(harga) : harga}${dummy}</td>
        <td>${statusBadge(k.status)}</td>
        <td>${k.tglPpjb || '—'}</td>
        <td>
          <div class="progress-bar" style="height:6px;background:var(--border);border-radius:3px;overflow:hidden;min-width:60px">
            <div style="height:100%;width:${Math.min(100, k.pctBayar || 0)}%;background:var(--primary)"></div>
          </div>
          <span class="text-muted" style="font-size:11px">${(k.pctBayar || 0).toFixed(0)}%</span>
        </td>
        <td>${F ? F.IDR(k.sisa || 0) : k.sisa}</td>
        <td>${k.umur || '—'}</td>
      </tr>`;
    }).join('');
  }

  function filterList(list, status) {
    if (!status || status === 'semua' || status === 'Semua') return list;
    const map = { 'belum terjual': 'belum', 'deal': 'deal', 'bertahap': 'bertahap', 'cash': 'cash' };
    const key = map[status.toLowerCase()] || status.toLowerCase();
    return list.filter(function (k) { return k.status === key; });
  }

  function kpiFromList(list) {
    const total = list.length;
    const terjual = list.filter(function (k) { return k.status !== 'belum'; }).length;
    const ppjb = list.reduce(function (s, k) { return s + (k.hargaDeal || 0); }, 0);
    const sisa = list.reduce(function (s, k) { return s + (k.sisa || 0); }, 0);
    return { total: total, terjual: terjual, ppjb: ppjb, sisa: sisa, pct: total ? (terjual / total * 100) : 0 };
  }

  return {
    STATUS_LABEL: STATUS_LABEL,
    statusBadge: statusBadge,
    renderListRows: renderListRows,
    filterList: filterList,
    kpiFromList: kpiFromList,
    detailHref: detailHref
  };
})();
