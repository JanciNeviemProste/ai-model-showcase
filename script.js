(function () {
  'use strict';

  // ============================================================
  // DATA — dual scoring: "delivered" = as-is output, "fixed" = after manual fixes
  // ============================================================
  var models = {
    opus: {
      key: 'opus', name: 'Claude Opus 4.6', site: 'NexusAI',
      time: '10m 47s', timeMin: 10.78, tech: 'Vanilla HTML/CSS/JS',
      color: '#8b5cf6', colorAlpha: 'rgba(139,92,246,0.25)',
      iframeSrc: 'sites/opus/index.html',
      iframeSrcOriginal: 'sites/opus/index.html',
      needsFix: false,
      delivered: { 'Design & UX': 93, 'Kvalita kódu': 90, 'Responzívnosť': 88, 'Obsah': 95, 'Funkcie': 95, 'Prístupnosť': 96, 'Výkon': 92, 'SEO': 82, 'Efektivita': 98 },
      fixed:     { 'Design & UX': 93, 'Kvalita kódu': 90, 'Responzívnosť': 88, 'Obsah': 95, 'Funkcie': 95, 'Prístupnosť': 96, 'Výkon': 92, 'SEO': 82, 'Efektivita': 98 },
      highlights: [
        'Funguje okamžite bez buildu',
        'Carousel s touch/swipe/keyboard',
        'Animované čítače s easing',
        'Google Maps embed',
        'Focus trap v mobile nav',
        'prefers-reduced-motion listener',
        'Unsplash reálne fotky'
      ],
      issues: ['Chýba JSON-LD schema.org'],
      deliveredNote: 'Funguje perfektne ako dodané. Žiadne opravy potrebné.'
    },
    sonnet: {
      key: 'sonnet', name: 'Claude Sonnet 4.6', site: 'Nexora AI',
      time: '16m 45s', timeMin: 16.75, tech: 'Next.js 16 + TypeScript + Tailwind',
      color: '#3b82f6', colorAlpha: 'rgba(59,130,246,0.25)',
      iframeSrc: 'sites/sonnet/index.html',
      iframeSrcOriginal: 'sites/sonnet-original/index.html',
      needsFix: true,
      delivered: { 'Design & UX': 30, 'Kvalita kódu': 95, 'Responzívnosť': 30, 'Obsah': 70, 'Funkcie': 20, 'Prístupnosť': 45, 'Výkon': 82, 'SEO': 78, 'Efektivita': 45 },
      fixed:     { 'Design & UX': 92, 'Kvalita kódu': 95, 'Responzívnosť': 92, 'Obsah': 90, 'Funkcie': 85, 'Prístupnosť': 92, 'Výkon': 82, 'SEO': 78, 'Efektivita': 85 },
      highlights: [
        'TypeScript strict mode',
        'Framer Motion animácie',
        'Process sekcia (stepper)',
        'Skip link + aria kompletné',
        'Scroll spy navigácia',
        'useScrollSpy custom hook'
      ],
      issues: [
        'KRITICKÉ: Web je neviditeľný na statickom hostingu (45× opacity:0)',
        'Framer Motion SSR vyžaduje funkčnú React hydráciu',
        'Žiadny carousel', 'Žiadna mapa', 'Gradient namiesto fotiek'
      ],
      deliveredNote: 'Stránka je kompletne NEVIDITEĽNÁ. Framer Motion nastaví 45 elementov na opacity:0. Bez funkčnej React hydrácie obsah nikdy nezmizne. Kód je excelentný, ale výsledok nefunkčný.'
    },
    kimi: {
      key: 'kimi', name: 'Kimi 2.5', site: 'NeuralFlow AI',
      time: '19m 27s', timeMin: 19.45, tech: 'Vanilla HTML/CSS/JS',
      color: '#06b6d4', colorAlpha: 'rgba(6,182,212,0.25)',
      iframeSrc: 'sites/kimi/index.html',
      iframeSrcOriginal: 'sites/kimi/index.html',
      needsFix: false,
      delivered: { 'Design & UX': 90, 'Kvalita kódu': 91, 'Responzívnosť': 88, 'Obsah': 92, 'Funkcie': 88, 'Prístupnosť': 85, 'Výkon': 90, 'SEO': 68, 'Efektivita': 80 },
      fixed:     { 'Design & UX': 90, 'Kvalita kódu': 91, 'Responzívnosť': 88, 'Obsah': 92, 'Funkcie': 88, 'Prístupnosť': 85, 'Výkon': 90, 'SEO': 68, 'Efektivita': 80 },
      highlights: [
        'Funguje okamžite bez buildu',
        'Canvas neural particle animácia',
        'Fluid typografia s clamp()',
        'IIFE modularný vzor',
        'Throttling a debouncing',
        'prefers-reduced-motion',
        'ResizeObserver pre canvas'
      ],
      issues: ['Chýba OG tags', 'Chýba JSON-LD', 'Žiadny carousel'],
      deliveredNote: 'Funguje perfektne ako dodané. Žiadne opravy potrebné.'
    },
    gemini: {
      key: 'gemini', name: 'Gemini 3.1 Pro', site: 'NexTech Solutions',
      time: '23m 31s', timeMin: 23.52, tech: 'Next.js 16 + TypeScript + Tailwind',
      color: '#f59e0b', colorAlpha: 'rgba(245,158,11,0.25)',
      iframeSrc: 'sites/gemini/index.html',
      iframeSrcOriginal: 'sites/gemini-original/index.html',
      needsFix: true,
      delivered: { 'Design & UX': 25, 'Kvalita kódu': 80, 'Responzívnosť': 30, 'Obsah': 10, 'Funkcie': 15, 'Prístupnosť': 35, 'Výkon': 82, 'SEO': 55, 'Efektivita': 20 },
      fixed:     { 'Design & UX': 88, 'Kvalita kódu': 92, 'Responzívnosť': 88, 'Obsah': 87, 'Funkcie': 78, 'Prístupnosť': 75, 'Výkon': 82, 'SEO': 65, 'Efektivita': 68 },
      highlights: [
        'Multi-page architektúra (4 stránky)',
        'Reusable UI komponenty',
        'Centralizovaný data.ts',
        'Glassmorphism dizajn'
      ],
      issues: [
        'KRITICKÉ: Homepage je default Next.js "To get started, edit page.tsx"',
        'Chaotická 3-úrovňová vnorená adresárová štruktúra',
        'Route stránky v nesprávnom priečinku',
        'Navigačné linky vedú na neexistujúce stránky',
        'Chýbali skip links', 'Žiadne OG tags',
        'Najpomalší + pýtal sa otázky počas generovania'
      ],
      deliveredNote: 'Homepage zobrazuje DEFAULT Next.js template ("To get started, edit page.tsx"). Gemini nikdy nedokončil hlavnú stránku. Vytvoril 3-úrovňovú vnorenú štruktúru a route pages dal do zlého priečinka. Navigácia vedie na 404.'
    }
  };

  var categories = [
    { key: 'Design & UX', weight: 0.20 },
    { key: 'Kvalita kódu', weight: 0.15 },
    { key: 'Responzívnosť', weight: 0.10 },
    { key: 'Obsah', weight: 0.15 },
    { key: 'Funkcie', weight: 0.15 },
    { key: 'Prístupnosť', weight: 0.10 },
    { key: 'Výkon', weight: 0.05 },
    { key: 'SEO', weight: 0.05 },
    { key: 'Efektivita', weight: 0.05 }
  ];

  var modelOrder = ['opus', 'sonnet', 'kimi', 'gemini'];
  var currentModel = 'opus';
  var currentDevice = 'desktop';
  var currentMode = 'delivered'; // 'delivered' or 'fixed'
  var charts = {};

  function getScores(k) { return models[k][currentMode]; }
  function getTotal(k) {
    var s = getScores(k);
    var t = 0;
    categories.forEach(function(c) { t += s[c.key] * c.weight; });
    return Math.round(t * 10) / 10;
  }
  function getRanking() {
    var arr = modelOrder.map(function(k){ return { k:k, t: getTotal(k) }; });
    arr.sort(function(a,b){ return b.t - a.t; });
    var ranks = {};
    arr.forEach(function(item, i){ ranks[item.k] = i + 1; });
    return ranks;
  }

  // ============================================================
  // MODE TOGGLE
  // ============================================================
  window.setMode = function(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });
    rebuildAll();
  };

  function rebuildAll() {
    buildScoreTable();
    buildModelCards();
    buildCategoryWinners();
    updateTotalsInHeader();
    rebuildCharts();
    // Update iframe src for current model
    var m = models[currentModel];
    var frame = document.getElementById('previewFrame');
    if (frame) frame.src = currentMode === 'delivered' ? m.iframeSrcOriginal : m.iframeSrc;
    // Update preview info
    switchModelInfo(currentModel);
  }

  function updateTotalsInHeader() {
    var footer = document.querySelector('.total-row');
    if (!footer) return;
    var cells = footer.querySelectorAll('td');
    if (cells.length < 6) return;
    ['opus','sonnet','kimi','gemini'].forEach(function(k, i) {
      cells[i + 2].innerHTML = '<strong>' + getTotal(k) + '%</strong>';
    });
  }

  // ============================================================
  // CHART HELPERS
  // ============================================================
  function initChartDefaults() {
    if (!window.Chart) return;
    Chart.defaults.color = '#a0a0b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
  }

  function rebuildCharts() {
    Object.keys(charts).forEach(function(k) { if (charts[k]) charts[k].destroy(); });
    charts = {};
    buildRankingChart();
    buildRadarChart();
    buildTimeChart();
    buildEfficiencyChart();
  }

  // ============================================================
  // RANKING CHART
  // ============================================================
  function buildRankingChart() {
    var ctx = document.getElementById('rankingChart');
    if (!ctx || !window.Chart) return;
    var sorted = modelOrder.slice().sort(function(a,b){ return getTotal(b) - getTotal(a); });
    charts.ranking = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(function(k){ return models[k].name; }),
        datasets: [{
          data: sorted.map(function(k){ return getTotal(k); }),
          backgroundColor: sorted.map(function(k){ return models[k].colorAlpha; }),
          borderColor: sorted.map(function(k){ return models[k].color; }),
          borderWidth: 2, borderRadius: 8, borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx){ return ' ' + ctx.parsed.x.toFixed(1) + '%'; } } } },
        scales: {
          x: { min: 0, max: 100, ticks: { callback: function(v){ return v + '%'; } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { grid: { display: false }, ticks: { font: { size: 13, weight: '600' } } }
        }
      }
    });
  }

  // ============================================================
  // RADAR CHART
  // ============================================================
  function buildRadarChart() {
    var ctx = document.getElementById('radarChart');
    if (!ctx || !window.Chart) return;
    var labels = categories.map(function(c){ return c.key; });
    var datasets = modelOrder.map(function(k) {
      var m = models[k]; var s = getScores(k);
      return {
        label: m.name, data: labels.map(function(l){ return s[l]; }),
        borderColor: m.color, backgroundColor: m.colorAlpha,
        borderWidth: 2, pointBackgroundColor: m.color, pointRadius: 4, pointHoverRadius: 6
      };
    });
    charts.radar = new Chart(ctx, {
      type: 'radar',
      data: { labels: labels, datasets: datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { r: { min: 0, max: 100, ticks: { stepSize: 20, backdropColor: 'transparent', callback: function(v){ return v + '%'; } }, grid: { color: 'rgba(255,255,255,0.08)' }, angleLines: { color: 'rgba(255,255,255,0.08)' }, pointLabels: { font: { size: 12 }, color: '#a0a0b8' } } },
        plugins: { legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, pointStyleWidth: 10 } }, tooltip: { callbacks: { label: function(ctx){ return ' ' + ctx.dataset.label + ': ' + ctx.parsed.r + '%'; } } } }
      }
    });
  }

  // ============================================================
  // TIME + EFFICIENCY CHARTS
  // ============================================================
  function buildTimeChart() {
    var ctx = document.getElementById('timeChart');
    if (!ctx || !window.Chart) return;
    var sorted = modelOrder.slice().sort(function(a,b){ return models[a].timeMin - models[b].timeMin; });
    charts.time = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(function(k){ return models[k].name; }),
        datasets: [{ data: sorted.map(function(k){ return models[k].timeMin; }), backgroundColor: sorted.map(function(k){ return models[k].colorAlpha; }), borderColor: sorted.map(function(k){ return models[k].color; }), borderWidth: 2, borderRadius: 8, borderSkipped: false }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: function(v){ return v + 'min'; } }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
    });
  }

  function buildEfficiencyChart() {
    var ctx = document.getElementById('efficiencyChart');
    if (!ctx || !window.Chart) return;
    var sorted = modelOrder.slice().sort(function(a,b){ return (getTotal(b) / models[b].timeMin) - (getTotal(a) / models[a].timeMin); });
    charts.efficiency = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(function(k){ return models[k].name; }),
        datasets: [{ data: sorted.map(function(k){ return (getTotal(k) / models[k].timeMin).toFixed(2); }), backgroundColor: sorted.map(function(k){ return models[k].colorAlpha; }), borderColor: sorted.map(function(k){ return models[k].color; }), borderWidth: 2, borderRadius: 8, borderSkipped: false }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: function(v){ return v + ' b/m'; } }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }
    });
  }

  // ============================================================
  // SCORE TABLE
  // ============================================================
  function buildScoreTable() {
    var tbody = document.getElementById('scoreTableBody');
    if (!tbody) return;
    var html = '';
    categories.forEach(function(cat) {
      var vals = modelOrder.map(function(k){ return getScores(k)[cat.key]; });
      var maxVal = Math.max.apply(null, vals);
      html += '<tr><td>' + cat.key + '</td><td style="color:var(--text3)">' + Math.round(cat.weight * 100) + '%</td>';
      ['opus','sonnet','kimi','gemini'].forEach(function(k) {
        var v = getScores(k)[cat.key];
        html += '<td class="col-' + k + (v === maxVal ? ' best' : '') + '">' + v + '%</td>';
      });
      html += '</tr>';
    });
    tbody.innerHTML = html;
    updateTotalsInHeader();
  }

  // ============================================================
  // MODEL CARDS
  // ============================================================
  function buildModelCards() {
    var grid = document.getElementById('modelsGrid');
    if (!grid) return;
    var ranks = getRanking();
    var html = '';
    modelOrder.forEach(function(k) {
      var m = models[k]; var rank = ranks[k]; var total = getTotal(k);
      html += '<div class="model-card' + (rank === 1 ? ' rank-1' : '') + '">';
      html += '<div class="model-color-bar" style="background:' + m.color + '"></div>';
      html += '<div class="model-card-top">';
      html += '<div class="rank-badge" style="background:' + m.colorAlpha + ';color:' + m.color + '">' + rank + '</div>';
      html += '<div class="model-name">' + m.name + '</div>';
      html += '<div class="model-site">' + m.site + ' — ' + m.tech + '</div>';
      html += '<div class="model-meta"><div class="meta-item"><span class="meta-label">Čas</span><span class="meta-value">' + m.time + '</span></div>';
      if (m.needsFix) html += '<div class="meta-item"><span class="meta-label">Stav</span><span class="meta-value" style="color:#ef4444">' + (currentMode === 'delivered' ? 'NEFUNKČNÉ' : 'OPRAVENÉ') + '</span></div>';
      else html += '<div class="meta-item"><span class="meta-label">Stav</span><span class="meta-value" style="color:#22c55e">FUNKČNÉ</span></div>';
      html += '</div>';
      html += '<div class="model-score-big" style="color:' + m.color + '">' + total + '%</div>';
      html += '<div class="model-score-rank">#' + rank + ' celkové poradie</div>';
      html += '</div>';
      // Score bars
      html += '<div class="model-bars">';
      categories.forEach(function(cat) {
        var v = getScores(k)[cat.key];
        html += '<div class="bar-row"><div class="bar-label">' + cat.key + '</div>';
        html += '<div class="bar-track"><div class="bar-fill" style="width:' + v + '%;background:' + m.color + '"></div></div>';
        html += '<div class="bar-val" style="color:' + m.color + '">' + v + '</div></div>';
      });
      html += '</div>';
      // Delivered note
      if (currentMode === 'delivered' && m.deliveredNote) {
        html += '<div class="delivered-note">' + m.deliveredNote + '</div>';
      }
      // Highlights
      html += '<div class="model-highlights">';
      html += '<div class="highlight-title">Silné stránky</div><div class="highlight-list">';
      m.highlights.forEach(function(h){ html += '<div class="highlight-item">' + h + '</div>'; });
      html += '</div>';
      if (m.issues && m.issues.length) {
        html += '<div class="highlight-title" style="margin-top:14px">Slabé stránky</div><div class="highlight-list">';
        m.issues.forEach(function(i){ html += '<div class="highlight-item bad">' + i + '</div>'; });
        html += '</div>';
      }
      html += '</div>';
      html += '<button class="preview-btn" onclick="switchModel(\'' + k + '\')">▶ Otvoriť Live Preview</button>';
      html += '</div>';
    });
    grid.innerHTML = html;
  }

  // ============================================================
  // PREVIEW
  // ============================================================
  function buildModelTabs() {
    var tabs = document.getElementById('modelTabs');
    if (!tabs) return;
    var html = '';
    modelOrder.forEach(function(k) {
      var m = models[k];
      html += '<button class="model-tab' + (k === currentModel ? ' active' : '') + '" data-model="' + k + '" onclick="switchModel(\'' + k + '\')" role="tab">';
      html += '<span class="dot" style="background:' + m.color + '"></span><span>' + m.name + '</span></button>';
    });
    tabs.innerHTML = html;
  }

  function switchModelInfo(key) {
    var m = models[key]; var total = getTotal(key);
    var info = document.getElementById('previewInfo');
    if (info) {
      var warning = '';
      if (currentMode === 'delivered' && m.needsFix) {
        warning = '<div class="preview-info-item" style="color:#ef4444"><strong>⚠ ' + (key === 'sonnet' ? 'Stránka je neviditeľná (opacity:0)' : 'Default Next.js homepage') + '</strong></div>';
      }
      info.innerHTML = '<div class="preview-info-item"><span>Model:</span><strong style="color:' + m.color + '">' + m.name + '</strong></div>'
        + '<div class="preview-info-item"><span>Stránka:</span><strong>' + m.site + '</strong></div>'
        + '<div class="preview-info-item"><span>Čas:</span><strong>' + m.time + '</strong></div>'
        + '<div class="preview-info-item"><span>Skóre:</span><strong style="color:' + m.color + '">' + total + '%</strong></div>'
        + warning;
    }
  }

  window.switchModel = function(key) {
    if (!models[key]) return;
    currentModel = key;
    var m = models[key];
    var frame = document.getElementById('previewFrame');
    if (frame) frame.src = currentMode === 'delivered' ? m.iframeSrcOriginal : m.iframeSrc;
    document.querySelectorAll('.model-tab').forEach(function(t) {
      var active = t.getAttribute('data-model') === key;
      t.classList.toggle('active', active);
      if (active) { t.style.background = m.colorAlpha; t.style.borderColor = m.color; }
      else { t.style.background = ''; t.style.borderColor = ''; }
    });
    switchModelInfo(key);
    document.getElementById('preview').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.setDevice = function(device) {
    currentDevice = device;
    var wrap = document.getElementById('iframeWrap');
    var widths = { desktop: '100%', tablet: '768px', mobile: '375px' };
    if (wrap) wrap.style.maxWidth = widths[device] || '100%';
    document.querySelectorAll('.device-btn').forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-device') === device);
    });
  };

  // ============================================================
  // CATEGORY WINNERS
  // ============================================================
  function buildCategoryWinners() {
    var grid = document.getElementById('winnersGrid');
    if (!grid) return;
    var html = '';
    categories.forEach(function(cat) {
      var best = modelOrder.reduce(function(a, b) { return getScores(b)[cat.key] > getScores(a)[cat.key] ? b : a; });
      var m = models[best];
      html += '<div class="winner-item"><span class="winner-cat">' + cat.key + '</span>';
      html += '<span class="winner-model" style="color:' + m.color + '">' + m.name.replace('Claude ', '') + '</span></div>';
    });
    grid.innerHTML = html;
  }

  // ============================================================
  // SCROLL + HEADER
  // ============================================================
  function initScrollAnimations() {
    var els = document.querySelectorAll('.animate-in');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function(el){ el.classList.add('visible'); }); return;
    }
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function(el){ obs.observe(el); });
  }

  function initHeader() {
    var header = document.getElementById('header'); var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) { requestAnimationFrame(function() { if (header) header.classList.toggle('scrolled', window.scrollY > 40); ticking = false; }); ticking = true; }
    }, { passive: true });
    var hamburger = document.getElementById('hamburger');
    var mobileNav = document.getElementById('mobileNav');
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', function() {
        var open = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('open', open);
        hamburger.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      mobileNav.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() { mobileNav.classList.remove('open'); hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; });
      });
    }
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var href = this.getAttribute('href'); if (href === '#') return;
        var target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
    });
  }

  // ============================================================
  // INIT
  // ============================================================
  document.addEventListener('DOMContentLoaded', function() {
    initHeader();
    buildScoreTable();
    buildModelCards();
    buildModelTabs();
    buildCategoryWinners();
    initScrollAnimations();
    switchModel('opus');

    function startCharts() {
      initChartDefaults(); buildRankingChart(); buildRadarChart(); buildTimeChart(); buildEfficiencyChart();
    }
    if (window.Chart) startCharts();
    else { var s = document.querySelector('script[src*="chart.js"]'); if (s) s.addEventListener('load', startCharts); }
  });

})();
