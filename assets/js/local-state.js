/**
 * Adhiland — local mock state (sessionStorage)
 * Persist approve/reject (+ alasan), created pengajuan, legal status, progres %.
 * Label UI: "(mock lokal)"
 *
 * F1: pengajuan override value can be:
 *   - string status (legacy): "Disetujui" | "Ditolak" | "Menunggu"
 *   - object: { status, alasan?, at? }
 * F2: created pengajuan list in sessionStorage, merged into AdhData.PENGAJUAN
 */
(function (global) {
  'use strict';
  /** Nominal max (Rp) Finance boleh approve final tanpa loloskan ke Direktur. Di atas = hanya Loloskan. */
  var LIMIT_APPROVE_FINANCE = 10000000; // Rp 10 juta — default F6

  var KEY = {
    pengajuan: 'adh_mock_pengajuan_status',
    created: 'adh_mock_pengajuan_created',
    paid: 'adh_mock_pengajuan_paid',
    budgetBump: 'adh_mock_budget_bump',
    audit: 'adh_mock_audit_log',
    legal: 'adh_mock_legal_status',
    progres: 'adh_mock_progres_pct'
  };

  function read(key) {
    try {
      var raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : (key === KEY.created ? [] : {});
    } catch (e) { return key === KEY.created ? [] : {}; }
  }
  function write(key, obj) {
    try { sessionStorage.setItem(key, JSON.stringify(obj)); } catch (e) { /* ignore */ }
  }

  /** Normalize override entry → { status, alasan, at } */
  function normEntry(v) {
    if (v == null) return null;
    if (typeof v === 'string') {
      return { status: v, alasan: null, at: null };
    }
    if (typeof v === 'object') {
      return {
        status: v.status || null,
        alasan: v.alasan || null,
        at: v.at || null,
        paidAt: v.paidAt || null
      };
    }
    return null;
  }

  function refreshBudgetMenunggu() {
    if (!global.AdhData || !Array.isArray(AdhData.PENGAJUAN)) return;
    if (AdhData.BUDGET && AdhData.BUDGET.pengajuanMenunggu) {
      var menunggu = AdhData.PENGAJUAN.filter(function (p) {
        return (p.status || '').toLowerCase() === 'menunggu';
      });
      AdhData.BUDGET.pengajuanMenunggu.n = menunggu.length;
      AdhData.BUDGET.pengajuanMenunggu.nilai = menunggu.reduce(function (s, p) {
        return s + (p.jumlah || 0);
      }, 0);
    }
  }

  var LS = {
    /** Apply status overrides onto PENGAJUAN array in-place */
    applyPengajuan: function (list) {
      var map = read(KEY.pengajuan);
      (list || []).forEach(function (p) {
        var entry = normEntry(map[p.id]);
        if (entry && entry.status) {
          p.status = entry.status;
          if (entry.alasan) p.alasan = entry.alasan;
          if (entry.at) p._mockAt = entry.at;
          if (entry.paidAt) {
            p._paidAt = entry.paidAt;
            p.statusPembayaran = 'Dibayar';
          }
        }
      });
      return list;
    },

    /**
     * Merge session-created pengajuan into AdhData.PENGAJUAN (prepend, skip dup ids).
     * Call after load + applyPengajuan.
     */
    mergeCreatedPengajuan: function () {
      if (!global.AdhData) return [];
      if (!Array.isArray(AdhData.PENGAJUAN)) AdhData.PENGAJUAN = [];
      var created = read(KEY.created);
      if (!Array.isArray(created) || !created.length) return created;
      var existing = {};
      AdhData.PENGAJUAN.forEach(function (p) { existing[String(p.id)] = true; });
      // apply status overrides on created items too
      var map = read(KEY.pengajuan);
      created.forEach(function (p) {
        var entry = normEntry(map[p.id]);
        if (entry && entry.status) {
          p.status = entry.status;
          if (entry.alasan) p.alasan = entry.alasan;
        }
        if (!existing[String(p.id)]) {
          AdhData.PENGAJUAN.unshift(p);
          existing[String(p.id)] = true;
        }
      });
      refreshBudgetMenunggu();
      return created;
    },

    /** List of mock-created pengajuan (session) */
    getCreatedPengajuan: function () {
      return read(KEY.created);
    },

    /**
     * Create a new pengajuan (F2). Persist session + push in-memory.
     * @param {object} payload fields without id/status/sumberRole (those filled here if missing)
     * @param {string} role sumberRole / page role
     * @returns {object} created row
     */
    createPengajuan: function (payload, role) {
      payload = payload || {};
      var now = new Date();
      var id = payload.id || ('PGJ-MOCK-' + now.getTime().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100));
      var row = {
        id: id,
        tanggal: payload.tanggal || now.toISOString(),
        jenis: payload.jenis || 'Anggaran',
        cluster: payload.cluster || payload.proyek || '',
        proyek: payload.proyek || payload.cluster || '',
        proyekId: payload.proyekId || null,
        pemohon: payload.pemohon || ('User Mock ' + (role || '')),
        keperluan: payload.keperluan || '',
        rekening: payload.rekening || null,
        jumlah: Number(payload.jumlah) || 0,
        bukti: null,
        status: payload.status || 'Menunggu review',
        statusPembayaran: null,
        alasan: null,
        sumberRole: role || payload.sumberRole || 'Direktur',
        umur: 0,
        _mockCreated: true
      };
      var list = read(KEY.created);
      if (!Array.isArray(list)) list = [];
      list.unshift(row);
      write(KEY.created, list);

      if (global.AdhData) {
        if (!Array.isArray(AdhData.PENGAJUAN)) AdhData.PENGAJUAN = [];
        AdhData.PENGAJUAN.unshift(row);
        refreshBudgetMenunggu();
      }
      return row;
    },

    /**
     * Set pengajuan status override.
     * @param {string|number} id
     * @param {string} status  e.g. "Disetujui" | "Ditolak"
     * @param {string} [alasan] required for reject in UI; optional here
     */
    setPengajuanStatus: function (id, status, alasan) {
      var map = read(KEY.pengajuan);
      var entry = {
        status: status,
        alasan: alasan || null,
        at: new Date().toISOString()
      };
      map[String(id)] = entry;
      write(KEY.pengajuan, map);
      try {
        LS.appendAudit({
          aksi: status,
          by: (global.AdhShell && AdhShell._lastRole) || 'Direktur',
          at: entry.at,
          alasan: alasan || null,
          refId: String(id)
        });
      } catch (e) { /* ignore */ }
      // also mutate in-memory if loaded
      if (global.AdhData && Array.isArray(AdhData.PENGAJUAN)) {
        var row = AdhData.PENGAJUAN.find(function (p) { return String(p.id) === String(id); });
        if (row) {
          row.status = status;
          if (alasan) row.alasan = alasan;
          row._mockAt = entry.at;
        }
        // also update in created list if present
        var created = read(KEY.created);
        if (Array.isArray(created)) {
          var c = created.find(function (p) { return String(p.id) === String(id); });
          if (c) {
            c.status = status;
            if (alasan) c.alasan = alasan;
            write(KEY.created, created);
          }
        }
        refreshBudgetMenunggu();
      }
    },
    setPengajuanStatusBulk: function (ids, status, alasan) {
      (ids || []).forEach(function (id) { LS.setPengajuanStatus(id, status, alasan); });
    },

    /**
     * Mark pengajuan as Dibayar (F4). Also bumps in-memory BUDGET.realisasi & reduces KAS mock.
     */
    markPaid: function (id) {
      var paidAt = new Date().toISOString();
      LS.setPengajuanStatus(id, 'Dibayar', null);
      // ensure paidAt stored in override entry
      var map = read(KEY.pengajuan);
      var entry = normEntry(map[String(id)]) || { status: 'Dibayar' };
      entry.status = 'Dibayar';
      entry.paidAt = paidAt;
      entry.at = entry.at || paidAt;
      map[String(id)] = entry;
      write(KEY.pengajuan, map);

      var amount = 0;
      if (global.AdhData && Array.isArray(AdhData.PENGAJUAN)) {
        var row = AdhData.PENGAJUAN.find(function (p) { return String(p.id) === String(id); });
        if (row) {
          row.status = 'Dibayar';
          row.statusPembayaran = 'Dibayar';
          row._paidAt = paidAt;
          amount = Number(row.jumlah) || 0;
        }
      }
      // persist paid ids list
      var paidList = read(KEY.paid);
      if (!Array.isArray(paidList)) paidList = [];
      var exists = paidList.some(function (x) { return String(x.id) === String(id); });
      if (!exists) {
        paidList.unshift({ id: String(id), amount: amount, at: paidAt });
        write(KEY.paid, paidList);
      }
      // budget/kas mock bump (session aggregate)
      var bump = read(KEY.budgetBump);
      if (!bump || typeof bump !== 'object') bump = { terbayar: 0, kasDelta: 0 };
      // only add once per id — track via paid list length already guarded
      if (!exists) {
        bump.terbayar = (Number(bump.terbayar) || 0) + amount;
        bump.kasDelta = (Number(bump.kasDelta) || 0) - amount;
        write(KEY.budgetBump, bump);
      }
      LS.applyBudgetBump();
      return { id: id, amount: amount, at: paidAt };
    },
    markPaidBulk: function (ids) {
      (ids || []).forEach(function (id) { LS.markPaid(id); });
    },
    getPaidList: function () {
      var list = read(KEY.paid);
      return Array.isArray(list) ? list : [];
    },
    /** Apply session budget/kas mock adjustments onto AdhData */
    applyBudgetBump: function () {
      if (!global.AdhData) return;
      var bump = read(KEY.budgetBump);
      if (!bump || typeof bump !== 'object') return;
      AdhData.BUDGET = AdhData.BUDGET || {};
      var baseReal = Number(AdhData.BUDGET._baseRealisasi != null ? AdhData.BUDGET._baseRealisasi : AdhData.BUDGET.realisasi) || 0;
      if (AdhData.BUDGET._baseRealisasi == null) AdhData.BUDGET._baseRealisasi = baseReal;
      AdhData.BUDGET.realisasi = baseReal + (Number(bump.terbayar) || 0);
      var ang = Number(AdhData.BUDGET.anggaran) || 0;
      AdhData.BUDGET.serapan = ang > 0 ? AdhData.BUDGET.realisasi / ang : 0;
      if (AdhData.KAS) {
        var baseKas = Number(AdhData.KAS._baseTotal != null ? AdhData.KAS._baseTotal : AdhData.KAS.total) || 0;
        if (AdhData.KAS._baseTotal == null) AdhData.KAS._baseTotal = baseKas;
        AdhData.KAS.total = baseKas + (Number(bump.kasDelta) || 0);
      }
    },

    /** Raw map (may contain string or object values — use getPengajuanEntry) */
    getPengajuanMap: function () { return read(KEY.pengajuan); },
    /** Normalized entry for one id, or null */
    getPengajuanEntry: function (id) {
      var map = read(KEY.pengajuan);
      return normEntry(map[String(id)]);
    },

    /** Legal cell: key = kavlingId|docType → status done|progress|overdue|todo */
    getLegalStatus: function (kavlingId, docType) {
      var map = read(KEY.legal);
      return map[String(kavlingId) + '|' + docType] || null;
    },
    setLegalStatus: function (kavlingId, docType, status) {
      var map = read(KEY.legal);
      map[String(kavlingId) + '|' + docType] = status;
      write(KEY.legal, map);
    },
    getLegalMap: function () { return read(KEY.legal); },

    /** Progres % by kavling id */
    getProgres: function (kavlingId) {
      var map = read(KEY.progres);
      var v = map[String(kavlingId)];
      return v == null ? null : Number(v);
    },
    setProgres: function (kavlingId, pct) {
      var map = read(KEY.progres);
      map[String(kavlingId)] = Number(pct);
      write(KEY.progres, map);
    },
    getProgresMap: function () { return read(KEY.progres); },

    clearAll: function () {
      try {
        sessionStorage.removeItem(KEY.pengajuan);
        sessionStorage.removeItem(KEY.created);
        sessionStorage.removeItem(KEY.paid);
        sessionStorage.removeItem(KEY.budgetBump);
        sessionStorage.removeItem(KEY.audit);
        sessionStorage.removeItem(KEY.legal);
        sessionStorage.removeItem(KEY.progres);
      } catch (e) { /* ignore */ }
    },

    /** Append audit log entry (F5) */
    appendAudit: function (entry) {
      var list = read(KEY.audit);
      if (!Array.isArray(list)) list = [];
      var row = {
        id: entry.id || ('AUD-' + Date.now()),
        aksi: entry.aksi || '—',
        by: entry.by || 'Direktur',
        at: entry.at || new Date().toISOString(),
        alasan: entry.alasan || null,
        refId: entry.refId || null,
        meta: entry.meta || null
      };
      list.unshift(row);
      if (list.length > 200) list = list.slice(0, 200);
      write(KEY.audit, list);
      return row;
    },
    getAuditLog: function (limit) {
      var list = read(KEY.audit);
      if (!Array.isArray(list)) list = [];
      if (limit) return list.slice(0, limit);
      return list;
    },
    /** Compute commit / queue aggregates from AdhData + overrides */
    getFinanceSnapshot: function () {
      var list = (global.AdhData && AdhData.PENGAJUAN) || [];
      function norm(s) { return (s || '').toLowerCase().replace(/_/g, ' ').trim(); }
      var menunggu = 0, menungguN = 0, review = 0, reviewN = 0, commit = 0, commitN = 0, dibayar = 0, dibayarN = 0;
      list.forEach(function (p) {
        var s = norm(p.status);
        var j = Number(p.jumlah) || 0;
        if (s === 'menunggu' || s === 'menunggu direktur') { menunggu += j; menungguN++; }
        else if (s === 'menunggu review') { review += j; reviewN++; }
        else if (s === 'disetujui') { commit += j; commitN++; }
        else if (s === 'dibayar') { dibayar += j; dibayarN++; }
      });
      var kas = (global.AdhData && AdhData.KAS && AdhData.KAS.total) || 0;
      var tempo = (global.AdhData && AdhData.BUDGET && AdhData.BUDGET.jatuhTempo && AdhData.BUDGET.jatuhTempo.nilai) || 0;
      var anggaran = (global.AdhData && AdhData.BUDGET && AdhData.BUDGET.anggaran) || 0;
      var realisasi = (global.AdhData && AdhData.BUDGET && AdhData.BUDGET.realisasi) || 0;
      var masukProxy = (global.AdhData && AdhData.SALES && AdhData.SALES.uangMasuk) ? Math.round(AdhData.SALES.uangMasuk * 0.02) : 0; // indikatif kecil
      // forecast: kas - antrian direktur - commit - tempo + proxy masuk
      var f30 = kas - menunggu - commit - tempo + masukProxy;
      var f60 = f30 + Math.round(masukProxy * 0.5);
      var f90 = f60 + Math.round(masukProxy * 0.5);
      return {
        kas: kas,
        anggaran: anggaran,
        realisasi: realisasi,
        commit: commit,
        commitN: commitN,
        menunggu: menunggu,
        menungguN: menungguN,
        review: review,
        reviewN: reviewN,
        dibayar: dibayar,
        dibayarN: dibayarN,
        tempo: tempo,
        masukProxy: masukProxy,
        forecast30: f30,
        forecast60: f60,
        forecast90: f90
      };
    },
    /** Download CSV from array of objects */
    exportCsv: function (filename, rows, columns) {
      if (!rows || !rows.length) {
        LS.showToast('Tidak ada data untuk export', 'warn');
        return;
      }
      columns = columns || Object.keys(rows[0]);
      function esc(v) {
        if (v == null) return '';
        var s = String(v);
        if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
      }
      var lines = [columns.join(',')];
      rows.forEach(function (r) {
        lines.push(columns.map(function (c) { return esc(r[c]); }).join(','));
      });
      var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || 'export.csv';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      LS.showToast('Export CSV: ' + filename, 'info');
    }
  };

  LS.showToast = function (msg, kind) {
    kind = kind || 'info';
    var host = document.querySelector('.toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast-host';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      host.setAttribute('aria-atomic', 'true');
      host.setAttribute('aria-label', 'Notifikasi');
      document.body.appendChild(host);
    }
    var el = document.createElement('div');
    el.className = 'toast toast-' + kind;
    el.setAttribute('role', 'status');
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity .25s';
      setTimeout(function () { el.remove(); }, 280);
    }, 2800);
  };

  /** Wire common dead buttons: Export, etc. — mock toast only */
  LS.wireMockButtons = function (root) {
    root = root || document;
    root.querySelectorAll('button').forEach(function (btn) {
      if (btn.dataset.mockWired) return;
      var label = (btn.textContent || '').trim().toLowerCase();
      if (!label) return;
      var isExport = label.indexOf('export') >= 0;
      var isImport = label.indexOf('impor') >= 0;
      if (isExport || isImport) {
        btn.dataset.mockWired = '1';
        btn.dataset.mockAction = 'export';
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          LS.showToast((isImport ? 'Impor' : 'Export') + ' (mock) — belum tersedia di mockup', 'info');
        });
      }
    });
  };

  LS.LIMIT_APPROVE_FINANCE = LIMIT_APPROVE_FINANCE;
  LS.canFinanceApprove = function (jumlah) {
    return (Number(jumlah) || 0) <= LIMIT_APPROVE_FINANCE;
  };

  global.AdhLocalState = LS;
})(typeof window !== 'undefined' ? window : this);
