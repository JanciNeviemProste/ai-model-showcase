(function () {
  'use strict';

  // ============================================================
  // DATA
  // ============================================================
  var models = {
    opus: {
      key: 'opus',
      name: 'Claude Opus 4.6',
      site: 'NexusAI',
      time: '10m 47s',
      timeMin: 10.78,
      tech: 'Vanilla HTML/CSS/JS',
      color: '#8b5cf6',
      colorAlpha: 'rgba(139,92,246,0.25)',
      iframeSrc: 'sites/opus/index.html',
      rank: 1,
      total: 92.6,
      scores: { 'Design & UX': 93, 'Kvalita kódu': 90, 'Responzívnosť': 88, 'Obsah': 95, 'Funkcie': 95, 'Prístupnosť': 96, 'Výkon': 92, 'SEO': 82, 'Efektivita': 98 },
      highlights: [
        'Carousel s touch/swipe/keyboard',
        'Animované čítače s easing',
        'Google Maps embed',
        'Focus trap v mobile nav',
        'prefers-reduced-motion listener',
        'Unsplash reálne fotky'
      ],
      issues: ['Chýba JSON-LD schema.org']
    },
    sonnet: {
      key: 'sonnet',
      name: 'Claude Sonnet 4.6',
      site: 'Nexora AI',
      time: '16m 45s',
      timeMin: 16.75,
      tech: 'Next.js 16 + TypeScript + Tailwind',
      color: '#3b82f6',
      colorAlpha: 'rgba(59,130,246,0.25)',
      iframeSrc: 'sites/sonnet/index.html',
      rank: 2,
      total: 89.6,
      scores: { 'Design & UX': 92, 'Kvalita kódu': 95, 'Responzívnosť': 92, 'Obsah': 90, 'Funkcie': 85, 'Prístupnosť': 92, 'Výkon': 82, 'SEO': 78, 'Efektivita': 85 },
      highlights: [
        'TypeScript strict mode',
        'Framer Motion animácie',
        'Process sekcia (stepper)',
        'Skip link + aria kompletné',
        'Scroll spy navigácia',
        'useScrollSpy custom hook'
      ],
      issues: ['Žiadny carousel', 'Žiadna mapa', 'Gradient namiesto fotiek']
    },
    kimi: {
      key: 'kimi',
      name: 'Kimi 2.5',
      site: 'NeuralFlow AI',
      time: '19m 27s',
      timeMin: 19.45,
      tech: 'Vanilla HTML/CSS/JS',
      color: '#06b6d4',
      colorAlpha: 'rgba(6,182,212,0.25)',
      iframeSrc: 'sites/kimi/index.html',
      rank: 3,
      total: 87.9,
      scores: { 'Design & UX': 90, 'Kvalita kódu': 91, 'Responzívnosť': 88, 'Obsah': 92, 'Funkcie': 88, 'Prístupnosť': 85, 'Výkon': 90, 'SEO': 68, 'Efektivita': 80 },
      highlights: [
        'Canvas neural particle animácia',
        'Fluid typografia s clamp()',
        'IIFE modularný vzor',
        'Throttling a debouncing',
        'prefers-reduced-motion',
        'ResizeObserver pre canvas'
      ],
      issues: ['Chýba OG tags', 'Chýba JSON-LD', 'Žiadny carousel']
    },
    gemini: {
      key: 'gemini',
      name: 'Gemini 3.1 Pro',
      site: 'NexTech Solutions',
      time: '23m 31s',
      timeMin: 23.52,
      tech: 'Next.js 16 + TypeScript + Tailwind',
      color: '#f59e0b',
      colorAlpha: 'rgba(245,158,11,0.25)',
      iframeSrc: 'sites/gemini/index.html',
      rank: 4,
      total: 83.2,
      scores: { 'Design & UX': 88, 'Kvalita kódu': 92, 'Responzívnosť': 88, 'Obsah': 87, 'Funkcie': 78, 'Prístupnosť': 75, 'Výkon': 82, 'SEO': 65, 'Efektivita': 68 },
      highlights: [
        'Multi-page architektúra (4 stránky)',
        'Reusable UI komponenty',
        'Centralizovaný data.ts',
        'Glassmorphism dizajn',
        'Framer Motion animácie'
      ],
      issues: ['Chaotická adresárová štruktúra', 'Chýbali skip links', 'Žiadne OG tags', 'Pýtal sa otázky počas generovania']
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

  // ============================================================
  // CHART.JS DEFAULTS
  // ============================================================
  function initChartDefaults() {
    if (!window.Chart) return;
    Chart.defaults.color = '#a0a0b8';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.07)';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size = 12;
  }

  // ============================================================
  // RANKING CHART (horizontal bar)
  // ============================================================
  function buildRankingChart() {
    var ctx = document.getElementById('rankingChart');
    if (!ctx || !window.Chart) return;
    var sorted = modelOrder.slice().sort(function(a,b){ return models[b].total - models[a].total; });
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(function(k){ return models[k].name; }),
        datasets: [{
          data: sorted.map(function(k){ return models[k].total; }),
          backgroundColor: sorted.map(function(k){ return models[k].colorAlpha; }),
          borderColor: sorted.map(function(k){ return models[k].color; }),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(ctx){ return ' ' + ctx.parsed.x.toFixed(1) + '%'; }
            }
          }
        },
        scales: {
          x: { min: 70, max: 100, ticks: { callback: function(v){ return v + '%'; } }, grid: { color: 'rgba(255,255,255,0.05)' } },
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
      var m = models[k];
      return {
        label: m.name,
        data: labels.map(function(l){ return m.scores[l]; }),
        borderColor: m.color,
        backgroundColor: m.colorAlpha,
        borderWidth: 2,
        pointBackgroundColor: m.color,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    });
    new Chart(ctx, {
      type: 'radar',
      data: { labels: labels, datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 60,
            max: 100,
            ticks: { stepSize: 10, backdropColor: 'transparent', callback: function(v){ return v + '%'; } },
            grid: { color: 'rgba(255,255,255,0.08)' },
            angleLines: { color: 'rgba(255,255,255,0.08)' },
            pointLabels: { font: { size: 12 }, color: '#a0a0b8' }
          }
        },
        plugins: {
          legend: { position: 'bottom', labels: { padding: 20, usePointStyle: true, pointStyleWidth: 10 } },
          tooltip: { callbacks: { label: function(ctx){ return ' ' + ctx.dataset.label + ': ' + ctx.parsed.r + '%'; } } }
        }
      }
    });
  }

  // ============================================================
  // TIME CHART
  // ============================================================
  function buildTimeChart() {
    var ctx = document.getElementById('timeChart');
    if (!ctx || !window.Chart) return;
    var sorted = modelOrder.slice().sort(function(a,b){ return models[a].timeMin - models[b].timeMin; });
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(function(k){ return models[k].name; }),
        datasets: [{
          label: 'Čas (minúty)',
          data: sorted.map(function(k){ return models[k].timeMin; }),
          backgroundColor: sorted.map(function(k){ return models[k].colorAlpha; }),
          borderColor: sorted.map(function(k){ return models[k].color; }),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function(ctx){ return ' ' + modelOrder.filter(function(k){ return models[k].name === ctx.label; }).map(function(k){ return models[k].time; })[0]; } } }
        },
        scales: {
          y: { ticks: { callback: function(v){ return v + 'min'; } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });
  }

  // ============================================================
  // EFFICIENCY CHART (score per minute)
  // ============================================================
  function buildEfficiencyChart() {
    var ctx = document.getElementById('efficiencyChart');
    if (!ctx || !window.Chart) return;
    var sorted = modelOrder.slice().sort(function(a,b){
      return (models[b].total / models[b].timeMin) - (models[a].total / models[a].timeMin);
    });
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sorted.map(function(k){ return models[k].name; }),
        datasets: [{
          label: '% skóre / minútu',
          data: sorted.map(function(k){ return (models[k].total / models[k].timeMin).toFixed(2); }),
          backgroundColor: sorted.map(function(k){ return models[k].colorAlpha; }),
          borderColor: sorted.map(function(k){ return models[k].color; }),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function(ctx){ return ' ' + ctx.parsed.y + ' bod/min'; } } }
        },
        scales: {
          y: { ticks: { callback: function(v){ return v + ' b/m'; } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { grid: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
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
      var scores = modelOrder.map(function(k){ return { k:k, v: models[k].scores[cat.key] }; });
      var maxVal = Math.max.apply(null, scores.map(function(s){ return s.v; }));
      html += '<tr>';
      html += '<td>' + cat.key + '</td>';
      html += '<td style="color:var(--text3)">' + Math.round(cat.weight * 100) + '%</td>';
      // order: opus, sonnet, kimi, gemini
      ['opus','sonnet','kimi','gemini'].forEach(function(k) {
        var v = models[k].scores[cat.key];
        var isBest = v === maxVal;
        html += '<td class="col-' + k + (isBest ? ' best' : '') + '">' + v + '%</td>';
      });
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  // ============================================================
  // MODEL CARDS
  // ============================================================
  function buildModelCards() {
    var grid = document.getElementById('modelsGrid');
    if (!grid) return;
    var rankEmoji = ['🥇','🥈','🥉','4️⃣'];
    var html = '';
    modelOrder.forEach(function(k) {
      var m = models[k];
      html += '<div class="model-card rank-' + m.rank + '">';
      html += '<div class="model-color-bar" style="background:' + m.color + '"></div>';
      html += '<div class="model-card-top">';
      html += '<div class="rank-badge" style="background:' + m.colorAlpha + ';color:' + m.color + '">' + m.rank + '</div>';
      html += '<div class="model-name">' + m.name + '</div>';
      html += '<div class="model-site">' + m.site + ' — ' + m.tech + '</div>';
      html += '<div class="model-meta">';
      html += '<div class="meta-item"><span class="meta-label">Čas</span><span class="meta-value">' + m.time + '</span></div>';
      html += '</div>';
      html += '<div class="model-score-big" style="color:' + m.color + '">' + m.total + '%</div>';
      html += '<div class="model-score-rank">#' + m.rank + ' celkové poradie</div>';
      html += '</div>';
      html += '<div class="model-bars">';
      categories.forEach(function(cat) {
        var v = m.scores[cat.key];
        html += '<div class="bar-row">';
        html += '<div class="bar-label">' + cat.key + '</div>';
        html += '<div class="bar-track"><div class="bar-fill" style="width:' + v + '%;background:' + m.color + '" data-width="' + v + '"></div></div>';
        html += '<div class="bar-val" style="color:' + m.color + '">' + v + '</div>';
        html += '</div>';
      });
      html += '</div>';
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
      html += '<button class="preview-btn" onclick="switchModel(\'' + k + '\')" data-model="' + k + '">▶ Otvoriť Live Preview</button>';
      html += '</div>';
    });
    grid.innerHTML = html;
  }

  // ============================================================
  // PREVIEW TABS
  // ============================================================
  function buildModelTabs() {
    var tabs = document.getElementById('modelTabs');
    if (!tabs) return;
    var html = '';
    modelOrder.forEach(function(k) {
      var m = models[k];
      html += '<button class="model-tab' + (k === currentModel ? ' active' : '') + '" data-model="' + k + '" onclick="switchModel(\'' + k + '\')" role="tab" aria-selected="' + (k === currentModel) + '">';
      html += '<span class="dot" style="background:' + m.color + '"></span>';
      html += '<span>' + m.name + '</span>';
      html += '</button>';
    });
    tabs.innerHTML = html;
  }

  window.switchModel = function(key) {
    if (!models[key]) return;
    currentModel = key;
    var m = models[key];
    var frame = document.getElementById('previewFrame');
    if (frame) frame.src = m.iframeSrc;
    // Update tabs
    document.querySelectorAll('.model-tab').forEach(function(t) {
      var active = t.getAttribute('data-model') === key;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
      if (active) t.style.background = m.colorAlpha;
      else t.style.background = '';
      if (active) t.style.borderColor = m.color;
      else t.style.borderColor = '';
    });
    // Update preview info
    var info = document.getElementById('previewInfo');
    if (info) {
      info.innerHTML = '<div class="preview-info-item"><span>Model:</span><strong style="color:' + m.color + '">' + m.name + '</strong></div>'
        + '<div class="preview-info-item"><span>Stránka:</span><strong>' + m.site + '</strong></div>'
        + '<div class="preview-info-item"><span>Tech:</span><strong>' + m.tech + '</strong></div>'
        + '<div class="preview-info-item"><span>Čas:</span><strong>' + m.time + '</strong></div>'
        + '<div class="preview-info-item"><span>Skóre:</span><strong style="color:' + m.color + '">' + m.total + '%</strong></div>';
    }
    // Scroll to preview section
    var previewSection = document.getElementById('preview');
    if (previewSection) {
      previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      var best = modelOrder.reduce(function(a, b) {
        return models[b].scores[cat.key] > models[a].scores[cat.key] ? b : a;
      });
      var m = models[best];
      html += '<div class="winner-item">';
      html += '<span class="winner-cat">' + cat.key + '</span>';
      html += '<span class="winner-model" style="color:' + m.color + '">' + m.name.replace('Claude ', '') + '</span>';
      html += '</div>';
    });
    grid.innerHTML = html;
  }

  // ============================================================
  // SCROLL ANIMATIONS
  // ============================================================
  function initScrollAnimations() {
    var els = document.querySelectorAll('.animate-in');
    if (!els.length) return;
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      els.forEach(function(el){ el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function(el){ observer.observe(el); });
  }

  // ============================================================
  // HEADER SCROLL
  // ============================================================
  function initHeader() {
    var header = document.getElementById('header');
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (header) header.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    // Mobile menu
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
        a.addEventListener('click', function() {
          mobileNav.classList.remove('open');
          hamburger.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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

    // Init preview iframe with first model
    switchModel('opus');

    // Wait for Chart.js
    if (window.Chart) {
      initChartDefaults();
      buildRankingChart();
      buildRadarChart();
      buildTimeChart();
      buildEfficiencyChart();
    } else {
      var s = document.querySelector('script[src*="chart.js"]');
      if (s) s.addEventListener('load', function() {
        initChartDefaults();
        buildRankingChart();
        buildRadarChart();
        buildTimeChart();
        buildEfficiencyChart();
      });
    }
  });

})();
