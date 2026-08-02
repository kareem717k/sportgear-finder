/**
 * SportGear Finder — Affiliate click tracking
 * Fires a GA4 `affiliate_click` event for every outbound Amazon link.
 * Handles both product layouts: .pcard (category pages) and .pick (articles).
 */
(function () {
  'use strict';

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
      link_url:     href
    });
  }, true);

})();
