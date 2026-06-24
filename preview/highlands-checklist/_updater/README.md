# Highlands Checklist — auto-updater

Keeps the shared speakers checklist current by reading Church of the Highlands'
public podcast feeds each week and inserting any new sermons into Supabase.

## How it works

- **Frontend:** `preview/highlands-checklist/index.html` (GitHub Pages, free).
  Reads sermons + shared checkbox state from Supabase, syncs live via Realtime.
- **Database:** Supabase project `williams-digital-leadgen`
  (`tkkhvbkocumyxpgsrpxv`), tables `highlands_sermons` and `highlands_checks`
  in the `public` schema. No extra monthly cost.
- **Updater:** `update_sermons.py`, run weekly by the GitHub Action
  `.github/workflows/highlands-checklist-update.yml`.

The updater is **insert-only** (`on_conflict=id, resolution=ignore-duplicates`),
so it never overwrites or removes existing rows — it only adds genuinely new
messages as the church publishes them.

## One-time setup (required for the weekly auto-update)

The Action needs the Supabase **service-role** key (the anon/publishable key
can read the list and toggle checks, but is not allowed to add sermons).

1. In Supabase: **Project Settings → API → service_role key** (the secret one).
2. In GitHub, on this repo: **Settings → Secrets and variables → Actions →
   New repository secret**, add **both**:
   - `HIGHLANDS_SUPABASE_URL` = `https://tkkhvbkocumyxpgsrpxv.supabase.co`
   - `HIGHLANDS_SUPABASE_SERVICE_ROLE_KEY` = *(the service_role key)*
3. Done. It runs every Monday ~13:00 UTC, or trigger it manually any time from
   the **Actions** tab → *Highlands checklist — auto-update sermons* → **Run workflow**.

Until the secrets are added, the list still works perfectly — it just won't
auto-add brand-new sermons. The current archive (2016–2026) is already loaded.

## Run it locally

```bash
export SUPABASE_URL=https://tkkhvbkocumyxpgsrpxv.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=...   # service_role key
python3 update_sermons.py
```
