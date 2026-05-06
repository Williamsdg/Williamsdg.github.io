/* ============================================
   Plainsman Art — Supabase Config
   Replace these placeholder values once the
   Plainsman Art Supabase project is created.
   While placeholders are in place the admin
   runs in MOCK MODE with in-memory data.
   ============================================ */

const SUPABASE_URL = 'https://YOUR-PLAINSMAN-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR-PLAINSMAN-ANON-KEY';

const PA_MOCK_MODE = SUPABASE_URL.includes('YOUR-PLAINSMAN-PROJECT');

let pa_db = null;
if (!PA_MOCK_MODE && window.supabase) {
  const { createClient } = window.supabase;
  pa_db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
