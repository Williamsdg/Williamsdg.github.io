/* Sword and Crown — the ONE place credentials go.
 *
 * Both the public website and the admin read this file. Paste the two values
 * from the Supabase project (Project Settings → API) and everything turns on.
 *
 * Both are safe to commit and safe to expose in a browser: the publishable /
 * anon key only ever grants what the row-level security policies in
 * admin/schema.sql allow, which is "read rows that have been published".
 *
 * NEVER put the service_role key here. It bypasses RLS entirely.
 *
 * While these stay empty:
 *   • the website renders its built-in sample content, exactly as it does today
 *   • the admin runs in preview mode, saving only to the current browser
 */
window.SC_CONFIG = {
  SUPABASE_URL: 'https://mqiahgfmvkslqtdfwzkq.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xaWFoZ2ZtdmtzbHF0ZGZ3emtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NDA3MzUsImV4cCI6MjEwODUxNjczNX0.PZ3mNJsRTIHfV4VLM-MoljzMl19C7Yi02kEaYVLCgSM',

  /* Stripe Payment Link for the $250 consultation deposit.
   * Create it in Stripe (Payment links -> new link, $250, one-off) and paste the
   * URL here. Until then the booking page holds the slot and tells the client a
   * payment link will be emailed - it never implies a card was charged. */
  DEPOSIT_PAYMENT_URL: '',

  // Vagaro booking widgets. Paste each embed snippet Vagaro generates (the
  // whole thing, <script> tag included) as a string. Empty = the page keeps
  // its call-or-text fallback. Keys match data-vagaro="…" on the pages.
  VAGARO_EMBEDS: {
    spa: '',        // head-spa.html — Constantina's books (no calendar yet — her $10/mo licence is Elana's call)
    // nano-brows.html — OFF (2026-10-28): tattoo services are Coming Soon until the city
    // approves the licence. Natalie's provider-widget snippet is kept in ~/.config/wd/sc-vagaro-build.md.
    consult: '',
    // consultation.html — business widget filtered to the Wig Consultations category (Elana, 90 min)
    wig: '<div id=\'frameTitle\' class=\'embedded-widget-title\' style=\'font-size: 23px; color: #333;font-family:Arial, Helvetica, sans-serif; line-height:24px; padding: 18px 10px 8px; text-align: center; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;\'></div>\n<div class="vagaro" style="width:250px; padding:0; border:0; margin:0 auto; text-align:center;"><style>.vagaro a {font-size:14px; color:#AAA; text-decoration:none;}</style><a href="https://www.vagaro.com/pro/">Powered by Vagaro</a>&nbsp;<a href="https://www.vagaro.com/pro/salon-software">Salon Software</a>,&nbsp;<a href="https://www.vagaro.com/pro/spa-software">Spa Software</a>&nbsp;&amp;&nbsp;<a href="https://www.vagaro.com/pro/fitness-software">Fitness Software</a><script type="text/javascript" defer src="https://www.vagaro.com//resources/WidgetEmbeddedLoader/OZqqEJ0nDZGcT3qmV35y79oz34mC2PeFJ4mC30m9dSycvCu7gevEhAJDXwOapcUbfYJExcUc9eS6XgQW?v=qYAvyHuaG8qL9hp8MBtwqaiSITHuHoFkTx9rNBpjhd4#"></scr'+'ipt></div>'
  },

  /* Shopify — the system of record for inventory.
   * SHOPIFY_DOMAIN is the store's own address, e.g. your-store.myshopify.com
   * (find it in the Shopify admin URL, not her custom domain).
   *
   * SHOPIFY_STOREFRONT_TOKEN is the PUBLIC Storefront API token. It is designed
   * to sit in browser JavaScript and can only read published products.
   * Shopify admin -> Settings -> Apps and sales channels -> Develop apps ->
   * Create an app -> Configure Storefront API scopes -> tick
   *   unauthenticated_read_product_listings
   *   unauthenticated_read_product_inventory
   * -> Install -> copy the Storefront API access token.
   *
   * This one comes from the Headless sales channel (Headless -> storefront ->
   * Storefront API -> Public access token). The "pretty" myshopify handle also
   * answers, but hmhe4p-ns is the store's real one.
   * NEVER put the Admin API token or the Headless PRIVATE token here. */
  SHOPIFY_DOMAIN: 'hmhe4p-ns.myshopify.com',
  SHOPIFY_STOREFRONT_TOKEN: '81671a15aca6ce673478955aed572422',
  SHOPIFY_API_VERSION: '2026-07'
};
