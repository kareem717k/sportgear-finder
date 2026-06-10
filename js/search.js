(function () {
  var BASE = '/sportgear-finder/';

  var INDEX = [
    // ── Hubs
    { title: 'Tennis Hub', sub: 'All tennis categories', tag: 'Tennis', url: BASE + 'tennis/' },
    // ── Equipment categories
    { title: 'Tennis Rackets', sub: 'Budget · Best Value · Premium', tag: 'Rackets', url: BASE + 'tennis/rackets.html' },
    { title: 'Tennis Balls', sub: 'Budget · Best Value · Premium', tag: 'Balls', url: BASE + 'tennis/balls.html' },
    { title: 'Tennis Shoes', sub: 'Budget · Best Value · Premium', tag: 'Shoes', url: BASE + 'tennis/shoes.html' },
    { title: 'Tennis Bags', sub: 'Budget · Best Value · Premium', tag: 'Bags', url: BASE + 'tennis/bags.html' },
    { title: 'Tennis Strings', sub: 'Budget · Best Value · Premium', tag: 'Strings', url: BASE + 'tennis/strings.html' },
    { title: 'Grips & Overgrips', sub: 'Budget · Best Value · Premium', tag: 'Grips', url: BASE + 'tennis/grips.html' },
    { title: 'Tennis Accessories', sub: 'Dampeners · wristbands · headbands', tag: 'Accessories', url: BASE + 'tennis/accessories.html' },
    // ── Clothing categories
    { title: 'Tennis Shirts & Polos', sub: 'Budget · Best Value · Premium', tag: 'Shirts', url: BASE + 'tennis/shirts.html' },
    { title: 'Tennis Shorts', sub: 'Budget · Best Value · Premium', tag: 'Shorts', url: BASE + 'tennis/shorts.html' },
    { title: 'Tennis Skirts & Dresses', sub: 'Budget · Best Value · Premium', tag: 'Skirts', url: BASE + 'tennis/skirts.html' },
    { title: 'Tennis Socks', sub: 'Budget · Best Value · Premium', tag: 'Socks', url: BASE + 'tennis/socks.html' },
    { title: 'Tennis Hats & Visors', sub: 'Budget · Best Value · Premium', tag: 'Hats', url: BASE + 'tennis/hats.html' },
    // ── Racket products
    { title: 'Wilson Tour Slam Adult Strung', sub: 'Rackets — Budget', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Head Ti.S6 Strung', sub: 'Rackets — Budget', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Babolat EVO Drive Gen 2', sub: 'Rackets — Best Value', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Yonex EZONE 100', sub: 'Rackets — Best Value', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Babolat Pure Drive 2025', sub: 'Rackets — Premium', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    { title: 'Babolat Pure Aero 98 2026', sub: 'Rackets — Premium', tag: 'Product', url: BASE + 'tennis/rackets.html' },
    // ── Ball products
    { title: 'Penn Championship Extra Duty', sub: 'Balls — Budget', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Wilson Championship Extra Duty', sub: 'Balls — Budget', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Wilson US Open Extra Duty', sub: 'Balls — Best Value', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Penn Tour Extra Duty', sub: 'Balls — Best Value', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Babolat Roland Garros All Court', sub: 'Balls — Premium', tag: 'Product', url: BASE + 'tennis/balls.html' },
    { title: 'Dunlop Australian Open Extra Duty', sub: 'Balls — Premium', tag: 'Product', url: BASE + 'tennis/balls.html' },
    // ── Shoe products
    { title: 'ASICS Gel Dedicate 8', sub: 'Shoes — Budget', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'NikeCourt Lite 4', sub: 'Shoes — Budget', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'ASICS Court FF 3', sub: 'Shoes — Best Value', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'Mizuno Wave Enforce Tour 2', sub: 'Shoes — Best Value', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'ASICS Gel-Resolution 9', sub: 'Shoes — Premium', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    { title: 'Nike Air Zoom Vapor Pro 2', sub: 'Shoes — Premium', tag: 'Product', url: BASE + 'tennis/shoes.html' },
    // ── Bag products
    { title: 'Wilson Federer Team III Bag', sub: 'Bags — Budget', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Head Core Club 6 Racket Bag', sub: 'Bags — Budget', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Babolat Pure Aero Backpack', sub: 'Bags — Best Value', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Head Tour Team Backpack', sub: 'Bags — Best Value', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Wilson Pro Staff Super Tour Bag', sub: 'Bags — Premium', tag: 'Product', url: BASE + 'tennis/bags.html' },
    { title: 'Geau Sport Axiom 2.0', sub: 'Bags — Premium', tag: 'Product', url: BASE + 'tennis/bags.html' },
    // ── String products
    { title: 'Wilson Synthetic Gut Power 16', sub: 'Strings — Budget', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Prince Synthetic Gut Original 16', sub: 'Strings — Budget', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Babolat RPM Blast 16', sub: 'Strings — Best Value', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Solinco Hyper-G 16L', sub: 'Strings — Best Value', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Luxilon ALU Power 125', sub: 'Strings — Premium', tag: 'Product', url: BASE + 'tennis/strings.html' },
    { title: 'Wilson Natural Gut 16', sub: 'Strings — Premium', tag: 'Product', url: BASE + 'tennis/strings.html' },
    // ── Grip products
    { title: 'Wilson Pro Overgrip 3-pack', sub: 'Grips — Budget', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Tourna Grip Original 10-pack', sub: 'Grips — Budget', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Yonex Super Grap 30-pack', sub: 'Grips — Best Value', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Babolat VS Original Overgrip 12-pack', sub: 'Grips — Best Value', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Head Hydrosorb Pro Replacement Grip', sub: 'Grips — Premium', tag: 'Product', url: BASE + 'tennis/grips.html' },
    { title: 'Wilson Leather Grip Replacement', sub: 'Grips — Premium', tag: 'Product', url: BASE + 'tennis/grips.html' },
    // ── Accessory products
    { title: 'Wilson Pro Feel Vibration Dampener', sub: 'Accessories — Budget', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Babolat Custom Damp', sub: 'Accessories — Budget', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Nike Dri-FIT Wristbands', sub: 'Accessories — Best Value', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Adidas AeroReady Headband', sub: 'Accessories — Best Value', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Nike Elite Doublewide Wristbands', sub: 'Accessories — Premium', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    { title: 'Babolat Logo Wristband', sub: 'Accessories — Premium', tag: 'Product', url: BASE + 'tennis/accessories.html' },
    // ── Shirt products
    { title: 'Decathlon Artengo Dry Tennis Polo', sub: 'Shirts — Budget', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'ASICS Club Polo Shirt', sub: 'Shirts — Budget', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'Nike Dri-FIT Advantage Polo', sub: 'Shirts — Best Value', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'Adidas Club Tennis Polo', sub: 'Shirts — Best Value', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'Lacoste Ultra-Dry Polo', sub: 'Shirts — Premium', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    { title: 'lululemon Metal Vent Tech Polo', sub: 'Shirts — Premium', tag: 'Product', url: BASE + 'tennis/shirts.html' },
    // ── Shorts products
    { title: 'Decathlon Artengo TSH500 Shorts', sub: 'Shorts — Budget', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Nike Dri-FIT Training Shorts 7"', sub: 'Shorts — Budget', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Adidas Club Tennis Shorts', sub: 'Shorts — Best Value', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Nike Court Dri-FIT Advantage Shorts', sub: 'Shorts — Best Value', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'lululemon Pace Breaker Short 7"', sub: 'Shorts — Premium', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    { title: 'Nike Court Flex Ace Shorts', sub: 'Shorts — Premium', tag: 'Product', url: BASE + 'tennis/shorts.html' },
    // ── Skirt products
    { title: 'Decathlon Artengo Soft Tennis Skirt', sub: 'Skirts — Budget', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Wilson Team Tennis Skirt', sub: 'Skirts — Budget', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Nike Court Dri-FIT Victory Skirt', sub: 'Skirts — Best Value', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Adidas Match Tennis Skirt', sub: 'Skirts — Best Value', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'lululemon Pace Rival Skirt', sub: 'Skirts — Premium', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    { title: 'Nike Court Dri-FIT Advantage Pleated Skirt', sub: 'Skirts — Premium', tag: 'Product', url: BASE + 'tennis/skirts.html' },
    // ── Sock products
    { title: 'Decathlon Artengo RS 160 Low Socks', sub: 'Socks — Budget', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Wilson Quarter Socks 3-pack', sub: 'Socks — Budget', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Nike Court Multiplier Cushioned Socks', sub: 'Socks — Best Value', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Adidas Tour Crew Tennis Socks', sub: 'Socks — Best Value', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Balega Hidden Comfort Socks', sub: 'Socks — Premium', tag: 'Product', url: BASE + 'tennis/socks.html' },
    { title: 'Thorlo Tennis Crew Socks', sub: 'Socks — Premium', tag: 'Product', url: BASE + 'tennis/socks.html' },
    // ── Hat products
    { title: 'Nike Dri-FIT Legacy91 Cap', sub: 'Hats — Budget', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Adidas Sport Performance Cap', sub: 'Hats — Budget', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Nike Court AeroBill Heritage86 Cap', sub: 'Hats — Best Value', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Wilson Ultralight Tennis Cap', sub: 'Hats — Best Value', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Nike Court Advantage Cap', sub: 'Hats — Premium', tag: 'Product', url: BASE + 'tennis/hats.html' },
    { title: 'Lacoste Sport Microfibre Player Cap', sub: 'Hats — Premium', tag: 'Product', url: BASE + 'tennis/hats.html' },
    // ── Gym Hub
    { title: 'Gym & Fitness Hub', sub: 'All gym categories', tag: 'Gym', url: BASE + 'gym/' },
    // ── Gym categories
    { title: 'Dumbbells', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/dumbbells.html' },
    { title: 'Resistance Bands', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/resistance-bands.html' },
    { title: 'Training Shoes', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/training-shoes.html' },
    { title: 'Gym Bags', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/gym-bags.html' },
    { title: 'Weightlifting Gloves', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/gloves.html' },
    { title: 'Jump Ropes', sub: 'Budget · Best Value · Premium', tag: 'Gym', url: BASE + 'gym/jump-ropes.html' },
    // ── Dumbbell products
    { title: 'Yes4All Rubber Hex Dumbbells', sub: 'Dumbbells — Budget', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'CAP Barbell Rubber-Coated Hex', sub: 'Dumbbells — Budget', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'PowerBlock Sport 24 Adjustable', sub: 'Dumbbells — Best Value', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'Bowflex SelectTech 552', sub: 'Dumbbells — Best Value', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'REP Fitness Quickdraw Adjustable', sub: 'Dumbbells — Premium', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    { title: 'Bowflex SelectTech 1090', sub: 'Dumbbells — Premium', tag: 'Product', url: BASE + 'gym/dumbbells.html' },
    // ── Resistance Band products
    { title: 'Fit Simplify Resistance Loop Bands', sub: 'Resistance Bands — Budget', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'TheraBand Resistance Bands Set', sub: 'Resistance Bands — Budget', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'WODFitters Pull-Up Assist Bands', sub: 'Resistance Bands — Best Value', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'Bodylastics Resistance Band Set', sub: 'Resistance Bands — Best Value', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'EliteFTS Pro Stretch Bands', sub: 'Resistance Bands — Premium', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    { title: 'Perform Better Superband', sub: 'Resistance Bands — Premium', tag: 'Product', url: BASE + 'gym/resistance-bands.html' },
    // ── Training Shoe products
    { title: 'New Balance 608 V5 Cross Trainer', sub: 'Training Shoes — Budget', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'Skechers Max Cushioning Arch Fit', sub: 'Training Shoes — Budget', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'Reebok Nano X3', sub: 'Training Shoes — Best Value', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'NOBULL Training Shoe', sub: 'Training Shoes — Best Value', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'Nike Metcon 9', sub: 'Training Shoes — Premium', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    { title: 'Nike Metcon 9 AMP', sub: 'Training Shoes — Premium', tag: 'Product', url: BASE + 'gym/training-shoes.html' },
    // ── Gym Bag products
    { title: 'Amazon Basics Duffel Gym Bag', sub: 'Gym Bags — Budget', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'DALIX 21" Sports Duffle Bag', sub: 'Gym Bags — Budget', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'Nike Brasilia 9.5 Training Duffel', sub: 'Gym Bags — Best Value', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'Under Armour Undeniable 5.0 Duffle', sub: 'Gym Bags — Best Value', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'Nike Hoops Elite Duffel Bag', sub: 'Gym Bags — Premium', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    { title: 'lululemon Early Embark Duffel 27L', sub: 'Gym Bags — Premium', tag: 'Product', url: BASE + 'gym/gym-bags.html' },
    // ── Weightlifting Glove products
    { title: 'RIMSports Workout Gloves', sub: 'Weightlifting Gloves — Budget', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'FREETOO Workout Gloves with Wrist Support', sub: 'Weightlifting Gloves — Budget', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'Trideer Workout Gloves', sub: 'Weightlifting Gloves — Best Value', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'Pro Wristwrap Weightlifting Gloves', sub: 'Weightlifting Gloves — Best Value', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'Harbinger Training Grip Gloves 3.0', sub: 'Weightlifting Gloves — Premium', tag: 'Product', url: BASE + 'gym/gloves.html' },
    { title: 'Schiek Sports Platinum Lifting Gloves', sub: 'Weightlifting Gloves — Premium', tag: 'Product', url: BASE + 'gym/gloves.html' },
    // ── Jump Rope products
    { title: 'XYLsports Jump Rope', sub: 'Jump Ropes — Budget', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'DEGOL Skipping Rope with Ball Bearings', sub: 'Jump Ropes — Budget', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'WOD Nation Attack Speed Jump Rope', sub: 'Jump Ropes — Best Value', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'RPM Speed Jump Rope 3.0', sub: 'Jump Ropes — Best Value', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'Crossrope Get Lean Set', sub: 'Jump Ropes — Premium', tag: 'Product', url: BASE + 'gym/jump-ropes.html' },
    { title: 'Crossrope Get Strong Set', sub: 'Jump Ropes — Premium', tag: 'Product', url: BASE + 'gym/jump-ropes.html' }
  ];

  // ── DOM ──────────────────────────────────────────────────
  var overlay, input, resultsList;
  var highlighted = -1;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="search-box">' +
        '<div class="search-input-row">' +
          '<svg width="18" height="18" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M14.5 14.5L19 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
          '<input type="text" placeholder="Search products, categories…" autocomplete="off" spellcheck="false" />' +
          '<button class="search-esc" aria-label="Close search">ESC</button>' +
        '</div>' +
        '<hr class="search-divider">' +
        '<div class="search-results"><p class="search-hint">Type to search 72 products across 12 categories</p></div>' +
      '</div>';
    document.body.appendChild(overlay);

    input = overlay.querySelector('input');
    resultsList = overlay.querySelector('.search-results');

    input.addEventListener('input', onInput);
    input.addEventListener('keydown', onKey);
    overlay.querySelector('.search-esc').addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
  }

  function onInput() {
    var q = input.value.trim().toLowerCase();
    highlighted = -1;
    if (!q) {
      resultsList.innerHTML = '<p class="search-hint">Type to search 72 products across 12 categories</p>';
      return;
    }
    var matches = INDEX.filter(function (item) {
      return item.title.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q);
    }).slice(0, 12);

    if (!matches.length) {
      resultsList.innerHTML = '<p class="search-empty">No results for "<strong>' + esc(input.value) + '</strong>"</p>';
      return;
    }
    resultsList.innerHTML = matches.map(function (item, i) {
      var isProduct = item.tag === 'Product';
      return '<a class="search-result" href="' + item.url + '" data-idx="' + i + '">' +
        '<span class="sr-tag' + (isProduct ? ' tag-product' : '') + '">' + esc(item.tag) + '</span>' +
        '<span class="sr-info"><span class="sr-title">' + esc(item.title) + '</span><span class="sr-sub">' + esc(item.sub) + '</span></span>' +
        '</a>';
    }).join('');
  }

  function onKey(e) {
    var items = resultsList.querySelectorAll('.search-result');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlighted = Math.min(highlighted + 1, items.length - 1);
      updateHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlighted = Math.max(highlighted - 1, 0);
      updateHighlight(items);
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      items[highlighted].click();
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  }

  function updateHighlight(items) {
    items.forEach(function (el, i) { el.classList.toggle('highlighted', i === highlighted); });
    if (items[highlighted]) items[highlighted].scrollIntoView({ block: 'nearest' });
  }

  function openSearch() {
    overlay.classList.add('open');
    input.value = '';
    resultsList.innerHTML = '<p class="search-hint">Type to search 72 products across 12 categories</p>';
    highlighted = -1;
    setTimeout(function () { input.focus(); }, 50);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function esc(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── INIT ─────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    buildOverlay();

    // Wire up search button(s)
    document.querySelectorAll('.nav-search-btn').forEach(function (btn) {
      btn.addEventListener('click', openSearch);
    });

    // Global keyboard shortcut: / or Ctrl+K
    document.addEventListener('keydown', function (e) {
      if (overlay.classList.contains('open')) return;
      if ((e.key === '/' && document.activeElement.tagName !== 'INPUT') || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        openSearch();
      }
    });
  });
})();
