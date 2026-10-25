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
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',

  /* Stripe Payment Link for the $250 consultation deposit.
   * Create it in Stripe (Payment links -> new link, $250, one-off) and paste the
   * URL here. Until then the booking page holds the slot and tells the client a
   * payment link will be emailed - it never implies a card was charged. */
  DEPOSIT_PAYMENT_URL: '',

  // Vagaro booking widgets. Paste each embed snippet Vagaro generates (the
  // whole thing, <script> tag included) as a string. Empty = the page keeps
  // its call-or-text fallback. Keys match data-vagaro="…" on the pages.
  VAGARO_EMBEDS: {
    spa: '',        // head-spa.html — Constantina's books
    consult: '',    // nano-brows.html — Natalie's consultation calendar
    wig: ''         // consultation.html — Elana's 90-minute wig consultations
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
   * NEVER put the Admin API token here. That one can read orders and customers. */
  SHOPIFY_DOMAIN: 'sword-and-crown-salon-and-studio.myshopify.com',
  SHOPIFY_STOREFRONT_TOKEN: '',
  SHOPIFY_API_VERSION: '2026-07'
};
