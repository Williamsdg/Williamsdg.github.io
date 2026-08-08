# Tiger Threads → Shopify: launch checklist

The store already exists: **tigerthreadsauburn.myshopify.com** (currently password-protected).
Everything below happens in its admin at [admin.shopify.com](https://admin.shopify.com) — Sherrie's login.

## 1. Import all 29 products in one shot
- **Products → Import** → upload `shopify-products.csv` (this folder).
- It creates every product with size variants, per-size inventory counts, prices,
  descriptions, and the product photo (pulled from the live site's image URLs).
- After import, spot-check a couple (Anna Dress should show XS–XXL with counts 4/1/2/3/4/5).

## 2. Make it sellable
- **Settings → Payments** — activate Shopify Payments (or PayPal).
- **Settings → Shipping and delivery** — add a flat rate (and/or local pickup at the trailer —
  pickup fits the pop-up model perfectly).
- **Settings → Taxes** — confirm Alabama collection is on.
- Pick a plan (**Settings → Plan**) if the trial hasn't been upgraded yet.

## 3. Go live
- **Online Store → Preferences →** untick *Restrict access to visitors with the password*.
- Optional: **Settings → Domains →** connect `tigerthreadsauburn.com` (it currently points
  at an unused GoDaddy builder page).

## 4. Flip the website to "Order Online"
Once the password is off, run from this folder:

```
python3 build-shop.py
git add shop-data.js shopify-products.csv img/products/ && git commit -m "shop: live Shopify links" && git push
```

The script detects the live store, matches every product to its Shopify listing
(handles match the CSV), and every "Message to claim" becomes an orange
**Order Online →** button — with automatic **Sold Out** states pulled from live
availability. Rerun the same command any time she adds products or stock changes.

## Notes
- The CSV imports products as **active**; the storefront password keeps them private
  until step 3, so the order above is safe.
- The CSV is for **first-time import only** — once the store is live and selling,
  re-importing it would overwrite live inventory. New products: import just their rows,
  or add them in admin.
- Variants import with no weight (0 g), which is fine for **flat-rate shipping or
  pickup**; if she wants weight-based rates, set weights in Shopify admin.
- Inventory quirk to fix in Shopify admin (or on the uploads page) after import:
  **Ginny Top & Shorts Set shows S:340** — almost certainly a typo for 34 or 3/40.
- **Earrings Aubie Hoop (75748)** has no photo yet — add one in Shopify or drop it
  in the Product Uploads folder and rerun the script.
- Confirm with Sherrie that the "product cost" she enters is the **customer price** —
  it's what the CSV uses as the selling price.
