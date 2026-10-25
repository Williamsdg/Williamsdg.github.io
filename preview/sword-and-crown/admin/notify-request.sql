-- Sword and Crown — fire notify-request on every new styling request.
-- Run AFTER the edge function is deployed. Replace the two placeholders.
-- (pg_net / supabase_functions.http_request ships enabled on new projects.)

drop trigger if exists notify_request on public.requests;
create trigger notify_request
  after insert on public.requests
  for each row
  execute function supabase_functions.http_request(
    'https://<PROJECT_REF>.supabase.co/functions/v1/notify-request',
    'POST',
    '{"Content-Type":"application/json","x-notify-secret":"<NOTIFY_SECRET>"}',
    '{}',
    '5000'
  );
-- The payload Supabase sends is {type, table, schema, record, old_record},
-- which is exactly what index.ts reads. Bookings no longer go through this
-- table — they live in Vagaro, which sends its own confirmations.
