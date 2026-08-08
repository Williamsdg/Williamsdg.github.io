#!/usr/bin/env python3
"""Regenerate the Tiger Threads shop from Sherrie's own data.

Pulls products from the shared Product Info list (Supabase) and photos from
the Product Uploads Drive folder, matches them by name / style number,
downloads + optimizes any new photos into img/products/, and rewrites:

  shop-data.js           -> feeds shop.html + the homepage featured grid
  shopify-products.csv   -> full Shopify import file (Products > Import)

It also checks the Tiger Threads Shopify store (SHOPIFY_DOMAIN). While the
store is password-protected the storefront API returns 401 and cards keep
their "Message to claim" fallback. Once the store is live, rerunning this
script matches each product to its Shopify listing (handles match the CSV)
and every card becomes a real "Order Online" button with live availability.

Run it any time Sherrie adds products, then commit:

    python3 build-shop.py
    git add img/products/ shop-data.js shopify-products.csv && git commit -m "shop refresh" && git push

Notes:
- Photos are downloaded once per product; to refresh a photo Sherrie replaced
  in Drive, delete img/products/<slug>.jpg and rerun.
- Once the store is LIVE, shopify-products.csv is for first-time import only:
  re-importing overwrites live Shopify inventory with the shared-list counts.
"""
import csv, json, re, subprocess, sys, unicodedata, urllib.error, urllib.request
from html import unescape
from pathlib import Path

BASE = Path(__file__).parent
SUPABASE = "https://tkkhvbkocumyxpgsrpxv.supabase.co/rest/v1"
ANON = "sb_publishable_4_xgRNDnzXimaykbC6YBwg_E2aYxgzz"  # publishable key, safe in-page
FOLDER = "1zGpjRFgc_zQUFQNhwx-eZB6I-EFFfSRT"  # Product Uploads drop-box (link-shared)
SHOPIFY_DOMAIN = "tigerthreadsauburn.myshopify.com"  # Sherrie's store (pre-launch = 401)
SITE_BASE = "https://williamsdigital.io/preview/tiger-threads-auburn/"  # absolute image URLs for the CSV
STOP = {"the", "a", "with", "on", "in", "and", "of"}


def fetch(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {"User-Agent": "tiger-threads-build/1.0"})
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


def canon_size(s):
    """Normalize size labels so 'XXL' and '2XL' compare equal."""
    s = s.strip().upper().rstrip(";")
    m = re.fullmatch(r"(X{2,})L", s)          # XXL -> 2X, XXXL -> 3X
    if m:
        return f"{len(m.group(1))}X"
    m = re.fullmatch(r"(\d)XL?", s)           # 2XL / 2X -> 2X
    if m:
        return f"{m.group(1)}X"
    return s


def parse_variants(sizes, qty):
    """Return [(size_label, qty_int_or_None), ...] from Sherrie's free-text fields."""
    sizes = (sizes or "").strip().rstrip(",")
    qty = (qty or "").strip()
    pairs = re.findall(r"([A-Za-z0-9]+)\s*:\s*(\d+)", qty)
    by_canon = {canon_size(k): int(v) for k, v in pairs}
    if re.fullmatch(r"one\s*size", sizes, re.I) or not sizes:
        n = re.fullmatch(r"(\d+)", qty)
        return [("One Size", int(n.group(1)) if n else (sum(by_canon.values()) or None))]
    labels = [s.strip() for s in sizes.split(",") if s.strip()]
    out, used = [], set()
    for lab in labels:
        c = canon_size(lab)
        out.append((lab, by_canon.get(c)))
        used.add(c)
    for c, n in by_canon.items():             # qty sizes missing from the sizes list
        if c not in used:
            out.append((c, n))
    return out


def qty_warnings(name, qty_raw, variants):
    """Flag inventory strings that likely hide a typo before they reach Shopify."""
    out = []
    for label, n in variants:
        if n is not None and n > 100:
            out.append(f"{name}: size {label} count {n} looks implausible — confirm before importing")
    if re.search(r"\d\s+[A-Za-z0-9]+\s*:", qty_raw or ""):
        out.append(f"{name}: possible missing comma in inventory \"{qty_raw.strip()}\" — counts may be fused")
    return out


def write_shopify_csv(data, path):
    cols = ["Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
            "Option1 Name", "Option1 Value", "Variant SKU", "Variant Inventory Tracker",
            "Variant Inventory Qty", "Variant Inventory Policy", "Variant Fulfillment Service",
            "Variant Price", "Variant Requires Shipping", "Variant Taxable",
            "Image Src", "Image Position", "Status"]
    warnings = []
    with open(path, "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=cols)
        w.writeheader()
        for p in data:
            variants = parse_variants(p["sizes_raw"], p["qty_raw"])
            warnings += qty_warnings(p["name"], p["qty_raw"], variants)
            if not re.fullmatch(r"\d+(\.\d{1,2})?", p["price_csv"] or ""):
                warnings.append(f"{p['name']}: price \"{p['price_csv']}\" is not a clean number — "
                                "Shopify would list it at $0.00; fix the cost on the uploads page")
            single = len(variants) == 1 and re.fullmatch(r"one\s*size", variants[0][0], re.I)
            for i, (label, n) in enumerate(variants):
                if n is None:
                    warnings.append(f"{p['name']}: no inventory count for size {label} (imported as 0)")
                row = {"Handle": p["slug"],
                       "Option1 Value": "Default Title" if single else label,
                       "Variant SKU": p["style"] or "",
                       "Variant Inventory Tracker": "shopify",
                       "Variant Inventory Qty": n if n is not None else 0,
                       "Variant Inventory Policy": "deny",
                       "Variant Fulfillment Service": "manual",
                       "Variant Price": p["price_csv"],
                       "Variant Requires Shipping": "TRUE", "Variant Taxable": "TRUE"}
                if i == 0:
                    body = "<br>".join(esc_html(line) for line in p["desc"].splitlines() if line.strip())
                    row.update({"Title": p["name"], "Body (HTML)": body,
                                "Vendor": "Tiger Threads", "Type": p["cat"],
                                "Tags": "Auburn, " + p["cat"], "Published": "TRUE",
                                "Option1 Name": "Title" if single else "Size",
                                "Status": "active"})
                    if p["img"]:
                        row.update({"Image Src": SITE_BASE + p["img"], "Image Position": 1})
                w.writerow(row)
    return warnings


def esc_html(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def drive_listing():
    """Return ({filename: id}, [subfolder names]) — folders detected by link, not name."""
    listing = fetch("https://drive.google.com/embeddedfolderview?id=" + FOLDER).decode("utf-8", "replace")
    files, folders = {}, []
    for fid, block in re.findall(r'id="entry-([\w-]+)"(.*?)(?=id="entry-|$)', listing, re.S):
        m = re.search(r'flip-entry-title">([^<]+)', block)
        if not m:
            continue
        name = unescape(m.group(1)).strip()
        if "/drive/folders/" in block or "/folders/" in block:
            folders.append(name)
        else:
            files[name] = fid
    return files, folders


def shopify_live_products():
    """Return {handle: product} from the live storefront, or None while locked."""
    try:
        raw = fetch(f"https://{SHOPIFY_DOMAIN}/products.json?limit=250")
        return {p["handle"]: p for p in json.loads(raw).get("products", [])}
    except urllib.error.HTTPError as e:
        print(f"Shopify store check: HTTP {e.code} — "
              + ("store is still password-protected; cards keep the message fallback"
                 if e.code in (401, 403) else "could not read storefront"))
    except Exception as e:
        print(f"Shopify store check failed ({e}); cards keep the message fallback")
    return None


def main():
    hdrs = {"apikey": ANON, "Authorization": "Bearer " + ANON}
    products = json.loads(fetch(
        SUPABASE + "/tt_products?select=name,cost,sizes,qty,description,created_at&order=created_at",
        hdrs))
    files, folders = drive_listing()
    print(f"{len(products)} products in the shared list, {len(files)} files in Product Uploads")
    if folders:
        print(f"  (ignoring subfolder(s) in Product Uploads — their contents are invisible "
              f"to this script: {'; '.join(folders)})")

    # ---- build records first so slug collisions are resolved before any download
    data = []
    for p in products:
        disp, num = display_name(p["name"])
        data.append({"name": disp, "style": num, "slug": slugify(disp), "db_name": p["name"],
                     "price": re.sub(r"\.0+$", "", p["cost"] or ""),
                     "price_csv": re.sub(r"\.0+$", "", p["cost"] or ""),
                     "sizes": (p["sizes"] or "").strip().rstrip(","),
                     "sizes_raw": p["sizes"] or "", "qty_raw": p["qty"] or "",
                     "desc": (p["description"] or "").strip(),
                     "cat": category(p["name"]), "img": None})
    seen = {}
    for rec in data:
        if rec["slug"] in seen:
            new = rec["slug"] + "-" + (rec["style"] or str(sum(1 for r in data if r["slug"] == rec["slug"])))
            print(f"  ⚠ slug collision: \"{rec['name']}\" and \"{seen[rec['slug']]['name']}\" "
                  f"both → {rec['slug']}; using {new} for the newer one")
            rec["slug"] = new
        seen[rec["slug"]] = rec

    # ---- match photos to products (style number first, then best word overlap)
    assigned, matches = set(), {}
    by_style = {style_no(f): f for f in files if style_no(f)}
    for rec in data:
        if rec["style"] and rec["style"] in by_style:
            matches[rec["db_name"]] = by_style[rec["style"]]
            assigned.add(by_style[rec["style"]])
    pairs = []
    for rec in data:
        if rec["db_name"] in matches:
            continue
        pt = tokens(rec["db_name"])
        for f in files:
            score = len(pt & tokens(f)) / max(len(pt), 1)
            if score >= 0.5:
                pairs.append((score, rec["db_name"], f))
    for score, pname, fname in sorted(pairs, reverse=True):
        if pname not in matches and fname not in assigned:
            matches[pname] = fname
            assigned.add(fname)

    # ---- attach photos: local file wins; download only what's new; a failed
    #      download costs the photo, never the product
    imgdir = BASE / "img" / "products"
    imgdir.mkdir(parents=True, exist_ok=True)
    for rec in data:
        dest = imgdir / (rec["slug"] + ".jpg")
        fname = matches.get(rec["db_name"])
        if dest.exists():
            rec["img"] = "img/products/" + dest.name
            if not fname:
                print(f"  ⚠ {rec['name']}: photo kept from local copy — its source file "
                      "left the Product Uploads folder")
            continue
        if not fname:
            continue
        raw = imgdir / ("_raw_" + rec["slug"])
        try:
            raw.write_bytes(fetch("https://drive.google.com/uc?export=download&id=" + files[fname]))
            r = subprocess.run(["sips", "-Z", "900", "-s", "format", "jpeg",
                                "-s", "formatOptions", "80", str(raw), "-o", str(dest)],
                               capture_output=True, text=True)
            if r.returncode == 0:
                rec["img"] = "img/products/" + dest.name
                print(f"  + {dest.name}  ({fname})")
            else:
                print(f"  !! could not convert {fname} — product kept, photo skipped "
                      f"({r.stderr.strip().splitlines()[-1] if r.stderr.strip() else 'sips error'})",
                      file=sys.stderr)
        except Exception as e:
            print(f"  !! could not download {fname} — product kept, photo skipped ({e})", file=sys.stderr)
        finally:
            raw.unlink(missing_ok=True)

    # ---- Shopify: attach live order links once the store is public
    live = shopify_live_products()
    if live is not None:
        linked = 0
        by_title = {re.sub(r"\s+", " ", sp["title"].strip().lower()): h for h, sp in live.items()}
        for rec in data:
            handle = rec["slug"] if rec["slug"] in live else by_title.get(rec["name"].lower())
            if handle:
                sp = live[handle]
                rec["url"] = f"https://{SHOPIFY_DOMAIN}/products/{handle}"
                rec["available"] = any(v.get("available") for v in sp.get("variants", []))
                if sp.get("variants"):
                    rec["price"] = re.sub(r"\.0+$", "", str(sp["variants"][0].get("price", rec["price"])))
                linked += 1
        print(f"Shopify store is LIVE — linked {linked}/{len(data)} products to real order pages")
        print("  ⚠ shopify-products.csv is for FIRST-TIME import only — re-importing now "
              "would overwrite live Shopify inventory with the shared-list counts")
        unlinked = [d["name"] for d in data if "url" not in d]
        if unlinked:
            print("  Not yet on Shopify (still show the message fallback): " + "; ".join(unlinked))

    public = [{k: d.get(k) for k in ("name", "style", "price", "sizes", "desc", "cat", "img", "url", "available")
               if d.get(k) is not None} for d in data]
    (BASE / "shop-data.js").write_text(
        "// GENERATED by build-shop.py — do not hand-edit. Rerun the script instead.\n"
        "window.TT_PRODUCTS = " + json.dumps(public, indent=1) + ";\n")

    warnings = write_shopify_csv(data, BASE / "shopify-products.csv")
    no_photo = [d["name"] for d in data if not d["img"]]
    orphans = sorted(set(files) - assigned)
    n_variants = sum(len(parse_variants(d["sizes_raw"], d["qty_raw"])) for d in data)
    print(f"\nWrote shop-data.js ({len(data)} products, {sum(1 for d in data if d['img'])} with photos)")
    print(f"Wrote shopify-products.csv ({len(data)} products, {n_variants} size variants)")
    for w in warnings:
        print("  ⚠ " + w)
    if no_photo:
        print("Products still needing a photo: " + "; ".join(no_photo))
    if orphans:
        print("Photos with no product info yet (ask Sherrie to add them on the uploads page): "
              + "; ".join(orphans))


if __name__ == "__main__":
    main()
