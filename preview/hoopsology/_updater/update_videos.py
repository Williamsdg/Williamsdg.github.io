#!/usr/bin/env python3
"""Pull Hoopsology's latest episodes + Shorts from YouTube into data/videos.json.

Runs on a schedule (GitHub Actions) — no API key needed. Sources:
  * RSS feeds for the channel's long-form (UULF) and Shorts (UUSH) uploads
  * the channel's /videos and /shorts pages, to backfill past the RSS 15-item cap
  * each new video's watch page, once, for publish date / length / description

Existing entries are merged, never dropped, so the archive only grows.
Prints CHANGED or UNCHANGED so the workflow knows whether to redeploy.
"""
import json, re, sys, html, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

CHANNEL_ID = "UCmng9ebKT9BMcuBLEVhAWFQ"
HANDLE = "hoopsologypodcast"
OUT = Path(__file__).resolve().parent.parent / "data" / "videos.json"
UA = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126 Safari/537.36", "Accept-Language": "en-US,en;q=0.9"}
NS = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015",
      "media": "http://search.yahoo.com/mrss/"}
MAX_WATCH_FETCHES = 40


def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def feed(prefix):
    xml = get(f"https://www.youtube.com/feeds/videos.xml?playlist_id={prefix}{CHANNEL_ID[2:]}")
    out = []
    for e in ET.fromstring(xml).findall("a:entry", NS):
        g = e.find("media:group", NS)
        stats = g.find("media:community/media:statistics", NS) if g is not None else None
        out.append({
            "id": e.findtext("yt:videoId", namespaces=NS),
            "title": e.findtext("a:title", namespaces=NS),
            "published": e.findtext("a:published", namespaces=NS),
            "description": (g.findtext("media:description", namespaces=NS) if g is not None else "") or "",
            "views": int(stats.get("views")) if stats is not None and stats.get("views") else None,
        })
    return out


def page_ids(tab):
    try:
        return list(dict.fromkeys(re.findall(r'"videoId":"([\w-]{11})"', get(f"https://www.youtube.com/@{HANDLE}/{tab}"))))
    except Exception as ex:  # page scraping is best-effort; RSS is the source of truth
        print(f"warn: /{tab} scrape failed: {ex}", file=sys.stderr)
        return []


def watch_details(vid):
    page = get(f"https://www.youtube.com/watch?v={vid}")
    def grab(pat):
        m = re.search(pat, page)
        return m.group(1) if m else None
    title = grab(r'"videoDetails":\{.*?"title":"((?:[^"\\]|\\.)*)"')
    desc = grab(r'"shortDescription":"((?:[^"\\]|\\.)*)"')
    return {
        "title": json.loads(f'"{title}"') if title else None,
        "description": json.loads(f'"{desc}"') if desc else None,
        "published": grab(r'"publishDate":"([^"]+)"'),
        "seconds": int(grab(r'"lengthSeconds":"(\d+)"') or 0) or None,
        "views": int(grab(r'"viewCount":"(\d+)"') or 0) or None,
    }


def signature(data):
    return json.dumps([(v["id"], v.get("title"), v.get("seconds")) for k in ("episodes", "shorts")
                       for v in data.get(k, [])])


def main():
    data = json.loads(OUT.read_text()) if OUT.exists() else {"episodes": [], "shorts": []}
    before = signature(data)
    lists = {"episodes": {v["id"]: v for v in data.get("episodes", [])},
             "shorts": {v["id"]: v for v in data.get("shorts", [])}}

    for key, prefix, tab in (("episodes", "UULF", "videos"), ("shorts", "UUSH", "shorts")):
        bucket = lists[key]
        other = lists["shorts" if key == "episodes" else "episodes"]
        for v in feed(prefix):
            bucket.setdefault(v["id"], {"id": v["id"]}).update({k: x for k, x in v.items() if x not in (None, "")})
        for vid in page_ids(tab):
            if vid not in bucket and vid not in other:
                bucket[vid] = {"id": vid}

    fetched = 0
    for bucket in lists.values():
        for v in bucket.values():
            if fetched >= MAX_WATCH_FETCHES:
                break
            if v.get("published") and v.get("seconds") and v.get("title"):
                continue
            try:
                d = watch_details(v["id"]); fetched += 1
                for k, x in d.items():
                    if x and (k in ("seconds",) or not v.get(k)):
                        v[k] = x
            except Exception as ex:
                print(f"warn: watch {v['id']}: {ex}", file=sys.stderr)

    def clean(bucket):
        vs = [v for v in bucket.values() if v.get("title")]
        for v in vs:
            v["title"] = html.unescape(v["title"])
        return sorted(vs, key=lambda v: v.get("published") or "", reverse=True)

    data["episodes"], data["shorts"] = clean(lists["episodes"]), clean(lists["shorts"])
    stale = (datetime.now(timezone.utc) - datetime.fromisoformat(
        (data.get("updated") or "2000-01-01T00:00:00Z").replace("Z", "+00:00"))).days >= 1
    if signature(data) == before and not stale:  # view counts alone refresh at most daily
        print("UNCHANGED"); return
    data["channel"] = {**data.get("channel", {}), "id": CHANNEL_ID, "handle": HANDLE}
    try:
        m = re.search(r'"([\d.,]+[KM]?) subscribers"', get(f"https://www.youtube.com/@{HANDLE}"))
        if m:
            data["channel"]["subscribers"] = m.group(1)
    except Exception as ex:
        print(f"warn: subscriber count: {ex}", file=sys.stderr)
    data["updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=1, ensure_ascii=False))
    print(f"CHANGED episodes={len(data['episodes'])} shorts={len(data['shorts'])}")


if __name__ == "__main__":
    main()
