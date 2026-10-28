/* Sword and Crown — Shopify Storefront API client.
 *
 * Shopify is the system of record for inventory: Elana already keeps her
 * jewellery and accessories there with photos and descriptions, and her
 * stylists will add wigs as they are washed and set. The website reads from
 * it rather than keeping a second copy that would immediately drift.
 *
 * The Storefront API token is PUBLIC and read-only by design — it is meant to
 * live in browser JavaScript. It can only read published products. It is not
 * the Admin API token, which must never appear here.
 *
 * Progressive enhancement, like everything else: with no credentials this file
 * does nothing and the pages keep the markup they ship with.
 */
window.SCShop = (function () {
  'use strict';

  var CFG = window.SC_CONFIG || {};
  var DOMAIN = CFG.SHOPIFY_DOMAIN || '';          // e.g. your-store.myshopify.com
  var TOKEN = CFG.SHOPIFY_STOREFRONT_TOKEN || '';
  /* Shopify supports a stable version for ~12 months, then silently serves the
     oldest supported one instead — so a stale pin drifts without erroring.
     Keep this within a year of today. */
  var VERSION = CFG.SHOPIFY_API_VERSION || '2026-07';
  var LIVE = !!(DOMAIN && TOKEN);

  function gql(query, variables) {
    if (!LIVE) return Promise.resolve(null);
    return fetch('https://' + DOMAIN + '/api/' + VERSION + '/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN
      },
      body: JSON.stringify({ query: query, variables: variables || {} })
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (j) {
        /* Shopify returns BOTH `data` and `errors` when a single field is
           denied — `quantityAvailable` and `totalInventory` raise ACCESS_DENIED
           unless the token carries `unauthenticated_read_product_inventory`.
           Throwing here would blank the entire shop over one inaccessible
           field, so keep whatever came back and only fail when there is
           genuinely nothing to use. */
        if (j.errors && j.errors.length) {
          if (window.console) {
            console.warn('[sc-shopify] partial response — ' +
              j.errors.map(function (e) { return e.message; }).join(' | '));
          }
          if (!j.data) throw new Error(j.errors[0].message);
        }
        return j.data;
      })
      .catch(function (e) {
        // Never blank a page because the shop is unreachable.
        if (window.console) console.warn('[sc-shopify]', e.message);
        return null;
      });
  }

  /* Her spec fields live in metafields so each value lands in its own slot on
     the page rather than being buried in a description paragraph. */
  var WIG_KEYS = ['cap_construction', 'cap_size', 'length', 'texture', 'density', 'colour', 'bangs'];
  var CLOTHING_KEYS = ['size_range', 'fit', 'fabric', 'model_height', 'care'];
  var ALL_KEYS = WIG_KEYS.concat(CLOTHING_KEYS);

  function metafieldIdents() {
    return ALL_KEYS.map(function (k) {
      return '{namespace:"specs",key:"' + k + '"}';
    }).join(',');
  }

  var PRODUCT_FIELDS = '\
    id handle title description availableForSale totalInventory\
    productType tags vendor\
    priceRange{minVariantPrice{amount currencyCode}}\
    compareAtPriceRange{minVariantPrice{amount currencyCode}}\
    featuredImage{url altText width height}\
    images(first:8){nodes{url altText width height}}\
    variants(first:1){nodes{id availableForSale quantityAvailable}}\
    metafields(identifiers:[' + metafieldIdents() + ']){key value}';

  function shape(node) {
    if (!node) return null;
    var specs = {};
    (node.metafields || []).forEach(function (m) {
      if (m && m.value) specs[m.key] = m.value;
    });
    var price = node.priceRange && node.priceRange.minVariantPrice;
    return {
      id: node.id,
      handle: node.handle,
      title: node.title,
      description: node.description,
      type: node.productType || '',
      tags: node.tags || [],
      available: !!node.availableForSale,
      stock: node.totalInventory,
      price: price ? Number(price.amount) : null,
      currency: price ? price.currencyCode : 'USD',
      image: node.featuredImage || null,
      images: (node.images && node.images.nodes) || [],
      variantId: node.variants && node.variants.nodes[0] && node.variants.nodes[0].id,
      specs: specs,
      /* Her clothing fit indicator: Runs small / True to size / Runs large.
         Returned as a 0, 1 or 2 so the slider can position itself. */
      fitIndex: (function () {
        var f = (specs.fit || '').toLowerCase();
        if (f.indexOf('small') > -1) return 0;
        if (f.indexOf('large') > -1) return 2;
        if (f) return 1;
        return null;
      })()
    };
  }

  var CART_FIELDS = 'id checkoutUrl totalQuantity cost{subtotalAmount{amount currencyCode}}' +
    'lines(first:100){nodes{id quantity merchandise{... on ProductVariant{id title ' +
    'price{amount currencyCode} image{url altText} product{title handle}}}}}';
  function toLines(lines) {
    return (lines || []).map(function (l) { return { merchandiseId: l.variantId, quantity: l.qty || 1 }; });
  }
  function cartOf(field) {
    return function (d) {
      var r = d && d[field];
      if (!r) return null;
      if (r.userErrors && r.userErrors.length && window.console) {
        console.warn('[sc-shopify] ' + field + ': ' + r.userErrors.map(function (e) { return e.message; }).join(' | '));
      }
      return r.cart || null;
    };
  }

  return {
    live: LIVE,
    domain: DOMAIN,
    wigKeys: WIG_KEYS,
    clothingKeys: CLOTHING_KEYS,

    /* `filter` is Shopify search syntax, e.g. "product_type:Wigs".
     *
     * Shopify returns at most 250 nodes per page. Elana expects 150–200
     * products at launch and growing (2026-10-20), so a single page would
     * quietly truncate the collection — and the filters are built from
     * whatever we fetched, so she would be filtering only part of her own
     * catalogue with nothing anywhere reporting it. Page until Shopify says
     * there is no more.
     */
    products: function (filter, limit) {
      var want = limit || 1000;   // her store passed 250 on 2026-10-27; 4 pages max
      var out = [];
      function page(after) {
        return gql(
          'query($n:Int!,$q:String,$after:String){products(first:$n,query:$q,after:$after,' +
          'sortKey:CREATED_AT,reverse:true){pageInfo{hasNextPage endCursor}' +
          'nodes{' + PRODUCT_FIELDS + '}}}',
          { n: Math.min(want - out.length, 250), q: filter || null, after: after || null }
        ).then(function (d) {
          /* A first page that fails is a failure (null, so the caller shows the
             can't-load state). A later page that fails keeps what we already
             have rather than throwing the whole collection away. */
          if (!d || !d.products) return out.length ? out : null;
          out = out.concat(d.products.nodes.map(shape));
          var pi = d.products.pageInfo;
          if (pi && pi.hasNextPage && out.length < want) return page(pi.endCursor);
          return out;
        });
      }
      return page(null);
    },

    /* Resolves to the product, `null` when the handle genuinely isn't in the
       catalogue, or `false` when the request itself failed — the caller must
       not tell a visitor a piece doesn't exist because our shop is down. */
    product: function (handle) {
      return gql(
        'query($h:String!){product(handle:$h){' + PRODUCT_FIELDS + '}}',
        { h: handle }
      ).then(function (d) {
        if (d === null) return false;
        return d.product ? shape(d.product) : null;
      });
    },

    collection: function (handle, limit) {
      return gql(
        'query($h:String!,$n:Int!){collection(handle:$h){title products(first:$n)' +
        '{nodes{' + PRODUCT_FIELDS + '}}}}',
        { h: handle, n: limit || 250 }
      ).then(function (d) {
        if (!d || !d.collection) return null;
        return { title: d.collection.title, products: d.collection.products.nodes.map(shape) };
      });
    },

    /* ── the bag ──────────────────────────────────────────────────────
       Shopify's Cart API, so a visitor can put several pieces in one bag
       across pages. The cart id is kept in localStorage by sc-cart.js; Shopify
       keeps the cart itself for ~10 days. Each call resolves to the cart, or
       `null` when the request failed or the cart no longer exists. */
    cartCreate: function (lines) {
      return gql('mutation($lines:[CartLineInput!]!){cartCreate(input:{lines:$lines}){cart{' + CART_FIELDS + '}userErrors{message}}}',
        { lines: toLines(lines) }).then(cartOf('cartCreate'));
    },
    cartGet: function (id) {
      return gql('query($id:ID!){cart(id:$id){' + CART_FIELDS + '}}', { id: id })
        .then(function (d) { return d && d.cart ? d.cart : null; });
    },
    cartAdd: function (id, lines) {
      return gql('mutation($id:ID!,$lines:[CartLineInput!]!){cartLinesAdd(cartId:$id,lines:$lines){cart{' + CART_FIELDS + '}userErrors{message}}}',
        { id: id, lines: toLines(lines) }).then(cartOf('cartLinesAdd'));
    },
    cartUpdate: function (id, lineId, qty) {
      return gql('mutation($id:ID!,$lines:[CartLineUpdateInput!]!){cartLinesUpdate(cartId:$id,lines:$lines){cart{' + CART_FIELDS + '}userErrors{message}}}',
        { id: id, lines: [{ id: lineId, quantity: qty }] }).then(cartOf('cartLinesUpdate'));
    },
    cartRemove: function (id, lineId) {
      return gql('mutation($id:ID!,$ids:[ID!]!){cartLinesRemove(cartId:$id,lineIds:$ids){cart{' + CART_FIELDS + '}userErrors{message}}}',
        { id: id, ids: [lineId] }).then(cartOf('cartLinesRemove'));
    },

    /* Checkout stays on Shopify — it is PCI compliant and already configured.
       We hand the basket over rather than rebuilding payments. */
    checkoutUrl: function (lines) {
      if (!DOMAIN) return null;
      var parts = (lines || []).map(function (l) {
        return String(l.variantId).split('/').pop() + ':' + (l.qty || 1);
      });
      return 'https://' + DOMAIN + '/cart/' + parts.join(',');
    }
  };
})();
