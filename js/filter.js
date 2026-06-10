/**
 * filter.js — SportGear Finder
 * Hybrid in-page filter engine for category pages.
 * Reads the DOM that's already rendered (zero SEO impact).
 * Injects a filter bar with tier buttons + search input.
 */

(function () {
  'use strict';

  // ─── CSS ────────────────────────────────────────────────────────────────────
  // Injected at runtime so no separate stylesheet is needed.
  var CSS = [
    '.filter-bar{',
      'display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;',
      'margin:0 0 32px;padding:16px 20px;',
      'background:#141414;border:1px solid #222;border-radius:10px;',
    '}',
    '.filter-tier-btns{display:flex;flex-wrap:wrap;gap:8px;flex:1 1 auto;}',
    '.filter-btn{',
      'padding:7px 16px;border-radius:6px;border:1px solid #2a2a2a;',
      'background:transparent;color:#aaa;font:600 13px/1 "Barlow Condensed",sans-serif;',
      'letter-spacing:.04em;text-transform:uppercase;cursor:pointer;',
      'transition:color .15s,border-color .15s,background .15s;',
    '}',
    '.filter-btn:hover{color:#fff;border-color:#444;}',
    '.filter-btn.active{',
      'color:#0b0b0b;background:#a3c900;border-color:#a3c900;',
    '}',
    '.filter-search-wrap{',
      'display:flex;align-items:center;gap:8px;',
      'background:#1a1a1a;border:1px solid #2a2a2a;border-radius:6px;',
      'padding:7px 12px;flex:0 0 220px;transition:border-color .15s;',
    '}',
    '.filter-search-wrap:focus-within{border-color:#a3c900;}',
    '.filter-search-wrap svg{opacity:.45;flex-shrink:0;}',
    '.filter-search-input{',
      'background:transparent;border:none;outline:none;',
      'color:#e8e8e8;font:14px/1 "Barlow Condensed",sans-serif;',
      'width:100%;',
    '}',
    '.filter-search-input::placeholder{color:#555;}',
    '.filter-empty-state{',
      'display:none;text-align:center;padding:60px 20px;',
      'color:#555;font-size:15px;',
    '}',
    '.filter-empty-state strong{color:#a3c900;}',
    '.filter-clear-btn{',
      'background:none;border:none;color:#a3c900;cursor:pointer;',
      'font:600 13px/1 "Barlow Condensed",sans-serif;',
      'letter-spacing:.04em;text-transform:uppercase;margin-top:12px;',
      'display:block;margin-left:auto;margin-right:auto;',
      'padding:6px 12px;border:1px solid #a3c90044;border-radius:4px;',
    '}',
    '@media(max-width:600px){',
      '.filter-bar{padding:12px 14px;}',
      '.filter-search-wrap{flex:1 1 100%;}',
    '}'
  ].join('');

  // ─── STATE ───────────────────────────────────────────────────────────────────
  var activeTier = 'all';
  var searchInput;

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  /** Get the page category name from the <h1> for the search placeholder */
  function getPageCategory() {
    var h1 = document.querySelector('.cat-hero-content h1');
    if (!h1) return 'products';
    // Strip <em> tags and clean up
    return h1.textContent.trim().replace(/\s+/g, ' ');
  }

  /** Determine tier from a .tier-v2 section element */
  function getSectionTier(section) {
    var badge = section.querySelector('.tier-v2-badge');
    if (!badge) return 'unknown';
    if (badge.classList.contains('budget')) return 'budget';
    if (badge.classList.contains('value')) return 'value';
    if (badge.classList.contains('premium')) return 'premium';
    return 'unknown';
  }

  /** Get searchable text from a .pcard element */
  function getCardText(card) {
    var parts = [];
    var name = card.querySelector('.pcard-name');
    var specs = card.querySelectorAll('.pcard-spec');
    var bestFor = card.querySelector('.pcard-best-for');
    if (name) parts.push(name.textContent);
    specs.forEach(function (s) { parts.push(s.textContent); });
    if (bestFor) parts.push(bestFor.textContent);
    return parts.join(' ').toLowerCase();
  }

  // ─── CORE FILTER ─────────────────────────────────────────────────────────────

  function applyFilters() {
    var sections = document.querySelectorAll('.tier-v2');
    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var totalVisible = 0;

    sections.forEach(function (section) {
      var sectionTier = getSectionTier(section);
      var tierMatch = activeTier === 'all' || sectionTier === activeTier;

      if (!tierMatch) {
        section.style.display = 'none';
        return;
      }

      // Tier matches — now filter individual cards
      var cards = section.querySelectorAll('.pcard');
      var visibleInSection = 0;

      cards.forEach(function (card) {
        var matches = !query || getCardText(card).includes(query);
        card.style.display = matches ? '' : 'none';
        if (matches) visibleInSection++;
      });

      // Hide the whole section if every card in it was filtered out
      if (visibleInSection === 0 && query) {
        section.style.display = 'none';
      } else {
        section.style.display = '';
        totalVisible += visibleInSection;
      }
    });

    updateEmptyState(totalVisible === 0, query);
  }

  // ─── EMPTY STATE ─────────────────────────────────────────────────────────────

  var emptyStateEl;

  function createEmptyState(container) {
    emptyStateEl = document.createElement('div');
    emptyStateEl.className = 'filter-empty-state';
    container.appendChild(emptyStateEl);
  }

  function updateEmptyState(show, query) {
    if (!emptyStateEl) return;
    if (show) {
      var esc = (query || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      emptyStateEl.innerHTML = query
        ? '<p>No products found matching <strong>"' + esc + '"</strong></p>' +
          '<button class="filter-clear-btn" id="filter-clear-btn">Clear search</button>'
        : '<p>No products in this tier yet.</p>';
      emptyStateEl.style.display = 'block';

      var clearBtn = document.getElementById('filter-clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          if (searchInput) searchInput.value = '';
          applyFilters();
        });
      }
    } else {
      emptyStateEl.style.display = 'none';
    }
  }

  // ─── INJECT FILTER BAR ───────────────────────────────────────────────────────

  function buildFilterBar() {
    var container = document.querySelector('.container');
    var firstTier = container && container.querySelector('.tier-v2');
    if (!firstTier) return; // not a category page

    // Inject CSS
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Build filter bar element
    var bar = document.createElement('div');
    bar.className = 'filter-bar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Filter products');

    // Tier buttons
    var tierBtns = document.createElement('div');
    tierBtns.className = 'filter-tier-btns';
    tierBtns.setAttribute('role', 'group');
    tierBtns.setAttribute('aria-label', 'Filter by budget tier');

    var tiers = [
      { value: 'all',     label: 'All' },
      { value: 'budget',  label: 'Budget' },
      { value: 'value',   label: 'Best Value' },
      { value: 'premium', label: 'Premium' }
    ];

    tiers.forEach(function (t) {
      var btn = document.createElement('button');
      btn.className = 'filter-btn' + (t.value === 'all' ? ' active' : '');
      btn.textContent = t.label;
      btn.dataset.tier = t.value;
      btn.setAttribute('aria-pressed', t.value === 'all' ? 'true' : 'false');
      btn.addEventListener('click', function () {
        activeTier = t.value;
        // Update button states
        tierBtns.querySelectorAll('.filter-btn').forEach(function (b) {
          var isActive = b.dataset.tier === activeTier;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        applyFilters();
      });
      tierBtns.appendChild(btn);
    });

    // Search input
    var searchWrap = document.createElement('div');
    searchWrap.className = 'filter-search-wrap';
    searchWrap.innerHTML =
      '<svg width="14" height="14" fill="none" viewBox="0 0 20 20">' +
        '<circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="2"/>' +
        '<path d="M14.5 14.5L19 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';

    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'filter-search-input';
    searchInput.placeholder = 'Search ' + getPageCategory().toLowerCase() + '…';
    searchInput.setAttribute('aria-label', 'Search products on this page');
    searchInput.autocomplete = 'off';
    searchInput.spellcheck = false;

    // Debounce search for performance
    var debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 120);
    });

    // Clear search on Escape
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchInput.value = '';
        applyFilters();
        searchInput.blur();
      }
    });

    searchWrap.appendChild(searchInput);

    bar.appendChild(tierBtns);
    bar.appendChild(searchWrap);

    // Insert bar before the first .tier-v2
    container.insertBefore(bar, firstTier);

    // Create empty state placeholder after last .tier-v2
    createEmptyState(container);
  }

  // ─── INIT ────────────────────────────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', buildFilterBar);

})();
