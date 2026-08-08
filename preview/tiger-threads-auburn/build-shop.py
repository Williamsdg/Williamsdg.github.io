#!/usr/bin/env python3
"""Regenerate the Tiger Threads shop from Sherrie's own data.

Pulls products from the shared Product Info list (Supabase) and photos from
the Product Uploads Drive folder, matches them by name / style number,
downloads + optimizes any new photos into img/products/, and rewrites
shop-data.js. Run it any time Sherrie adds products, then commit:

    python3 build-shop.py
    git add img/products/ shop-data.js && git commit -m "shop refresh" && git push

Photos are matched to products by 5-digit style number when present,
otherwise by word overlap between the product name and the file name.
Products without a photo still appear (monogram tile). Photos without a
product entry are reported so Sherrie can be nudged to fill in the info.
"""
import json, re, subprocess, sys, unicodedata, urllib.request
from html import unescape
from pathlib import Path

BASE = Path(__file__).parent
SUPABASE = "https://tkkhvbkocumyxpgsrpxv.supabase.co/rest/v1"
ANON = "sb_publishable_4_xgRNDnzXimaykbC6YBwg_E2aYxgzz"  # publishable key, safe in-page
FOLDER = "1zGpjRFgc_zQUFQNhwx-eZB6I-EFFfSRT"  # Product Uploads drop-box (link-shared)
STOP = {"the", "a", "with", "on", "in", "and", "of"}


def fetch(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    return urllib.request.urlopen(req, timeout=60).read()


def tokens(s):
    s = s.replace("&", " and ").replace("'", "")
    s = re.sub(r"[^a-z0-9]+", " ", s.lower())
    out = set()
    for t in s.split():
        if t in STOP or t.isdigit():
            continue
        out.add(t[:-1] if t.endswith("s") and len(t) > 3 else t)
    return out


def style_no(s):
    m = re.search(r"\b(\d{5})\b", s)
    return m.group(1) if m else None


def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def category(name):
    n = name.lower()
    if "earring" in n: return "Earrings"
    if "sweatshirt" in n or "sweater" in n: return "Sweatshirts & Sweaters"
    if "pajama" in n or "set" in n: return "Sets & Pajamas"
    if "dress" in n: return "Dresses"
    if "top" in n or "tee" in n or "shirt" in n: return "Tops"
    return "More"


def display_name(name):
    # "Earrings Auburn Drop 75750" -> ("Earrings Auburn Drop", "75750")
    num = style_no(name)
    if num:
        name = re.sub(r"\s*\b%s\b\s*" % num, " ", name).strip()
    return re.sub(r"\s{2,}", " ", name), num


def main():
    hdrs = {"apikey": ANON, "Authorization": "Bearer " + ANON}
    products = json.loads(fetch(
        SUPABASE + "/tt_products?select=name,cost,sizes,description,created_at&order=created_at",
        hdrs))
    listing = fetch("https://drive.google.com/embeddedfolderview?id=" + FOLDER).decode("utf-8", "replace")
    entries = re.findall(r'id="entry-([\w-]+)".*?flip-entry-title">([^<]+)', listing, re.S)
    files = {unescape(n).strip(): i for i, n in entries if "folder" not in unescape(n).lower()}
    print(f"{len(products)} products in the shared list, {len(files)} files in Product Uploads")

    # ---- match photos to products (style number first, then best word overlap)
    assigned, matches = set(), {}
    by_style = {style_no(f): f for f in files if style_no(f)}
    for p in products:
        num = style_no(p["name"])
        if num and num in by_style:
            matches[p["name"]] = by_style[num]
            assigned.add(by_style[num])
    pairs = []
    for p in products:
        if p["name"] in matches:
            continue
        pt = tokens(p["name"])
        for f in files:
            score = len(pt & tokens(f)) / max(len(pt), 1)
            if score >= 0.5:
                pairs.append((score, p["name"], f))
    for score, pname, fname in sorted(pairs, reverse=True):
        if pname not in matches and fname not in assigned:
            matches[pname] = fname
            assigned.add(fname)

    # ---- download + optimize any photos we don't have yet
    imgdir = BASE / "img" / "products"
    imgdir.mkdir(parents=True, exist_ok=True)
    data = []
    for p in products:
        disp, num = display_name(p["name"])
        rec = {"name": disp, "style": num,
               "price": re.sub(r"\.0+$", "", p["cost"] or ""),
               "sizes": (p["sizes"] or "").strip().rstrip(","),
               "desc": (p["description"] or "").strip(),
               "cat": category(p["name"]), "img": None}
        fname = matches.get(p["name"])
        if fname:
            dest = imgdir / (slugify(disp) + ".jpg")
            if not dest.exists():
                raw = imgdir / ("_raw_" + slugify(disp))
                raw.write_bytes(fetch("https://drive.google.com/uc?export=download&id=" + files[fname]))
                r = subprocess.run(["sips", "-Z", "900", "-s", "format", "jpeg",
                                    "-s", "formatOptions", "80", str(raw), "-o", str(dest)],
                                   capture_output=True, text=True)
                raw.unlink()
                if r.returncode != 0:
                    print(f"  !! sips failed for {fname}: {r.stderr.strip()}", file=sys.stderr)
                    continue
                print(f"  + {dest.name}  ({fname})")
            rec["img"] = "img/products/" + dest.name
        data.append(rec)

    (BASE / "shop-data.js").write_text(
        "// GENERATED by build-shop.py — do not hand-edit. Rerun the script instead.\n"
        "window.TT_PRODUCTS = " + json.dumps(data, indent=1) + ";\n")
    no_photo = [d["name"] for d in data if not d["img"]]
    orphans = sorted(set(files) - assigned)
    print(f"\nWrote shop-data.js with {len(data)} products "
          f"({sum(1 for d in data if d['img'])} with photos)")
    if no_photo:
        print("Products still needing a photo: " + "; ".join(no_photo))
    if orphans:
        print("Photos with no product info yet (ask Sherrie to add them on the uploads page): "
              + "; ".join(orphans))


if __name__ == "__main__":
    main()
