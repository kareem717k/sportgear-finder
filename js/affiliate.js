/**
 * SportGear Finder — Affiliate click tracking + marketplace localisation
 *
 * 1. Localisation: rewrites outbound /dp/ links to the visitor's nearest
 *    Amazon marketplace, but ONLY for marketplaces we hold a tag for.
 * 2. Tracking: fires a GA4 `affiliate_click` event for every outbound link.
 *
 * Handles both product layouts: .pcard (category pages) and .pick (articles).
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
   * Associates tags, per marketplace.
   *
   * Amazon Associates is PER-MARKETPLACE: `sportgearfind-20` is a US tag
   * and earns exactly nothing on amazon.de or amazon.co.uk. Each locale
   * needs its own programme signup at affiliate-program.amazon.<tld>.
   *
   * A null tag means "we have no programme there" — those visitors are
   * left on amazon.com rather than being sent to a store where a sale
   * would pay us $0. Fill a tag in and that market goes live instantly;
   * no other change is needed.
   * ------------------------------------------------------------- */
  var TAGS = {
    'com':    'sportgearfind-20',
    'co.uk':  null,
    'de':     null,
    'fr':     null,
    'it':     null,
    'es':     null,
    'nl':     null,
    'se':     null,
    'pl':     null,
    'ca':     null,
    'com.au': null,
    'com.br': null,
    'com.mx': null,
    'com.tr': null,
    'co.jp':  null,
    'in':     null,
    'ae':     null,
    'sa':     null,
    'eg':     null,
    'sg':     null
  };

  /* Country -> nearest marketplace that actually ships there.
   * Countries with no Amazon presence (IL, BD, IR, ...) are deliberately
   * absent: amazon.com is already their best option, so we leave links be. */
  var MARKET = {
    GB: 'co.uk', IE: 'co.uk',
    DE: 'de', AT: 'de', CH: 'de', LU: 'de', LI: 'de',
    LT: 'de', LV: 'de', EE: 'de', CZ: 'de', SK: 'de', HU: 'de',
    SI: 'de', HR: 'de', GR: 'de', RO: 'de', BG: 'de', FI: 'de',
    DK: 'de', CY: 'de', MT: 'de',
    FR: 'fr', MC: 'fr',
    IT: 'it',
    ES: 'es', PT: 'es',
    NL: 'nl', BE: 'nl',
    SE: 'se', NO: 'se',
    PL: 'pl',
    CA: 'ca',
    AU: 'com.au', NZ: 'com.au',
    BR: 'com.br',
    MX: 'com.mx',
    TR: 'com.tr',
    JP: 'co.jp',
    IN: 'in',
    AE: 'ae', JO: 'ae', LB: 'ae', KW: 'ae', QA: 'ae', BH: 'ae', OM: 'ae',
    SA: 'sa',
    EG: 'eg',
    SG: 'sg', MY: 'sg'
  };

  /* IANA timezone -> ISO country. Timezone is a far better geo signal than
   * navigator.language (which reads en-US almost everywhere) and costs no
   * network request, so nothing leaves the page to resolve it. */
  var TZ = {
    'Europe/London': 'GB', 'Europe/Dublin': 'IE',
    'Europe/Berlin': 'DE', 'Europe/Vienna': 'AT', 'Europe/Zurich': 'CH',
    'Europe/Luxembourg': 'LU', 'Europe/Vaduz': 'LI',
    'Europe/Vilnius': 'LT', 'Europe/Riga': 'LV', 'Europe/Tallinn': 'EE',
    'Europe/Prague': 'CZ', 'Europe/Bratislava': 'SK', 'Europe/Budapest': 'HU',
    'Europe/Ljubljana': 'SI', 'Europe/Zagreb': 'HR', 'Europe/Athens': 'GR',
    'Europe/Bucharest': 'RO', 'Europe/Sofia': 'BG', 'Europe/Helsinki': 'FI',
    'Europe/Copenhagen': 'DK', 'Asia/Nicosia': 'CY', 'Europe/Malta': 'MT',
    'Europe/Paris': 'FR', 'Europe/Monaco': 'MC',
    'Europe/Rome': 'IT',
    'Europe/Madrid': 'ES', 'Europe/Lisbon': 'PT',
    'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE',
    'Europe/Stockholm': 'SE', 'Europe/Oslo': 'NO',
    'Europe/Warsaw': 'PL',
    'America/Toronto': 'CA', 'America/Vancouver': 'CA',
    'America/Edmonton': 'CA', 'America/Winnipeg': 'CA', 'America/Halifax': 'CA',
    'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
    'Australia/Brisbane': 'AU', 'Australia/Perth': 'AU', 'Australia/Adelaide': 'AU',
    'Pacific/Auckland': 'NZ',
    'America/Sao_Paulo': 'BR',
    'America/Mexico_City': 'MX',
    'Europe/Istanbul': 'TR',
    'Asia/Tokyo': 'JP',
    'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
    'Asia/Dubai': 'AE', 'Asia/Amman': 'JO', 'Asia/Beirut': 'LB',
    'Asia/Kuwait': 'KW', 'Asia/Qatar': 'QA', 'Asia/Bahrain': 'BH',
    'Asia/Muscat': 'OM',
    'Asia/Riyadh': 'SA',
    'Africa/Cairo': 'EG',
    'Asia/Singapore': 'SG', 'Asia/Kuala_Lumpur': 'MY',
    /* Present so the GA4 event can name them; they have no MARKET entry,
     * which is the point — these visitors are already on the right store. */
    'Asia/Jerusalem': 'IL', 'Asia/Tel_Aviv': 'IL', 'Asia/Gaza': 'PS',
    'Asia/Hebron': 'PS', 'Asia/Dhaka': 'BD', 'Asia/Tehran': 'IR',
    'Asia/Karachi': 'PK', 'Asia/Baghdad': 'IQ', 'Asia/Damascus': 'SY'
  };

  function country() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (TZ[tz]) return TZ[tz];
      if (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage)$/.test(tz)) return 'US';
    } catch (err) { /* Intl unavailable — fall through to language */ }

    var m = (navigator.language || '').match(/-([A-Z]{2})$/);
    return m ? m[1] : '';
  }

  var cc     = country();
  var market = MARKET[cc] || 'com';
  var tag    = TAGS[market];

  /* No tag for their market => the US link is still the best link we have. */
  if (!tag) market = 'com';

  function localise() {
    if (market === 'com') return 0;

    var links = document.querySelectorAll('a[href*="amazon.com/"]');
    var n = 0;

    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href') || '';
      var asin = href.match(/\/dp\/([A-Z0-9]{10})/);
      if (!asin) continue;

      links[i].setAttribute(
        'href',
        'https://www.amazon.' + market + '/dp/' + asin[1] + '?tag=' + TAGS[market]
      );
      n++;
    }
    return n;
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var rewritten = localise();

    /* Fires on every pageview, including the no-op case. That is the point:
     * it measures how much traffic sits in markets we cannot yet monetise,
     * which is the number that decides whether a locale signup is worth it. */
    if (typeof gtag === 'function') {
      gtag('event', 'market_detect', {
        visitor_country: cc || '(unknown)',
        marketplace:     market,
        monetised:       !!TAGS[market],
        links_localised: rewritten
      });
    }
  });

  /* ---------------------------------------------------------------
   * Click tracking
   * ------------------------------------------------------------- */

  function text(el) {
    return el ? el.textContent.trim().replace(/\s+/g, ' ') : '';
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var link = t.closest('a[href*="amazon."]');
    if (!link || typeof gtag !== 'function') return;

    var href = link.getAttribute('href') || '';
    var asin = href.match(/\/dp\/([A-Z0-9]{10})/);
    var card = link.closest('.pcard, .pick');
    var name = '';
    var tier = '';

    if (card) {
      if (card.classList.contains('pcard')) {
        name = text(card.querySelector('.pcard-name'));
        tier = text(card.querySelector('.pcard-tier'));
      } else {
        name = text(card.querySelector('h3'));
        tier = text(card.querySelector('.badge'));
      }
    }

    gtag('event', 'affiliate_click', {
      asin:         asin ? asin[1] : '(search)',
      product_name: name || '(unknown)',
      product_tier: tier || '(none)',
      link_url:     href,
      marketplace:  market
    });
  }, true);

})();
