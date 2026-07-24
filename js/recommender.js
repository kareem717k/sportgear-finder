/**
 * recommender.js — SportGear Finder
 * "Gear Finder" — homepage recommender widget.
 * Client-side, rule-based matching against data/products.json.
 * No external calls, no hallucinated products: every result is a real
 * catalog entry with a real affiliate link.
 */

(function () {
  'use strict';

  // ─── DATA ────────────────────────────────────────────────────────────────
  var PRODUCTS = null;
  var LOAD_ERROR = false;

  function loadProducts() {
    return fetch('data/products.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { PRODUCTS = d.products || []; })
      .catch(function () { LOAD_ERROR = true; });
  }

  // ─── VOCAB ───────────────────────────────────────────────────────────────
  var SPORT_KEYWORDS = {
    tennis: ['tennis', 'racket', 'racquet'],
    gym: ['gym', 'fitness', 'workout', 'weightlifting', 'lifting', 'dumbbell', 'strength', 'crossfit', 'home gym'],
    boxing: ['boxing', 'box', 'fight', 'sparring', 'punch', 'heavy bag', 'mma'],
    swimming: ['swim', 'swimming', 'pool', 'lap', 'triathlon', 'open water'],
    football: ['football', 'soccer', 'futbol', 'pitch', 'goalkeeper', 'keeper']
  };

  var CATEGORY_KEYWORDS = {
    tennis: {
      rackets: ['racket', 'racquet'],
      balls: ['ball', 'balls'],
      shoes: ['shoe', 'shoes', 'sneaker'],
      bags: ['bag', 'backpack', 'duffel'],
      strings: ['string', 'strings', 'gut', 'polyester'],
      grips: ['grip', 'overgrip'],
      accessories: ['dampener', 'wristband', 'headband'],
      shirts: ['shirt', 'polo'],
      shorts: ['short', 'shorts'],
      skirts: ['skirt', 'dress'],
      socks: ['sock', 'socks'],
      hats: ['hat', 'cap', 'visor']
    },
    gym: {
      dumbbells: ['dumbbell', 'dumbbells', 'weight', 'weights'],
      'resistance-bands': ['band', 'bands', 'resistance'],
      'training-shoes': ['shoe', 'shoes', 'trainer', 'trainers', 'cross trainer'],
      'gym-bags': ['bag', 'duffel', 'gym bag'],
      gloves: ['glove', 'gloves'],
      'jump-ropes': ['rope', 'jump rope', 'skipping rope']
    },
    boxing: {
      gloves: ['glove', 'gloves'],
      'punching-bags': ['punching bag', 'heavy bag', 'bag'],
      'hand-wraps': ['wrap', 'wraps', 'hand wrap'],
      shoes: ['shoe', 'shoes', 'boxing shoe'],
      headgear: ['headgear', 'helmet', 'head guard'],
      'speed-bags': ['speed bag', 'speed bags']
    },
    swimming: {
      goggles: ['goggle', 'goggles'],
      suits: ['suit', 'swimsuit', 'jammer', 'diamondfit'],
      caps: ['cap', 'swim cap'],
      fins: ['fin', 'fins', 'flipper', 'flippers'],
      'training-aids': ['kickboard', 'pull buoy', 'paddle', 'training aid'],
      bags: ['bag', 'mesh bag']
    },
    football: {
      boots: ['boot', 'boots', 'cleat', 'cleats'],
      balls: ['ball', 'balls', 'football'],
      'shin-guards': ['shin guard', 'shin pad', 'shin'],
      'goalkeeper-gloves': ['goalkeeper', 'keeper glove', 'gk glove'],
      jerseys: ['jersey', 'jerseys', 'shirt', 'kit'],
      socks: ['sock', 'socks']
    }
  };

  var TIER_KEYWORDS = {
    budget: ['cheap', 'budget', 'affordable', 'inexpensive', 'entry-level', 'low cost', 'lowest price'],
    value: ['value', 'mid-range', 'midrange', 'decent', 'good balance'],
    premium: ['premium', 'best', 'top', 'expensive', 'high-end', 'pro-level', 'professional']
  };

  var SKILL_KEYWORDS = {
    beginner: ['beginner', 'new', 'starting', 'first time', 'novice', 'just starting'],
    intermediate: ['intermediate', 'regular', 'club level'],
    advanced: ['advanced', 'expert', 'pro', 'competitive', 'elite', 'tournament']
  };

  var STOPWORDS = ['a', 'an', 'the', 'for', 'i', 'me', 'my', 'need', 'want', 'looking', 'best', 'good',
    'to', 'buy', 'some', 'with', 'and', 'or', 'of', 'is', 'are', 'that', 'this', 'gear', 'equipment',
    'under', 'over', 'around', 'about', 'dollars', 'dollar', 'usd', 'find', 'get', 'give', 'show'];

  // ─── PARSING ─────────────────────────────────────────────────────────────

  function tokenize(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9$.\s-]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
  }

  function detectFromKeywordMap(lowerText, map) {
    var best = null;
    for (var key in map) {
      var kws = map[key];
      for (var i = 0; i < kws.length; i++) {
        if (lowerText.indexOf(kws[i]) !== -1) { best = key; break; }
      }
      if (best) break;
    }
    return best;
  }

  function detectMaxPrice(lowerText) {
    var m = lowerText.match(/(?:under|below|less than|<)\s*\$?\s*(\d+)/);
    if (m) return parseInt(m[1], 10);
    m = lowerText.match(/\$\s*(\d+)/);
    if (m) return parseInt(m[1], 10);
    return null;
  }

  function parseQuery(rawQuery, uiFilters) {
    var lowerText = rawQuery.toLowerCase();

    var sport = uiFilters.sport !== 'any' ? uiFilters.sport : detectFromKeywordMap(lowerText, SPORT_KEYWORDS);
    var tier = uiFilters.budget !== 'any' ? uiFilters.budget : detectFromKeywordMap(lowerText, TIER_KEYWORDS);
    var skill = uiFilters.skill !== 'any' ? uiFilters.skill : detectFromKeywordMap(lowerText, SKILL_KEYWORDS);
    var maxPrice = detectMaxPrice(lowerText);

    var category = null;
    if (sport && CATEGORY_KEYWORDS[sport]) {
      category = detectFromKeywordMap(lowerText, CATEGORY_KEYWORDS[sport]);
    } else {
      // try every sport's category map; first hit wins and also implies sport
      for (var s in CATEGORY_KEYWORDS) {
        var cat = detectFromKeywordMap(lowerText, CATEGORY_KEYWORDS[s]);
        if (cat) { category = cat; sport = sport || s; break; }
      }
    }

    var tokens = tokenize(rawQuery).filter(function (t) {
      return t.length > 2 && STOPWORDS.indexOf(t) === -1;
    });

    return { sport: sport, tier: tier, skill: skill, category: category, maxPrice: maxPrice, tokens: tokens };
  }

  // ─── SCORING ─────────────────────────────────────────────────────────────

  function scoreProduct(p, parsed) {
    var score = 0;
    var text = (p.name + ' ' + p.bestFor + ' ' + p.tags.join(' ')).toLowerCase();

    if (parsed.category && p.category === parsed.category) score += 6;
    if (parsed.tier && p.tier === parsed.tier) score += 4;
    if (parsed.skill && p.tags.indexOf(parsed.skill) !== -1) score += 4;

    if (parsed.maxPrice) {
      if (p.price <= parsed.maxPrice) score += 3;
      else score -= 8;
    }

    parsed.tokens.forEach(function (t) {
      if (text.indexOf(t) !== -1) score += 1.5;
    });

    score += (p.score || 0) * 0.6; // curated quality baseline, breaks ties
    return score;
  }

  function rankByScore(list, parsed) {
    return list
      .map(function (p) { return { product: p, s: scoreProduct(p, parsed) }; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (r) { return r.product; });
  }

  function recommend(rawQuery, uiFilters, limit) {
    limit = limit || 6;
    if (!PRODUCTS) return { results: [], parsed: null };
    var parsed = parseQuery(rawQuery, uiFilters);

    var pool = PRODUCTS.filter(function (p) {
      return !parsed.sport || p.sport === parsed.sport;
    });

    // Category is a hard, high-confidence signal once detected (from dropdown
    // context or keyword match) — rank within it first so a "tennis racket"
    // query doesn't get diluted by tennis shoes that merely share a tag.
    var results = [];
    if (parsed.category) {
      var categoryPool = pool.filter(function (p) { return p.category === parsed.category; });
      results = rankByScore(categoryPool, parsed).slice(0, limit);
    }

    if (results.length < limit) {
      var usedIds = {};
      results.forEach(function (p) { usedIds[p.id] = true; });
      var rest = pool.filter(function (p) { return !usedIds[p.id]; });
      var restScored = rankByScore(rest, parsed);
      var restRelevant = restScored.filter(function (p) { return scoreProduct(p, parsed) > 0; });
      var fill = (parsed.category ? restRelevant : restScored).slice(0, limit - results.length);
      results = results.concat(fill);
    }

    // last-resort fallback: broad query matched nothing but implied a sport
    if (!results.length && parsed.sport) {
      results = pool.slice().sort(function (a, b) { return (b.score || 0) - (a.score || 0); }).slice(0, limit);
    }

    return { results: results, parsed: parsed };
  }

  // ─── RENDER ──────────────────────────────────────────────────────────────

  var TIER_LABEL = { budget: 'Budget', value: 'Best Value', premium: 'Premium' };

  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function categoryPageUrl(p) {
    return p.sport + '/' + p.category + '.html';
  }

  function renderCard(p) {
    return (
      '<div class="pcard finder-pcard">' +
        '<div class="pcard-img"><img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
        '<div class="pcard-body">' +
          '<span class="tier-v2-badge ' + esc(p.tier) + ' finder-tier-badge">' + (TIER_LABEL[p.tier] || p.tier) + '</span>' +
          '<div class="pcard-name">' + esc(p.name) + '</div>' +
          '<div class="pcard-meta">' +
            '<div class="pcard-price-block"><div class="pcard-price">' + esc(p.priceDisplay) + '</div></div>' +
            '<div class="pcard-score"><div class="pcard-score-num">' + esc(p.score) + '<span>/10</span></div><div class="pcard-score-label">Our Score</div></div>' +
          '</div>' +
          '<div class="pcard-footer">' +
            '<span class="pcard-best-for">' + esc(p.bestFor) + '</span>' +
            '<div class="pcard-btns">' +
              '<a class="btn btn-amazon btn-sm" href="' + esc(p.affiliateLink) + '" rel="noopener sponsored" target="_blank">Amazon</a>' +
              '<a class="btn btn-sm finder-compare-link" href="' + esc(categoryPageUrl(p)) + '">Compare all</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderResults(container, results, parsed) {
    if (LOAD_ERROR) {
      container.innerHTML = '<p class="finder-empty">Couldn\'t load product data. Please refresh and try again.</p>';
      return;
    }
    if (!results.length) {
      container.innerHTML =
        '<p class="finder-empty">No exact matches yet — try a different sport, budget, or fewer words. ' +
        '<a href="tennis/index.html">Browse Tennis</a>, <a href="gym/index.html">Gym</a>, <a href="boxing/index.html">Boxing</a>, ' +
        '<a href="swimming/index.html">Swimming</a> or <a href="football/index.html">Football</a> instead.</p>';
      return;
    }
    var note = '';
    if (parsed) {
      var bits = [];
      if (parsed.sport) bits.push(parsed.sport.charAt(0).toUpperCase() + parsed.sport.slice(1));
      if (parsed.category) bits.push(parsed.category.replace('-', ' '));
      if (parsed.tier) bits.push(TIER_LABEL[parsed.tier]);
      if (parsed.skill) bits.push(parsed.skill);
      if (parsed.maxPrice) bits.push('under $' + parsed.maxPrice);
      if (bits.length) note = '<p class="finder-note">Matching: <strong>' + esc(bits.join(' · ')) + '</strong></p>';
    }
    container.innerHTML = note + '<div class="products-v2 finder-grid">' + results.map(renderCard).join('') + '</div>';
  }

  // ─── UI BUILD ────────────────────────────────────────────────────────────

  var CSS = [
    '.finder-section{padding:56px 0 8px;}',
    '.finder-card{background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:32px;max-width:900px;margin:0 auto;}',
    '.finder-title{font-family:"Barlow Condensed","Inter",sans-serif;font-size:2rem;font-weight:900;color:#fff;margin:0 0 6px;text-align:center;}',
    '.finder-sub{color:#9a9a9a;text-align:center;margin:0 0 24px;font-size:.95rem;}',
    '.finder-query-row{display:flex;gap:10px;margin-bottom:14px;}',
    '.finder-query-input{flex:1;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:14px 16px;color:#e8e8e8;font-size:1rem;font-family:inherit;}',
    '.finder-query-input:focus{outline:none;border-color:#a3c900;}',
    '.finder-quick-filters{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px;}',
    '.finder-select{background:#1a1a1a;border:1px solid #2a2a2a;border-radius:8px;padding:10px 12px;color:#e8e8e8;font-size:.85rem;font-family:inherit;flex:1 1 140px;}',
    '.finder-submit{width:100%;background:#a3c900;color:#0b0b0b;border:none;border-radius:8px;padding:14px;font-weight:800;font-size:.95rem;text-transform:uppercase;letter-spacing:.04em;cursor:pointer;transition:opacity .15s;}',
    '.finder-submit:hover{opacity:.88;}',
    '.finder-results{margin-top:28px;}',
    '.finder-note{color:#9a9a9a;font-size:.85rem;margin:0 0 14px;text-align:center;}',
    '.finder-empty{color:#9a9a9a;text-align:center;padding:20px;line-height:1.7;}',
    '.finder-empty a{color:#a3c900;}',
    '.finder-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;background:transparent;border-radius:12px;overflow:visible;}',
    '.finder-pcard{border:1px solid rgba(255,255,255,0.08);border-radius:12px;background:rgba(255,255,255,0.02);}',
    '.finder-pcard .pcard-img{height:180px;}',
    '.finder-tier-badge{align-self:flex-start;margin-bottom:8px;}',
    '.finder-compare-link{background:transparent;border:1px solid #333;color:#ccc;}',
    '.finder-compare-link:hover{border-color:#a3c900;color:#a3c900;}',
    '@media(max-width:640px){.finder-card{padding:20px;}.finder-title{font-size:1.5rem;}.finder-query-row{flex-direction:column;}}'
  ].join('');

  function buildSection() {
    var section = document.createElement('section');
    section.className = 'finder-section';
    section.id = 'gear-finder';
    section.innerHTML =
      '<div class="container">' +
        '<div class="finder-card">' +
          '<h2 class="finder-title">Find My Gear</h2>' +
          '<p class="finder-sub">Tell us what you need — sport, budget, skill level — and we\'ll match you against 217 real products.</p>' +
          '<form id="finder-form">' +
            '<div class="finder-query-row">' +
              '<input type="text" id="finder-query" class="finder-query-input" placeholder="e.g. beginner tennis racket for hard court, under $80" autocomplete="off">' +
            '</div>' +
            '<div class="finder-quick-filters">' +
              '<select id="finder-sport" class="finder-select">' +
                '<option value="any">Any sport</option>' +
                '<option value="tennis">Tennis</option>' +
                '<option value="gym">Gym &amp; Fitness</option>' +
                '<option value="boxing">Boxing</option>' +
                '<option value="swimming">Swimming</option>' +
                '<option value="football">Football</option>' +
              '</select>' +
              '<select id="finder-budget" class="finder-select">' +
                '<option value="any">Any budget</option>' +
                '<option value="budget">Budget</option>' +
                '<option value="value">Best Value</option>' +
                '<option value="premium">Premium</option>' +
              '</select>' +
              '<select id="finder-skill" class="finder-select">' +
                '<option value="any">Any skill level</option>' +
                '<option value="beginner">Beginner</option>' +
                '<option value="intermediate">Intermediate</option>' +
                '<option value="advanced">Advanced</option>' +
              '</select>' +
            '</div>' +
            '<button type="submit" class="finder-submit">Find My Gear</button>' +
          '</form>' +
          '<div id="finder-results" class="finder-results"></div>' +
        '</div>' +
      '</div>';
    return section;
  }

  function init() {
    var anchor = document.querySelector('.stat-bar');
    if (!anchor || !document.querySelector('.sport-grid-v2')) return; // homepage only

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var section = buildSection();
    anchor.parentNode.insertBefore(section, anchor.nextSibling);

    var form = section.querySelector('#finder-form');
    var queryInput = section.querySelector('#finder-query');
    var sportSelect = section.querySelector('#finder-sport');
    var budgetSelect = section.querySelector('#finder-budget');
    var skillSelect = section.querySelector('#finder-skill');
    var resultsEl = section.querySelector('#finder-results');

    loadProducts();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = queryInput.value.trim();
      var filters = { sport: sportSelect.value, budget: budgetSelect.value, skill: skillSelect.value };

      if (!q && filters.sport === 'any' && filters.budget === 'any' && filters.skill === 'any') {
        resultsEl.innerHTML = '<p class="finder-empty">Type what you\'re looking for, or pick a sport / budget / skill level above.</p>';
        return;
      }

      function run() {
        var out = recommend(q, filters, 6);
        renderResults(resultsEl, out.results, out.parsed);
      }

      if (!PRODUCTS && !LOAD_ERROR) {
        resultsEl.innerHTML = '<p class="finder-empty">Loading catalog…</p>';
        loadProducts().then(run);
      } else {
        run();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  // Expose for debugging / potential reuse on other pages
  window.SGFRecommender = { recommend: recommend, loadProducts: loadProducts };
})();
