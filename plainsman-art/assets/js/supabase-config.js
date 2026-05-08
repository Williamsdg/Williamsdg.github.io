/* ============================================
   Plainsman Art — Supabase Config
   Replace these placeholder values once the
   Plainsman Art Supabase project is created.
   While placeholders are in place the admin
   runs in MOCK MODE with in-memory data.
   ============================================ */

const SUPABASE_URL = 'https://jsedmqwhqkodwqmqzoxb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzZWRtcXdocWtvZHdxbXF6b3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMDgwODEsImV4cCI6MjA5Mzc4NDA4MX0.g5lTSaePDr6Fy_iNDDX_yuwf11fhWAjuAPcFNGlR59M';

const PA_MOCK_MODE = SUPABASE_URL.includes('YOUR-PLAINSMAN-PROJECT');

let pa_db = null;
if (!PA_MOCK_MODE && window.supabase) {
  const { createClient } = window.supabase;
  pa_db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
