/* Sword and Crown — publishing system configuration.
 *
 * Paste the two values below from the Supabase project
 * (Project Settings → API). Both are safe to commit and safe to expose in a
 * browser: the publishable/anon key only ever grants what the row-level
 * security policies in schema.sql allow, which is "read published rows".
 *
 * NEVER put the service_role key in this file. It bypasses RLS entirely.
 *
 * While these stay empty the admin runs in PREVIEW MODE: it works, but every
 * change is kept in this browser only and never reaches the website.
 */
window.SC_CONFIG = {
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: ''
};
