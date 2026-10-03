/**
 * Adhiland ERP — Dashboard Direktur (all 16 widgets)
 * Spec: 04_SPEC_DASHBOARD_DIREKTUR.md
 */
(function () {
  'use strict';

  const D = window.AdhData;
  const F = window.fmt;
  let charts = [];
  let viewPeriod = 12;
  let compareMode = 'period';
  let viewportBound = false;

  // T3-12: resize charts on orientation change / viewport resize (bound once)
  function bindViewportOnce() {
    if (viewportBound) return;
    viewportBound = true;
    function refresh() { requestAnimationFrame(function () { resizeCharts(); }); }
    window.addEventListener('orientationchange', function () { setTimeout(refresh, 250); });
    var rz;
    window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(refresh, 150); });
  }

  function ragClass(status) {
    if (status === 'good' || status === 'ok') return 'rag-good';
    if (status === 'warn') return 'rag-warn';
    if (status === 'bad' || status === 'critical') return 'rag-bad';
    return 'rag-info';
  }

  function severityClass(s) {
    if (s === 'critical') return 'severity-critical';
    if (s === 'warn') return 'severity-warn';
    if (s === 'ok') return 'severity-ok';
    return 'severity-info';
  }

  function iconFor(s) {
    return '<span class="decision-status-dot" aria-hidden="true"></span>';
  }

  function latestDelta(field) {
    if(compareMode==='none') return null;
    const rows = (D.MONTHLY||[]).filter(x => Number(x[field]||0) !== 0 || field === 'masuk');
    if (rows.length < 2) return null;
    const a = Number(rows[rows.length-2][field]||0), b = Number(rows[rows.length-1][field]||0);
    if (!a) return null;
    const pct = ((b-a)/Math.abs(a))*100;
    return { text: (pct>=0?'+':'') + pct.toFixed(1) + '%', cls: pct>=0 ? 'up-good' : 'down-bad' };
  }
  function scopeLabel(){ return D.DATA_SCOPE || 'Konsolidasi'; }

  /* ========== W-DIR-00 Dashboard toolbar (project dipilih via topbar global) ========== */
  function renderGlobalBar() {
    return `
    <div class="global-bar" id="w-dir-00" role="region" aria-label="Filter dashboard">
      <div class="filter-group">
        <span class="filter-label">Periode</span>
        <select class="select-sm" id="filter-periode" aria-label="Periode"><option value="3" ${viewPeriod===3?'selected':''}>3 bulan terakhir</option><option value="6" ${viewPeriod===6?'selected':''}>6 bulan terakhir</option><option value="12" ${viewPeriod===12?'selected':''}>12 bulan tersedia</option></select>
      </div>
      <div class="filter-group">
        <span class="filter-label">Pembanding</span>
        <select class="select-sm" id="filter-pembanding" aria-label="Pembanding"><option value="period" ${compareMode==='period'?'selected':''}>Periode lalu</option><option value="none" ${compareMode==='none'?'selected':''}>Tanpa pembanding</option></select>
      </div>
      <div class="filter-group" style="margin-left:auto">
        <span class="text-muted" style="font-size:12px">Scope: ${scopeLabel()} · Data per ${F.dateTime(D.AS_OF)}</span>
        <button class="btn btn-secondary btn-sm" type="button" data-detail="project_matrix">Detail Data</button><button class="btn btn-secondary btn-sm" type="button" data-action="export-projects">Export</button>
        <button class="btn btn-primary btn-sm" type="button" data-action="board-pack" title="Cetak Board Pack">Board Pack</button>
      </div>
    </div>`;
  }

  /* ========== W-DIR-01 Pusat Keputusan ========== */
  function renderDecisionCenter() {
    const cards = D.DECISIONS.map(d => `
      <article class="decision-card ${severityClass(d.severity)}" data-id="${d.id}">
        <div class="decision-header">
          <div class="decision-icon ${d.severity === 'critical' ? 'critical' : d.severity === 'warn' ? 'warn' : 'info'}">${iconFor(d.severity)}</div>
          <div>
            <div class="decision-title">${d.title}</div>
            <div class="decision-meta">${d.meta}</div>
          </div>
        </div>
        <div class="decision-actions">
          <a class="btn btn-primary btn-sm" href="${d.href}">${d.action}</a>
        </div>
      </article>
    `).join('');
    return `
    <section class="mb-5" id="w-dir-01" aria-labelledby="dc-title">
      <h2 id="dc-title" class="sr-only">Pusat Keputusan</h2>
      <div class="decision-grid">${cards}</div>
    </section>`;
  }

  /* ========== W-DIR-02 KPI strip ========== */
  /* Setiap kartu KPI mewakili kategori informasi yang berbeda, jadi tiap kartu
     punya tipe detail + tabel sumbernya sendiri. Judul popup = label kartu. */
  const KPI_DETAIL = {
    '02a': 'kas_bank',
    '02b': 'total_ppjb',
    '02c': 'uang_masuk',
    '02d': 'sisa_tagihan',
    '02e': 'stok_belum',
    '02f': 'hutang',
    '02g': 'piutang_usaha',
    '02h': 'serapan_anggaran'
  };
  function renderKPI() {
    const kpis = [
      {
        id: '02a', label: 'Kas & Bank', value: F.IDR(D.KAS.total, 'compact'),
        sub: D.PROJECT_HEALTH.length===1 ? D.PROJECT_HEALTH[0].name : (D.PROJECT_HEALTH.filter(p=>Number(p.kas||0)>0).length + ' project memiliki saldo kas'), delta: null, rag: 'bad',
        tip: 'M-001 · Saldo kas & bank konsolidasi'
      },
      {
        id: '02b', label: 'Total Penjualan (PPJB)', value: F.IDR(D.SALES.ppjb, 'compact'),
        sub: F.num(D.SALES.kavlingTerjual) + ' kavling', delta: latestDelta('ppjb'), rag: 'info',
        tip: 'M-010 · Nilai kontrak PPJB'
      },
      {
        id: '02c', label: 'Uang Masuk', value: F.IDR(D.SALES.uangMasuk, 'compact'),
        sub: F.pct(D.SALES.rasioMasuk) + ' dari PPJB', delta: latestDelta('masuk'), rag: 'warn',
        tip: 'M-011 · Kas diterima dari konsumen'
      },
      {
        id: '02d', label: 'Sisa Tagihan PPJB', value: F.IDR(D.SALES.sisaTagihan, 'compact'),
        sub: F.pct(1 - D.SALES.rasioMasuk) + ' belum masuk', delta: null, rag: 'bad',
        tip: 'M-012 · PPJB − Uang Masuk'
      },
      {
        id: '02e', label: 'Stok Belum Terjual', value: F.num(D.STOK.belumTerjual) + ' kavling',
        sub: 'Potensi ' + F.IDR(D.STOK.potensi, 'compact'), delta: null, rag: 'info',
        tip: 'M-014 / M-015'
      },
      {
        id: '02f', label: 'Hutang', value: F.IDR(D.LIABILITAS.hutang, 'compact'),
        sub: D.LIABILITAS.hutang ? ('Kas menutup ' + F.pct(D.KAS.total / D.LIABILITAS.hutang)) : 'Tidak ada saldo hutang pada snapshot', delta: null, rag: 'warn',
        tip: 'M-020 · Total hutang neraca'
      },
      {
        id: '02g', label: 'Piutang Usaha (Jurnal)', value: F.IDR(D.LIABILITAS.piutangUsaha, 'compact'),
        sub: 'Saldo piutang usaha dari database', delta: null, rag: 'warn',
        tip: 'M-021 · Piutang usaha dari jurnal'
      },
      {
        id: '02h', label: 'Serapan Anggaran', value: F.pct(D.BUDGET.serapan),
        sub: F.IDR(D.BUDGET.realisasi, 'compact') + ' dari ' + F.IDR(D.BUDGET.anggaran, 'compact'), delta: null, rag: 'warn',
        tip: 'M-032 · Realisasi / Anggaran'
      }
    ];

    const cards = kpis.map(k => `
      <article class="kpi-card" id="w-dir-${k.id}" title="${k.tip || ''}">
        <div class="kpi-label">
          <span>${k.label}</span>
          <span class="kpi-label-actions"><button class="status-badge ${ragClass(k.rag)} kpi-status-btn" type="button" data-detail="${KPI_DETAIL[k.id]||'budget'}" data-detail-title="${k.label}" aria-label="Status ${k.rag}, buka detail">${k.rag === 'bad' ? 'Kritis' : k.rag === 'warn' ? 'Waspada' : k.rag === 'good' ? 'Baik' : 'Info'}</button><button class="kpi-info-btn" type="button" data-detail="${KPI_DETAIL[k.id]||'budget'}" data-detail-title="${k.label}" aria-label="Lihat detail ${k.label}" title="Lihat detail">${window.AdhShell?AdhShell.icon('document',15):'▧'}</button></span>
        </div>
        <div class="kpi-value">${k.value}</div>
        <div class="kpi-sub">${k.sub || ''}</div>
        ${k.delta ? `<span class="kpi-delta ${k.delta.cls}">${k.delta.text}</span>` : ''}
      </article>
    `).join('');

    return `<section class="kpi-grid" id="w-dir-02" aria-label="KPI utama">${cards}</section>`;
  }

  /* ========== W-DIR-03 Matriks Kesehatan Proyek ========== */
  function renderProjectMatrix() {
    const rows = D.PROJECT_HEALTH.map(p => {
      const barPct = Math.min(100, Math.round(p.rasio * 100));
      return `
        <tr>
          <td><strong>${p.name}</strong></td>
          <td class="num ${p.kas === 0 ? 'zero' : ''}">${p.kas === 0 ? '–' : F.IDR(p.kas, 'compact')}</td>
          <td class="num">${F.IDR(p.ppjb, 'compact')}</td>
          <td class="num ${p.masuk === 0 ? 'zero' : ''}">${p.masuk === 0 ? '–' : F.IDR(p.masuk, 'compact')}</td>
          <td>
            <div class="in-cell-bar">
              <div class="bar-track"><div class="bar-fill" style="width:${barPct}%;background:var(--proj-${p.id === 'mayana2' ? 'mayana2' : p.id})"></div></div>
              <span>${F.pct(p.rasio)}</span>
            </div>
          </td>
          <td class="num">${F.pct(p.serapan)}</td>
          <td class="num">${p.konstruksiTelat}</td>
          <td><span class="status-badge ${ragClass(p.skor)}">${p.skorLabel}</span></td>
        </tr>`;
    }).join('');

    return `
    <article class="card" id="w-dir-03">
      <div class="card-header">
        <h3 class="card-title">${D.PROJECT_HEALTH.length === 1 ? 'Kesehatan project — '+D.PROJECT_HEALTH[0].name : (D.PROJECT_HEALTH.filter(p => p.skor === 'critical').length)+' dari '+D.PROJECT_HEALTH.length+' project berstatus Kritis'}</h3>
        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-detail="project_matrix">Detail</button>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table" aria-label="Matriks kesehatan proyek">
          <thead>
            <tr>
              <th scope="col">Proyek</th>
              <th scope="col" class="num">Kas</th>
              <th scope="col" class="num">PPJB</th>
              <th scope="col" class="num">Uang Masuk</th>
              <th scope="col">Rasio Masuk</th>
              <th scope="col" class="num">Serapan</th>
              <th scope="col" class="num">Telat ST</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <table class="sr-only"><caption>Matriks kesehatan proyek untuk pembaca layar</caption></table>
    </article>`;
  }

  /* ========== W-DIR-04 Funnel Kavling ========== */
  function renderFunnel() {
    const f = D.STOK.funnel;
    const total = f.belum + f.dealBelumBayar + f.bertahap + f.cash;
    const stages = [
      { label: 'Belum terjual', n: f.belum, color: 'var(--viz-plan)' },
      { label: 'Deal–belum bayar', n: f.dealBelumBayar, color: 'var(--warning)' },
      { label: 'Bertahap', n: f.bertahap, color: 'var(--info)' },
      { label: 'Cash lunas', n: f.cash, color: 'var(--success)' }
    ];
    const bars = stages.map(s => {
      const pct = Math.round((s.n / total) * 100);
      return `
        <div style="margin-bottom:10px">
          <div class="flex-between" style="margin-bottom:4px">
            <span style="font-size:13px">${s.label}</span>
            <span style="font-size:13px;font-weight:600">${s.n} <span class="text-muted">(${pct}%)</span></span>
          </div>
          <div class="bar-track" style="height:10px;background:var(--surface-3);border-radius:5px;overflow:hidden">
            <div style="width:${pct}%;height:100%;background:${s.color};border-radius:5px"></div>
          </div>
        </div>`;
    }).join('');

    return `
    <article class="card" id="w-dir-04">
      <div class="card-header">
        <h3 class="card-title">Funnel kavling: ${F.num(f.belum)} belum laku · potensi ${F.IDR(D.STOK.potensi,'compact')}</h3>
        <div class="card-actions"><button class="btn btn-ghost btn-sm" type="button" data-detail="funnel">Detail</button></div>
      </div>
      ${bars}
      <p class="text-muted mt-3" style="font-size:12px">Total ${total} kavling · Snapshot 30 Sep 2026</p>
    </article>`;
  }

  /* ========== W-DIR-05 Penjualan vs Uang Masuk (Combo) ========== */
  function renderSalesCombo() {
    return `
    <article class="card" id="w-dir-05">
      <div class="card-header">
        <h3 class="card-title">Penjualan vs Uang Masuk <span class="text-muted" style="font-weight:400;font-size:12px">(${scopeLabel()})</span></h3>
        <div class="card-actions"><button class="btn btn-ghost btn-sm" type="button" data-detail="penjualan_ppjb" data-detail-title="Penjualan vs Uang Masuk">Detail</button></div>
      </div>
      <div class="chart-container"><canvas id="chart-sales-combo" role="img" aria-label="Grafik gabungan penjualan dan arus kas per bulan">Grafik penjualan vs arus kas. Data tersedia pada tabel detail.</canvas></div>
    </article>`;
  }

  /* ========== W-DIR-06 Celah Tagih ========== */
  function renderCelah() {
    const rows = D.PROJECTS.map(p => {
      const s = D.SALES.byProject[p.id];
      return `<tr>
        <td>${p.short}</td>
        <td class="num">${F.IDR(s.ppjb, 'compact')}</td>
        <td class="num ${s.masuk === 0 ? 'zero' : ''}">${s.masuk === 0 ? '–' : F.IDR(s.masuk, 'compact')}</td>
        <td class="num">${F.IDR(s.sisa, 'compact')}</td>
        <td class="num">${F.pct(s.rasio)}</td>
      </tr>`;
    }).join('');
    return `
    <article class="card" id="w-dir-06">
      <div class="card-header">
        <h3 class="card-title">Celah tagih: ${F.IDR(D.SALES.sisaTagihan,'compact')} belum masuk</h3>
        <div class="card-actions"><button class="btn btn-ghost btn-sm" type="button" data-detail="celah_tagih">Detail</button></div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Proyek</th><th class="num">PPJB</th><th class="num">Masuk</th><th class="num">Sisa</th><th class="num">Rasio</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </article>`;
  }

  /* ========== W-DIR-07 Jembatan Kas + Cash Runway (P0) ========== */
  function renderCashBridge() {
    // Runway uses the actual historical cash-outflow benchmark from kas_mutasi.
    const dueValue = (D.DUE_ITEMS||[]).filter(function(x){return x.days<=7;}).reduce(function(a,x){return a+(x.amount||0);},0);
    const need = (D.BUDGET.pengajuanMenunggu&&D.BUDGET.pengajuanMenunggu.nilai||0) + dueValue;
    const dailyBurn = D.CANONICAL&&D.CANONICAL.derived&&D.CANONICAL.derived.cashBurn ? D.CANONICAL.derived.cashBurn.avgDailyOutflow : 0;
    const runwayDays = dailyBurn>0 ? Math.max(0, Math.round(D.KAS.total / dailyBurn)) : 0;
    const coverPct = need > 0 ? D.KAS.total / need : 0;
    return `
    <article class="card" id="w-dir-07">
      <div class="card-header">
        <h3 class="card-title">Kas menutup hanya ${F.pct(coverPct)} kebutuhan — runway ~${runwayDays} hari</h3>
        <div class="card-actions"><button class="btn btn-ghost btn-sm" type="button" data-detail="saldo" data-detail-title="Saldo Kas per Proyek">Detail</button></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px">
        <div style="text-align:center;padding:16px;background:var(--danger-soft);border-radius:var(--radius);border:1px solid var(--border)">
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">CASH RUNWAY (P0)</div>
          <div style="font-size:32px;font-weight:700;color:var(--danger);font-variant-numeric:tabular-nums">${runwayDays}</div>
          <div style="font-size:12px;color:var(--text-muted)">hari · historical burn ${F.IDR(dailyBurn,'compact')}/hari</div>
          <div class="bar-track" style="height:8px;margin-top:10px;background:var(--surface-3);border-radius:4px">
            <div style="width:${Math.min(100, runwayDays)}%;height:100%;background:var(--danger);border-radius:4px;max-width:100%"></div>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Ambang waspada &lt; 30 hari</div>
        </div>
        <div style="font-size:13px;display:flex;flex-direction:column;justify-content:center;gap:8px">
          <div class="flex-between"><span class="text-muted">Kas tersedia</span><strong>${F.IDR(D.KAS.total, 'compact')}</strong></div>
          <div class="flex-between"><span class="text-muted">Pengajuan menunggu</span><strong>${F.IDR(D.BUDGET.pengajuanMenunggu.nilai, 'compact')}</strong></div>
          <div class="flex-between"><span class="text-muted">Jatuh tempo</span><strong>${F.IDR(dueValue, 'compact')}</strong></div>
          <div class="flex-between" style="border-top:1px solid var(--border);padding-top:8px"><span class="text-muted">Selisih</span><strong style="color:var(--danger)">${F.IDR(D.KAS.total - need, 'compact')}</strong></div>
        </div>
      </div>
      <div class="chart-container sm"><canvas id="chart-cash-bridge" role="img" aria-label="Grafik waterfall jembatan arus kas">Grafik jembatan arus kas. Data tersedia pada tabel detail.</canvas></div>
      <p class="text-muted mt-2" style="font-size:11px">Waterfall: Kas → −Pengajuan → −Jatuh tempo → Selisih. Runway memakai rata-rata outflow 90 hari terakhir dari kas_mutasi; benchmark historis, bukan forecast.</p>
    </article>`;
  }

  /* ========== W-DIR-08 Kualitas Pemasukan ========== */
  function renderCashQuality() {
    return `
    <article class="card" id="w-dir-08">
      <div class="card-header">
        <h3 class="card-title">Kualitas kategori arus kas masuk <span class="text-muted" style="font-weight:400;font-size:12px">(derived account mapping · ${scopeLabel()})</span></h3>
        <div class="card-actions"><button class="btn btn-ghost btn-sm" type="button" data-detail="cash_quality">Detail</button></div>
      </div>
      <div class="chart-container sm"><canvas id="chart-cash-quality" role="img" aria-label="Diagram donat kualitas arus kas masuk">Diagram kualitas arus kas masuk. Data tersedia pada tabel detail.</canvas></div>
    </article>`;
  }

  /* ========== W-DIR-09 Serapan Anggaran ========== */
  function renderBudgetBurn() {
    const serapan = D.BUDGET.serapan || 0;
    const konstruksiSerapan = D.BUDGET.konstruksiSerapan || 0;
    return `
    <article class="card" id="w-dir-09">
      <div class="card-header">
        <h3 class="card-title">Serapan ${F.pct(serapan)} — konstruksi ${F.pct(konstruksiSerapan)}</h3>
        <div class="card-actions"><button class="btn btn-ghost btn-sm" type="button" data-detail="budget">Detail</button></div>
      </div>
      <div class="chart-container"><canvas id="chart-budget-burn" role="img" aria-label="Grafik batang serapan anggaran per proyek">Grafik serapan anggaran. Data tersedia pada tabel detail.</canvas></div>
    </article>`;
  }

  /* ========== W-DIR-10 Jatuh Tempo ========== */
  function renderDueItems() {
    const dueRows=(D.DUE_ITEMS||[]);
    const nJatuh = dueRows.length;
    const dueValue = dueRows.reduce(function(a,x){return a+(x.amount||0);},0);
    return `
    <article class="card" id="w-dir-10">
      <div class="card-header">
        <h3 class="card-title">${nJatuh} item budgeting jatuh tempo</h3>
        <div class="card-actions"><button class="btn btn-ghost btn-sm" type="button" data-detail="due">Detail</button><a class="btn btn-ghost btn-sm" href="budgeting.html">Buka Budgeting</a></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:12px">
        <div class="flex-between">
          <span>Pengajuan menunggu</span>
          <strong>${D.BUDGET.pengajuanMenunggu.n} item · ${F.IDR(D.BUDGET.pengajuanMenunggu.nilai, 'compact')}</strong>
        </div>
        <div class="bar-track" style="height:8px;background:var(--surface-3);border-radius:4px">
          <div style="width:${Math.min(100, D.BUDGET.pengajuanMenunggu.n ? (D.BUDGET.pengajuanMenunggu.n / Math.max(1, D.BUDGET.pengajuanMenunggu.n + nJatuh))*100 : 0)}%;height:100%;background:var(--warning);border-radius:4px"></div>
        </div>
        <div class="flex-between">
          <span>Budgeting jatuh tempo</span>
          <strong>${nJatuh} item · ${F.IDR(dueValue, 'compact')}</strong>
        </div>
        <div class="bar-track" style="height:8px;background:var(--surface-3);border-radius:4px">
          <div style="width:${Math.min(100, nJatuh ? (nJatuh / Math.max(1, D.BUDGET.pengajuanMenunggu.n + nJatuh))*100 : 0)}%;height:100%;background:var(--danger);border-radius:4px"></div>
        </div>
        <p class="text-muted" style="font-size:12px">Kas hanya menutup ${F.pct(D.CASH_COVER.rasio)} dari total kebutuhan.</p>
      </div>
    </article>`;
  }

  /* ========== W-DIR-11 Bayar vs Progres (P0 scatter) ========== */
  function renderPayVsProgress() {
    return `
    <article class="card" id="w-dir-11">
      <div class="card-header">
        <h3 class="card-title">Scatter: % bayar konsumen vs % progres (P0)</h3>
        <div class="card-actions"><button class="btn btn-ghost btn-sm" type="button" data-detail="project_matrix">Detail</button></div>
      </div>
      <div class="chart-container sm"><canvas id="chart-pay-progress" role="img" aria-label="Diagram sebar pembayaran versus progres konstruksi">Diagram sebar pembayaran vs progres. Data tersedia pada tabel detail.</canvas></div>
      <p class="text-muted mt-2" style="font-size:11px">Kuadran kanan-bawah = sudah dibayar tapi progres macet · kiri-atas = progres jalan tapi tagihan belum masuk</p>
    </article>`;
  }

  /* ========== W-DIR-12 Telat Serah Terima ========== */
  function renderLateST() {
    const k = D.KONSTRUKSI || { terlambat: 0, rataTelatHari: 0, onProgress: 0, close: 0, maxTelatHari: 0 };
    const nTelat = k.terlambat || 0;
    const rata = k.rataTelatHari || 0;
    const title = nTelat > 0
      ? `${nTelat} unit konstruksi terlambat — rata-rata ${rata} hari`
      : `Konstruksi: ${k.onProgress || 0} on progress · ${k.close || 0} close (0 terlambat)`;
    return `
    <article class="card" id="w-dir-12">
      <div class="card-header">
        <h3 class="card-title">${title}</h3>
        <div class="card-actions"><a class="btn btn-ghost btn-sm" href="../Teknik/index.html">Buka Teknik</a></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:12px">
        <div style="text-align:center;padding:16px;background:var(--danger-soft);border-radius:var(--radius-sm)">
          <div style="font-size:28px;font-weight:700;color:var(--danger)">${k.terlambat || 0}</div>
          <div class="text-muted" style="font-size:12px">Terlambat</div>
        </div>
        <div style="text-align:center;padding:16px;background:var(--warning-soft);border-radius:var(--radius-sm)">
          <div style="font-size:28px;font-weight:700;color:var(--warning)">${k.rataTelatHari || 0}</div>
          <div class="text-muted" style="font-size:12px">Rata-rata hari</div>
        </div>
      </div>
      <div class="flex-between" style="font-size:13px">
        <span>On progress: <strong>${k.onProgress || 0}</strong></span>
        <span>Close: <strong>${k.close || 0}</strong></span>
        <span>Maks: <strong>${k.maxTelatHari || 0} hari</strong></span>
      </div>
    </article>`;
  }

  /* ========== W-DIR-13 Heatmap Legal ========== */
  function renderLegalHeat() {
    const done = D.LEGAL.done || 0;
    const target = D.LEGAL.target || 0;
    const pctW = Math.max(0.5, Math.min(100, (D.LEGAL.pct || 0) * 100));
    return `
    <article class="card" id="w-dir-13">
      <div class="card-header">
        <h3 class="card-title">Legal ${F.pct(D.LEGAL.pct)} lengkap (${done}/${target})</h3>
        <div class="card-actions"><a class="btn btn-ghost btn-sm" href="../Legal/index.html">Buka Legal</a></div>
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
        <div style="flex:1;height:16px;background:var(--surface-3);border-radius:8px;overflow:hidden">
          <div style="width:${pctW}%;height:100%;background:var(--hm-done)"></div>
        </div>
        <strong>${F.pct(D.LEGAL.pct)}</strong>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;font-size:12px;text-align:center">
        <div><div style="width:12px;height:12px;background:var(--hm-done);border-radius:2px;margin:0 auto 4px"></div>Selesai</div>
        <div><div style="width:12px;height:12px;background:var(--hm-progress);border-radius:2px;margin:0 auto 4px"></div>Proses</div>
        <div><div style="width:12px;height:12px;background:var(--hm-overdue);border-radius:2px;margin:0 auto 4px"></div>Terlambat</div>
        <div><div style="width:12px;height:12px;background:var(--hm-todo);border-radius:2px;margin:0 auto 4px"></div>Belum</div>
      </div>
      <p class="text-muted mt-3" style="font-size:12px">Dokumen: SLF, BAST, AJB, BPHTB, PPH, Balik Nama, SHGB</p>
    </article>`;
  }

  /* ========== W-DIR-14 / 15 Aging ========== */
  function renderAging(id, title, data, colorVar) {
    const total = (data||[]).reduce((a,d)=>a+(Number(d.nilai)||0),0);
    const max = Math.max(...data.map(d => d.nilai), 1);
    const bars = data.map(d => {
      const pct = Math.round((d.nilai / max) * 100);
      return `
        <div style="margin-bottom:8px">
          <div class="flex-between" style="font-size:12px;margin-bottom:2px">
            <span>${d.bucket}</span>
            <span>${F.IDR(d.nilai, 'compact')} (${d.n})</span>
          </div>
          <div class="bar-track" style="height:8px;background:var(--surface-3);border-radius:4px">
            <div style="width:${pct}%;height:100%;background:${colorVar};border-radius:4px"></div>
          </div>
        </div>`;
    }).join('');
    return `
    <article class="card" id="${id}">
      <div class="card-header">
        <h3 class="card-title">${title} <span class="text-muted" style="font-size:12px;font-weight:400">· ${F.IDR(total,'compact')}</span></h3>
        <div class="card-actions"><button class="btn btn-ghost btn-sm" type="button" data-detail="${id==='w-dir-14'?'ar_aging':'ap_aging'}">Detail</button></div>
      </div>
      ${bars}
    </article>`;
  }

  /* ========== W-DIR-16 Aktivitas & DQ ========== */
  function renderActivityDQ() {
    return `
    <article class="card" id="w-dir-16">
      <div class="card-header">
        <h3 class="card-title">Kualitas data & kelengkapan source <span class="text-muted" style="font-size:12px;font-weight:400">· ${scopeLabel()}</span></h3>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
        <div style="padding:12px;background:var(--danger-soft);border-radius:var(--radius-sm);text-align:center">
          <div style="font-weight:700;color:var(--danger)">${D.DATA_QUALITY && D.DATA_QUALITY.inventarisRows===0 ? 'DQ-001' : 'OK'}</div>
          <div style="font-size:12px;color:var(--text-muted)">Inventaris: ${D.DATA_QUALITY ? D.DATA_QUALITY.inventarisRows : 0} baris</div>
        </div>
        <div style="padding:12px;background:var(--warning-soft);border-radius:var(--radius-sm);text-align:center">
          <div style="font-weight:700;color:var(--warning)">${D.DATA_QUALITY ? D.DATA_QUALITY.paymentScheduleRows : 0}</div>
          <div style="font-size:12px;color:var(--text-muted)">Payment schedule tersedia</div>
        </div>
        <div style="padding:12px;background:var(--warning-soft);border-radius:var(--radius-sm);text-align:center">
          <div style="font-weight:700;color:var(--warning)">${D.DATA_QUALITY ? D.DATA_QUALITY.paymentHistoryRows : 0}</div>
          <div style="font-size:12px;color:var(--text-muted)">Payment history tersedia</div>
        </div>
        <div style="padding:12px;background:var(--info-soft);border-radius:var(--radius-sm);text-align:center">
          <div style="font-weight:700;color:var(--info)">${D.DATA_QUALITY ? D.DATA_QUALITY.sourceRows.toLocaleString('id-ID') : '—'}</div>
          <div style="font-size:12px;color:var(--text-muted)">Baris sumber terintegrasi</div>
        </div>
      </div>
    </article>`;
  }

  /* ========== Charts init ========== */
  function initCharts() {
    // Destroy previous
    charts.forEach(c => { try { c.destroy(); } catch(e){} });
    charts = [];

    if (typeof Chart === 'undefined') {
      document.querySelectorAll('.chart-container').forEach(function(box){
        if(box.dataset.nochart==='1')return;
        box.dataset.nochart='1';
        box.innerHTML='<div class="empty-state"><span class="empty-title">Grafik tidak tersedia</span><span class="empty-sub">Library Chart.js gagal dimuat. Data tetap dapat dilihat pada tabel detail.</span></div>';
      });
      return;
    }

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--viz-grid').trim();
    const axisColor = getComputedStyle(document.documentElement).getPropertyValue('--viz-axis').trim();
    const salesColor = getComputedStyle(document.documentElement).getPropertyValue('--viz-sales').trim();
    const cashColor = getComputedStyle(document.documentElement).getPropertyValue('--viz-cash').trim();
    const planColor = getComputedStyle(document.documentElement).getPropertyValue('--viz-plan').trim();
    const actualColor = getComputedStyle(document.documentElement).getPropertyValue('--viz-actual').trim();

    // Sales combo
    const salesSeries = (D.MONTHLY||[]).slice(-viewPeriod);
    const ctx1 = document.getElementById('chart-sales-combo');
    if (ctx1 && ctx1.offsetParent) {
      charts.push(new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: salesSeries.map(m => m.m),
          datasets: [
            {
              type: 'bar',
              label: 'PPJB',
              data: salesSeries.map(m => m.ppjb / 1e9),
              backgroundColor: salesColor,
              borderRadius: 4,
              order: 2
            },
            {
              type: 'line',
              label: 'Uang Masuk',
              data: salesSeries.map(m => m.masuk / 1e9),
              borderColor: cashColor,
              backgroundColor: cashColor,
              tension: 0.3,
              pointRadius: 3,
              borderWidth: 2,
              order: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: axisColor, boxWidth: 12 } },
            tooltip: {
              callbacks: {
                label: (ctx) => ctx.dataset.label + ': Rp ' + ctx.parsed.y.toFixed(2) + ' M'
              }
            }
          },
          scales: {
            x: { grid: { color: gridColor }, ticks: { color: axisColor, maxRotation: 45 } },
            y: {
              grid: { color: gridColor },
              ticks: { color: axisColor, callback: v => v + ' M' },
              title: { display: true, text: 'Rp miliar', color: axisColor }
            }
          }
        }
      }));
    }

    // Cash bridge (waterfall-like bar)
    const ctx2 = document.getElementById('chart-cash-bridge');
    if (ctx2 && ctx2.offsetParent) {
      charts.push(new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Kas', 'Pengajuan', 'Jatuh tempo', 'Selisih'],
          datasets: [{
            data: [((D.KAS&&D.KAS.total)||0)/1e6, -(((D.BUDGET&&D.BUDGET.pengajuanMenunggu&&D.BUDGET.pengajuanMenunggu.nilai)||0)/1e6), -((D.DUE_ITEMS||[]).filter(function(x){return x.days<=7;}).reduce(function(a,x){return a+(x.amount||0);},0)/1e6), (((D.KAS&&D.KAS.total)||0)-((D.BUDGET&&D.BUDGET.pengajuanMenunggu&&D.BUDGET.pengajuanMenunggu.nilai)||0))/1e6],
            backgroundColor: [
              cashColor,
              getComputedStyle(document.documentElement).getPropertyValue('--warning').trim(),
              getComputedStyle(document.documentElement).getPropertyValue('--danger').trim(),
              getComputedStyle(document.documentElement).getPropertyValue('--danger').trim()
            ],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => c.parsed.y.toFixed(1) + ' jt' } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: axisColor } },
            y: { grid: { color: gridColor }, ticks: { color: axisColor, callback: v => v + ' jt' } }
          }
        }
      }));
    }

    // Cash quality donut
    const ctx3 = document.getElementById('chart-cash-quality');
    if (ctx3 && ctx3.offsetParent) {
      charts.push(new Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: (D.CASH_QUALITY||[]).map(function(x){return x.kategori;}),
          datasets: [{
            data: (D.CASH_QUALITY||[]).map(function(x){return x.nilai/1e6;}),
            backgroundColor: [salesColor, cashColor, planColor, getComputedStyle(document.documentElement).getPropertyValue('--proj-mayana2').trim()],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { color: axisColor, boxWidth: 12, font: { size: 11 } } }
          },
          cutout: '60%'
        }
      }));
    }

    // Budget burn — project-aware when a project is selected.
    const ctx4 = document.getElementById('chart-budget-burn');
    if (ctx4 && ctx4.offsetParent) {
      let budgetRows = [];
      const scopeProject = D.currentProjectId && D.currentProjectId() !== 'all' ? D.currentProjectId() : 'all';
      if(scopeProject !== 'all'){
        const p=(D.PROJECTS||[]).find(x=>x.id===scopeProject);
        const grouped={};
        ((D.CANONICAL&&D.CANONICAL.tables&&D.CANONICAL.tables.budgeting_item)||[]).filter(r=>p&&r.Cluster===p.name).forEach(r=>{
          const k=r['Jenis Pekerjaan']||'Lainnya'; if(!grouped[k])grouped[k]={name:k,plan:0,real:0}; grouped[k].plan+=Number(r['Jumlah Rencana'])||0; grouped[k].real+=Number(r['Terbayar'])||0;
        });
        budgetRows=Object.keys(grouped).map(k=>grouped[k]);
      } else {
        budgetRows=((D.CANONICAL&&D.CANONICAL.tables&&D.CANONICAL.tables.dashboard_budget_realisasi)||[]).map(x=>({name:x['Jenis Pekerjaan'],plan:x['Alokasi Anggaran']||0,real:x['Realisasi']||0}));
      }
      charts.push(new Chart(ctx4, {
        type: 'bar',
        data: {
          labels: budgetRows.map(x=>x.name),
          datasets: [
            { label: 'Anggaran', data: budgetRows.map(x=>x.plan/1e9), backgroundColor: planColor, borderRadius: 4 },
            { label: 'Realisasi', data: budgetRows.map(x=>x.real/1e9), backgroundColor: actualColor, borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top', labels: { color: axisColor, boxWidth: 12 } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: axisColor } },
            y: { grid: { color: gridColor }, ticks: { color: axisColor, callback: v => v + ' M' } }
          }
        }
      }));
    }

    // P0 Scatter: % bayar (x) vs % progres (y) per proyek
    const ctx5 = document.getElementById('chart-pay-progress');
    if (ctx5 && ctx5.offsetParent) {
      const scatterPts = (D.PROJECT_HEALTH||[]).map(function(p){
        var rows=(D.CANONICAL&&D.CANONICAL.tables&&D.CANONICAL.tables.rekap_konstruksi||[]).filter(function(r){return r.Cluster===p.name;});
        var prog=rows.length?rows.reduce(function(a,r){return a+(Number(r['%'])||0);},0)/rows.length:0;
        return {x:Math.round((p.rasio||0)*100),y:Math.round(prog),label:p.short};
      });
      const projColors = [
        getComputedStyle(document.documentElement).getPropertyValue('--proj-joyo').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--proj-sigura').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--proj-lumiera').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--proj-mayana2').trim(),
        getComputedStyle(document.documentElement).getPropertyValue('--proj-resort').trim()
      ];
      charts.push(new Chart(ctx5, {
        type: 'scatter',
        data: {
          datasets: scatterPts.map((pt, i) => ({
            label: pt.label,
            data: [{ x: pt.x, y: pt.y }],
            backgroundColor: projColors[i],
            pointRadius: 8,
            pointHoverRadius: 10
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { color: axisColor, boxWidth: 12, font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: (ctx) => ctx.dataset.label + ': bayar ' + ctx.parsed.x + '% · progres ' + ctx.parsed.y + '%'
              }
            }
          },
          scales: {
            x: {
              min: 0, max: 100,
              title: { display: true, text: '% Bayar konsumen', color: axisColor },
              grid: { color: gridColor },
              ticks: { color: axisColor, callback: v => v + '%' }
            },
            y: {
              min: 0, max: 100,
              title: { display: true, text: '% Progres konstruksi', color: axisColor },
              grid: { color: gridColor },
              ticks: { color: axisColor, callback: v => v + '%' }
            }
          }
        }
      }));
    }
  }

  /* ========== Main render ========== */
  let activeTab = 'overview';
  const TABS = [['overview','Ringkasan'],['cash','Kas & Anggaran'],['risk','Risiko & Data']];

  function renderTabs() {
    return '<div class="tab-bar" role="tablist" aria-label="Bagian dashboard">' +
      TABS.map(function (t) {
        return '<button class="tab-btn' + (activeTab === t[0] ? ' active' : '') + '" type="button" role="tab" id="tab-' + t[0] + '" data-tab="' + t[0] + '" aria-selected="' + (activeTab === t[0] ? 'true' : 'false') + '" aria-controls="tabpanel-' + t[0] + '">' + t[1] + '</button>';
      }).join('') + '</div>';
  }
  function tabPanel(id, html) {
    return '<div class="tab-panel" role="tabpanel" id="tabpanel-' + id + '" aria-labelledby="tab-' + id + '"' + (activeTab === id ? '' : ' hidden') + '>' + html + '</div>';
  }

  function render(root) {
    if (!root) return;
    bindViewportOnce();

    const overviewPanel =
      renderKPI() +
      '<div class="zone zone-2-8-4">' + renderProjectMatrix() + renderFunnel() + '</div>' +
      '<div class="zone zone-2-8-4">' + renderSalesCombo() + renderCelah() + '</div>';

    const cashPanel =
      '<div class="zone zone-2-6-6">' + renderCashBridge() + renderCashQuality() + '</div>' +
      '<div class="zone zone-2-7-5">' + renderBudgetBurn() + renderDueItems() + '</div>';

    const riskPanel =
      '<div class="zone zone-3-4-4-4">' + renderPayVsProgress() + renderLateST() + renderLegalHeat() + '</div>' +
      '<div class="zone zone-2-6-6">' +
        renderAging('w-dir-14', 'Umur piutang', D.AR_AGING||[], 'var(--warning)') +
        renderAging('w-dir-15', 'Umur hutang', D.AP_AGING||[], 'var(--danger)') +
      '</div>' +
      '<div class="zone zone-1">' + renderActivityDQ() + '</div>';

    root.innerHTML =
      renderGlobalBar() +
      renderDecisionCenter() +
      renderTabs() +
      tabPanel('overview', overviewPanel) +
      tabPanel('cash', cashPanel) +
      tabPanel('risk', riskPanel);

    // Charts after DOM paint
    requestAnimationFrame(() => {
      initCharts();
    });

    root.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTab = btn.dataset.tab || 'overview';
        render(root);
      });
    });
    root.querySelectorAll('[data-detail]').forEach(function(btn){btn.addEventListener('click',function(){if(window.AdhShell&&AdhShell.openDetail)AdhShell.openDetail(btn.dataset.detail,{title:btn.dataset.detailTitle||undefined});});});

    var per=root.querySelector('#filter-periode');if(per)per.addEventListener('change',function(){viewPeriod=Number(per.value)||12;render(root);});
    var cmp=root.querySelector('#filter-pembanding');if(cmp)cmp.addEventListener('change',function(){compareMode=cmp.value||'period';render(root);});

    var ex=root.querySelector('[data-action="export-projects"]');if(ex)ex.addEventListener('click',function(){var rows=(D.CANONICAL&&D.CANONICAL.derived&&D.CANONICAL.derived.projectSummary)||[];if(window.AdhLocalState&&AdhLocalState.exportCsv)AdhLocalState.exportCsv('adhiland-project-summary.csv',rows,['name','kas','ppjb','masuk','sisa','rasio','n','belum']);else{var csv=['Project,Kas,PPJB,Uang Masuk,Piutang,Rasio,Terjual,Belum Terjual'].concat(rows.map(function(r){return [r.name,r.kas,r.ppjb,r.masuk,r.sisa,r.rasio,r.n,r.belum].map(function(v){return '"'+String(v==null?'':v).replace(/"/g,'""')+'"';}).join(',')})).join('\n');var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='adhiland-project-summary.csv';a.click();}});
    // Re-init charts on theme change (fade swap, no harsh flash)
    window.addEventListener('themechange', () => {
      const wraps = root.querySelectorAll('.chart-container');
      wraps.forEach(function (c) { c.classList.add('chart-swapping'); });
      requestAnimationFrame(function () {
        initCharts();
        setTimeout(function () {
          wraps.forEach(function (c) { c.classList.remove('chart-swapping'); });
        }, 80);
      });
    });

    // Board Pack: use the browser's professional print flow; no duplicate mock alert.
    var board=root.querySelector('[data-action="board-pack"]');
    if(board) board.addEventListener('click',function(){
      if(window.AdhShell&&AdhShell.showToast)AdhShell.showToast('Board Pack siap dicetak','info');
      setTimeout(function(){window.print();},120);
    });
  }

  function resizeCharts(){
    charts.forEach(function(c){ try { c.resize(); } catch(e){} });
  }

  window.AdhDashboard = { render: render, resizeCharts: resizeCharts };
})();
