/**
 * gear-fit.js — SportGear Finder
 * The rules layer behind the Gear Finder: what a complete kit for each sport
 * is made of, which questions are worth asking, and how a catalog product maps
 * onto a person's answers.
 *
 * This file holds knowledge, not behaviour. gear-finder.js owns the UI and the
 * assembly algorithm and reads everything it needs from window.SGF_FIT.
 *
 * Why the fit data lives here and not in data/products.json: that file is the
 * hand-verified catalog (every ASIN checked against a live Amazon buy box) and
 * regenerating it to bolt on a `fit` object risks the one thing this site
 * cannot afford to get wrong. The signals we actually need — who a product
 * suits, what it pairs with — are derivable from the fields already there
 * (sport, category, tier, tags, score) plus the per-sport tables below.
 */

(function () {
  'use strict';

  // ─── SPORTS ──────────────────────────────────────────────────────────────

  var SPORTS = [
    { id: 'tennis',      label: 'Tennis' },
    { id: 'gym',         label: 'Gym & Fitness' },
    { id: 'boxing',      label: 'Boxing' },
    { id: 'swimming',    label: 'Swimming' },
    { id: 'football',    label: 'Football' },
    { id: 'volleyball',  label: 'Volleyball' },
    { id: 'pickleball',  label: 'Pickleball' },
    { id: 'ping-pong',   label: 'Ping Pong' },
    { id: 'badminton',   label: 'Badminton' }
  ];

  // ─── LEVELS & BUDGET ─────────────────────────────────────────────────────

  var LEVELS = [
    { id: 'new',         label: 'Just starting',  hint: 'First kit, or coming back after years off' },
    { id: 'casual',      label: 'I play regularly', hint: 'A few times a month, know what I like' },
    { id: 'competitive', label: 'I compete',       hint: 'League, club or tournament play' }
  ];

  // Tier preference by level. Order is the preference order — first is best.
  var LEVEL_TIERS = {
    'new':         ['budget', 'value', 'premium'],
    'casual':      ['value', 'budget', 'premium'],
    'competitive': ['premium', 'value', 'budget']
  };

  // Tags in the catalog that signal a product suits a given level.
  var LEVEL_TAGS = {
    'new':         ['beginner', 'recreational', 'starter', 'entry', 'easy', 'forgiving'],
    'casual':      ['intermediate', 'recreational', 'all-around', 'comfort', 'versatile'],
    'competitive': ['advanced', 'professional', 'tour', 'competition', 'tournament', 'match', 'pro', 'elite']
  };

  // The cap is what the assembler spends against. It is used for filtering
  // only — no per-listing price is ever rendered (Amazon Associates permits
  // displayed prices only from the Creators API, see scripts/remove-prices.ps1).
  // `phrase` is the prose form used in the kit summary sentence. The labels
  // above are button text and already carry their own preposition ("Under
  // $100"), so pasting them after a word like "around" reads as broken
  // English — the summary reads `phrase` instead.
  var BUDGETS = [
    { id: 'lean',    label: 'Under $100',  cap: 100,      phrase: 'under $100' },
    { id: 'mid',     label: '$100 – $250', cap: 250,      phrase: 'around $100–$250' },
    { id: 'serious', label: '$250 – $500', cap: 500,      phrase: 'around $250–$500' },
    { id: 'full',    label: '$500+',       cap: 1200,     phrase: 'over $500' },
    { id: 'open',    label: 'No limit',    cap: Infinity, phrase: 'with no budget limit' }
  ];

  // ─── KITS ────────────────────────────────────────────────────────────────
  /**
   * A kit is an ordered list of slots. Each slot is one category of the
   * catalog plus the rules for when it belongs in this person's kit.
   *
   *   cat       category id in data/products.json
   *   label     what to call it in the results
   *   rank      assembly + upgrade priority. 1 is the centrepiece.
   *   weight    share of the budget this slot gets before the upgrade pass.
   *             Weights are normalised over whatever slots survive filtering,
   *             so they do not need to sum to 1 here.
   *   core      never dropped, even if the budget will not stretch
   *   optional  first to be dropped when the budget will not stretch
   *   when      predicate over the profile; slot is skipped when it returns false
   *   why       the standing reason this slot is in the kit at all
   */
  var KITS = {
    tennis: [
      { cat: 'rackets', label: 'Racket', rank: 1, weight: 0.38, core: true,
        why: 'The one piece that changes how every shot feels.' },
      { cat: 'shoes', label: 'Court shoes', rank: 2, weight: 0.26,
        why: 'Running shoes have no lateral support — this is the single biggest injury-prevention item in tennis.' },
      { cat: 'bags', label: 'Bag', rank: 5, weight: 0.10,
        why: 'Keeps the racket out of a hot car boot, which kills strings and grips.' },
      { cat: 'strings', label: 'Strings', rank: 4, weight: 0.05,
        when: function (p) { return p.level !== 'new'; },
        why: 'Once you play weekly, strings shape feel more than the frame does.' },
      { cat: 'grips', label: 'Overgrips', rank: 6, weight: 0.04,
        why: 'Cheapest way to stop the racket twisting in your hand.' },
      { cat: 'balls', label: 'Balls', rank: 3, weight: 0.04,
        why: 'You need them from day one.' },
      { cat: 'socks', label: 'Socks', rank: 7, weight: 0.04, optional: true,
        why: 'Blisters end sessions faster than fitness does.' },
      { cat: 'skirts', label: 'Apparel', rank: 8, weight: 0.09, optional: true,
        when: function (p) { return p.flags.women; },
        why: 'Court-cut apparel with ball pockets.' },
      { cat: 'shorts', label: 'Apparel', rank: 8, weight: 0.09, optional: true,
        when: function (p) { return !p.flags.women; },
        why: 'Ball pockets and a cut that does not ride up on the serve.' }
    ],

    gym: [
      { cat: 'training-shoes', label: 'Training shoes', rank: 1, weight: 0.30, core: true,
        why: 'A flat, stable sole is what lets you lift safely — running shoes compress under load.' },
      { cat: 'dumbbells', label: 'Dumbbells', rank: 2, weight: 0.35,
        when: function (p) { return p.context !== 'commercial'; },
        why: 'The backbone of a home setup — adjustable pairs replace a whole rack.' },
      { cat: 'resistance-bands', label: 'Resistance bands', rank: 3, weight: 0.10,
        why: 'Warm-ups, accessory work, and the only kit that travels.' },
      { cat: 'gym-bags', label: 'Gym bag', rank: 4, weight: 0.10,
        when: function (p) { return p.context !== 'home'; },
        why: 'Wet-kit compartment is the feature that matters.' },
      { cat: 'gloves', label: 'Gloves', rank: 5, weight: 0.07, optional: true,
        why: 'Grip support once the bar gets heavy enough to tear callouses.' },
      { cat: 'jump-ropes', label: 'Jump rope', rank: 6, weight: 0.08, optional: true,
        why: 'Cheapest conditioning tool that exists.' }
    ],

    boxing: [
      { cat: 'gloves', label: 'Gloves', rank: 1, weight: 0.35, core: true,
        why: 'Weight and fit here decide whether your hands last the year.' },
      { cat: 'hand-wraps', label: 'Hand wraps', rank: 2, weight: 0.06,
        why: 'Non-negotiable. Gloves protect your opponent; wraps protect you.' },
      { cat: 'punching-bags', label: 'Heavy bag', rank: 3, weight: 0.35,
        when: function (p) { return p.context === 'home'; },
        why: 'The whole point of training at home.' },
      { cat: 'headgear', label: 'Headgear', rank: 4, weight: 0.12,
        when: function (p) { return p.context === 'sparring' || p.context === 'competing'; },
        why: 'Required the moment you start taking live shots.' },
      { cat: 'shoes', label: 'Boxing shoes', rank: 5, weight: 0.12,
        when: function (p) { return p.context === 'competing'; },
        why: 'Pivot and footwork stop fighting your soles.' },
      { cat: 'speed-bags', label: 'Speed bag', rank: 6, weight: 0.10, optional: true,
        when: function (p) { return p.context === 'home'; },
        why: 'Timing and shoulder endurance, in a corner of the garage.' }
    ],

    swimming: [
      { cat: 'goggles', label: 'Goggles', rank: 1, weight: 0.22, core: true,
        why: 'A leaking pair ruins every session — fit matters more than brand.' },
      { cat: 'suits', label: 'Suit', rank: 2, weight: 0.35, core: true,
        why: 'Chlorine-resistant fabric is the difference between one season and three.' },
      { cat: 'caps', label: 'Cap', rank: 3, weight: 0.08,
        why: 'Less drag, and most pools expect one.' },
      { cat: 'bags', label: 'Mesh bag', rank: 4, weight: 0.12,
        why: 'Wet kit needs to breathe or it turns.' },
      { cat: 'training-aids', label: 'Training aids', rank: 5, weight: 0.12,
        when: function (p) { return p.level !== 'new'; },
        why: 'Kickboard and pull buoy are how you isolate a weak half of the stroke.' },
      { cat: 'fins', label: 'Fins', rank: 6, weight: 0.11, optional: true,
        why: 'Builds ankle flexibility and lets you hold a faster pace.' }
    ],

    football: [
      { cat: 'boots', label: 'Boots', rank: 1, weight: 0.40, core: true,
        why: 'Stud pattern has to match your surface or you slide.' },
      { cat: 'goalkeeper-gloves', label: 'Keeper gloves', rank: 2, weight: 0.20, core: true,
        when: function (p) { return p.context === 'keeper'; },
        why: 'Latex grade decides both grip and how fast they wear out.' },
      { cat: 'shin-guards', label: 'Shin guards', rank: 3, weight: 0.10,
        why: 'Mandatory in every organised match.' },
      { cat: 'balls', label: 'Ball', rank: 4, weight: 0.16,
        why: 'Match-weight ball for training beats a cheap one that goes out of shape.' },
      { cat: 'socks', label: 'Socks', rank: 5, weight: 0.06,
        why: 'Grip socks stop the slide inside the boot.' },
      { cat: 'jerseys', label: 'Jersey', rank: 6, weight: 0.14, optional: true,
        why: 'Moisture-wicking kit for training days.' }
    ],

    volleyball: [
      // Playing in a garden makes the net the centrepiece, not the shoes —
      // there is no court to have court shoes for. Rank cannot vary by
      // context, so the two readings of "volleyball" get their own slots.
      { cat: 'nets', label: 'Net system', rank: 1, weight: 0.45, core: true,
        when: function (p) { return p.context === 'home'; },
        why: 'Nothing else in the kit matters without one. Portable systems set up in a garden in about ten minutes.' },
      { cat: 'shoes', label: 'Court shoes', rank: 1, weight: 0.38, core: true,
        when: function (p) { return p.context === 'indoor'; },
        why: 'Gum soles and jump cushioning — the load on landing is what wrecks knees.' },
      { cat: 'volleyballs', label: 'Ball', rank: 2, weight: 0.20, core: true,
        why: 'Indoor and beach balls are different weights and covers.' },
      { cat: 'knee-pads', label: 'Knee pads', rank: 3, weight: 0.12,
        when: function (p) { return p.context === 'indoor'; },
        why: 'You will hit the floor. Repeatedly.' },
      { cat: 'shoes', label: 'Court shoes', rank: 4, weight: 0.30, optional: true,
        when: function (p) { return p.context === 'home'; },
        why: 'Worth adding once the garden games get competitive.' },
      { cat: 'ankle-braces', label: 'Ankle braces', rank: 5, weight: 0.12, optional: true,
        when: function (p) { return p.context !== 'beach'; },
        why: 'Ankle rolls at the net are the most common volleyball injury there is.' },
      { cat: 'training-aids', label: 'Training aids', rank: 6, weight: 0.12, optional: true,
        when: function (p) { return p.level !== 'new'; },
        why: 'Solo reps on setting and spiking without a partner.' }
    ],

    pickleball: [
      { cat: 'paddles', label: 'Paddle', rank: 1, weight: 0.38, core: true,
        why: 'Core thickness and face material decide power vs control.' },
      { cat: 'balls', label: 'Balls', rank: 2, weight: 0.07,
        why: 'Indoor and outdoor balls are not interchangeable — hole count differs.' },
      { cat: 'shoes', label: 'Court shoes', rank: 3, weight: 0.26,
        why: 'Lateral support for the constant side-to-side at the kitchen line.' },
      { cat: 'grips', label: 'Overgrips', rank: 4, weight: 0.05,
        why: 'Cheap, and it is the only part of the paddle you actually touch.' },
      { cat: 'bags', label: 'Bag', rank: 5, weight: 0.12, optional: true,
        why: 'Paddle sleeve plus a ball pocket is all you need.' },
      // Only offered to driveway players, and for them it outranks everything
      // but the paddle — there is no game without it.
      { cat: 'nets', label: 'Net system', rank: 2, weight: 0.30, core: true,
        when: function (p) { return p.context === 'home'; },
        why: 'Turns a driveway into a court.' }
    ],

    'ping-pong': [
      { cat: 'sets', label: 'Paddle set', rank: 1, weight: 0.40, core: true,
        when: function (p) { return p.context === 'casual'; },
        why: 'Four paddles and balls in one box — the right call for a house that plays socially.' },
      { cat: 'paddles', label: 'Paddle', rank: 1, weight: 0.40, core: true,
        when: function (p) { return p.context !== 'casual'; },
        why: 'A real blade with proper rubber is a different sport to a hardware-store bat.' },
      { cat: 'balls', label: 'Balls', rank: 2, weight: 0.12,
        why: '3-star 40+ balls bounce true and last.' },
      { cat: 'nets', label: 'Net & posts', rank: 3, weight: 0.18,
        when: function (p) { return p.context === 'casual'; },
        why: 'Clamp nets fit any table, so a dining table becomes playable.' },
      { cat: 'custom', label: 'Rubber & blade', rank: 4, weight: 0.25,
        when: function (p) { return p.context === 'competitive'; },
        why: 'Once you know your style, matching rubber to blade beats any pre-made bat.' },
      { cat: 'training', label: 'Training gear', rank: 5, weight: 0.20, optional: true,
        when: function (p) { return p.context !== 'casual'; },
        why: 'Catch nets and collectors turn solo practice into real volume.' }
    ],

    badminton: [
      { cat: 'sets', label: 'Racket set', rank: 1, weight: 0.40, core: true,
        when: function (p) { return p.context === 'casual'; },
        why: 'Two rackets and shuttles in a box — the sane starting point for garden play.' },
      { cat: 'rackets', label: 'Racket', rank: 1, weight: 0.40, core: true,
        when: function (p) { return p.context !== 'casual'; },
        why: 'Balance point and shaft flex are what separate club rackets from toys.' },
      { cat: 'shuttlecocks', label: 'Shuttlecocks', rank: 2, weight: 0.14,
        why: 'Feather for club play, nylon for everything else — you go through them fast.' },
      { cat: 'strings-grips', label: 'Strings & grips', rank: 3, weight: 0.08,
        why: 'Grip wears out in weeks; string tension is free power.' },
      { cat: 'bags', label: 'Bag', rank: 4, weight: 0.12, optional: true,
        why: 'Thermal lining stops frames cooking in a car.' },
      // Badminton's context answers are casual/competitive — there is no
      // 'home' value here, so gating on one silently disables the slot.
      { cat: 'nets', label: 'Net system', rank: 2, weight: 0.25,
        when: function (p) { return p.context === 'casual'; },
        why: 'Garden play needs posts and a net, and a proper one beats string between two chairs.' }
    ]
  };

  // ─── SPORT-SPECIFIC QUESTION ─────────────────────────────────────────────
  /**
   * One question per sport, chosen because its answer changes which slots go
   * in the kit — not merely how they are ranked. Anything that only nudges
   * ranking belongs in the free-text box instead, where it costs no clicks.
   *
   * `tags` must be *distinctive* catalog tags, matched exactly. Generic ones
   * like 'grip', 'protection' or 'comfort' sit on half the catalog, and since
   * a match here earns a printed "Built for goalkeeper" line, a loose tag puts
   * that sentence under a pair of socks. If an answer has no distinctive tag,
   * leave the list short — it still drives slot selection, which is its job.
   */
  var CONTEXT_Q = {
    tennis: {
      q: 'Where do you mostly play?',
      opts: [
        { id: 'hard',    label: 'Hard court',        tags: ['durable', 'outsole'] },
        { id: 'clay',    label: 'Clay',              tags: ['clay', 'herringbone'] },
        { id: 'indoor',  label: 'Indoor / carpet',   tags: ['indoor'] },
        { id: 'unsure',  label: 'Mix of everything', tags: ['all-court', 'versatile'] }
      ]
    },
    gym: {
      q: 'Where do you train?',
      opts: [
        { id: 'home',       label: 'At home', tags: ['adjustable', 'compact', 'space-saving'] },
        { id: 'commercial', label: 'A gym',   tags: ['portable'] },
        { id: 'both',       label: 'Both',    tags: ['adjustable', 'portable'] }
      ]
    },
    boxing: {
      q: 'What does your training look like?',
      opts: [
        { id: 'home',      label: 'Bag work at home',   tags: ['training', 'freestanding'] },
        { id: 'sparring',  label: 'Classes & sparring', tags: ['sparring'] },
        { id: 'competing', label: 'Competing',          tags: ['competition', 'professional', 'lace-up'] }
      ]
    },
    swimming: {
      q: 'What kind of swimming?',
      opts: [
        { id: 'laps',      label: 'Pool laps',        tags: ['training', 'chlorine-resistant', 'lap'] },
        { id: 'openwater', label: 'Open water / tri', tags: ['open water', 'mirrored', 'triathlon'] },
        { id: 'casual',    label: 'Casual & fitness', tags: ['recreational'] }
      ]
    },
    football: {
      q: 'What position do you play?',
      opts: [
        { id: 'outfield', label: 'Outfield',   tags: ['speed'] },
        { id: 'keeper',   label: 'Goalkeeper', tags: ['goalkeeper'] }
      ]
    },
    volleyball: {
      q: 'Where do you play?',
      opts: [
        { id: 'indoor', label: 'Indoor court',      tags: ['indoor', 'gum-sole'] },
        { id: 'beach',  label: 'Beach / sand',      tags: ['beach', 'sand'] },
        { id: 'home',   label: 'Garden or driveway', tags: ['portable', 'recreational'] }
      ]
    },
    pickleball: {
      q: 'Where do you play?',
      opts: [
        { id: 'courts', label: 'Public courts',      tags: ['outdoor'] },
        { id: 'home',   label: 'Driveway or garden', tags: ['portable', 'recreational'] },
        { id: 'indoor', label: 'Indoor courts',      tags: ['indoor'] }
      ]
    },
    'ping-pong': {
      q: 'How do you play?',
      opts: [
        { id: 'casual',      label: 'Family & social',    tags: ['recreational', 'set'] },
        { id: 'competitive', label: 'Club & competitive', tags: ['competition', 'spin', 'advanced'] }
      ]
    },
    badminton: {
      q: 'How do you play?',
      opts: [
        { id: 'casual',      label: 'Garden & casual',    tags: ['recreational', 'nylon'] },
        { id: 'competitive', label: 'Club & competitive', tags: ['competition', 'feather', 'advanced'] }
      ]
    }
  };

  // ─── FREE-TEXT SIGNALS ───────────────────────────────────────────────────
  /**
   * The optional "anything else" box. Each flag is detected from phrases a
   * person would actually type, and boosts products carrying certain tags.
   * Phrases are matched as substrings, so they are written long enough not to
   * collide: bare 'her' would fire on "other".
   *
   * `cats` is the scope, and it is not optional decoration. Tag vocabulary in
   * the catalog is shared across categories — 'comfort' and 'support' appear
   * on backpacks and socks as readily as on rackets — so an unscoped flag
   * produces sentences like "this backpack was chosen for your tennis elbow".
   * A flag only scores, and only earns the right to explain itself, inside the
   * categories where the concern is physically real. Omit `cats` only where
   * the concern genuinely applies to everything.
   */
  var FLAGS = {
    arm: {
      phrases: ['elbow', 'tennis elbow', 'golfers elbow', 'arm pain', 'shoulder pain', 'wrist pain',
                'joint pain', 'arthritis', 'sore arm', 'sore shoulder', 'injury', 'injured', 'tendon'],
      tags: ['arm-friendly', 'shock', 'vibration', 'dampening', 'comfort'],
      cats: ['rackets', 'paddles', 'strings', 'grips', 'strings-grips', 'gloves', 'hand-wraps',
             'resistance-bands', 'dumbbells', 'accessories'],
      label: 'arm comfort'
    },
    wideFeet: {
      phrases: ['wide feet', 'wide foot', 'wide fit', 'wide fitting', 'flat feet', 'flat foot',
                'bunion', 'bunions', 'wide toe box'],
      // Width signals only. 'support' and 'cushioned' were here once and are
      // the reason this flag used to explain itself on a pair of socks: they
      // are comfort words that footwear does not own. Every tag below is a
      // width claim and appears on real entries in products.json.
      tags: ['wide', 'wide-available', 'roomy', 'arch-fit'],
      // Footwear only. Socks do not come in widths, so they can no longer
      // take the credit for a pick the shoes should be making.
      cats: ['shoes', 'boots', 'training-shoes'],
      label: 'wide-fit footwear'
    },
    light: {
      phrases: ['lightweight', 'light weight', 'too heavy', 'lighter', 'light racket', 'light paddle'],
      tags: ['lightweight', 'light'],
      cats: ['rackets', 'paddles', 'boots', 'shoes', 'training-shoes', 'bags', 'gym-bags', 'headgear'],
      label: 'low weight'
    },
    durable: {
      phrases: ['durable', 'lasts', 'long lasting', 'wears out', 'wear out', 'falls apart', 'hard wearing'],
      tags: ['durable', 'reinforced', 'heavy-duty', 'tough'],
      label: 'durability'
    },
    travel: {
      phrases: ['travel', 'traveling', 'travelling', 'commute', 'portable', 'small apartment',
                'small space', 'no space', 'tight space'],
      tags: ['portable', 'compact', 'foldable', 'space-saving'],
      cats: ['bags', 'gym-bags', 'dumbbells', 'nets', 'punching-bags', 'resistance-bands',
             'jump-ropes', 'training', 'training-aids'],
      label: 'portability'
    },
    kids: {
      phrases: ['my kid', 'my son', 'my daughter', 'my child', 'junior', 'youth', 'for a kid',
                'for kids', '10 year', '11 year', '12 year', '13 year', '8 year', '9 year'],
      tags: ['junior', 'youth', 'kids'],
      label: 'junior sizing'
    },
    women: {
      phrases: ['woman', 'women', 'female', 'my wife', 'my girlfriend', 'my daughter', "women's", 'womens'],
      tags: ['women', 'womens', 'female'],
      cats: ['shirts', 'shorts', 'skirts', 'shoes', 'boots', 'training-shoes', 'suits', 'jerseys', 'hats'],
      label: "women's fit"
    },
    gift: {
      phrases: ['gift', 'present', 'birthday', 'christmas', 'surprise'],
      tags: ['set', 'bundle', 'complete', 'starter'],
      cats: ['sets', 'bags', 'paddles', 'rackets', 'balls'],
      label: 'gifting'
    },
    quiet: {
      phrases: ['quiet', 'noise', 'neighbour', 'neighbor', 'apartment', 'upstairs'],
      tags: ['quiet', 'noise'],
      cats: ['jump-ropes', 'dumbbells', 'punching-bags', 'nets', 'training'],
      label: 'noise'
    }
  };

  // Explicit budget written into the free-text box overrides the bracket.
  function detectBudget(text) {
    var m = text.match(/(?:under|below|less than|max|budget of|around|about|up to|<)\s*\$?\s*(\d{2,5})/);
    if (m) return parseInt(m[1], 10);
    m = text.match(/\$\s*(\d{2,5})/);
    if (m) return parseInt(m[1], 10);
    return null;
  }

  var STOPWORDS = ['the', 'and', 'for', 'with', 'that', 'this', 'have', 'want', 'need', 'looking',
                   'been', 'from', 'about', 'into', 'over', 'some', 'just', 'like', 'play', 'playing',
                   'buy', 'get', 'good', 'best', 'really', 'very', 'more', 'much', 'would', 'could'];

  /**
   * Turns the raw answers into the profile object every other function reads.
   * `flags` is always fully populated (false for undetected) so callers can
   * read p.flags.women without a guard.
   */
  function buildProfile(answers) {
    var text = (answers.notes || '').toLowerCase();
    var flags = {};
    var matched = [];

    Object.keys(FLAGS).forEach(function (key) {
      var hit = FLAGS[key].phrases.some(function (ph) { return text.indexOf(ph) !== -1; });
      flags[key] = hit;
      if (hit) matched.push(key);
    });

    var bracket = null;
    for (var i = 0; i < BUDGETS.length; i++) {
      if (BUDGETS[i].id === answers.budget) { bracket = BUDGETS[i]; break; }
    }

    var typed = detectBudget(text);
    var cap = typed || (bracket ? bracket.cap : Infinity);

    // A junior kit is a beginner kit regardless of what was clicked.
    var level = answers.level || 'casual';
    if (flags.kids) level = 'new';

    var tokens = text.replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(function (t) {
      return t.length > 3 && STOPWORDS.indexOf(t) === -1;
    });

    return {
      sport: answers.sport,
      level: level,
      budgetId: answers.budget,
      budgetLabel: typed ? ('$' + typed) : (bracket ? bracket.label : 'any budget'),
      // Prose form for sentences. A typed figure ("under 80") becomes
      // "around $80"; a bracket carries its own wording; skipping the step
      // leaves the sentence with nothing to say about budget.
      budgetPhrase: typed ? ('around $' + typed) : (bracket ? bracket.phrase : ''),
      // The number to name when the kit cannot fit, e.g. "more than $100".
      budgetCeiling: isFinite(cap) ? ('$' + cap) : '',
      cap: cap,
      context: answers.context || null,
      owned: answers.owned || [],
      notes: answers.notes || '',
      tokens: tokens,
      flags: flags,
      matchedFlags: matched
    };
  }

  /**
   * The slots that belong in this person's kit, already filtered and ordered.
   * Owned categories drop out here so the assembler never sees them.
   */
  function slotsFor(profile) {
    var kit = KITS[profile.sport] || [];
    return kit.filter(function (s) {
      if (profile.owned.indexOf(s.cat) !== -1) return false;
      return s.when ? s.when(profile) : true;
    }).sort(function (a, b) { return a.rank - b.rank; });
  }

  function tagsForContext(sport, contextId) {
    var q = CONTEXT_Q[sport];
    if (!q || !contextId) return [];
    for (var i = 0; i < q.opts.length; i++) {
      if (q.opts[i].id === contextId) return q.opts[i].tags;
    }
    return [];
  }

  function contextLabel(sport, contextId) {
    var q = CONTEXT_Q[sport];
    if (!q || !contextId) return '';
    for (var i = 0; i < q.opts.length; i++) {
      if (q.opts[i].id === contextId) return q.opts[i].label;
    }
    return '';
  }

  window.SGF_FIT = {
    SPORTS: SPORTS,
    LEVELS: LEVELS,
    LEVEL_TIERS: LEVEL_TIERS,
    LEVEL_TAGS: LEVEL_TAGS,
    BUDGETS: BUDGETS,
    KITS: KITS,
    CONTEXT_Q: CONTEXT_Q,
    FLAGS: FLAGS,
    buildProfile: buildProfile,
    slotsFor: slotsFor,
    tagsForContext: tagsForContext,
    contextLabel: contextLabel
  };
})();
