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
  SUPABASE_ANON_KEY: ''
};
