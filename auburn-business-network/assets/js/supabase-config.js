/* ============================================
   Auburn Business Network - Supabase Config
   ============================================ */

const SUPABASE_URL = 'https://ushenraaxcxsxeimhsca.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaGVucmFheGN4c3hlaW1oc2NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTkwMDgsImV4cCI6MjA4OTg5NTAwOH0.bSpkZYBbLyJOuzPrQwA88EQivK4TSWHlHljK8yzrTOU';

const { createClient } = window.supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
