/**
 * Adhiland ERP — Data layer (real extract 2026-10-02)
 * Loads assets/data/*.json; falls back to embedded aggregate.
 * All numbers from dashboard_proyek + pengajuan + kavling_master.
 */
window.AdhData = (function () {
  'use strict';

  const DATA_BASE = (function () {
    const scripts = document.getElementsByTagName('script');
    for (let i = scripts.length - 1; i >= 0; i--) {
      const src = scripts[i].src || '';
      if (src.indexOf('data.js') !== -1) {
        return src.replace(/assets\/js\/data\.js.*$/, 'assets/data/');
      }
    }
    const path = window.location.pathname;
    if (path.indexOf('/kavling-detail/') !== -1) return '../../assets/data/';
    if (path.indexOf('/Direktur/') !== -1 || path.indexOf('/Legal/') !== -1 ||
        path.indexOf('/Teknik/') !== -1 || path.indexOf('/Marketing/') !== -1 ||
        path.indexOf('/Operasional/') !== -1 ||
        path.indexOf('/Finance/') !== -1) return '../assets/data/';
    return 'assets/data/';
  })();

  const EMBEDDED = {
    "AS_OF": "2026-10-02T12:00:00+07:00",
    "SOURCE": "database CSV extract 2026-10-02",
    "PROJECTS": [
      {"id":"joyo","name":"EazyKost Joyo Agung","short":"Joyo","kode":"joyo-agung","alamat":"","npwp":""},
      {"id":"sigura","name":"EazyKost Sigura-gura","short":"Sigura","kode":"siguragura","alamat":"","npwp":""},
      {"id":"lumiera","name":"Lumiera Garden","short":"Lumiera","kode":"lumiera","alamat":"","npwp":""},
      {"id":"resort","name":"Mayana Resort","short":"Resort","kode":"mayana","alamat":"","npwp":""},
      {"id":"mayana2","name":"Mayana II","short":"Mayana II","kode":"tahap2","alamat":"DAU Sumbersekar","npwp":""}
    ],
    "KAS": {"total":75308483,"byProject":{"joyo":0,"sigura":0,"lumiera":75308483,"resort":0,"mayana2":0}},
    "SALES": {
      "ppjb":103944800000,"uangMasuk":13286720000,"sisaTagihan":90658080000,"rasioMasuk":0.1278,"kavlingTerjual":63,
      "byProject":{
        "joyo":{"ppjb":20378800000,"masuk":0,"sisa":20378800000,"rasio":1,"n":14},
        "sigura":{"ppjb":49973000000,"masuk":0,"sisa":49973000000,"rasio":1,"n":18},
        "lumiera":{"ppjb":32315000000,"masuk":13286720000,"sisa":19028280000,"rasio":0.4112,"n":29},
        "resort":{"ppjb":1278000000,"masuk":0,"sisa":1278000000,"rasio":1,"n":2},
        "mayana2":{"ppjb":0,"masuk":0,"sisa":0,"rasio":0,"n":0}
      }
    },
    "STOK": {
      "belumTerjual":43,"potensi":61825100000,
      "funnel":{"belum":43,"dealBelumBayar":47,"bertahap":13,"cash":3}
    },
    "LIABILITAS":{"hutang":0,"piutangUsaha":0,"piutangKaryawan":0,"piutangLain":0},
    "BUDGET":{
      "anggaran":0,"realisasi":0,"serapan":0,
      "konstruksiSerapan":0.044,"konstruksiAnggaran":42680000000,"konstruksiRealisasi":1880000000,
      "jatuhTempo":{"n":0,"nilai":0},
      "pengajuanMenunggu":{"n":80,"nilai":2767325772,"tertuaHari":17}, "anggaran":2502827936,"realisasi":0,"serapan":0,"jatuhTempo":{"n":21,"nilai":1077915700}
    },
    "CASH_COVER":{"rasio":0.0272,"kebutuhanBayar":2767325772,"selisih":-2692017289},
    "KONSTRUKSI":{"total":63,"onProgress":55,"terlambat":0,"close":8,"rataTelatHari":0,"maxTelatHari":0},
    "LEGAL":{"done":9,"target":448,"pct":0.0201,"rows":106},
    "DECISIONS":[
      {"id":1,"title":"80 pengajuan menunggu — Rp 2.767,33 jt","severity":"critical","meta":"Nilai total Rp 2.767.325.772","action":"Tinjau","href":"pengajuan.html"},
      {"id":2,"title":"Kas menutup 2,7% kebutuhan bayar","severity":"critical","meta":"Selisih Rp -2.692,02 jt vs pengajuan","action":"Lihat jembatan kas","href":"arus-kas.html"},
      {"id":5,"title":"Kelengkapan legal 2,0% (9/448 dokumen)","severity":"critical","meta":"Target 448 dokumen","action":"Buka Legal","href":"../Legal/index.html"}
    ],
    "PROJECT_HEALTH":[
      {"id":"joyo","name":"EazyKost Joyo Agung","short":"Joyo","kas":0,"ppjb":20378800000,"masuk":0,"rasio":1,"serapan":0,"telatST":0,"status":"critical"},
      {"id":"sigura","name":"EazyKost Sigura-gura","short":"Sigura","kas":0,"ppjb":49973000000,"masuk":0,"rasio":1,"serapan":0,"telatST":0,"status":"critical"},
      {"id":"lumiera","name":"Lumiera Garden","short":"Lumiera","kas":75308483,"ppjb":32315000000,"masuk":13286720000,"rasio":0.4112,"serapan":0,"telatST":0,"status":"ok"},
      {"id":"resort","name":"Mayana Resort","short":"Resort","kas":0,"ppjb":1278000000,"masuk":0,"rasio":1,"serapan":0,"telatST":0,"status":"critical"},
      {"id":"mayana2","name":"Mayana II","short":"Mayana II","kas":0,"ppjb":0,"masuk":0,"rasio":0,"serapan":0,"telatST":0,"status":"warn"}
    ],
    "PENGAJUAN": [],
    "KAVLING": [],
    "_loaded": false
  };

  const D = Object.assign({}, EMBEDDED);

  // Chart/widget extras (not always in aggregate.json)
  D.MONTHLY = D.MONTHLY || [];
  D.AR_AGING = D.AR_AGING || [];
  D.AP_AGING = D.AP_AGING || [];


  async function fetchJSON(name) {
    try {
      const res = await fetch(DATA_BASE + name);
      if (!res.ok) throw new Error(String(res.status));
      return await res.json();
    } catch (e) {
      console.warn('[AdhData] fetch failed:', name, e.message);
      return null;
    }
  }

  D.load = async function () {
    if (D._loaded) return D;
    // Canonical database snapshot generated from database.zip. This is the
    // single browser-side source for all 34 extracted tables + derived views.
    // Dimuat dari assets/js/canonical-data.js (global) lebih dulu, karena fetch()
    // ke file:// diblokir Chrome — tanpa ini semua tabel kanonik kosong saat
    // mockup dibuka dengan klik-ganda, dan seluruh popup detail jadi "Tidak ada data".
    var canonical = (typeof window !== 'undefined' && window.ADH_CANONICAL) || await fetchJSON('canonical-data.json');
    if (canonical) {
      D.CANONICAL = canonical;
      D.PROJECTS = canonical.projects || D.PROJECTS;
      D.DB = canonical.tables || {};
      D.DERIVED = canonical.derived || {};
      if (D.DERIVED.projectSummary) {
        D.PROJECT_HEALTH = D.DERIVED.projectSummary.map(function(p){
          return { id:p.id, name:p.name, short:p.short, kas:p.kas||0, ppjb:p.ppjb||0, masuk:p.masuk||0, rasio:p.rasio||0, serapan:0, telatST:0, konstruksiTelat:0, skor:(p.kas||0)>0?'ok':'critical', skorLabel:(p.kas||0)>0?'Sehat':'Kritis' };
        });
        D.KAS = { total:D.PROJECT_HEALTH.reduce(function(s,p){return s+p.kas;},0), byProject:{} };
        D.SALES = { ppjb:0, uangMasuk:0, sisaTagihan:0, rasioMasuk:0, kavlingTerjual:0, byProject:{} };
        D.STOK = { belumTerjual:0, potensi:0, funnel:{belum:0,dealBelumBayar:0,bertahap:0,cash:0} };
        canonical.derived.projectSummary.forEach(function(p){
          D.KAS.byProject[p.id]=p.kas||0;
          D.SALES.byProject[p.id]={ppjb:p.ppjb||0,masuk:p.masuk||0,sisa:p.sisa||0,rasio:p.rasio||0,n:p.n||0};
          D.SALES.ppjb+=p.ppjb||0; D.SALES.uangMasuk+=p.masuk||0; D.SALES.sisaTagihan+=p.sisa||0; D.SALES.kavlingTerjual+=p.n||0;
          D.STOK.belumTerjual+=p.belum||0; D.STOK.potensi+=p.stokValue||0;
        });
        D.SALES.rasioMasuk=D.SALES.ppjb?D.SALES.uangMasuk/D.SALES.ppjb:0;
      }
      if (D.DERIVED.monthlySales && D.DERIVED.monthlySales.length) D.MONTHLY=D.DERIVED.monthlySales;
      D.CASH_QUALITY=D.DERIVED.cashInQuality||[];
      D.DUE_ITEMS=D.DERIVED.dueItems||[];
      D.NOTIFICATIONS=D.DERIVED.notifications||[];
      D.BUDGET=D.BUDGET||{};
      if (D.DERIVED.approvalSummary) D.BUDGET.pengajuanMenunggu={n:D.DERIVED.approvalSummary.count,nilai:D.DERIVED.approvalSummary.value,tertuaHari:0};
      if (D.DERIVED.budgetSummary) { D.BUDGET.anggaran=D.DERIVED.budgetSummary.budget; D.BUDGET.realisasi=D.DERIVED.budgetSummary.realization; D.BUDGET.serapan=D.DERIVED.budgetSummary.rate; }
      D.DATA_QUALITY=D.DERIVED.dataQuality||{};
    }
    const [agg, kav, peng, legal] = await Promise.all([
      fetchJSON('aggregate.json'),
      fetchJSON('kavling.json'),
      fetchJSON('pengajuan.json'),
      fetchJSON('legal.json')
    ]);
    if (agg) {
      Object.keys(agg).forEach(function (k) { D[k] = agg[k]; });
      // preserve chart extras if aggregate omits them
      if (!D.MONTHLY) D.MONTHLY = EMBEDDED.MONTHLY;
      if (!D.AR_AGING) D.AR_AGING = EMBEDDED.AR_AGING;
      if (!D.AP_AGING) D.AP_AGING = EMBEDDED.AP_AGING;
    }
    if (kav) D.KAVLING = kav;
    if (peng) {
      D.PENGAJUAN = peng;
      // apply sessionStorage mock overrides (approve/reject lokal)
      if (typeof window !== 'undefined' && window.AdhLocalState) {
        window.AdhLocalState.applyPengajuan(D.PENGAJUAN);
        if (window.AdhLocalState.mergeCreatedPengajuan) {
          window.AdhLocalState.mergeCreatedPengajuan();
        }
        if (window.AdhLocalState.applyBudgetBump) {
          window.AdhLocalState.applyBudgetBump();
        }
      }
      var menunggu = D.PENGAJUAN.filter(function (p) { return (p.status || '').toLowerCase() === 'menunggu'; });
      D.BUDGET = D.BUDGET || {};
      D.BUDGET.pengajuanMenunggu = {
        n: menunggu.length,
        nilai: menunggu.reduce(function (s, p) { return s + (p.jumlah || 0); }, 0),
        tertuaHari: menunggu.reduce(function (m, p) { return Math.max(m, p.umur || 0); }, 0)
      };
    }
    if (legal) {
      var doneDocs = 0;
      legal.forEach(function (r) {
        ['slf','bast','ajb','bphtb','pph','balikNama','shgb'].forEach(function (k) {
          var v = (r[k] || '').trim().toLowerCase();
          if (v && v !== '-' && v !== 'belum' && v !== 'belum mulai') doneDocs++;
        });
      });
      D.LEGAL = D.LEGAL || {};
      D.LEGAL.done = doneDocs;
      D.LEGAL.rows = legal.length;
      D.LEGAL.target = legal.length * 7;
      D.LEGAL.pct = D.LEGAL.target ? doneDocs / D.LEGAL.target : 0;
      D.LEGAL_ROWS = legal;
    }
    
    // Re-apply canonical financial/derived views after legacy JSON compatibility loads.
    // Legacy normalized files remain available to existing pages, while executive
    // metrics and new detail interactions use the database.zip snapshot.
    if (canonical && canonical.derived) {
      var ps=canonical.derived.projectSummary||[];
      D.PROJECT_HEALTH=ps.map(function(p){return {id:p.id,name:p.name,short:p.short,kas:p.kas||0,ppjb:p.ppjb||0,masuk:p.masuk||0,rasio:p.rasio||0,serapan:0,telatST:0,konstruksiTelat:0,skor:(p.kas||0)>0?'ok':'critical',skorLabel:(p.kas||0)>0?'Sehat':'Kritis'};});
      D.KAS={total:ps.reduce(function(s,p){return s+(p.kas||0);},0),byProject:{}};
      D.SALES={ppjb:0,uangMasuk:0,sisaTagihan:0,rasioMasuk:0,kavlingTerjual:0,byProject:{}};
      D.STOK={belumTerjual:0,potensi:0,funnel:{belum:0,dealBelumBayar:0,bertahap:0,cash:0}};
      ps.forEach(function(p){D.KAS.byProject[p.id]=p.kas||0;D.SALES.byProject[p.id]={ppjb:p.ppjb||0,masuk:p.masuk||0,sisa:p.sisa||0,rasio:p.rasio||0,n:p.n||0};D.SALES.ppjb+=p.ppjb||0;D.SALES.uangMasuk+=p.masuk||0;D.SALES.sisaTagihan+=p.sisa||0;D.SALES.kavlingTerjual+=p.n||0;D.STOK.belumTerjual+=p.belum||0;D.STOK.potensi+=p.stokValue||0;});
      D.SALES.rasioMasuk=D.SALES.ppjb?D.SALES.uangMasuk/D.SALES.ppjb:0;
      D.MONTHLY=canonical.derived.monthlySales||D.MONTHLY;
      D.CASH_QUALITY=canonical.derived.cashInQuality||[]; D.DUE_ITEMS=canonical.derived.dueItems||[]; D.NOTIFICATIONS=canonical.derived.notifications||[]; D.DATA_QUALITY=canonical.derived.dataQuality||{};
      if(canonical.derived.arAging)D.AR_AGING=canonical.derived.arAging; if(canonical.derived.apAging)D.AP_AGING=canonical.derived.apAging;
      var phRows=(canonical.tables&&canonical.tables.piutang_hutang)||[];var phPi=phRows.filter(function(r){return r.Seksi==='Piutang'&&String(r.Akun||'').toLowerCase().indexOf('total')<0;}).reduce(function(a,r){return a+(Number(r.Saldo)||0);},0);var phHu=phRows.filter(function(r){return r.Seksi==='Hutang'&&String(r.Akun||'').toLowerCase().indexOf('total')<0;}).reduce(function(a,r){return a+(Number(r.Saldo)||0);},0);D.LIABILITAS=D.LIABILITAS||{};D.LIABILITAS.piutangUsaha=phPi;D.LIABILITAS.hutang=phHu;
      if(canonical.derived.approvalSummary){D.BUDGET=D.BUDGET||{};D.BUDGET.pengajuanMenunggu={n:canonical.derived.approvalSummary.count,nilai:canonical.derived.approvalSummary.value,tertuaHari:0};}
      var dueNeed=(canonical.derived.dueItems||[]).filter(function(x){return x.days<=7;}).reduce(function(a,x){return a+(x.amount||0);},0);var reqNeed=(canonical.derived.approvalSummary?canonical.derived.approvalSummary.value:0)+dueNeed;D.CASH_COVER={rasio:D.KAS.total/Math.max(1,reqNeed),kebutuhanBayar:reqNeed,selisih:D.KAS.total-reqNeed};
      if(canonical.derived.budgetSummary){D.BUDGET=D.BUDGET||{};D.BUDGET.anggaran=canonical.derived.budgetSummary.budget;D.BUDGET.realisasi=canonical.derived.budgetSummary.realization;D.BUDGET.serapan=canonical.derived.budgetSummary.rate;}
      if(canonical.tables&&canonical.tables.piutang_hutang){var rowsPH=canonical.tables.piutang_hutang;var pi=rowsPH.filter(function(r){return r.Seksi==='Piutang'&&String(r.Akun||'').toLowerCase().indexOf('total')<0;}).reduce(function(a,r){return a+(Number(r.Saldo)||0);},0);var hu=rowsPH.filter(function(r){return r.Seksi==='Hutang'&&String(r.Akun||'').toLowerCase().indexOf('total')<0;}).reduce(function(a,r){return a+(Number(r.Saldo)||0);},0);D.LIABILITAS={hutang:hu,piutangUsaha:pi,piutangKaryawan:0,piutangLain:0};}
    }

    if (!Array.isArray(D.MONTHLY)) D.MONTHLY = [];
    if (!Array.isArray(D.AR_AGING)) D.AR_AGING = [];
    if (!Array.isArray(D.AP_AGING)) D.AP_AGING = [];
    if (D.BUDGET.konstruksiSerapan == null) D.BUDGET.konstruksiSerapan = 0;

    
    if (Array.isArray(D.PROJECT_HEALTH)) {
      D.PROJECT_HEALTH.forEach(function (h) {
        if (h.konstruksiTelat == null) h.konstruksiTelat = h.telatST || 0;
        if (!h.skor) h.skor = h.status || 'warn';
        if (!h.skorLabel) {
          var map = { critical: 'Kritis', warn: 'Waspada', ok: 'Sehat', good: 'Sehat', bad: 'Kritis' };
          h.skorLabel = map[h.skor] || h.skor;
        }
      });
    }

    D.applyProjectView = function(){
      if(!D.CANONICAL||!D.CANONICAL.derived)return;
      var pid=D.currentProjectId();
      var ps=D.CANONICAL.derived.projectSummary||[];
      var allDue=D.CANONICAL.derived.dueItems||[];
      var allNotif=D.CANONICAL.derived.notifications||[];
      var allAr=D.CANONICAL.derived.arAging||[];
      var allAp=D.CANONICAL.derived.apAging||[];
      var allCashQuality=D.CANONICAL.derived.cashInQuality||[];
      var allMonthly=D.CANONICAL.derived.monthlySales||[];
      var tables=D.CANONICAL.tables||{};

      if(!pid||pid==='all'){
        var allSummary=ps;
        D.KAS={total:allSummary.reduce(function(s,p){return s+(p.kas||0);},0),byProject:{}};
        D.SALES={ppjb:0,uangMasuk:0,sisaTagihan:0,rasioMasuk:0,kavlingTerjual:0,byProject:{}};
        D.STOK={belumTerjual:0,potensi:0,funnel:{belum:0,dealBelumBayar:0,bertahap:0,cash:0}};
        allSummary.forEach(function(p){
          D.KAS.byProject[p.id]=p.kas||0;
          D.SALES.byProject[p.id]={ppjb:p.ppjb||0,masuk:p.masuk||0,sisa:p.sisa||0,rasio:p.rasio||0,n:p.n||0};
          D.SALES.ppjb+=p.ppjb||0; D.SALES.uangMasuk+=p.masuk||0; D.SALES.sisaTagihan+=p.sisa||0; D.SALES.kavlingTerjual+=p.n||0;
          D.STOK.belumTerjual+=p.belum||0; D.STOK.potensi+=p.stokValue||0;
        });
        var kvAll=tables.kavling_master||[];
        kvAll.forEach(function(r){var st=String(r['Status Unit']||'').toUpperCase();if(st.indexOf('DEAL')>=0&&st.indexOf('BELUM')>=0)D.STOK.funnel.dealBelumBayar++;else if(st.indexOf('BERTAHAP')>=0)D.STOK.funnel.bertahap++;else if(st.indexOf('CASH')>=0)D.STOK.funnel.cash++;else if(st.indexOf('BELUM TERJUAL')>=0)D.STOK.funnel.belum++;});
        D.SALES.rasioMasuk=D.SALES.ppjb?D.SALES.uangMasuk/D.SALES.ppjb:0;
        D.PROJECT_HEALTH=allSummary.map(function(p){var bi=(tables.budgeting_item||[]).filter(function(r){return r.Cluster===p.name;}),pl=bi.reduce(function(a,r){return a+(Number(r['Jumlah Rencana'])||0);},0),pa=bi.reduce(function(a,r){return a+(Number(r['Terbayar'])||0);},0);return {id:p.id,name:p.name,short:p.short,kas:p.kas||0,ppjb:p.ppjb||0,masuk:p.masuk||0,rasio:p.rasio||0,serapan:pl?pa/pl:0,telatST:0,konstruksiTelat:0,skor:(p.kas||0)>0?'ok':'critical',skorLabel:(p.kas||0)>0?'Sehat':'Kritis'};});
        D.DUE_ITEMS=allDue; D.NOTIFICATIONS=allNotif; D.AR_AGING=allAr; D.AP_AGING=allAp; D.CASH_QUALITY=allCashQuality; D.MONTHLY=allMonthly;
        D.DATA_SCOPE='Konsolidasi';
        var bs=D.CANONICAL.derived.budgetSummary||{}; D.BUDGET=D.BUDGET||{}; D.BUDGET.anggaran=bs.budget||0; D.BUDGET.realisasi=bs.realization||0; D.BUDGET.serapan=bs.rate||0;
        var cs=D.CANONICAL.derived.constructionSummary||{}; D.KONSTRUKSI={total:cs.rows||0,onProgress:(tables.rekap_konstruksi||[]).filter(function(r){return Number(r['%']||0)>0&&Number(r['%']||0)<100;}).length,terlambat:0,close:(tables.rekap_konstruksi||[]).filter(function(r){return Number(r['%']||0)>=100;}).length,rataTelatHari:0,maxTelatHari:0,contract:cs.contract||0,paid:cs.paid||0,remaining:cs.remaining||0,avgProgress:cs.avgProgress||0}; D.BUDGET.konstruksiSerapan=cs.contract?(cs.paid||0)/cs.contract:0;
        var legalAll=tables.laporan_legal||[]; var doneAll=0; legalAll.forEach(function(r){['SLF','BAST','AJB','BPHTB','PPH','Balik Nama','SHGB'].forEach(function(k){var v=String(r[k]||'').trim().toLowerCase();if(v&&v!=='-'&&v!=='belum'&&v!=='belum mulai')doneAll++;});}); D.LEGAL={done:doneAll,target:legalAll.length*7,pct:legalAll.length?doneAll/(legalAll.length*7):0,rows:legalAll.length};
        var dueAllNeed=allDue.filter(function(x){return Number(x.days)<=7;}).reduce(function(a,x){return a+(x.amount||0);},0); var allReq=(D.BUDGET.pengajuanMenunggu?D.BUDGET.pengajuanMenunggu.nilai:0)+dueAllNeed; D.CASH_COVER={rasio:D.KAS.total/Math.max(1,allReq),kebutuhanBayar:allReq,selisih:D.KAS.total-allReq};
        var ph=tables.piutang_hutang||[]; var pi=ph.filter(function(r){return r.Seksi==='Piutang'&&String(r.Akun||'').toLowerCase().indexOf('total')<0;}).reduce(function(a,r){return a+(Number(r.Saldo)||0);},0); var hu=ph.filter(function(r){return r.Seksi==='Hutang'&&String(r.Akun||'').toLowerCase().indexOf('total')<0;}).reduce(function(a,r){return a+(Number(r.Saldo)||0);},0); D.LIABILITAS={hutang:hu,piutangUsaha:pi,piutangKaryawan:0,piutangLain:0};
        return;
      }

      var p=ps.find(function(x){return x.id===pid;}); if(!p)return;
      D.KAS={total:p.kas||0,byProject:{}}; D.KAS.byProject[pid]=p.kas||0;
      D.SALES={ppjb:p.ppjb||0,uangMasuk:p.masuk||0,sisaTagihan:p.sisa||0,rasioMasuk:p.rasio||0,kavlingTerjual:p.n||0,byProject:{}}; D.SALES.byProject[pid]={ppjb:p.ppjb||0,masuk:p.masuk||0,sisa:p.sisa||0,rasio:p.rasio||0,n:p.n||0};
      var kv=(tables.kavling_master||[]).filter(function(r){return r['Nama Proyek']===p.name;});
      D.STOK={belumTerjual:kv.filter(function(r){return String(r['Status Unit']||'').toUpperCase().indexOf('BELUM TERJUAL')>=0;}).length,potensi:kv.filter(function(r){return String(r['Status Unit']||'').toUpperCase().indexOf('BELUM TERJUAL')>=0;}).reduce(function(a,r){return a+(Number(r['Harga Jual Daftar'])||Number(r['Harga Deal/PPJB'])||0);},0),funnel:{belum:0,dealBelumBayar:0,bertahap:0,cash:0}};
      kv.forEach(function(r){var st=String(r['Status Unit']||'').toUpperCase();if(st.indexOf('DEAL')>=0&&st.indexOf('BELUM')>=0)D.STOK.funnel.dealBelumBayar++;else if(st.indexOf('BERTAHAP')>=0)D.STOK.funnel.bertahap++;else if(st.indexOf('CASH')>=0)D.STOK.funnel.cash++;else if(st.indexOf('BELUM TERJUAL')>=0)D.STOK.funnel.belum++;});
      D.PROJECT_HEALTH=[{id:p.id,name:p.name,short:p.short,kas:p.kas||0,ppjb:p.ppjb||0,masuk:p.masuk||0,rasio:p.rasio||0,serapan:0,telatST:0,konstruksiTelat:0,skor:(p.kas||0)>0?'ok':'critical',skorLabel:(p.kas||0)>0?'Sehat':'Kritis'}];
      D.DUE_ITEMS=allDue.filter(function(x){return x.project===p.name;});
      D.NOTIFICATIONS=allNotif.filter(function(x){return x.project===p.name;});
      var ageBuckets=function(rows){var out={'0–30':{nilai:0,n:0},'31–60':{nilai:0,n:0},'61–90':{nilai:0,n:0},'91–180':{nilai:0,n:0},'>180':{nilai:0,n:0}};rows.forEach(function(r){var age=Number(r.Umur)||0,b=age<=30?'0–30':age<=60?'31–60':age<=90?'61–90':age<=180?'91–180':'>180';out[b].nilai+=Number(r.Saldo)||0;out[b].n++;});return Object.keys(out).map(function(k){return {bucket:k,nilai:out[k].nilai,n:out[k].n};});};
      var phAge=(tables.piutang_hutang||[]).filter(function(r){return r.Perusahaan===p.name;}); D.AR_AGING=ageBuckets(phAge.filter(function(r){return r.Seksi==='Piutang';})); D.AP_AGING=ageBuckets(phAge.filter(function(r){return r.Seksi==='Hutang';}));
      D.DATA_SCOPE=p.name;

      /* Project-specific budget / construction / legal / AR-AP views. */
      var bi=(tables.budgeting_item||[]).filter(function(r){return r.Cluster===p.name;});
      var planned=bi.reduce(function(a,r){return a+(Number(r['Jumlah Rencana'])||0);},0), paid=bi.reduce(function(a,r){return a+(Number(r['Terbayar'])||0);},0);
      var peng=(D.PENGAJUAN||[]).filter(function(r){return (r.proyekId===pid || r.Cluster===p.name || r.proyek===p.name || r.Proyek===p.name) && String(r.status||'').toLowerCase()==='menunggu';});
      var pengValue=peng.reduce(function(a,r){return a+(Number(r.jumlah)||0);},0);
      D.BUDGET=Object.assign({},D.BUDGET,{anggaran:planned,realisasi:paid,serapan:planned?paid/planned:0,jatuhTempo:{n:D.DUE_ITEMS.length,nilai:D.DUE_ITEMS.reduce(function(a,x){return a+(x.amount||0);},0)},pengajuanMenunggu:{n:peng.length,nilai:pengValue,tertuaHari:peng.reduce(function(a,r){return Math.max(a,Number(r.umur)||0);},0)}}); D.PROJECT_HEALTH[0].serapan=planned?paid/planned:0;
      var kr=(tables.rekap_konstruksi||[]).filter(function(r){return r.Cluster===p.name;});
      var contract=kr.reduce(function(a,r){return a+(Number(r['Nilai Kontrak'])||0);},0), kp=kr.reduce(function(a,r){return a+(Number(r['Terbayar'])||0);},0), prog=kr.length?kr.reduce(function(a,r){return a+(Number(r['%'])||0);},0)/kr.length:0;
      D.KONSTRUKSI={total:kr.length,onProgress:kr.filter(function(r){var v=Number(r['%']||0);return v>0&&v<100;}).length,terlambat:0,close:kr.filter(function(r){return Number(r['%']||0)>=100;}).length,rataTelatHari:0,maxTelatHari:0,contract:contract,paid:kp,remaining:contract-kp,avgProgress:prog}; D.BUDGET.konstruksiSerapan=contract?kp/contract:0;
      var lg=(tables.laporan_legal||[]).filter(function(r){return r.Proyek===p.name;}), done=0; lg.forEach(function(r){['SLF','BAST','AJB','BPHTB','PPH','Balik Nama','SHGB'].forEach(function(k){var v=String(r[k]||'').trim().toLowerCase();if(v&&v!=='-'&&v!=='belum'&&v!=='belum mulai')done++;});}); D.LEGAL={done:done,target:lg.length*7,pct:lg.length?done/(lg.length*7):0,rows:lg.length};
      var ph=(tables.piutang_hutang||[]).filter(function(r){return r.Perusahaan===p.name;}); var pi=ph.filter(function(r){return r.Seksi==='Piutang'&&String(r.Akun||'').toLowerCase().indexOf('total')<0;}).reduce(function(a,r){return a+(Number(r.Saldo)||0);},0), hu=ph.filter(function(r){return r.Seksi==='Hutang'&&String(r.Akun||'').toLowerCase().indexOf('total')<0;}).reduce(function(a,r){return a+(Number(r.Saldo)||0);},0); D.LIABILITAS={hutang:hu,piutangUsaha:pi,piutangKaryawan:0,piutangLain:0};

      var dueNeed=D.DUE_ITEMS.filter(function(x){return Number(x.days)<=7;}).reduce(function(a,x){return a+(x.amount||0);},0); var reqNeed=pengValue+dueNeed; D.CASH_COVER={rasio:D.KAS.total/Math.max(1,reqNeed),kebutuhanBayar:reqNeed,selisih:D.KAS.total-reqNeed};

      /* Cash-in quality is a transparent account classification for the selected project. */
      var jr=(tables.jurnal||[]).filter(function(r){return r.Perusahaan===p.name&&String(r.Tipe||'').toUpperCase()==='KAS_MASUK';});
      var q={Kavling:0,ITJ:0,PTB:0,Pendanaan:0,Lainnya:0}; jr.forEach(function(r){var s=(String(r['Akun KR']||'')+' '+String(r.Deskripsi||'')).toUpperCase(),v=Number(r.Jumlah)||0;if(s.indexOf('KAVLING')>=0||s.indexOf('PPJB')>=0)q.Kavling+=v;else if(s.indexOf('ITJ')>=0)q.ITJ+=v;else if(s.indexOf('PTB')>=0)q.PTB+=v;else if(s.indexOf('HUTANG')>=0||s.indexOf('PINJAMAN')>=0)q.Pendanaan+=v;else q.Lainnya+=v;}); D.CASH_QUALITY=Object.keys(q).map(function(k){return {kategori:k,nilai:q[k]};}).filter(function(x){return x.nilai!==0;});

      /* Project chart series: PPJB from sale dates; classified cash-in from journal dates. */
      var months={}; kv.forEach(function(r){var dt=String(r['Tanggal Terjual']||'');if(/^\d{4}-\d{2}/.test(dt)){var m=dt.slice(0,7);months[m]=months[m]||{m:m,ppjb:0,masuk:0};months[m].ppjb+=Number(r['Harga Deal/PPJB'])||0;}});
      jr.forEach(function(r){var dt=String(r.Tanggal||'');if(/^\d{4}-\d{2}/.test(dt)){var m=dt.slice(0,7),s=(String(r['Akun KR']||'')+' '+String(r.Deskripsi||'')).toUpperCase();if(s.indexOf('KAVLING')>=0||s.indexOf('PPJB')>=0||s.indexOf('ITJ')>=0||s.indexOf('PTB')>=0){months[m]=months[m]||{m:m,ppjb:0,masuk:0};months[m].masuk+=Number(r.Jumlah)||0;}}});
      D.MONTHLY=Object.keys(months).sort().map(function(k){return months[k];});
    };

    D._loaded = true;
    document.dispatchEvent(new CustomEvent('adhdataready'));
    return D;
  };

  D.currentProjectId = function () {
    try { return localStorage.getItem('adh_project_filter') || 'all'; } catch(e) { return 'all'; }
  };
  D.setCurrentProject = function (id) {
    try { localStorage.setItem('adh_project_filter', id || 'all'); } catch(e) {}
    document.dispatchEvent(new CustomEvent('adhprojectchange', {detail:{projectId:id||'all'}}));
  };
  D.projectFiltered = function (rows, field) {
    var pid=D.currentProjectId(); if(!pid || pid==='all') return rows||[];
    var p=(D.PROJECTS||[]).find(function(x){return x.id===pid;}); if(!p) return rows||[];
    field=field||'proyek';
    return (rows||[]).filter(function(r){ var v=r[field] || r['Proyek'] || r['Nama Proyek'] || r['Cluster'] || r['Perusahaan']; return v===p.name || v===p.short || String(v||'').toLowerCase().indexOf(String(p.name||'').toLowerCase())>=0; });
  };
  D.detail = function(type, opts){
    opts=opts||{}; var db=D.DB||{}; var pid=opts.projectId||D.currentProjectId();
    var p=(D.PROJECTS||[]).find(function(x){return x.id===pid;});
    var name=p&&p.name;
    var map={
      saldo:'dashboard_proyek', piutang_ppjb:'dashboard_proyek', penjualan_ppjb:'dashboard_proyek', cash_quality:'kas_ringkasan_bulanan', due:'budgeting_item', pengajuan:'pengajuan', project_matrix:'dashboard_proyek', funnel:'kavling_master', celah_tagih:'dashboard_proyek', budget:'dashboard_budget_realisasi', konstruksi:'rekap_konstruksi', legal:'laporan_legal', notifications:'pengajuan', ar_aging:'piutang_hutang', ap_aging:'piutang_hutang', piutang_hutang:'piutang_hutang'
    };
    if(type==='cash_quality') return {type:type,project:p||null,rows:(D.CASH_QUALITY||[]),source:'derived.cashInQuality',scope:D.DATA_SCOPE||'Konsolidasi'};
    if(type==='due') return {type:type,project:p||null,rows:(D.DUE_ITEMS||[]).map(function(r){return {'Cluster':r.project,'Jenis Pekerjaan':r.type,'Deskripsi':r.description,'Jatuh Tempo':r.due,'Sisa':r.amount,'Sisa Hari':r.days,'Status':r.status};}),source:'derived.dueItems',scope:D.DATA_SCOPE||'Konsolidasi'};
    if(type==='notifications') return {type:type,project:p||null,rows:(D.NOTIFICATIONS||[]),source:'derived.notifications',scope:D.DATA_SCOPE||'Konsolidasi'};
    if(type==='ar_aging') return {type:type,project:p||null,rows:(D.AR_AGING||[]),source:'derived.arAging',scope:D.DATA_SCOPE||'Konsolidasi'};
    if(type==='ap_aging') return {type:type,project:p||null,rows:(D.AP_AGING||[]),source:'derived.apAging',scope:D.DATA_SCOPE||'Konsolidasi'};

    /* ---- Detail per kartu KPI: satu kategori = satu sumber eksplisit ----
       Tiap kartu dashboard punya kategori informasi berbeda, jadi tiap tipe
       menunjuk tabel sumbernya sendiri (bukan semuanya ke dashboard_proyek).
       Bila tabel kanonik belum tersedia (mis. dibuka via file://), dipakai
       fallback dari agregat yang sama dengan yang dipakai kartunya, supaya
       angka popup SELALU konsisten dengan angka kartu. */
    var salesRows=function(){
      var bp=(D.SALES&&D.SALES.byProject)||{},out=[];
      (D.PROJECTS||[]).forEach(function(pr){var v=bp[pr.id];if(!v)return;
        out.push({Proyek:pr.name,'Unit Terjual':v.n||0,'Nilai PPJB':v.ppjb||0,'Uang Masuk':v.masuk||0,'Piutang PPJB':v.sisa||0,'Total Penjualan':v.ppjb||0,Rasio:(v.rasio||0)*100});});
      return out;
    };
    var sc=D.DATA_SCOPE||'Konsolidasi';
    var sumBy=function(list,f){return (list||[]).reduce(function(a,r){return a+(Number(r[f])||0);},0);};
    var rp=function(n){return 'Rp '+Math.round(Number(n)||0).toLocaleString('id-ID');};
    /* Baris "Total ..." dari tabel sumber tidak ikut ditampilkan sebagai baris
       tabel; nilainya diangkat ke ringkasan di ATAS tabel (permintaan Bos). */
    var dropTotalRows=function(list){return (list||[]).filter(function(r){return String(r.Akun||'').toLowerCase().indexOf('total')<0;});};
    if(type==='kas_bank'){
      var kb=(db.dashboard_proyek||[]).map(function(r){return {Proyek:r.Proyek,Bank:r.Bank,Brankas:r.Brankas,'Kas Kecil & Silang Kas':r['Kas Kecil & Silang Kas'],Total:r.Total};});
      if(!kb.length)kb=(D.PROJECT_HEALTH||[]).map(function(pp){return {Proyek:pp.name,Bank:null,Brankas:null,'Kas Kecil & Silang Kas':null,Total:pp.kas||0};});
      if(name)kb=kb.filter(function(r){return r.Proyek===name;});
      return {type:type,project:p||null,rows:kb,total:sumBy(kb,'Total'),totalLabel:'Total Kas & Bank',source:'dashboard_proyek · kolom kas',scope:sc};
    }
    if(type==='total_ppjb'){
      var tp=(db.dashboard_proyek||[]).map(function(r){return {Proyek:r.Proyek,'Unit Terjual':r['Unit Terjual'],'Nilai PPJB':r['Nilai PPJB'],'Total Penjualan':r['Total Penjualan']};});
      if(!tp.length)tp=salesRows().map(function(r){return {Proyek:r.Proyek,'Unit Terjual':r['Unit Terjual'],'Nilai PPJB':r['Nilai PPJB'],'Total Penjualan':r['Total Penjualan']};});
      if(name)tp=tp.filter(function(r){return r.Proyek===name;});
      return {type:type,project:p||null,rows:tp,total:sumBy(tp,'Nilai PPJB'),totalLabel:'Total Nilai PPJB',totalNote:sumBy(tp,'Unit Terjual')+' kavling terjual',source:'dashboard_proyek · Nilai PPJB',scope:sc};
    }
    if(type==='uang_masuk'){
      var um=(db.dashboard_proyek||[]).map(function(r){return {Proyek:r.Proyek,'Nilai PPJB':r['Nilai PPJB'],'Uang Masuk':r['Uang Masuk'],Rasio:r.Rasio};});
      if(!um.length)um=salesRows().map(function(r){return {Proyek:r.Proyek,'Nilai PPJB':r['Nilai PPJB'],'Uang Masuk':r['Uang Masuk'],Rasio:r.Rasio};});
      if(name)um=um.filter(function(r){return r.Proyek===name;});
      var umTot=sumBy(um,'Uang Masuk'),umBase=sumBy(um,'Nilai PPJB');
      return {type:type,project:p||null,rows:um,total:umTot,totalLabel:'Total Uang Masuk',totalNote:umBase?('dari PPJB '+rp(umBase)+' · '+(umTot/umBase*100).toFixed(2)+'%'):null,source:'dashboard_proyek · Uang Masuk',scope:sc};
    }
    if(type==='sisa_tagihan'){
      var stg=(db.dashboard_proyek||[]).map(function(r){return {Proyek:r.Proyek,'Nilai PPJB':r['Nilai PPJB'],'Uang Masuk':r['Uang Masuk'],'Piutang PPJB':r['Piutang PPJB']};});
      if(!stg.length)stg=salesRows().map(function(r){return {Proyek:r.Proyek,'Nilai PPJB':r['Nilai PPJB'],'Uang Masuk':r['Uang Masuk'],'Piutang PPJB':r['Piutang PPJB']};});
      if(name)stg=stg.filter(function(r){return r.Proyek===name;});
      var stTot=sumBy(stg,'Piutang PPJB'),stBase=sumBy(stg,'Nilai PPJB');
      return {type:type,project:p||null,rows:stg,total:stTot,totalLabel:'Total Sisa Tagihan',totalNote:stBase?((stTot/stBase*100).toFixed(2)+'% dari nilai PPJB'):null,source:'dashboard_proyek · Piutang PPJB',scope:sc};
    }
    if(type==='stok_belum'){
      var sk=(db.kavling_master||[]).filter(function(r){return String(r['Status Unit']||'').toUpperCase()==='BELUM TERJUAL';})
        .map(function(r){return {Proyek:r['Nama Proyek'],Kavling:r.Kavling,'Nama Pembeli':r['Nama Pembeli'],'Harga Jual Daftar':r['Harga Jual Daftar'],'Status Unit':r['Status Unit']};});
      if(name)sk=sk.filter(function(r){return r.Proyek===name;});
      var skFallback=false;
      if(!sk.length){skFallback=true;sk=[{Proyek:name||'Konsolidasi',Kavling:'—','Nama Pembeli':'—','Harga Jual Daftar':null,'Status Unit':'BELUM TERJUAL'}];}
      return {type:type,project:p||null,rows:sk,
        total:skFallback?((D.STOK&&D.STOK.belumTerjual)||0):sk.length,totalLabel:'Total Kavling Belum Terjual',
        totalNote:'potensi '+(skFallback?rp((D.STOK&&D.STOK.potensi)||0):rp(sumBy(sk,'Harga Jual Daftar'))),
        source:'kavling_master · Status Unit = BELUM TERJUAL',scope:sc};
    }
    if(type==='hutang'||type==='piutang_usaha'){
      var sec=(type==='hutang')?'Hutang':'Piutang';
      var raw=(db.piutang_hutang||[]).filter(function(r){return r.Seksi===sec;});
      if(name)raw=raw.filter(function(r){return r.Perusahaan===name;});
      var det=dropTotalRows(raw);
      var tot=sumBy(det,'Saldo');
      var hasDetail=det.length>0;
      if(!hasDetail){
        // hanya ada baris "Total ..." (mis. proyek tanpa rincian akun) — pakai nilai totalnya
        tot=sumBy(raw,'Saldo');
        if(!raw.length)tot=(type==='hutang')?((D.LIABILITAS&&D.LIABILITAS.hutang)||0):((D.LIABILITAS&&D.LIABILITAS.piutangUsaha)||0);
        det=[];
      }
      return {type:type,project:p||null,rows:det,total:tot,
        totalLabel:(type==='hutang')?'Total Hutang':'Total Piutang Usaha',
        totalNote:hasDetail?null:'tidak ada rincian akun pada scope ini',
        emptyNote:hasDetail?null:'Tidak ada rincian akun — hanya nilai total tersedia.',
        source:'piutang_hutang · Seksi = '+sec,scope:sc};
    }
    if(type==='serapan_anggaran'){
      var sa=(db.dashboard_budget_realisasi||[]).map(function(r){var a=Number(r['Alokasi Anggaran'])||0,rr=Number(r['Realisasi'])||0;return {'Jenis Pekerjaan':r['Jenis Pekerjaan'],'Alokasi Anggaran':a,Realisasi:rr,'%':a?rr/a*100:0};});
      if(!sa.length){var bg=(D.BUDGET&&D.BUDGET.anggaran)||0,rg=(D.BUDGET&&D.BUDGET.realisasi)||0;sa=[{'Jenis Pekerjaan':'Total Anggaran','Alokasi Anggaran':bg,Realisasi:rg,'%':bg?rg/bg*100:0}];}
      var saReal=sumBy(sa,'Realisasi'),saPlan=sumBy(sa,'Alokasi Anggaran');
      return {type:type,project:p||null,rows:sa,total:saReal,totalLabel:'Total Realisasi',totalNote:'dari anggaran '+rp(saPlan)+(saPlan?(' · '+(saReal/saPlan*100).toFixed(2)+'%'):''),source:'dashboard_budget_realisasi',scope:sc};
    }

    var rows=db[map[type]]||[];
    if(name) rows=rows.filter(function(r){return (r.Proyek||r['Nama Proyek']||r.Cluster||r.Perusahaan)===name;});
    if(type==='funnel'){
      var kv=rows, agg={}; kv.forEach(function(r){var st=String(r['Status Unit']||'').toUpperCase();var key=st.indexOf('DEAL')>=0&&st.indexOf('BELUM')>=0?'Deal — Belum Bayar':st.indexOf('BERTAHAP')>=0?'Terjual Bertahap':st.indexOf('CASH')>=0?'Terjual Cash':'Belum Terjual';if(!agg[key])agg[key]={count:0,value:0};agg[key].count++;agg[key].value+=Number(r['Harga Deal/PPJB'])||Number(r['Harga Jual Daftar'])||0;}); rows=Object.keys(agg).map(function(k){return {'Proyek':name||'Konsolidasi','Status':k,'Unit Terjual':agg[k].count,'Nilai PPJB':agg[k].value,'Uang Masuk':0};});
    }
    if(type==='piutang_hutang' && name) rows=rows.filter(function(r){return r.Perusahaan===name;});
    if(type==='penjualan_ppjb') rows=rows.map(function(r){return {'Proyek':r.Proyek,'Nilai PPJB':r['Nilai PPJB']||0,'Uang Masuk':r['Uang Masuk']||0,'Piutang PPJB':r['Piutang PPJB']||0,'Unit Terjual':r['Unit Terjual']||0};});
    return {type:type,project:p||null,rows:rows,source:map[type]||null,scope:D.DATA_SCOPE||'Konsolidasi'};
  };

  D.getKavling = function (id) {
    var n = Number(id);
    return (D.KAVLING || []).find(function (k) { return k.id === n; }) || null;
  };

  D.filterPengajuan = function (opts) {
    opts = opts || {};
    var list = D.PENGAJUAN || [];
    if (opts.role) {
      var role = opts.role.toLowerCase();
      list = list.filter(function (p) { return (p.sumberRole || '').toLowerCase() === role; });
    }
    if (opts.status) {
      var st = opts.status.toLowerCase();
      if (st !== 'semua') list = list.filter(function (p) { return (p.status || '').toLowerCase() === st; });
    }
    if (opts.proyekId) list = list.filter(function (p) { return p.proyekId === opts.proyekId; });
    return list;
  };

  D.cashImpact = function (selectedIds) {
    var set = {};
    (selectedIds || []).forEach(function (id) { set[String(id)] = true; });
    var list = (D.PENGAJUAN || []).filter(function (p) {
      return set[String(p.id)] && (p.status || '').toLowerCase() === 'menunggu';
    });
    var total = list.reduce(function (s, p) { return s + (p.jumlah || 0); }, 0);
    var kas = (D.KAS && D.KAS.total) || 0;
    return { count: list.length, total: total, kas: kas, after: kas - total, cover: total > 0 ? kas / total : 1, items: list };
  };

  D.paginate = function (rows, page, size) {
    page = Math.max(1, page || 1);
    size = size || 50;
    var total = rows.length;
    var start = (page - 1) * size;
    return { rows: rows.slice(start, start + size), page: page, size: size, total: total, pages: Math.ceil(total / size) || 1 };
  };

  D.loadReport = async function (name) {
    var data = await fetchJSON(name + '.json');
    if (!data) return { total: 0, rows: [] };
    if (Array.isArray(data)) return { total: data.length, rows: data };
    return data;
  };

  D.AS_OF = new Date(D.AS_OF);
  return D;
})();
