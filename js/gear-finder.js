/**
 * gear-finder.js — SportGear Finder
 * The Gear Finder: a short profile flow that returns a complete kit rather
 * than a page of search results.
 *
 * Replaces the old recommender.js keyword box. The difference that matters is
 * the output: recommender.js ranked six products against a string, this
 * assembles one item per slot of a real kit, inside a stated budget, and says
 * why each pick is there for *this* person.
 *
 * Everything is client-side and deterministic. Every item is a catalog entry
 * with a verified affiliate link — nothing here can invent a product.
 *
 * Requires js/gear-fit.js (window.SGF_FIT) to be loaded first.
 */

(function () {
  'use strict';

  var FIT = window.SGF_FIT;
  if (!FIT) return;

  var STORE_KEY = 'sgf_profile_v2';

  var PRODUCTS = null;
  var BY_CAT = {};      // sport -> category -> [products]
  var LOAD_ERROR = false;

  var state = {
    answers: { sport: null, level: null, budget: null, context: null, owned: [], notes: '' },
    step: 0,
    steps: []
  };

  // ─── DATA ────────────────────────────────────────────────────────────────

  function indexProducts() {
    BY_CAT = {};
    PRODUCTS.forEach(function (p) {
      if (!BY_CAT[p.sport]) BY_CAT[p.sport] = {};
      if (!BY_CAT[p.sport][p.category]) BY_CAT[p.sport][p.category] = [];
      BY_CAT[p.sport][p.category].push(p);
    });
  }

  function loadProducts() {
    return fetch('data/products.json')
      .then(function (r) { return r.json(); })
      .then(function (d) { PRODUCTS = d.products || []; indexProducts(); })
      .catch(function () { LOAD_ERROR = true; });
  }

  // ─── SCORING ─────────────────────────────────────────────────────────────

  /**
   * How well one product suits one person. Deliberately additive and capped
   * per signal: a product covered in tags should not outrank a better product
   * just by carrying more of them.
   */
  function fitScore(p, profile) {
    var score = (p.score || 0);
    var hits = { level: [], context: [], flags: [], tokens: [] };
    var tags = (p.tags || []).map(function (t) { return String(t).toLowerCase(); });
    var text = (p.name + ' ' + (p.bestFor || '') + ' ' + tags.join(' ')).toLowerCase();

    // Tier preference — the strongest single signal, because tier already
    // encodes the price/quality trade-off the whole catalog is built around.
    var prefs = FIT.LEVEL_TIERS[profile.level] || [];
    var tierIdx = prefs.indexOf(p.tier);
    if (tierIdx === 0) score += 3;
    else if (tierIdx === 1) score += 1.5;

    var levelTags = FIT.LEVEL_TAGS[profile.level] || [];
    levelTags.forEach(function (t) {
      if (tags.indexOf(t) !== -1 && hits.level.length < 2) { hits.level.push(t); score += 2; }
    });

    // Exact tag match, not a substring of the name — 'flex' inside "Dri-FIT
    // Flex Shorts" is not evidence of anything.
    //
    // Weighted above level tags on purpose. Context is something the person
    // stated outright; level tags are inferred. At 1.5 an explicit "indoor
    // court" answer still lost to a beach ball that happened to carry the
    // 'recreational' tag, which is the wrong ball for the answer given.
    FIT.tagsForContext(profile.sport, profile.context).forEach(function (t) {
      if (tags.indexOf(t) !== -1 && hits.context.length < 2) { hits.context.push(t); score += 3; }
    });

    profile.matchedFlags.forEach(function (key) {
      var f = FIT.FLAGS[key];
      // A flag only applies inside the categories where the concern is real.
      // Without this, 'comfort' on a backpack claims to address tennis elbow.
      if (f.cats && f.cats.indexOf(p.category) === -1) return;
      var hit = f.tags.some(function (t) { return tags.indexOf(t) !== -1; });
      if (hit && hits.flags.length < 3) { hits.flags.push(key); score += 2.5; }
    });

    profile.tokens.forEach(function (t) {
      if (text.indexOf(t) !== -1 && hits.tokens.length < 3) { hits.tokens.push(t); score += 1; }
    });

    return { score: score, hits: hits };
  }

  function rankSlot(list, profile) {
    return list.map(function (p) {
      var r = fitScore(p, profile);
      return { p: p, score: r.score, hits: r.hits };
    }).sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.p.price - b.p.price; // cheaper wins ties — never upsell on a coin flip
    });
  }

  // ─── ASSEMBLY ────────────────────────────────────────────────────────────

  function sumPrice(picks) {
    return picks.reduce(function (n, x) { return n + (x.choice.p.price || 0); }, 0);
  }

  /**
   * Build the kit.
   *
   *  1. Take the slots this profile needs and split the budget across them by
   *     weight, so the centrepiece gets the lion's share.
   *  2. Fill each slot with the best-fitting product inside its allocation.
   *  3. Spend whatever is left over: repeatedly apply the single best-value
   *     upgrade available anywhere in the kit. Allocation is a starting split,
   *     not a ceiling — this is what stops a $500 budget buying six mid items
   *     when the racket should absorb the difference.
   *  4. If even the cheapest kit overruns, drop slots from the bottom and
   *     report them rather than silently returning something unaffordable.
   */
  function assemble(profile) {
    var pool = BY_CAT[profile.sport] || {};
    var slots = FIT.slotsFor(profile).filter(function (s) {
      return (pool[s.cat] || []).length > 0;
    });
    if (!slots.length) return null;

    var totalW = slots.reduce(function (n, s) { return n + s.weight; }, 0);
    var cap = profile.cap;

    var picks = slots.map(function (s) {
      var ranked = rankSlot(pool[s.cat], profile);
      var alloc = cap === Infinity ? Infinity : cap * (s.weight / totalW);
      var withinAlloc = ranked.filter(function (c) { return c.p.price <= alloc; });
      var choice = withinAlloc[0];
      if (!choice) {
        // Nothing in this slot fits its share — take the cheapest and let the
        // trim pass decide whether the slot survives at all.
        choice = ranked.slice().sort(function (a, b) { return a.p.price - b.p.price; })[0];
      }
      return { slot: s, choice: choice, ranked: ranked };
    });

    var dropped = [];

    if (cap !== Infinity) {
      // ── 4. Trim, cheapest-first, before trying to upgrade anything ──
      var guard = 0;
      while (sumPrice(picks) > cap && guard++ < 40) {
        // First try downgrading within the slot furthest over its share.
        var downgraded = false;
        for (var i = picks.length - 1; i >= 0; i--) {
          var cur = picks[i];
          var cheaper = cur.ranked.filter(function (c) { return c.p.price < cur.choice.p.price; })
            .sort(function (a, b) { return b.score - a.score; })[0];
          if (cheaper) { cur.choice = cheaper; downgraded = true; break; }
        }
        if (downgraded) continue;

        // Nothing left to downgrade — drop a slot. Not simply the lowest
        // priority one: on a tight budget that strips the $6 socks and $7
        // overgrips one by one while the $80 court shoes that actually broke
        // the budget survive to the end, and you finish with a lone racket.
        // Drop whatever costs the most per unit of importance instead, so the
        // one blocking item goes and the cheap useful ones stay.
        var dropIdx = -1, worst = -1;
        for (var j = 0; j < picks.length; j++) {
          if (picks[j].slot.core) continue;
          // rank^1.5, not rank: linear under-weights importance enough that a
          // $13 bag survives while the $36 net a garden player came for does not.
          var burden = picks[j].choice.p.price * Math.pow(picks[j].slot.rank, 1.5);
          if (burden > worst) { worst = burden; dropIdx = j; }
        }
        if (dropIdx === -1) break; // only core slots remain; report the overrun
        dropped.push(picks[dropIdx].slot);
        picks.splice(dropIdx, 1);
      }

      // ── 3. Upgrade pass, in slot order ──
      // Deliberately not "best value per dollar": that spends the surplus on
      // whichever cheap item has the steepest marginal gain, which is how you
      // end up with premium overgrips and the entry-level racket the person
      // actually swings. Importance order means the centrepiece absorbs the
      // leftover first, which is what anyone spending the money would do.
      for (var pass = 0; pass < 2; pass++) {
        for (var k = 0; k < picks.length; k++) {
          var entry = picks[k];
          var ceiling = entry.choice.p.price + (cap - sumPrice(picks));
          var better = null;
          for (var n = 0; n < entry.ranked.length; n++) {
            var c = entry.ranked[n];
            if (c.p.price <= ceiling && c.score > entry.choice.score) { better = c; break; }
          }
          if (better) entry.choice = better;
        }
      }
    }

    return {
      profile: profile,
      picks: picks,
      dropped: dropped.sort(function (a, b) { return a.rank - b.rank; }),
      overBudget: cap !== Infinity && sumPrice(picks) > cap
    };
  }

  // ─── REASONS ─────────────────────────────────────────────────────────────

  var LEVEL_WORD = { 'new': 'someone starting out', casual: 'regular play', competitive: 'competitive play' };

  function reasonsFor(entry, profile) {
    var out = [];
    var hits = entry.choice.hits;

    if (hits.flags.length) {
      var labels = hits.flags.map(function (k) { return FIT.FLAGS[k].label; });
      out.push('Chosen for ' + labels.join(' and ') + ' — you told us that matters.');
    }
    if (hits.context.length && profile.context) {
      out.push('Built for ' + FIT.contextLabel(profile.sport, profile.context).toLowerCase() + '.');
    }
    if (hits.level.length) {
      out.push('Tagged ' + hits.level.join(' and ') + ' — right end of the range for ' +
               (LEVEL_WORD[profile.level] || 'your level') + '.');
    }
    if (!out.length && hits.tokens.length) {
      out.push('Matches what you asked for: ' + hits.tokens.join(', ') + '.');
    }
    return out.slice(0, 2);
  }

  // ─── RENDER ──────────────────────────────────────────────────────────────

  var TIER_LABEL = { budget: 'Budget', value: 'Best Value', premium: 'Premium', cool: 'Cool Pick' };

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function categoryUrl(p) { return p.sport + '/' + p.category + '.html'; }

  function renderSlot(entry, profile, idx) {
    var p = entry.choice.p;
    var reasons = reasonsFor(entry, profile);
    var alt = entry.ranked.length > 1;

    return (
      '<li class="kit-slot" data-cat="' + esc(entry.slot.cat) + '">' +
        '<div class="kit-slot-rail"><span class="kit-slot-num">' + (idx + 1) + '</span></div>' +
        '<div class="kit-slot-body">' +
          '<div class="kit-slot-head">' +
            '<h3 class="kit-slot-label">' + esc(entry.slot.label) + '</h3>' +
            (entry.slot.core ? '<span class="kit-essential">Essential</span>' : '') +
          '</div>' +
          '<p class="kit-slot-why">' + esc(entry.slot.why) + '</p>' +
          '<div class="kit-pick">' +
            '<a class="kit-pick-img" href="' + esc(p.affiliateLink) + '" rel="noopener sponsored" target="_blank" tabindex="-1" aria-hidden="true">' +
              '<img src="' + esc(p.image) + '" alt="" loading="lazy">' +
            '</a>' +
            '<div class="kit-pick-body">' +
              '<span class="tier-v2-badge ' + esc(p.tier) + '">' + (TIER_LABEL[p.tier] || esc(p.tier)) + '</span>' +
              '<a class="kit-pick-name" href="' + esc(p.affiliateLink) + '" rel="noopener sponsored" target="_blank">' + esc(p.name) + '</a>' +
              '<div class="kit-pick-score">' + esc(p.score) + '<span>/10</span></div>' +
              (reasons.length
                ? '<ul class="kit-reasons">' + reasons.map(function (r) {
                    return '<li>' + esc(r) + '</li>';
                  }).join('') + '</ul>'
                : '<p class="kit-reasons-fallback">' + esc(p.bestFor) + '</p>') +
              '<div class="kit-pick-actions">' +
                '<a class="btn btn-amazon btn-sm" href="' + esc(p.affiliateLink) + '" rel="noopener sponsored" target="_blank">View on Amazon</a>' +
                (alt ? '<button type="button" class="kit-swap" data-cat="' + esc(entry.slot.cat) + '">Show me another</button>' : '') +
                '<a class="kit-compare" href="' + esc(categoryUrl(p)) + '">Compare all ' + esc(entry.slot.label.toLowerCase()) + '</a>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</li>'
    );
  }

  function summaryLine(profile) {
    var bits = [];
    var lvl = { 'new': 'just starting out', casual: 'playing regularly', competitive: 'competing' };
    bits.push(lvl[profile.level] || 'playing');
    var ctx = FIT.contextLabel(profile.sport, profile.context);
    if (ctx) bits.push(ctx.toLowerCase());
    bits.push('around ' + profile.budgetLabel.toLowerCase());
    if (profile.owned.length) bits.push('skipping the ' + profile.owned.length + ' item' + (profile.owned.length > 1 ? 's' : '') + ' you already own');
    return bits.join(' · ');
  }

  function sportLabel(id) {
    for (var i = 0; i < FIT.SPORTS.length; i++) if (FIT.SPORTS[i].id === id) return FIT.SPORTS[i].label;
    return id;
  }

  function renderKit(kit) {
    var section = document.getElementById('your-kit');
    if (!section) return;
    var profile = kit.profile;

    var gaps = '';
    if (kit.dropped.length) {
      gaps =
        '<div class="kit-gaps">' +
          '<h4>Add these when you can</h4>' +
          '<p>They did not fit ' + esc(profile.budgetLabel.toLowerCase()) + ', and none of them are urgent on day one.</p>' +
          '<ul>' + kit.dropped.map(function (s) {
            return '<li><a href="' + esc(profile.sport + '/' + s.cat + '.html') + '">' + esc(s.label) + '</a> — ' + esc(s.why) + '</li>';
          }).join('') + '</ul>' +
        '</div>';
    }

    var warn = kit.overBudget
      ? '<p class="kit-warn">Heads up: the essentials for this sport sit above ' + esc(profile.budgetLabel.toLowerCase()) +
        '. This is the leanest complete setup we would actually stand behind.</p>'
      : '';

    section.innerHTML =
      '<div class="container">' +
        '<div class="kit-card">' +
          '<div class="kit-head">' +
            '<div>' +
              '<span class="kit-eyebrow">Your kit</span>' +
              '<h2 class="kit-title">' + esc(sportLabel(profile.sport)) + ' — ' + kit.picks.length + ' piece' + (kit.picks.length > 1 ? 's' : '') + '</h2>' +
              '<p class="kit-summary">Built for ' + esc(summaryLine(profile)) + '.</p>' +
            '</div>' +
            '<button type="button" class="kit-restart" id="kit-restart">Start over</button>' +
          '</div>' +
          warn +
          '<ol class="kit-list">' + kit.picks.map(function (e, i) { return renderSlot(e, profile, i); }).join('') + '</ol>' +
          gaps +
          '<p class="kit-disclosure">Every pick is a product we have reviewed, ranked against your answers. ' +
            'Links are affiliate links — we earn a commission at no cost to you. Prices change constantly, so check current pricing on Amazon.</p>' +
        '</div>' +
      '</div>';

    section.hidden = false;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ─── QUIZ ────────────────────────────────────────────────────────────────

  function stepsFor(sport) {
    var steps = ['level', 'budget'];
    if (FIT.CONTEXT_Q[sport]) steps.push('context');
    steps.push('owned', 'notes');
    return steps;
  }

  function chip(value, label, hint, selected) {
    return '<button type="button" class="gfx-chip' + (selected ? ' selected' : '') + '" data-value="' + esc(value) + '">' +
      '<span class="gfx-chip-label">' + esc(label) + '</span>' +
      (hint ? '<span class="gfx-chip-hint">' + esc(hint) + '</span>' : '') +
      '</button>';
  }

  function stepContent(key) {
    var a = state.answers;

    if (key === 'level') {
      return {
        q: 'How much ' + sportLabel(a.sport).toLowerCase().replace(' & fitness', '') + ' do you play?',
        body: '<div class="gfx-opts">' + FIT.LEVELS.map(function (l) {
          return chip(l.id, l.label, l.hint, a.level === l.id);
        }).join('') + '</div>'
      };
    }

    if (key === 'budget') {
      return {
        q: 'What are you looking to spend in total?',
        sub: 'For the whole kit, not per item. We use this to split the budget across what you need.',
        body: '<div class="gfx-opts gfx-opts-tight">' + FIT.BUDGETS.map(function (b) {
          return chip(b.id, b.label, '', a.budget === b.id);
        }).join('') + '</div>'
      };
    }

    if (key === 'context') {
      var q = FIT.CONTEXT_Q[a.sport];
      return {
        q: q.q,
        body: '<div class="gfx-opts gfx-opts-tight">' + q.opts.map(function (o) {
          return chip(o.id, o.label, '', a.context === o.id);
        }).join('') + '</div>'
      };
    }

    if (key === 'owned') {
      // Offer only the slots this person's kit actually contains — asking a
      // hard-court player whether they own clay shoes is noise. Built against
      // a copy with owned emptied, otherwise chips vanish as they are ticked.
      var probe = FIT.buildProfile({
        sport: a.sport, level: a.level, budget: a.budget, context: a.context, owned: [], notes: a.notes
      });
      var own = FIT.slotsFor(probe);
      return {
        q: 'Anything you already have?',
        sub: 'We will leave it out and spend the budget on the rest.',
        multi: true,
        body: '<div class="gfx-opts gfx-opts-tight">' + own.map(function (s) {
          return chip(s.cat, s.label, '', a.owned.indexOf(s.cat) !== -1);
        }).join('') + '</div>'
      };
    }

    // notes
    return {
      q: 'Anything else we should know?',
      sub: 'Optional. Injuries, wide feet, a gift, a hard budget — plain English is fine.',
      free: true,
      body: '<textarea class="gfx-notes" id="gfx-notes" rows="3" placeholder="e.g. I had tennis elbow last year and I have wide feet">' + esc(a.notes) + '</textarea>'
    };
  }

  function renderStep() {
    var panel = document.getElementById('gfx-panel');
    if (!panel) return;

    var key = state.steps[state.step];
    var c = stepContent(key);
    var total = state.steps.length;
    var pct = Math.round(((state.step) / total) * 100);
    var isLast = state.step === total - 1;

    panel.innerHTML =
      '<div class="gfx-progress"><span style="width:' + pct + '%"></span></div>' +
      '<div class="gfx-meta">Step ' + (state.step + 1) + ' of ' + total + ' · ' + esc(sportLabel(state.answers.sport)) + '</div>' +
      '<h2 class="gfx-q">' + esc(c.q) + '</h2>' +
      (c.sub ? '<p class="gfx-sub">' + esc(c.sub) + '</p>' : '') +
      c.body +
      '<div class="gfx-nav">' +
        '<button type="button" class="gfx-back" id="gfx-back">' + (state.step === 0 ? 'Change sport' : 'Back') + '</button>' +
        '<button type="button" class="gfx-next" id="gfx-next">' +
          (isLast ? 'Build my kit' : (c.multi || c.free ? 'Continue' : 'Skip')) +
        '</button>' +
      '</div>';

    panel.hidden = false;
  }

  function advance() {
    if (state.step < state.steps.length - 1) {
      state.step++;
      renderStep();
    } else {
      build();
    }
  }

  function build() {
    var notesEl = document.getElementById('gfx-notes');
    if (notesEl) state.answers.notes = notesEl.value;

    var profile = FIT.buildProfile(state.answers);
    var kit = assemble(profile);

    if (!kit) {
      var section = document.getElementById('your-kit');
      if (section) {
        section.innerHTML = '<div class="container"><div class="kit-card"><p class="kit-empty">' +
          'We could not build a kit from those answers. <button type="button" id="kit-restart" class="kit-restart">Start over</button></p></div></div>';
        section.hidden = false;
      }
      return;
    }

    save();
    renderKit(kit);
    track('gear_finder_complete', {
      sport: profile.sport, level: profile.level, budget: profile.budgetId,
      context: profile.context || 'none', items: kit.picks.length
    });
  }

  // ─── PERSISTENCE ─────────────────────────────────────────────────────────

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.answers)); } catch (e) { /* private mode */ }
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function clearSaved() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* no-op */ }
  }

  function track(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }

  // ─── FLOW CONTROL ────────────────────────────────────────────────────────

  function selectSport(sportId) {
    state.answers.sport = sportId;
    state.answers.context = null;
    state.answers.owned = [];
    state.steps = stepsFor(sportId);
    state.step = 0;

    var pills = document.querySelectorAll('.hero-sport-pill');
    var idx = -1;
    FIT.SPORTS.forEach(function (s, i) { if (s.id === sportId) idx = i; });
    pills.forEach(function (pill, i) { pill.classList.toggle('chosen', i === idx); });

    // Settle the hero on the chosen sport and stop the carousel — from here on
    // the background is context for the answers, not an attract loop.
    if (window.SGF_HERO && idx > -1) { window.SGF_HERO.goTo(idx); window.SGF_HERO.stop(); }

    document.body.classList.add('gfx-active');
    renderStep();
    track('gear_finder_start', { sport: sportId });

    var panel = document.getElementById('gfx-panel');
    if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function resetAll() {
    state.answers = { sport: null, level: null, budget: null, context: null, owned: [], notes: '' };
    state.step = 0;
    clearSaved();
    document.body.classList.remove('gfx-active');
    document.querySelectorAll('.hero-sport-pill').forEach(function (p) { p.classList.remove('chosen'); });
    var panel = document.getElementById('gfx-panel');
    if (panel) { panel.hidden = true; panel.innerHTML = ''; }
    var section = document.getElementById('your-kit');
    if (section) { section.hidden = true; section.innerHTML = ''; }
    var resume = document.getElementById('gfx-resume');
    if (resume) resume.hidden = true;
    document.querySelector('.hero-v2').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Swap a slot to its next-best option, cycling through the ranked list.
  function swapSlot(cat) {
    var profile = FIT.buildProfile(state.answers);
    var kit = assemble(profile);
    if (!kit) return;

    var li = document.querySelector('.kit-slot[data-cat="' + cat + '"]');
    var entry = null;
    kit.picks.forEach(function (e) { if (e.slot.cat === cat) entry = e; });
    if (!li || !entry) return;

    var seen = parseInt(li.getAttribute('data-alt') || '0', 10) + 1;
    if (seen >= entry.ranked.length) seen = 0;
    li.setAttribute('data-alt', String(seen));
    entry.choice = entry.ranked[seen];

    var idx = Array.prototype.indexOf.call(li.parentNode.children, li);
    var tmp = document.createElement('div');
    tmp.innerHTML = renderSlot(entry, profile, idx);
    var fresh = tmp.firstChild;
    fresh.setAttribute('data-alt', String(seen));
    li.parentNode.replaceChild(fresh, li);
    track('gear_finder_swap', { sport: profile.sport, category: cat });
  }

  // ─── INIT ────────────────────────────────────────────────────────────────

  function buildPanel() {
    var panel = document.createElement('div');
    panel.className = 'gfx-panel';
    panel.id = 'gfx-panel';
    panel.hidden = true;
    return panel;
  }

  function buildResumeChip(saved) {
    var wrap = document.createElement('div');
    wrap.className = 'gfx-resume';
    wrap.id = 'gfx-resume';
    wrap.innerHTML =
      '<span>Welcome back — rebuild your ' + esc(sportLabel(saved.sport)) + ' kit?</span>' +
      '<button type="button" id="gfx-resume-yes">Rebuild it</button>' +
      '<button type="button" id="gfx-resume-no" class="gfx-resume-dismiss">Start fresh</button>';
    return wrap;
  }

  function init() {
    var heroContent = document.querySelector('.hero-v2 .hero-content');
    var heroSports = document.getElementById('hero-sports');
    if (!heroContent || !heroSports || !document.querySelector('.sport-grid-v2')) return; // homepage only

    document.querySelector('.hero-v2').classList.add('hero-finder-mode');

    var panel = buildPanel();
    heroSports.parentNode.insertBefore(panel, heroSports.nextSibling);

    // Results live below the hero so the page keeps its normal flow until used.
    var section = document.createElement('section');
    section.className = 'kit-section';
    section.id = 'your-kit';
    section.hidden = true;
    var statBar = document.querySelector('.stat-bar');
    if (statBar) statBar.parentNode.insertBefore(section, statBar);
    else document.body.appendChild(section);

    var saved = load();
    if (saved && saved.sport) {
      var chip = buildResumeChip(saved);
      panel.parentNode.insertBefore(chip, panel);
      chip.addEventListener('click', function (e) {
        if (e.target.id === 'gfx-resume-yes') {
          state.answers = {
            sport: saved.sport, level: saved.level, budget: saved.budget,
            context: saved.context, owned: saved.owned || [], notes: saved.notes || ''
          };
          state.steps = stepsFor(saved.sport);
          state.step = state.steps.length - 1;
          chip.hidden = true;
          document.body.classList.add('gfx-active');
          build();
        } else if (e.target.id === 'gfx-resume-no') {
          chip.hidden = true;
          clearSaved();
        }
      });
    }

    // Sport selection reuses the hero pills — they already exist, already map
    // 1:1 to the nine sports in order, and already drive the background.
    heroSports.addEventListener('click', function (e) {
      var pill = e.target.closest('.hero-sport-pill');
      if (!pill) return;
      var idx = parseInt(pill.getAttribute('data-idx'), 10);
      if (isNaN(idx) || !FIT.SPORTS[idx]) return;
      selectSport(FIT.SPORTS[idx].id);
    });

    panel.addEventListener('click', function (e) {
      var chipEl = e.target.closest('.gfx-chip');
      if (chipEl) {
        var key = state.steps[state.step];
        var value = chipEl.getAttribute('data-value');
        if (key === 'owned') {
          var at = state.answers.owned.indexOf(value);
          if (at === -1) state.answers.owned.push(value); else state.answers.owned.splice(at, 1);
          chipEl.classList.toggle('selected');
        } else {
          state.answers[key] = value;
          advance();
        }
        return;
      }
      if (e.target.id === 'gfx-next') {
        var k = state.steps[state.step];
        if (k === 'notes') {
          var el = document.getElementById('gfx-notes');
          if (el) state.answers.notes = el.value;
        }
        advance();
        return;
      }
      if (e.target.id === 'gfx-back') {
        var cur = state.steps[state.step];
        if (cur === 'notes') {
          var n = document.getElementById('gfx-notes');
          if (n) state.answers.notes = n.value;
        }
        if (state.step === 0) resetAll();
        else { state.step--; renderStep(); }
      }
    });

    section.addEventListener('click', function (e) {
      if (e.target.id === 'kit-restart') { resetAll(); return; }
      var swap = e.target.closest('.kit-swap');
      if (swap) swapSlot(swap.getAttribute('data-cat'));
    });

    loadProducts().then(function () {
      if (LOAD_ERROR) {
        var p = document.getElementById('gfx-panel');
        if (p && !p.hidden) p.innerHTML = '<p class="gfx-error">Could not load the product catalog. Please refresh.</p>';
      }
      // Deep link: index.html?sport=tennis jumps straight into the flow.
      var m = window.location.search.match(/[?&]sport=([a-z-]+)/);
      if (m) {
        var found = FIT.SPORTS.filter(function (s) { return s.id === m[1]; })[0];
        if (found) selectSport(found.id);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
