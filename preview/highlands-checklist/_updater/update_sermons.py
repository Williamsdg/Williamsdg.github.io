#!/usr/bin/env python3
"""
Auto-update the Highlands speakers checklist.

Reads the church's public podcast feeds, derives (year, month, title, speaker, kind)
for every episode, and upserts any NEW ones into the Supabase `highlands_sermons`
table. Existing rows are left untouched (insert-only on conflict).

Runs weekly via GitHub Actions. Needs two env vars:
  SUPABASE_URL              e.g. https://tkkhvbkocumyxpgsrpxv.supabase.co
  SUPABASE_SERVICE_ROLE_KEY  (repo secret — never commit this)
"""
import os, re, sys, json, urllib.request, xml.etree.ElementTree as ET

FEEDS = [
    ("https://feeds.churchofthehighlands.com/media/sunday/audio",  "sun"),
    ("https://feeds.churchofthehighlands.com/media/midweek/audio", "fw"),
]

MONTHS = {m: i for i, m in enumerate(
    ["", "jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"])}

def slug(s):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", s.lower())).strip("-")

def parse_pubdate(text):
    # RFC-822: "Wed, 04 Jun 2025 10:00:00 +0000"
    if not text:
        return None, None
    parts = text.split()
    try:
        # parts: [Wed,] DD Mon YYYY ...
        idx = 0
        if parts[0].endswith(","):
            idx = 1
        day = parts[idx]; mon = parts[idx+1][:3].lower(); year = int(parts[idx+2])
        return year, MONTHS.get(mon)
    except Exception:
        return None, None

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "highlands-checklist-updater/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

def itunes(el, tag):
    ns = "{http://www.itunes.com/dtds/podcast-1.0.dtd}"
    node = el.find(ns + tag)
    return node.text.strip() if node is not None and node.text else None

def collect():
    rows = []
    for url, kind in FEEDS:
        try:
            xml = fetch(url)
        except Exception as e:
            print(f"WARN: could not fetch {url}: {e}", file=sys.stderr)
            continue
        root = ET.fromstring(xml)
        for item in root.iter("item"):
            title = (item.findtext("title") or "").strip()
            if not title:
                continue
            # speaker: prefer itunes:author, then <author>, then "Highlands Team"
            speaker = itunes(item, "author") or (item.findtext("author") or "").strip() or "Highlands Team"
            speaker = re.sub(r"\s+", " ", speaker).strip()
            y, m = parse_pubdate(item.findtext("pubDate"))
            if not y or not m:
                continue
            rows.append({"year": y, "month": m, "title": title, "speaker": speaker, "kind": kind})
    return rows

def make_rows(raw):
    # assign a per (year,month) sequence for stable sort_key
    seen = {}
    out = []
    # process newest first so seq numbering is deterministic per run
    for r in sorted(raw, key=lambda r: (r["year"], r["month"]), reverse=True):
        key = (r["year"], r["month"])
        seen[key] = seen.get(key, 0) + 1
        seq = seen[key]
        sid = f'{r["year"]}-{r["month"]:02d}-{r["kind"]}-{slug(r["title"])}-{slug(r["speaker"])}'[:200]
        out.append({
            "id": sid,
            "year": r["year"], "month": r["month"],
            "title": r["title"], "speaker": r["speaker"], "kind": r["kind"],
            "sort_key": f'{r["year"]:04d}-{r["month"]:02d}-{seq:02d}',
        })
    return out

def upsert(rows, url, key):
    # insert-only: do nothing on id conflict so we never clobber sort_key of existing rows
    endpoint = f"{url}/rest/v1/highlands_sermons?on_conflict=id"
    body = json.dumps(rows).encode()
    req = urllib.request.Request(endpoint, data=body, method="POST", headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=ignore-duplicates,return=representation",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        inserted = json.loads(r.read() or b"[]")
        return inserted

def main():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        print("ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set", file=sys.stderr)
        sys.exit(1)

    raw = collect()
    if not raw:
        print("No items parsed from feeds; nothing to do.")
        return
    rows = make_rows(raw)
    inserted = upsert(rows, url, key)
    print(f"Feeds parsed: {len(rows)} items. Newly inserted: {len(inserted)}.")
    for s in inserted:
        print(f"  + {s['year']}-{s['month']:02d} [{s['kind']}] {s['title']} — {s['speaker']}")

if __name__ == "__main__":
    main()
