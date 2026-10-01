/* Sword and Crown — public-site data layer.
 *
 * Progressive enhancement, deliberately. With no credentials in sc-config.js
 * this file does nothing at all and every page renders exactly the markup it
 * ships with. Once the Supabase project exists and the keys are pasted in, the
 * same pages hydrate from the database instead.
 *
 * That means the site is never broken by a missing backend, and never shows an
 * empty shop because a network call failed — it falls back to what is already
 * in the HTML.
 */
window.SC = (function () {
  'use strict';

  var CFG = window.SC_CONFIG || {};
  var LIVE = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
  var REST = LIVE ? CFG.SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/' : null;

  function get(path) {
    if (!LIVE) return Promise.resolve(null);
    return fetch(REST + path, {
      headers: {
        apikey: CFG.SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + CFG.SUPABASE_ANON_KEY,
        Accept: 'application/json'
      }
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).catch(function (e) {
      // Never let a data problem blank out a page.
      if (window.console) console.warn('[sc-data]', path, e.message);
      return null;
    });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function money(cents) {
    if (cents == null) return null;
    var whole = cents % 100 === 0;
    return '$' + (cents / 100).toLocaleString(undefined, {
      minimumFractionDigits: whole ? 0 : 2, maximumFractionDigits: 2
    });
  }

  /* Minimal markdown — headings, bold, italic, links, paragraphs.
     Everything is escaped first, so article bodies can never inject HTML. */
  function markdown(src) {
    if (!src) return '';
    var blocks = esc(src).replace(/\r\n/g, '\n').split(/\n{2,}/);
    return blocks.map(function (b) {
      b = b.trim();
      if (!b) return '';
      var m = b.match(/^(#{2,4})\s+(.*)$/);
      if (m) {
        var lvl = Math.min(m[1].length + 1, 5);
        return '<h' + lvl + '>' + inline(m[2]) + '</h' + lvl + '>';
      }
      if (/^[-*]\s+/m.test(b) && b.split('\n').every(function (l) { return /^[-*]\s+/.test(l.trim()); })) {
        return '<ul>' + b.split('\n').map(function (l) {
          return '<li>' + inline(l.trim().replace(/^[-*]\s+/, '')) + '</li>';
        }).join('') + '</ul>';
      }
      return '<p>' + inline(b).replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }

  function inline(t) {
    return t
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
    }

  var api = {
    live: LIVE,
    esc: esc,
    money: money,
    markdown: markdown,

    products: function (category) {
      var q = 'products?select=*&published=eq.true&order=sort.asc,created_at.desc';
      if (category && category !== 'all') q += '&category=eq.' + encodeURIComponent(category);
      return get(q);
    },

    articles: function (kind, limit) {
      var q = 'articles?select=*&published=eq.true&kind=eq.' + encodeURIComponent(kind) +
              '&order=published_at.desc';
      if (limit) q += '&limit=' + limit;
      return get(q);
    },

    article: function (kind, slug) {
      return get('articles?select=*&published=eq.true&kind=eq.' +
        encodeURIComponent(kind) + '&slug=eq.' + encodeURIComponent(slug) + '&limit=1')
        .then(function (rows) { return rows && rows[0] ? rows[0] : null; });
    },

    setting: function (key) {
      return get('settings?select=value&key=eq.' + encodeURIComponent(key) + '&limit=1')
        .then(function (rows) { return rows && rows[0] ? rows[0].value : null; });
    },

    /* Replace a node's contents only when there is real content to replace it
       with. Used everywhere below so a failed call leaves the page intact. */
    swap: function (node, html) {
      if (node && html) node.innerHTML = html;
    }
  };

  /* ───────────── shared hydration that runs on every page ───────────── */
  if (LIVE) {
    document.addEventListener('DOMContentLoaded', function () {
      // Footer: phone, hours, booking links
      api.setting('contact').then(function (c) {
        if (!c) return;
        if (c.phone) {
          document.querySelectorAll('[data-sc="phone"]').forEach(function (n) {
            n.textContent = c.phone;
            if (n.tagName === 'A') n.href = 'tel:' + c.phone.replace(/[^0-9+]/g, '');
          });
        }
        if (c.hours) {
          document.querySelectorAll('[data-sc="hours"]').forEach(function (n) {
            n.innerHTML = esc(c.hours).replace(/\n/g, '<br>');
          });
        }
        if (c.booking_url) {
          document.querySelectorAll('[data-sc="book"]').forEach(function (n) {
            n.href = c.booking_url;
            n.setAttribute('target', '_blank');
            n.setAttribute('rel', 'noopener');
          });
        }
      });
    });
  }

  return api;
})();
