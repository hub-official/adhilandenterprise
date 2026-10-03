/**
 * Adhiland Finance — Unified number & date formatters
 * Spec: 08_SPEC_INFOGRAFIK.md §3
 * All display numbers MUST go through these functions.
 */
(function (global) {
  'use strict';

  const IDR = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  const IDR_DEC = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const NUM = new Intl.NumberFormat('id-ID');
  const NUM_DEC = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  });

  const MONTHS_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];

  /**
   * Format Rupiah.
   * @param {number} value
   * @param {'full'|'compact'|'dec'} mode - full = Rp 75.308.483; compact = Rp 75,31 jt / Rp 103,94 M; dec = with decimals
   */
  function fmtIDR(value, mode) {
    if (value == null || Number.isNaN(value)) return '–';
    const v = Number(value);
    if (mode === 'dec') return IDR_DEC.format(v).replace(/\s/g, ' ');
    if (mode === 'compact') {
      const abs = Math.abs(v);
      if (abs >= 1e12) return 'Rp ' + NUM_DEC.format(v / 1e12) + ' T';
      if (abs >= 1e9)  return 'Rp ' + NUM_DEC.format(v / 1e9) + ' M';
      if (abs >= 1e6)  return 'Rp ' + NUM_DEC.format(v / 1e6) + ' jt';
      if (abs >= 1e3)  return 'Rp ' + NUM_DEC.format(v / 1e3) + ' rb';
      return IDR.format(v).replace(/\s/g, ' ');
    }
    return IDR.format(v).replace(/\s/g, ' ');
  }

  /**
   * Format percentage 0–1 or 0–100 → "12,8%"
   * @param {number} value - if >1 assume already percent
   * @param {number} [digits=1]
   */
  function fmtPct(value, digits) {
    if (value == null || Number.isNaN(value)) return '–';
    const v = Number(value);
    const pct = v > 1 || v < -1 ? v : v * 100;
    return NUM_DEC.format(Number(pct.toFixed(digits == null ? 1 : digits))) + '%';
  }

  /**
   * Format plain number with thousand separators
   */
  function fmtNum(value, digits) {
    if (value == null || Number.isNaN(value)) return '–';
    if (digits != null) {
      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }).format(value);
    }
    return NUM.format(value);
  }

  /**
   * Format date for display: "30 Sep 2026"
   * @param {Date|string|number} d
   */
  function fmtDate(d) {
    if (!d) return '–';
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return '–';
    return date.getDate() + ' ' + MONTHS_ID[date.getMonth()] + ' ' + date.getFullYear();
  }

  /**
   * Format datetime: "30 Sep 2026 14:05"
   */
  function fmtDateTime(d) {
    if (!d) return '–';
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return '–';
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return fmtDate(date) + ' ' + h + ':' + m;
  }

  /**
   * Days label: "259 hari"
   */
  function fmtDays(n) {
    if (n == null || Number.isNaN(n)) return '–';
    return fmtNum(Math.round(n)) + ' hari';
  }

  /**
   * Delta display helper
   * @param {number} current
   * @param {number} previous
   * @param {boolean} lowerIsBetter
   */
  function fmtDelta(current, previous, lowerIsBetter) {
    if (current == null || previous == null || previous === 0) return { text: '–', cls: 'neutral' };
    const diff = current - previous;
    const pct = (diff / Math.abs(previous)) * 100;
    const sign = diff > 0 ? '+' : '';
    const text = sign + NUM_DEC.format(Number(pct.toFixed(1))) + '%';
    let cls = 'neutral';
    if (diff > 0) cls = lowerIsBetter ? 'up-bad' : 'up-good';
    else if (diff < 0) cls = lowerIsBetter ? 'down-good' : 'down-bad';
    return { text, cls, diff, pct };
  }

  global.fmt = {
    IDR: fmtIDR,
    pct: fmtPct,
    num: fmtNum,
    date: fmtDate,
    dateTime: fmtDateTime,
    days: fmtDays,
    delta: fmtDelta,
    MONTHS_ID
  };
})(typeof window !== 'undefined' ? window : globalThis);

/* Upgrade API: unit-scaled currency for dense financial tables. */
(function(global){
  if(!global.fmt) return;
  global.fmt.IDRUnit = function(value, unit, digits){
    if(value==null || Number.isNaN(Number(value))) return '–';
    var n=Number(value), div=unit==='triliun'?1e12:unit==='juta'?1e6:unit==='ribu'?1e3:1;
    var d=digits==null?(div===1?0:1):digits;
    return (n/div).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
  };
})(typeof window!=='undefined'?window:globalThis);
