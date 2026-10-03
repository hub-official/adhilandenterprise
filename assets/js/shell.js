/**
 * Adhiland ERP — shared AppShell / navigation / table interaction layer
 * Upgrade: corporate-compact, consistent SVG icon system, nested navigation,
 * persistent sidebar state, shared table controls and currency display modes.
 */
(function () {
  'use strict';

  var ICONS = {
    dashboard:'layout-dashboard', workflow:'git-branch', approval:'check-square', review:'search-check', payment:'wallet-cards',
    governance:'shield-check', budget:'calculator', property:'building-2', report:'bar-chart-3', cash:'arrow-left-right', journal:'book-open',
    ledger:'book-copy', balance:'scale', profit:'chart-no-axes-combined', receivable:'credit-card', inventory:'package', master:'database',
    trash:'trash-2', home:'house', document:'file-text', construction:'hard-hat', sales:'tag', promotion:'megaphone', operations:'clipboard-list',
    settings:'settings-2', users:'users', audit:'history', chevron:'chevron-down', menu:'panel-left', sun:'sun', moon:'moon', search:'search',
    columns:'columns-3', filter:'list-filter', download:'download', plus:'plus', external:'external-link', table:'table-2', x:'x'
  };

  var PATHS = {
    'layout-dashboard':'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    'git-branch':'<circle cx="6" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="M6 8v5a6 6 0 0 0 6 6h3"/><circle cx="18" cy="5" r="3"/><path d="M18 8v3a4 4 0 0 1-4 4h-2"/>',
    'check-square':'<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    'search-check':'<path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="7"/><path d="m8.5 11 2 2 3.5-4"/>',
    'wallet-cards':'<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M16 3v4M7 3v2M3 10h18M16 15h.01"/>',
    'shield-check':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    'calculator':'<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2"/>',
    'building-2':'<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M2 22h20M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2"/>',
    'bar-chart-3':'<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V7M17 16v-9"/>',
    'arrow-left-right':'<path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>',
    'book-open':'<path d="M2 4a2 2 0 0 1 2-2h5a4 4 0 0 1 4 4v16a4 4 0 0 0-4-4H4a2 2 0 0 0-2 2Z"/><path d="M22 4a2 2 0 0 0-2-2h-5a4 4 0 0 0-4 4v16a4 4 0 0 1 4-4h5a2 2 0 0 1 2 2Z"/>',
    'book-copy':'<path d="M2 6a2 2 0 0 1 2-2h10v14H4a2 2 0 0 0-2 2Z"/><path d="M18 18h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M6 2h10a2 2 0 0 1 2 2v14"/>',
    'scale':'<path d="M12 3v18M5 21h14M4 7h16M7 7l-3 7a4 4 0 0 0 6 0L7 7ZM17 7l-3 7a4 4 0 0 0 6 0l-3-7Z"/>',
    'chart-no-axes-combined':'<path d="M3 3v18h18"/><path d="m7 16 4-5 3 3 6-8"/>',
    'credit-card':'<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20M6 15h4"/>',
    'package':'<path d="m16.5 9.4 3.5-2M3 7.4l9 5 9-5M12 22V12.4M20 13v6.5a2 2 0 0 1-1 1.7l-6 3.4a2 2 0 0 1-2 0l-6-3.4a2 2 0 0 1-1-1.7V13M3.3 5.3 10.8 1a2.4 2.4 0 0 1 2.4 0l7.5 4.3a2.4 2.4 0 0 1 1.2 2.1v.1L12 12.4 2.1 7.5v-.1a2.4 2.4 0 0 1 1.2-2.1Z"/>',
    'database':'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
    'trash-2':'<path d="M3 6h18M8 6V3h8v3M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
    'house':'<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
    'file-text':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    'hard-hat':'<path d="M2 18a10 10 0 0 1 20 0Z"/><path d="M4 18h16M12 8V2M7 11a5 5 0 0 1 10 0"/>',
    'tag':'<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1 0-2.8L10.6 3H20v9.4a2 2 0 0 1 .6 1Z"/><circle cx="16" cy="7" r="1"/>',
    'megaphone':'<path d="m3 11 18-5v12L3 13Z"/><path d="M11 15v5M7 14l-1 5"/><path d="M21 9a3 3 0 0 1 0 6"/>',
    'clipboard-list':'<rect width="16" height="18" x="4" y="4" rx="2"/><path d="M9 2h6v4H9zM8 10h8M8 14h5"/>',
    'settings-2':'<path d="M20 7h-9M14 17H4M20 17h-3M10 7H4"/><circle cx="14" cy="7" r="3"/><circle cx="7" cy="17" r="3"/>',
    'users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    'history':'<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>',
    'chevron-down':'<path d="m6 9 6 6 6-6"/>', 'panel-left':'<rect width="20" height="18" x="2" y="3" rx="2"/><path d="M9 3v18"/>',
    'sun':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
    'moon':'<path d="M20.8 14.6A8.5 8.5 0 0 1 9.4 3.2 8.5 8.5 0 1 0 20.8 14.6Z"/>',
    'search':'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', 'columns-3':'<path d="M9 3v18M15 3v18M4 3h16v18H4z"/>',
    'list-filter':'<path d="M3 5h18M6 12h12M10 19h4"/>', 'download':'<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    'plus':'<path d="M12 5v14M5 12h14"/>', 'external-link':'<path d="M14 3h7v7M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'table-2':'<path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18"/>', 'x':'<path d="m6 6 12 12M18 6 6 18"/>', 'bell':'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/>'
  };

  function icon(name, size) {
    var key = ICONS[name] || name;
    return '<svg class="ui-icon" width="'+(size||16)+'" height="'+(size||16)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(PATHS[key]||'')+'</svg>';
  }

  var NAV = {
    Direktur: [
      {group:'Utama',items:[{id:'dashboard',label:'Dashboard',href:'index.html',icon:'dashboard'},{id:'workflow',label:'Workflow',icon:'workflow',children:[{id:'pengajuan',label:'Pengajuan',href:'pengajuan.html',icon:'approval',badge:'pengajuan'},{id:'finance-review',label:'Review Finance',href:'finance-review.html',icon:'review',badge:'finance_review'},{id:'siap-bayar',label:'Siap Bayar',href:'siap-bayar.html',icon:'payment',badge:'siap_bayar'}]},{id:'property',label:'Property',icon:'property',children:[{id:'kavling',label:'Kavling & Penjualan',href:'kavling.html',icon:'sales'},{id:'inventaris',label:'Inventaris',href:'inventaris.html',icon:'inventory'}]},{id:'budgeting',label:'Budgeting',href:'budgeting.html',icon:'budget'}]},
      {group:'Laporan',items:[{id:'arus-kas',label:'Arus Kas',href:'arus-kas.html',icon:'cash'},{id:'jurnal',label:'Jurnal',href:'jurnal.html',icon:'journal'},{id:'buku-besar',label:'Buku Besar',href:'buku-besar.html',icon:'ledger'},{id:'neraca',label:'Neraca',href:'neraca.html',icon:'balance'},{id:'laba-rugi',label:'Laba Rugi',href:'laba-rugi.html',icon:'profit'},{id:'piutang-hutang',label:'Piutang & Hutang',href:'piutang-hutang.html',icon:'receivable'},{id:'realisasi',label:'Realisasi Biaya',href:'realisasi.html',icon:'report'}]},
      {group:'Governance',items:[{id:'tata-kelola',label:'Tata Kelola',href:'tata-kelola.html',icon:'governance'},{id:'master',label:'Master Data',href:'master.html',icon:'master'},{id:'sampah',label:'Tempat Sampah',href:'sampah.html',icon:'trash'}]},
      {group:'Lintas Departemen',items:[{id:'legal',label:'Legal',href:'../Legal/index.html',icon:'document'},{id:'teknik',label:'Teknik',href:'../Teknik/index.html',icon:'construction'}]}
    ],
    Legal:[{group:'Legal',items:[{id:'home',label:'Dashboard Legal',href:'index.html',icon:'home'},{id:'dokumen',label:'Matriks Dokumen',href:'dokumen.html',icon:'document'},{id:'pengajuan',label:'Pengajuan Legal',href:'pengajuan.html',icon:'approval'},{id:'kavling',label:'Detail Kavling',href:'kavling.html',icon:'property'}]}],
    Teknik:[{group:'Teknik',items:[{id:'home',label:'Dashboard Teknik',href:'index.html',icon:'home'},{id:'progres',label:'Progres Konstruksi',href:'progres.html',icon:'construction'},{id:'rekap',label:'Rekap Konstruksi',href:'property_rekap-konstruksi.html',icon:'report'},{id:'pengajuan',label:'Pengajuan Teknik',href:'pengajuan.html',icon:'approval'}]}],
    Marketing:[{group:'Marketing',items:[{id:'home',label:'Dashboard Marketing',href:'index.html',icon:'home'},{id:'stok',label:'Stok & Penjualan',href:'stok.html',icon:'sales'},{id:'pengajuan',label:'Pengajuan Promosi',href:'pengajuan.html',icon:'promotion'}]}],
    Operasional:[{group:'Operasional',items:[{id:'home',label:'Dashboard Operasional',href:'index.html',icon:'home'},{id:'anggaran',label:'Anggaran Operasional',href:'anggaran.html',icon:'budget'},{id:'pengajuan',label:'Pengajuan Ops',href:'pengajuan.html',icon:'approval'}]}],
    Finance:[{group:'Finance',items:[{id:'home',label:'Dashboard Finance',href:'index.html',icon:'home'},{id:'finance-review',label:'Antrian Review',href:'review.html',icon:'review',badge:'finance_review'},{id:'siap-bayar',label:'Siap Bayar',href:'siap-bayar.html',icon:'payment',badge:'siap_bayar'}]}]
  };

  function detectRole(){var p=window.location.pathname;if(p.includes('/Legal/'))return'Legal';if(p.includes('/Teknik/'))return'Teknik';if(p.includes('/Marketing/'))return'Marketing';if(p.includes('/Operasional/'))return'Operasional';if(p.includes('/Finance/'))return'Finance';return'Direktur';}
  function detectActive(){return (window.location.pathname.split('/').pop()||'index.html').replace('.html','');}
  function resolveBadge(item){if(!item.badge||!window.AdhData)return null;var list=window.AdhData.PENGAJUAN||[];if(item.badge==='pengajuan')return list.filter(function(p){return String(p.status||'').toLowerCase()==='menunggu';}).length||null;if(item.badge==='finance_review')return list.filter(function(p){var s=String(p.status||'').toLowerCase();return s==='menunggu review'||s==='menunggu_review';}).length||null;if(item.badge==='siap_bayar')return list.filter(function(p){return String(p.status||'').toLowerCase()==='disetujui';}).length||null;return null;}
  function badgeHtml(item){var n=resolveBadge(item);return n?'<span class="badge" aria-label="'+n+' menunggu">'+n+'</span>':'';}

  function renderItem(item, active, parentActive){
    var has=Array.isArray(item.children)&&item.children.length;
    var childActive=has&&item.children.some(function(c){return active===c.id;});
    var isActive=active===item.id||childActive;
    if(has){
      return '<div class="nav-tree-item '+(isActive?'is-open':'')+'"><button class="nav-item nav-parent '+(isActive?'active':'')+'" type="button" data-nav-parent="'+item.id+'" title="'+item.label+'" aria-expanded="'+(isActive?'true':'false')+'">'+icon(item.icon,16)+'<span class="label">'+item.label+'</span>'+badgeHtml(item)+'<span class="nav-chevron">'+icon('chevron',14)+'</span></button><div class="nav-children" data-nav-children="'+item.id+'">'+item.children.map(function(c){return renderItem(c,active,isActive);}).join('')+'</div></div>';
    }
    return '<a class="nav-item nav-child'+(isActive?' active':'')+'" href="'+item.href+'" data-id="'+item.id+'" title="'+item.label+'">'+icon(item.icon,16)+'<span class="label">'+item.label+'</span>'+badgeHtml(item)+'</a>';
  }

  function renderSidebar(role){var groups=NAV[role]||NAV.Direktur,active=detectActive();var html='<aside class="sidebar" id="sidebar" role="navigation" aria-label="Menu utama"><div class="sidebar-brand"><span class="brand-logo"><img src="../assets/img/Adhiland-mark.png" alt="" aria-hidden="true" onerror="this.src=\'../assets/img/Adhiland-transparent.png\'"></span><span class="brand-text">Adhiland ERP<small class="brand-sub">Enterprise Version</small></span><button class="sidebar-collapse-btn" id="sidebar-collapse" type="button" aria-label="Sembunyikan sidebar" aria-expanded="true" title="Sembunyikan sidebar">'+icon('panel-left',15)+'</button></div><nav class="sidebar-nav">';groups.forEach(function(g){html+='<section class="nav-group"><div class="nav-group-label">'+g.group+'</div>'+g.items.map(function(i){return renderItem(i,active,false);}).join('')+'</section>';});return html+'</nav><div class="sidebar-footer">Data per '+(window.fmt?window.fmt.dateTime(window.AdhData.AS_OF):'2 Okt 2026')+'</div></aside>';}

  var ROLE_LABEL={Direktur:'Direktur',Legal:'Legal',Teknik:'Teknik',Marketing:'Marketing',Operasional:'Operasional',Finance:'Finance'};
  var ROLE_INITIAL={Direktur:'DR',Legal:'LG',Teknik:'TK',Marketing:'MK',Operasional:'OP',Finance:'FN'};
  function renderTopbar(title,role){var label=ROLE_LABEL[role]||role,initial=ROLE_INITIAL[role]||'DR';var projects=(window.AdhData&&window.AdhData.PROJECTS)||[];var current=(window.AdhData&&window.AdhData.currentProjectId)?window.AdhData.currentProjectId():'all';var opts='<option value="all"'+(current==='all'?' selected':'')+'>Semua Project</option>'+projects.map(function(p){return '<option value="'+p.id+'"'+(current===p.id?' selected':'')+'>'+p.name+'</option>';}).join('');var notif=(window.AdhData&&window.AdhData.NOTIFICATIONS)||[];var n=notif.length;var t=esc(title||'Dashboard');var bc='<nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="index.html">'+esc(label)+'</a></li><li aria-current="page">'+t+'</li></ol></nav>';return '<header class="topbar" role="banner"><div class="topbar-left"><button class="btn-icon sidebar-toggle-btn" id="sidebar-toggle" type="button" aria-label="Sembunyikan sidebar" title="Sembunyikan sidebar">'+icon('panel-left',18)+'<span class="sidebar-toggle-text">Menu</span></button><div class="topbar-titles"><h1 class="page-title">'+t+'</h1>'+bc+'</div></div><div class="topbar-right"><label class="global-project-picker"><span>Project</span><select id="global-project-filter" aria-label="Project aktif">'+opts+'</select></label><button class="btn-icon notification-btn" id="notification-toggle" type="button" aria-label="Notifikasi" title="Notifikasi">'+icon('bell',17)+(n?'<span class="notification-count">'+Math.min(n,99)+'</span>':'')+'</button><button class="btn-icon" id="theme-toggle" type="button" aria-label="Ganti tema" title="Tema">'+icon('moon',17)+'</button><div class="user-pill"><span class="user-role">'+label+'</span><span class="user-avatar">'+initial+'</span></div></div></header>';}

  function ensureToastHost(){
    var host=document.querySelector('.toast-host');
    if(!host){
      host=document.createElement('div');
      host.className='toast-host';
      host.setAttribute('role','status');
      host.setAttribute('aria-live','polite');
      host.setAttribute('aria-atomic','true');
      host.setAttribute('aria-label','Notifikasi');
      document.body.appendChild(host);
    }
    return host;
  }
  function showToast(msg,kind){kind=kind||'info';var host=ensureToastHost();var el=document.createElement('div');el.className='toast toast-'+kind;el.setAttribute('role','status');el.textContent=msg;host.appendChild(el);setTimeout(function(){el.style.opacity='0';el.style.transition='opacity .25s';setTimeout(function(){el.remove();},280);},2800);}

  /* Focus trap for modals/drawers (WCAG 2.4.3). Returns a release function. */
  var FOCUSABLE='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function trapFocus(container){
    if(!container)return function(){};
    function focusable(){
      return Array.prototype.slice.call(container.querySelectorAll(FOCUSABLE)).filter(function(el){
        return el.offsetWidth>0||el.offsetHeight>0||el===document.activeElement;
      });
    }
    function onKey(e){
      if(e.key!=='Tab')return;
      var f=focusable();if(!f.length){e.preventDefault();return;}
      var first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
    container.addEventListener('keydown',onKey);
    var f=focusable();
    if(f.length){try{f[0].focus();}catch(e){}}
    return function(){container.removeEventListener('keydown',onKey);};
  }

  function esc(v){return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function money(v){return 'Rp '+(Number(v)||0).toLocaleString('id-ID');}
  function detailConfig(type){var c={
    kas_bank:{title:'Kas & Bank',cols:[['Proyek','Proyek'],['Bank','Bank'],['Brankas','Brankas'],['Kas Kecil & Silang Kas','Kas Kecil & Silang Kas'],['Total','Total']]},
    total_ppjb:{title:'Total Penjualan (PPJB)',cols:[['Proyek','Proyek'],['Unit Terjual','Unit Terjual'],['Nilai PPJB','Nilai PPJB'],['Total Penjualan','Total Penjualan']]},
    uang_masuk:{title:'Uang Masuk',cols:[['Proyek','Proyek'],['Nilai PPJB','Nilai PPJB'],['Uang Masuk','Uang Masuk'],['Rasio','Rasio']]},
    sisa_tagihan:{title:'Sisa Tagihan PPJB',cols:[['Proyek','Proyek'],['Nilai PPJB','Nilai PPJB'],['Uang Masuk','Uang Masuk'],['Piutang PPJB','Piutang PPJB']]},
    stok_belum:{title:'Stok Belum Terjual',cols:[['Proyek','Proyek'],['Kavling','Kavling'],['Pembeli','Nama Pembeli'],['Harga Daftar','Harga Jual Daftar'],['Status','Status Unit']]},
    hutang:{title:'Hutang',cols:[['Perusahaan','Perusahaan'],['Akun','Akun'],['Saldo','Saldo'],['Umur','Umur']]},
    piutang_usaha:{title:'Piutang Usaha (Jurnal)',cols:[['Perusahaan','Perusahaan'],['Akun','Akun'],['Saldo','Saldo'],['Umur','Umur']]},
    serapan_anggaran:{title:'Serapan Anggaran',cols:[['Jenis Pekerjaan','Jenis Pekerjaan'],['Alokasi Anggaran','Alokasi Anggaran'],['Realisasi','Realisasi'],['Serapan','%']]},
    saldo:{title:'Saldo',cols:[['Proyek','Proyek'],['Bank','Bank'],['Brankas','Brankas'],['Kas Kecil & Silang Kas','Kas Kecil & Silang Kas'],['Total','Total']]},piutang_ppjb:{title:'Piutang PPJB',cols:[['Proyek','Proyek'],['Piutang PPJB','Piutang PPJB']]},funnel:{title:'Funnel Kavling',cols:[['Proyek','Proyek'],['Unit Terjual','Unit Terjual'],['Nilai PPJB','Nilai PPJB'],['Uang Masuk','Uang Masuk']]},piutang_hutang:{title:'Piutang & Hutang',cols:[['Proyek','Perusahaan'],['Seksi','Seksi'],['Akun','Akun'],['Saldo','Saldo'],['Umur','Umur']]},penjualan_ppjb:{title:'Penjualan PPJB',cols:[['Proyek','Proyek'],['Nilai PPJB','Nilai PPJB'],['Uang Masuk','Uang Masuk'],['Piutang PPJB','Piutang PPJB']]},project_matrix:{title:'Matriks Kesehatan Proyek',cols:[['Proyek','Proyek'],['Kas','Total'],['PPJB','Nilai PPJB'],['Uang Masuk','Uang Masuk'],['Piutang PPJB','Piutang PPJB']]},celah_tagih:{title:'Celah Tagih',cols:[['Proyek','Proyek'],['PPJB','Nilai PPJB'],['Masuk','Uang Masuk'],['Sisa','Piutang PPJB'],['Rasio','Rasio']]},cash_quality:{title:'Kualitas Arus Kas Masuk',cols:[['Kategori','kategori'],['Nilai','nilai']]},due:{title:'Jatuh Tempo & Risiko Pembayaran',cols:[['Project','Cluster'],['Jenis','Jenis Pekerjaan'],['Deskripsi','Deskripsi'],['Jatuh Tempo','Jatuh Tempo'],['Sisa','Sisa']]},pengajuan:{title:'Pengajuan Direktur',cols:[['Tanggal','Tanggal'],['Project','Cluster'],['Jenis','Jenis'],['Keperluan','Keperluan'],['Jumlah','Jumlah'],['Status','Status']]},budget:{title:'Anggaran vs Realisasi',cols:[['Jenis Pekerjaan','Jenis Pekerjaan'],['Anggaran','Alokasi Anggaran'],['Realisasi','Realisasi']]},konstruksi:{title:'Rekap Konstruksi',cols:[['Cluster','Cluster'],['Kavling','Kavling'],['Kontraktor','Kontraktor'],['Kontrak','Nilai Kontrak'],['Terbayar','Terbayar'],['Sisa','Sisa']]},legal:{title:'Matriks Legal',cols:[['Proyek','Proyek'],['Kavling','Kavling'],['Komplit','Komplit'],['%','%']]},notifications:{title:'Notifikasi',cols:[['Severity','severity'],['Judul','title'],['Project','project'],['Nominal','amount']]},ar_aging:{title:'Umur Piutang',cols:[['Bucket','bucket'],['Nilai','nilai'],['Jumlah','n']]},ap_aging:{title:'Umur Hutang',cols:[['Bucket','bucket'],['Nilai','nilai'],['Jumlah','n']]}};return c[type]||{title:'Detail',cols:[]};}
  function cell(k,v){if(v==null||v==='')return '—';if(['Bank','Brankas','Kas Kecil & Silang Kas','Total','Piutang PPJB','Nilai PPJB','Uang Masuk','Sisa','PPJB','Masuk','Kas','Jumlah','Alokasi Anggaran','Realisasi','Nilai','nilai','Terbayar','Nilai Kontrak','amount','Saldo','Total Penjualan','Harga Jual Daftar'].indexOf(k)>=0)return money(v);if(k==='Rasio'||k==='%')return Number(v).toLocaleString('id-ID',{maximumFractionDigits:2})+'%';return esc(v);}
  function openDetail(type,opts){opts=opts||{};var d=window.AdhData&&window.AdhData.detail?window.AdhData.detail(type,opts):null,c=detailConfig(type);if(opts.title)c={title:opts.title,cols:c.cols};var rows=(d&&d.rows)||[],MAXROWS=500,shown=Math.min(rows.length,MAXROWS);
    var cnt=rows.length>shown?('Menampilkan '+shown+' dari '+rows.length+' baris'):(rows.length+' baris');
    var html='<div class="detail-summary"><span>Source: '+esc((d&&d.source)||'database.zip')+'</span><span>Scope: '+esc((d&&d.scope)||((d&&d.project&&d.project.name)||'Konsolidasi'))+'</span><span>'+cnt+'</span>';
    if(d&&d.totalLabel)html+='<span class="detail-total"><strong>'+esc(d.totalLabel)+': '+money(d.total)+'</strong>'+(d.totalNote?'<em>'+esc(d.totalNote)+'</em>':'')+'</span>';
    html+='</div>';
    if(!rows.length)html+='<div class="empty-state">'+icon('document',26)+'<strong>Tidak ada data</strong><span>'+esc((d&&d.emptyNote)||'Dataset tidak memiliki baris untuk konteks yang dipilih.')+'</span></div>';else html+='<div class="table-wrap detail-table-wrap"><table class="data-table"><thead><tr>'+c.cols.map(function(x){return '<th>'+esc(x[0])+'</th>';}).join('')+'</tr></thead><tbody>'+rows.slice(0,MAXROWS).map(function(r){return '<tr>'+c.cols.map(function(x){return '<td>'+cell(x[1],r[x[1]])+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';var o=document.createElement('div');o.id='global-detail-overlay';o.className='global-modal-overlay open';o.innerHTML='<section class="global-modal" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title"><header class="global-modal-header"><h2 id="detail-modal-title">'+esc(c.title)+'</h2><button class="btn-icon" data-close-detail aria-label="Tutup">'+icon('x',17)+'</button></header><div class="global-modal-body detail-body">'+html+'</div><footer class="global-modal-footer"><span class="text-muted">Data aktual / derived dari database snapshot</span><button class="btn btn-secondary" data-close-detail>Tutup</button></footer></section>';document.body.appendChild(o);var prev=document.activeElement;var release=trapFocus(o.querySelector('.global-modal'));function closeDetail(){document.removeEventListener('keydown',onEsc);release();o.remove();if(prev&&prev.focus){try{prev.focus();}catch(e){}}}function onEsc(e){if(e.key==='Escape')closeDetail();}document.addEventListener('keydown',onEsc);o.addEventListener('click',function(e){if(e.target===o||e.target.closest('[data-close-detail]'))closeDetail();});}
  function openNotifications(){
    var rows=(window.AdhData&&window.AdhData.NOTIFICATIONS)||[];
    var PAGE=10,shown=0;
    function rowHtml(n){
      return '<div class="notification-row"><span class="status-badge '+(n.severity==='critical'?'rag-bad':n.severity==='warn'?'rag-warn':'rag-info')+'">'+esc(n.severity)+'</span><div><strong>'+esc(n.title)+'</strong><div class="text-muted">'+esc(n.meta||n.project||'')+'</div></div><strong>'+((Number(n.amount)||0)?money(n.amount):'')+'</strong></div>';
    }
    var o=document.createElement('div');
    o.id='notification-overlay';o.className='global-modal-overlay open';
    o.innerHTML='<section class="global-modal notification-modal" role="dialog" aria-modal="true" aria-labelledby="notif-modal-title"><header class="global-modal-header"><h2 id="notif-modal-title">Notifikasi</h2><button class="btn-icon" data-close-notif aria-label="Tutup">'+icon('x',17)+'</button></header><div class="global-modal-body" id="notif-body"></div><footer class="global-modal-footer"><span id="notif-count" class="text-muted"></span><span style="display:flex;gap:8px"><button class="btn btn-secondary btn-sm" id="notif-more" type="button">Muat lebih</button><button class="btn btn-secondary" data-close-notif type="button">Tutup</button></span></footer></section>';
    document.body.appendChild(o);
    var body=o.querySelector('#notif-body'),countEl=o.querySelector('#notif-count'),moreBtn=o.querySelector('#notif-more');
    function renderMore(){
      if(!rows.length){
        body.innerHTML='<div class="empty-state">'+icon('bell',26)+'<strong>Tidak ada notifikasi</strong><span>Semua pengajuan berada pada kondisi normal.</span></div>';
        countEl.textContent='';moreBtn.style.display='none';return;
      }
      var next=rows.slice(shown,shown+PAGE);
      if(next.length)body.insertAdjacentHTML('beforeend',next.map(rowHtml).join(''));
      shown+=next.length;
      countEl.textContent='Menampilkan '+Math.min(shown,rows.length)+' dari '+rows.length+' notifikasi';
      moreBtn.style.display=shown>=rows.length?'none':'';
    }
    moreBtn.addEventListener('click',renderMore);
    renderMore();
    var prevN=document.activeElement;
    var releaseN=trapFocus(o.querySelector('.global-modal'));
    function closeNotif(){document.removeEventListener('keydown',onEscN);releaseN();o.remove();if(prevN&&prevN.focus){try{prevN.focus();}catch(e){}}}
    function onEscN(e){if(e.key==='Escape')closeNotif();}
    document.addEventListener('keydown',onEscN);
    o.addEventListener('click',function(e){if(e.target===o||e.target.closest('[data-close-notif]'))closeNotif();});
  }

  /* Shared drawer component (T1-10) — one consistent pattern for every page. */
  function openDrawer(opts){
    opts=opts||{};
    var id=opts.id||'adh-drawer';
    var old=document.getElementById(id); if(old)old.remove();
    var wrap=document.createElement('div');
    wrap.id=id; wrap.className='drawer-overlay';
    wrap.innerHTML='<aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="'+id+'-title"><header class="drawer-header"><h2 class="drawer-title" id="'+id+'-title">'+esc(opts.title||'Detail')+'</h2><button class="btn-icon" data-drawer-close type="button" aria-label="Tutup">'+icon('x',17)+'</button></header><div class="drawer-body">'+(opts.body||'')+'</div><footer class="drawer-footer">'+(opts.footer||'<button class="btn btn-secondary" data-drawer-close type="button">Tutup</button>')+'</footer></aside>';
    document.body.appendChild(wrap);
    requestAnimationFrame(function(){wrap.classList.add('open');});
    var prev=document.activeElement;
    var release=trapFocus(wrap.querySelector('.drawer'));
    var closed=false;
    function close(){if(closed)return;closed=true;release();wrap.classList.remove('open');document.removeEventListener('keydown',onEsc);setTimeout(function(){wrap.remove();},220);if(prev&&prev.focus){try{prev.focus();}catch(e){}}}
    function onEsc(e){if(e.key==='Escape')close();}
    document.addEventListener('keydown',onEsc);
    wrap.addEventListener('click',function(e){if(e.target===wrap||e.target.closest('[data-drawer-close]'))close();});
    // T4-02: swipe right on the drawer closes it
    addSwipe(wrap.querySelector('.drawer'),function(dx){if(dx>0)close();});
    return {el:wrap,close:close};
  }

  /* Styled confirm dialog (T1-09) — replaces native confirm(). */
  function confirmDialog(opts){
    opts=opts||{};
    var o=document.createElement('div');
    o.className='global-modal-overlay open';
    o.innerHTML='<section class="global-modal" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" style="width:min(440px,96vw)"><header class="global-modal-header"><h2 id="confirm-title">'+esc(opts.title||'Konfirmasi')+'</h2><button class="btn-icon" data-c-no type="button" aria-label="Tutup">'+icon('x',17)+'</button></header><div class="global-modal-body"><p style="margin:0;font-size:13px;line-height:1.6">'+esc(opts.message||'Lanjutkan aksi ini?')+'</p></div><footer class="global-modal-footer"><span></span><span style="display:flex;gap:10px"><button class="btn btn-secondary" data-c-no type="button">'+esc(opts.cancelText||'Batal')+'</button><button class="btn '+(opts.danger?'btn-danger':'btn-primary')+'" data-c-yes type="button">'+esc(opts.confirmText||'Lanjutkan')+'</button></span></footer></section>';
    document.body.appendChild(o);
    var prev=document.activeElement;
    var release=trapFocus(o.querySelector('.global-modal'));
    var done=false;
    function close(){if(done)return;done=true;release();o.remove();document.removeEventListener('keydown',onEsc);if(prev&&prev.focus){try{prev.focus();}catch(e){}}}
    function onEsc(e){if(e.key==='Escape')close();}
    document.addEventListener('keydown',onEsc);
    o.addEventListener('click',function(e){if(e.target===o||e.target.closest('[data-c-no]'))close();});
    var yes=o.querySelector('[data-c-yes]');
    if(yes)yes.addEventListener('click',function(){close();if(opts.onConfirm)opts.onConfirm();});
    return {close:close};
  }

  /* T4-02: generic swipe detector (passive touch listeners) */
  function addSwipe(el, onSwipe){
    if(!el)return;
    var x0=null,y0=null;
    el.addEventListener('touchstart',function(e){var t=e.touches[0];x0=t.clientX;y0=t.clientY;},{passive:true});
    el.addEventListener('touchend',function(e){
      if(x0===null)return;
      var t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;
      x0=null;
      if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)onSwipe(dx);
    },{passive:true});
  }

  /* T4-01: mobile bottom navigation — first 5 primary destinations */
  function bottomNavItems(role){
    var groups=NAV[role]||NAV.Direktur,out=[];
    groups.forEach(function(g){g.items.forEach(function(it){
      if(out.length>=5)return;
      if(it.href)out.push({label:it.label,href:it.href,icon:it.icon});
      else if(it.children&&it.children.length)out.push({label:it.label,href:it.children[0].href,icon:it.icon});
    });});
    return out.slice(0,5);
  }
  function renderBottomNav(role){
    var active=detectActive();
    return '<nav class="bottom-nav" role="navigation" aria-label="Navigasi cepat">'+bottomNavItems(role).map(function(it){
      var file=(it.href.split('/').pop()||'').replace('.html','');
      var on=(file===active);
      return '<a class="bottom-nav-item'+(on?' active':'')+'" href="'+it.href+'"'+(on?' aria-current="page"':'')+'><span class="bn-icon" aria-hidden="true">'+icon(it.icon,20)+'</span><span class="bn-label">'+esc(it.label)+'</span></a>';
    }).join('')+'</nav>';
  }

  /* T4-04: pull-to-refresh (mobile) */
  function setupPullToRefresh(shell){
    var main=shell.querySelector('.main');
    if(!main||!('ontouchstart' in window))return;
    var ind=document.createElement('div');
    ind.className='ptr-indicator';ind.setAttribute('aria-hidden','true');
    ind.innerHTML=icon('arrow-left-right',16)+'<span>Lepas untuk menyegarkan</span>';
    shell.appendChild(ind);
    var y0=null,pulling=false;
    main.addEventListener('touchstart',function(e){if(main.scrollTop>0)return;y0=e.touches[0].clientY;},{passive:true});
    main.addEventListener('touchmove',function(e){
      if(y0===null)return;
      var dy=e.touches[0].clientY-y0;
      if(dy>70&&main.scrollTop<=0){pulling=true;ind.classList.add('show');}
    },{passive:true});
    main.addEventListener('touchend',function(){
      if(pulling){
        ind.classList.add('refreshing');
        var lbl=ind.querySelector('span');if(lbl)lbl.textContent='Menyegarkan…';
        var done=function(){setTimeout(function(){location.reload();},350);};
        try{if(window.AdhData&&AdhData.load){AdhData.load().then(done,done);}else done();}catch(e){done();}
      }
      y0=null;pulling=false;
    },{passive:true});
  }

  /* T4-05: sticky bulk-action bar when rows are selected (mobile) */
  function setupStickyActionBar(shell){
    if(!shell.querySelector('.row-check'))return;
    var srcBtn=shell.querySelector('button[id^="btn-mass-"]');
    if(!srcBtn)return;
    var bar=document.createElement('div');
    bar.className='sticky-action-bar';bar.setAttribute('role','region');bar.setAttribute('aria-label','Aksi massal');
    bar.innerHTML='<span class="sab-count">0 dipilih</span><span class="sab-actions"></span>';
    var clone=srcBtn.cloneNode(true);clone.removeAttribute('id');clone.removeAttribute('disabled');
    bar.querySelector('.sab-actions').appendChild(clone);
    shell.appendChild(bar);
    function refresh(){
      var n=shell.querySelectorAll('.row-check:checked').length;
      bar.querySelector('.sab-count').textContent=n+' dipilih';
      bar.classList.toggle('show',n>0);
      clone.disabled=(n===0);
    }
    shell.addEventListener('change',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('row-check'))refresh();});
    clone.addEventListener('click',function(){srcBtn.click();setTimeout(refresh,80);});
    refresh();
  }

  function setupNavigation(shell){
    function setSidebarState(collapsed){
      var app=document.getElementById('app-shell'); if(!app)return;
      app.classList.toggle('sidebar-collapsed', !!collapsed);
      var state=!!collapsed;
      var top=document.getElementById('sidebar-toggle'), side=document.getElementById('sidebar-collapse');
      [top,side].forEach(function(btn){
        if(!btn)return;
        btn.setAttribute('aria-expanded', state?'false':'true');
        btn.setAttribute('aria-label', state?'Tampilkan sidebar':'Sembunyikan sidebar');
        btn.title=state?'Tampilkan sidebar':'Sembunyikan sidebar';
      });
      try{localStorage.setItem('adh_sidebar_collapsed',state?'1':'0');}catch(e){}
    }
    function toggleSidebar(){var app=document.getElementById('app-shell');setSidebarState(!app || !app.classList.contains('sidebar-collapsed'));}
    var t=document.getElementById('sidebar-toggle'); if(t)t.addEventListener('click',toggleSidebar);
    var sc=document.getElementById('sidebar-collapse'); if(sc)sc.addEventListener('click',toggleSidebar);
    function isMobile(){return window.innerWidth<=767;}
    function isTablet(){return window.innerWidth>767&&window.innerWidth<=1279;}
    function defaultCollapsed(){return isMobile()||isTablet();}
    var stored=null;try{stored=localStorage.getItem('adh_sidebar_collapsed');}catch(e){}
    if(stored===null){setSidebarState(defaultCollapsed());}else{setSidebarState(stored==='1');}
    shell.addEventListener('click',function(e){if(isMobile()&&!e.target.closest('#sidebar')&&!e.target.closest('#sidebar-toggle'))setSidebarState(true);});
    // T4-02: swipe left on the open sidebar closes it (mobile)
    addSwipe(shell.querySelector('#sidebar'),function(dx){if(isMobile()&&dx<0)setSidebarState(true);});
    var lastMobile=isMobile();
    window.addEventListener('resize',function(){
      var m=isMobile();
      if(m!==lastMobile){lastMobile=m;setSidebarState(m?true:defaultCollapsed());}
    });
    window.addEventListener('orientationchange',function(){
      setTimeout(function(){if(window.AdhDashboard&&window.AdhDashboard.resizeCharts)window.AdhDashboard.resizeCharts();},250);
    });

    shell.querySelectorAll('[data-nav-parent]').forEach(function(btn){btn.addEventListener('click',function(){
      var app=document.getElementById('app-shell');
      var node=btn.closest('.nav-tree-item');
      if(app&&app.classList.contains('sidebar-collapsed')&&!isMobile()){
        setSidebarState(false);
        node.classList.add('is-open');
        btn.setAttribute('aria-expanded','true');
        return;
      }
      var open=node.classList.toggle('is-open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });});
    shell.addEventListener('click',function(e){
      var btn=e.target.closest('button'); if(!btn)return;
      var label=(btn.textContent||'').trim().toLowerCase();
      if(label==='detail' && !btn.dataset.detail){
        var card=btn.closest('.card'); var id=card&&card.id||'';
        var map={'w-dir-04':'funnel','w-dir-11':'project_matrix','w-dir-12':'project_matrix','w-dir-14':'ar_aging','w-dir-15':'ap_aging'};
        var type=map[id]||'project_matrix';
        openDetail(type,{projectId:window.AdhData&&window.AdhData.currentProjectId?window.AdhData.currentProjectId():undefined});
      }
    });
    /* Escape handling lives inside each modal (openDetail / openNotifications) so focus can be restored. */
    var theme=document.getElementById('theme-toggle');
    if(theme){theme.addEventListener('click',function(){if(window.AdhTheme)window.AdhTheme.toggle();syncThemeButton();});syncThemeButton();}
    var pf=document.getElementById('global-project-filter'); if(pf)pf.addEventListener('change',function(){
      if(window.AdhData&&window.AdhData.setCurrentProject)window.AdhData.setCurrentProject(pf.value);
      if(window.AdhData&&window.AdhData.applyProjectView)window.AdhData.applyProjectView();
      syncProjectContext();
      var dash=document.getElementById('dashboard-root');
      if(dash&&window.AdhDashboard){window.AdhDashboard.render(dash);}
      else {window.location.reload();}
    });
    var nt=document.getElementById('notification-toggle'); if(nt)nt.addEventListener('click',openNotifications);
    shell.querySelectorAll('[data-detail]').forEach(function(btn){btn.addEventListener('click',function(){openDetail(btn.dataset.detail,{projectId:btn.dataset.project||undefined,title:btn.dataset.detailTitle||undefined});});});
    shell.querySelectorAll('button').forEach(function(btn){var txt=(btn.textContent||'').trim().toLowerCase();if(txt==='detail'&&!btn.dataset.detail&&!btn.closest('.drawer')){btn.dataset.detail='project_matrix';btn.addEventListener('click',function(){openDetail('project_matrix');});}});
  }
  function syncThemeButton(){var b=document.getElementById('theme-toggle');if(!b)return;var dark=document.documentElement.getAttribute('data-theme')==='dark';b.innerHTML=icon(dark?'sun':'moon',17);b.title=dark?'Tema terang':'Tema gelap';b.setAttribute('aria-label',dark?'Ganti ke tema terang':'Ganti ke tema gelap');b.setAttribute('aria-pressed',dark?'true':'false');}
  function syncProjectContext(){
    var pid=window.AdhData&&window.AdhData.currentProjectId?window.AdhData.currentProjectId():'all';
    var pf=document.getElementById('global-project-filter'); if(pf)pf.value=pid;
    var count=document.querySelector('.notification-count'); var n=(window.AdhData&&window.AdhData.NOTIFICATIONS||[]).length;
    if(n){if(!count){var btn=document.getElementById('notification-toggle');if(btn){count=document.createElement('span');count.className='notification-count';btn.appendChild(count);}} if(count)count.textContent=Math.min(n,99);}
    else if(count)count.remove();
  }

  function parseMoneyText(text){var m=String(text).trim().match(/^Rp\s*([\d.]+)(?:,\d+)?\s*$/i);if(!m)return null;return Number(m[1].replace(/\./g,''));}
  function moneyCompact(v){var n=Math.abs(v),sign=v<0?'-':'';function d(x){return x.toLocaleString('id-ID',{minimumFractionDigits:1,maximumFractionDigits:2});}if(n>=1e12)return sign+'Rp '+d(n/1e12)+' T';if(n>=1e9)return sign+'Rp '+d(n/1e9)+' M';if(n>=1e6)return sign+'Rp '+d(n/1e6)+' jt';if(n>=1e3)return sign+'Rp '+d(n/1e3)+' rb';return 'Rp '+n.toLocaleString('id-ID');}
  function moneyFull(v){return (v<0?'-':'')+'Rp '+Math.abs(v).toLocaleString('id-ID');}
  function setCurrencyMode(table,mode){table.querySelectorAll('tbody td, tfoot td').forEach(function(td){if(!td.dataset.moneyOriginal){var v=parseMoneyText(td.textContent);if(v!==null)td.dataset.moneyOriginal=String(v);}if(td.dataset.moneyOriginal){var v=Number(td.dataset.moneyOriginal);td.textContent=mode==='compact'?moneyCompact(v):moneyFull(v);}});}

  function enhanceTable(table,index){
    if(table.dataset.enhanced==='1'||table.classList.contains('no-enhance'))return;
    var wrap=table.closest('.table-wrap')||table.parentElement;if(!wrap)return;
    table.dataset.enhanced='1';
    var rows=Array.prototype.slice.call(table.tBodies&&table.tBodies[0]?table.tBodies[0].rows:[]);
    if(!rows.length)return;
    rows.forEach(function(r,i){r.dataset.origIndex=String(i);});
    var toolbar=document.createElement('div');toolbar.className='table-toolbar';
    toolbar.innerHTML='<div class="table-tools-left"><label class="table-search"><span class="sr-only">Cari tabel</span>'+icon('search',15)+'<input type="search" placeholder="Cari dalam tabel…" aria-label="Cari dalam tabel"></label><span class="table-result-count"></span></div><div class="table-tools-right"><label class="table-control-label">Nilai <select class="money-mode" aria-label="Mode nilai"><option value="full">Rp penuh</option><option value="compact">Compact</option></select></label><label class="table-control-label">Baris <select class="page-size" aria-label="Jumlah baris per halaman"><option>25</option><option selected>50</option><option>100</option><option>200</option></select></label><button class="btn btn-secondary btn-sm column-toggle" type="button">'+icon('columns',15)+' Kolom</button><button class="btn btn-secondary btn-sm density-toggle" type="button">'+icon('table',15)+' Rapat</button></div>';
    wrap.parentNode.insertBefore(toolbar,wrap);
    var footer=document.createElement('div');footer.className='table-footer';footer.innerHTML='<span class="table-pagination-info"></span><div class="table-pagination"><button type="button" class="btn btn-secondary btn-sm page-prev">Sebelumnya</button><span class="page-number"></span><button type="button" class="btn btn-secondary btn-sm page-next">Berikutnya</button></div>';
    wrap.parentNode.insertBefore(footer,wrap.nextSibling);
    var search=toolbar.querySelector('input'), sizeSel=toolbar.querySelector('.page-size'), modeSel=toolbar.querySelector('.money-mode'), density=toolbar.querySelector('.density-toggle');
    var page=1,densityCompact=false,query='';
    function visibleRows(){return rows.filter(function(r){return r.dataset.searchVisible!=='0'&&r.dataset.projectVisible!=='0';});}
    function render(){var filtered=visibleRows(),size=Number(sizeSel.value)||50,pages=Math.max(1,Math.ceil(filtered.length/size));if(page>pages)page=pages;rows.forEach(function(r){r.style.display='none';});filtered.slice((page-1)*size,page*size).forEach(function(r){r.style.display='';});toolbar.querySelector('.table-result-count').textContent=filtered.length+' baris';footer.querySelector('.table-pagination-info').textContent=filtered.length?'Menampilkan '+((page-1)*size+1)+'–'+Math.min(page*size,filtered.length)+' dari '+filtered.length:'Tidak ada hasil';footer.querySelector('.page-number').textContent=page+' / '+pages;footer.querySelector('.page-prev').disabled=page<=1;footer.querySelector('.page-next').disabled=page>=pages;}
    search.addEventListener('input',function(){query=search.value.trim().toLowerCase();rows.forEach(function(r){r.dataset.searchVisible=(!query||r.textContent.toLowerCase().indexOf(query)>=0)?'1':'0';});page=1;render();});
    sizeSel.addEventListener('change',function(){page=1;render();});
    modeSel.addEventListener('change',function(){setCurrencyMode(table,modeSel.value);});
    footer.querySelector('.page-prev').addEventListener('click',function(){if(page>1){page--;render();}});footer.querySelector('.page-next').addEventListener('click',function(){page++;render();});
    density.addEventListener('click',function(){densityCompact=!densityCompact;table.classList.toggle('table-compact',densityCompact);density.innerHTML=icon('table',15)+(densityCompact?' Normal':' Rapat');});
    var colBtn=toolbar.querySelector('.column-toggle');var menu=document.createElement('div');menu.className='column-menu';menu.hidden=true;var ths=table.tHead?Array.prototype.slice.call(table.tHead.rows[0].cells):[];menu.innerHTML='<div class="column-menu-title">Tampilkan kolom</div>'+ths.map(function(th,i){return '<label><input type="checkbox" data-col="'+i+'" checked> '+(th.textContent||('Kolom '+(i+1))).trim()+'</label>';}).join('');toolbar.appendChild(menu);colBtn.addEventListener('click',function(){menu.hidden=!menu.hidden;});menu.querySelectorAll('input').forEach(function(cb){cb.addEventListener('change',function(){var i=Number(cb.dataset.col),show=cb.checked;Array.prototype.forEach.call(table.rows,function(r){if(r.cells[i])r.cells[i].style.display=show?'':'none';});});});
    document.addEventListener('click',function(e){if(!toolbar.contains(e.target))menu.hidden=true;});
    /* Column sorting (T2-02) */
    var sortIdx=-1,sortDir=0;
    function sortValue(row,i){var c=row.cells[i];if(!c)return '';var t=(c.textContent||'').trim();var m=parseMoneyText(t);if(m!==null)return m;var raw=t.replace(/[^0-9,.\-]/g,'');if(raw&&raw!=='-'&&raw!=='.'){var n=Number(raw.replace(/\./g,'').replace(',','.'));if(!isNaN(n))return n;}return t.toLowerCase();}
    function doSort(i){
      if(sortIdx===i){sortDir=sortDir===1?-1:(sortDir===-1?0:1);}else{sortIdx=i;sortDir=1;}
      if(sortDir===0){rows.sort(function(a,b){return Number(a.dataset.origIndex||0)-Number(b.dataset.origIndex||0);});}
      else{rows.sort(function(a,b){var va=sortValue(a,i),vb=sortValue(b,i);if(va<vb)return -1*sortDir;if(va>vb)return 1*sortDir;return 0;});}
      var tb=table.tBodies&&table.tBodies[0];if(tb)rows.forEach(function(r){tb.appendChild(r);});
      ths.forEach(function(th,k){
        th.removeAttribute('aria-sort');
        var old=th.querySelector('.sort-ind');if(old)old.remove();
        if(k===i&&sortDir!==0){
          th.setAttribute('aria-sort',sortDir===1?'ascending':'descending');
          var ind=document.createElement('span');ind.className='sort-ind';ind.setAttribute('aria-hidden','true');ind.textContent=sortDir===1?' ▲':' ▼';th.appendChild(ind);
        }
      });
      page=1;render();
    }
    ths.forEach(function(th,i){
      if((th.textContent||'').trim()==='')return;
      th.classList.add('th-sortable');
      th.setAttribute('data-sortable','');
      th.setAttribute('tabindex','0');
      th.setAttribute('role','button');
      th.setAttribute('aria-label',(th.textContent||'').trim()+'. Urutkan kolom ini');
      th.addEventListener('click',function(){doSort(i);});
      th.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();doSort(i);}});
    });
    render();
  }
  function enhanceTables(root){root.querySelectorAll('table.data-table').forEach(enhanceTable);}

  function filterTablesByProject(root){var pid=window.AdhData&&window.AdhData.currentProjectId?window.AdhData.currentProjectId():'all';if(!pid||pid==='all'||!window.AdhData)return;var p=(window.AdhData.PROJECTS||[]).find(function(x){return x.id===pid;});if(!p)return;root.querySelectorAll('table.data-table').forEach(function(t){var heads=Array.prototype.map.call(t.tHead?t.tHead.rows[0].cells:[],function(c){return (c.textContent||'').trim().toLowerCase();});var idx=heads.findIndex(function(h){return h==='proyek'||h==='project'||h==='cluster'||h==='nama proyek'||h==='perusahaan';});if(idx<0)return;Array.prototype.forEach.call(t.tBodies&&t.tBodies[0]?t.tBodies[0].rows:[],function(r){var v=(r.cells[idx]&&r.cells[idx].textContent||'').trim();var ok=(v===p.name||v===p.short||v.indexOf(p.name)>=0||v.indexOf(p.short)>=0);r.dataset.projectVisible=ok?'1':'0';r.style.display=ok?'':'none';});});}

  function wireMockButtons(root){root=root||document;root.querySelectorAll('button').forEach(function(btn){if(btn.dataset.mockWired==='1')return;if(btn.id&&/btn-|mass|approve|reject|prev|next|save|close|cancel|login|theme|sidebar/i.test(btn.id))return;if(btn.classList.contains('btn-approve')||btn.classList.contains('btn-reject')||btn.classList.contains('row-check')||btn.classList.contains('leg-cell')||btn.classList.contains('btn-edit-pr')||btn.classList.contains('chip')||btn.hasAttribute('data-nav-parent'))return;var label=(btn.textContent||'').trim().toLowerCase();if(!label)return;var isExport=label.indexOf('export')>=0,isImport=label.indexOf('impor')>=0,isDead=/^(kerjakan|upload|buat pengajuan|\+ inventaris|\+ revisi)/i.test(label);if(isExport||isImport||isDead){btn.dataset.mockWired='1';btn.addEventListener('click',function(e){e.preventDefault();if(isExport){var table=btn.closest('.card,.main')&&btn.closest('.card,.main').querySelector('table.data-table');if(table){var rows=Array.prototype.map.call(table.rows,function(r){return Array.prototype.map.call(r.cells,function(c){return '"'+String(c.textContent||'').replace(/"/g,'""')+'"';}).join(',');}).join('\n');var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows],{type:'text/csv;charset=utf-8'}));a.download='adhiland-export.csv';a.click();showToast('Export CSV berhasil','info');}else showToast('Tidak ada tabel untuk diexport','warn');}else if(isImport){var input=document.createElement('input');input.type='file';input.accept='.csv,.json';input.onchange=function(){if(input.files&&input.files[0])showToast('File '+input.files[0].name+' siap diproses pada workflow import','info');};input.click();}else showToast((btn.textContent||'Aksi').trim()+' — buka workflow terkait untuk memproses item','info');});}});}

  function mount(opts){opts=opts||{};var role=opts.role||detectRole(),title=opts.title||'Dashboard',content=opts.content||'';var shell=document.createElement('div');shell.className='app-shell';shell.id='app-shell';shell.innerHTML='<a class="skip-link" href="#main">Lewati ke konten</a>'+renderSidebar(role)+renderTopbar(title,role)+'<main class="main" id="main" role="main"><div class="main-inner">'+content+'</div></main>'+renderBottomNav(role);var target=document.getElementById('app')||document.body;target.innerHTML='';target.appendChild(shell);try{localStorage.setItem('adh_last_role',role);}catch(e){}setupNavigation(shell);setupPullToRefresh(shell);filterTablesByProject(shell);enhanceTables(shell);setupStickyActionBar(shell);wireMockButtons(shell);window.AdhShell._lastRole=role;}

  /* Loading skeleton — injected before AdhData.load() resolves (T2-06) */
  function skeletonShell(){
    var k='';
    for(var i=0;i<4;i++){k+='<article class="kpi-card"><div class="skeleton" style="height:12px;width:65%;margin-bottom:10px"></div><div class="skeleton" style="height:22px;width:45%"></div></article>';}
    var lines='';
    for(var j=0;j<7;j++){lines+='<div class="skeleton" style="height:13px;width:100%;margin-bottom:9px"></div>';}
    return '<div class="app-shell" aria-busy="true" aria-label="Memuat data"><main class="main"><div class="main-inner"><section class="kpi-grid">'+k+'</section><article class="card"><div class="skeleton" style="height:16px;width:28%;margin-bottom:16px"></div>'+lines+'</article></div></main></div>';
  }
  (function(){
    var app=document.getElementById('app');
    if(app && !app.firstElementChild){ app.innerHTML=skeletonShell(); }
  })();

  window.AdhShell={mount:mount,detectRole:detectRole,NAV:NAV,showToast:showToast,wireMockButtons:wireMockButtons,icon:icon,enhanceTables:enhanceTables,filterTablesByProject:filterTablesByProject,openDetail:openDetail,openNotifications:openNotifications,openDrawer:openDrawer,confirmDialog:confirmDialog,syncProjectContext:syncProjectContext,trapFocus:trapFocus,ensureToastHost:ensureToastHost,skeletonShell:skeletonShell,_lastRole:null};
})();
