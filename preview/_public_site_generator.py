#!/usr/bin/env python3
"""Generate luxury-aesthetic public marketing sites for each trade dashboard.
Single-file standalone HTML, dark canvas + gold accent + per-trade primary color,
real Unsplash trade photography, randomized but realistic content."""

from pathlib import Path

HERE = Path(__file__).resolve().parent

# ────────────────────────────────────────────────────────────────
# PER-TRADE CONFIGURATION
# Each entry produces one /preview/<slug>-site/index.html
# Photos are real Unsplash IDs hand-picked to match the trade.
# ────────────────────────────────────────────────────────────────

SITES = [
    {
        "slug": "hvac-dashboard",
        "site_slug": "climate-air-pros-site",
        "brand": "Climate Air Pros",
        "brand_em": "Air Pros",
        "brand_short": "Climate Air",
        "tagline": "Heating, cooling, and indoor air done the way it ought to be.",
        "eyebrow": "Air Conditioning · HVAC",
        "primary": "#2563eb",
        "primary_dark": "#1e3a8a",
        "favicon_letter": "C",
        "phone": "(205) 555-2200",
        "email": "service@climateairpros.com",
        "address": "1840 Lakeshore Pkwy · Birmingham, AL 35209",
        "hours": "Mon–Sat 7a–7p · 24/7 Emergency",
        "founded": 2008,
        "founder_name": "Marcus Whitley",
        "founder_title": "Founder · NATE-certified",
        "founder_short": "Marcus Whitley",
        "founder_quote": "We won't sell you a system you don't need. And the one you do need, we'll install it the right way.",
        "philosophy": "We do <em>three things</em> well — and we won't pretend to do more.",
        "story_p1": "Climate Air Pros opened in 2008 with one truck and a Rolodex. Sixteen years later we run nine trucks across Birmingham and Shelby County, every one of them stocked the way our techs ask for them to be — not the way a corporate parts catalog says.",
        "story_p2": "We work on residential and light commercial. Heat pumps, gas furnaces, mini-splits, and the air-quality systems that actually matter — proper filtration, fresh-air ventilation, dehumidification. We don't do duct cleaning gimmicks. We don't sell you a UV light you don't need.",
        "story_p3": "Our techs are NATE-certified. Our installs are permitted and inspected. Our warranties are in writing. That's the whole pitch.",
        "hero_img": "https://images.unsplash.com/photo-1631545806609-26b8e3194b34?w=1800&q=85",
        "hero_alt": "HVAC technician working on a rooftop unit at sunset",
        "story_img": "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=85",
        "story_alt": "HVAC technician with toolkit",
        "services": [
            {"name": "AC Install & Replacement", "desc": "Full system replacement with permit pulled and inspection scheduled before we start.", "img": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=900&q=85"},
            {"name": "Furnace & Heat Pump", "desc": "Gas furnaces, electric heat pumps, and dual-fuel systems sized to your house — not your square footage.", "img": "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=900&q=85"},
            {"name": "Service & Tune-Ups", "desc": "Spring and fall maintenance plans. Members go to the front of the queue when something breaks.", "img": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=900&q=85"},
            {"name": "Indoor Air Quality", "desc": "Whole-home filtration, fresh-air ventilation, and humidity control. The stuff that actually changes how the house feels.", "img": "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=900&q=85"},
            {"name": "Mini-Splits", "desc": "Garages, additions, sunrooms — anywhere ductwork doesn't make sense. Mitsubishi and Daikin specialists.", "img": "https://images.unsplash.com/photo-1532555706-c7d31f9bf78e?w=900&q=85"},
            {"name": "Commercial Light", "desc": "Restaurants, retail spaces, and small office buildings. Rooftop units, makeup air, and exhaust.", "img": "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=1200&q=85",
            "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600&q=85",
            "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=85",
            "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=600&q=85",
            "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&q=85",
        ],
        "press": [
            {"q": "They quoted me a repair, not a replacement, when two other companies tried to sell me a new system. Six months later it's still running fine.", "by": "Sarah K. · Crestline"},
            {"q": "On time to the minute. The tech put on shoe covers without me asking. That tells you everything.", "by": "James T. · Mountain Brook"},
            {"q": "We had a heat pump go out on a Sunday in July. They had a temporary unit running by 10pm.", "by": "Renita W. · Hoover"},
        ],
        "cta_label": "Schedule Service",
        "cta_sub": "Free estimates on installs · Flat-rate diagnostic on repairs",
        "footer_lines": ["Birmingham, Alabama", "Licensed & Insured · AL #19847", "EPA Section 608 Universal"],
    },
    {
        "slug": "plumbing-dashboard",
        "site_slug": "flowright-plumbing-site",
        "brand": "FlowRight Plumbing & Gas",
        "brand_em": "Plumbing & Gas",
        "brand_short": "FlowRight",
        "tagline": "Drains, water heaters, gas lines, and emergency calls — done right the first time.",
        "eyebrow": "Plumbing / Gas",
        "primary": "#0d9488",
        "primary_dark": "#134e4a",
        "favicon_letter": "F",
        "phone": "(205) 555-3401",
        "email": "dispatch@flowrightplumbing.com",
        "address": "210 Oxmoor Blvd · Homewood, AL 35209",
        "hours": "24/7 Emergency · Office Mon–Fri 7a–6p",
        "founded": 2014,
        "founder_name": "Daryl Pierce",
        "founder_title": "Master Plumber · Owner",
        "founder_short": "Daryl Pierce",
        "founder_quote": "If a plumber says it'll take two hours, it should take two hours. We charge by the job, not by the clock.",
        "philosophy": "Flat-rate pricing. <em>No surprises.</em> Ever.",
        "story_p1": "FlowRight opened in 2014 because the owner was tired of watching customers get hourly-billed for jobs that should have been quoted up front. Every job we do is priced before we touch a wrench.",
        "story_p2": "Our techs are licensed master plumbers, gas-certified, and trained on tankless installs. We carry parts for the most common water heater brands on every truck so you're not waiting on a supply house.",
        "story_p3": "We pull permits when permits are required. We test gas lines with proper manometers. And we won't quote you a repipe when a repair will hold.",
        "hero_img": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1800&q=85",
        "hero_alt": "Plumber working under sink with tools laid out",
        "story_img": "https://images.unsplash.com/photo-1542013936693-884638332954?w=900&q=85",
        "story_alt": "Plumber checking water heater",
        "services": [
            {"name": "Drain & Sewer", "desc": "Snaking, hydro-jetting, and camera inspections. We find the problem before we sell you the fix.", "img": "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=900&q=85"},
            {"name": "Water Heaters", "desc": "Tank, tankless, hybrid heat-pump. Same-day installs on most brands.", "img": "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=900&q=85"},
            {"name": "Gas Lines & Permits", "desc": "New gas lines, leak repair, and pressure testing. Permitted and inspected.", "img": "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=900&q=85"},
            {"name": "Repipe & Slab Leaks", "desc": "PEX or copper repipes. Slab leak detection with electronic locators — no guess holes.", "img": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85"},
            {"name": "Fixture Install", "desc": "Faucets, toilets, garbage disposals, dishwashers, ice maker lines. Tile-cutter on every truck.", "img": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=900&q=85"},
            {"name": "24/7 Emergency", "desc": "Burst pipes, sewer backups, no-hot-water mornings. Real plumbers — not a call center routing you out.", "img": "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&q=85",
            "https://images.unsplash.com/photo-1542013936693-884638332954?w=600&q=85",
            "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&q=85",
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85",
            "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=85",
        ],
        "press": [
            {"q": "Tankless water heater installed and inspected in a single day. Permit pulled in the morning, inspector came Friday. Painless.", "by": "Mark D. · Vestavia Hills"},
            {"q": "Found a slab leak in 20 minutes that another company spent two days looking for. Saved me thousands.", "by": "Lisa H. · Homewood"},
            {"q": "Came out at 11pm on a Saturday. Quoted the repair before they started. The price didn't change.", "by": "Tom W. · Hoover"},
        ],
        "cta_label": "Request Service",
        "cta_sub": "Flat-rate quotes · Same-day on most calls · 24/7 emergency line",
        "footer_lines": ["Birmingham, Alabama", "Master Plumber · AL MP #08842", "Gas-Cert · Bonded & Insured"],
    },
    {
        "slug": "home-services-dashboard",
        "site_slug": "homecare-services-site",
        "brand": "HomeCare Services Co.",
        "brand_em": "Services Co.",
        "brand_short": "HomeCare",
        "tagline": "Handyman, fixtures, painting, and the small stuff that keeps a house running.",
        "eyebrow": "Home Services",
        "primary": "#059669",
        "primary_dark": "#064e3b",
        "favicon_letter": "H",
        "phone": "(205) 555-1144",
        "email": "hello@homecareservices.com",
        "address": "3201 Independence Dr · Homewood, AL 35209",
        "hours": "Mon–Sat 7a–6p · Closed Sunday",
        "founded": 2012,
        "founder_name": "Curtis Bell",
        "founder_title": "Founder · 28 yrs in the trades",
        "founder_short": "Curtis Bell",
        "founder_quote": "Most homes don't need a contractor. They need someone who shows up, knows what they're doing, and finishes what they start.",
        "philosophy": "Small jobs done <em>right</em>. Big jobs done <em>honest</em>.",
        "story_p1": "HomeCare started in 2012 doing punch-list work for two property managers. Twelve years later we run six full-time crews and do everything from a leaky faucet to a full bathroom refresh.",
        "story_p2": "We bill by the job, not the hour. We tell you up front what's included and what isn't. And we don't show up with a sales pitch dressed as a repair quote.",
        "story_p3": "Our crews handle handyman, painting interior and exterior, light electrical and plumbing, fixture installs, gutter work, deck repair, and seasonal maintenance contracts for repeat customers.",
        "hero_img": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1800&q=85",
        "hero_alt": "Handyman working on home repair with tools",
        "story_img": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=85",
        "story_alt": "Craftsman repairing wood",
        "services": [
            {"name": "General Handyman", "desc": "Drywall patches, door adjustments, hardware swaps, picture hanging — the list of small things you've been meaning to do.", "img": "https://images.unsplash.com/photo-1572017074091-c4b1f6e6b03e?w=900&q=85"},
            {"name": "Interior & Exterior Paint", "desc": "Single rooms, full interiors, exterior siding and trim. Sherwin-Williams certified applicators.", "img": "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=900&q=85"},
            {"name": "Fixture & Appliance Install", "desc": "Lights, fans, faucets, dishwashers, garbage disposals, ice maker lines, smart thermostats.", "img": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85"},
            {"name": "Deck & Outdoor", "desc": "Deck staining, board replacement, gutter cleaning and repair, pressure washing, fence panel repair.", "img": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85"},
            {"name": "Bathroom Refresh", "desc": "Vanity swaps, tile repair, caulk and grout, new toilets and faucets — without the cost of a full remodel.", "img": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85"},
            {"name": "Seasonal Maintenance", "desc": "Spring and fall checklists. HVAC filter swaps, gutter cleanouts, weatherstripping. Members get priority scheduling.", "img": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=85",
            "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=85",
            "https://images.unsplash.com/photo-1572017074091-c4b1f6e6b03e?w=600&q=85",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85",
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=85",
        ],
        "press": [
            {"q": "Quoted a punch list of 14 things, finished 13 in one day, came back the next morning for the last one. Money well spent.", "by": "Jenna M. · English Village"},
            {"q": "I've used three handyman services in Birmingham. HomeCare is the only one that texts when they're on the way.", "by": "Robert F. · Forest Park"},
            {"q": "Painted our whole interior in three days. The lines on the trim look painted by a machine.", "by": "Anna K. · Crestline"},
        ],
        "cta_label": "Get a Quote",
        "cta_sub": "Free estimates on jobs over $400 · Most small jobs quoted by phone",
        "footer_lines": ["Birmingham, Alabama", "Licensed & Insured", "Member · Alabama Home Builders Assoc."],
    },
    {
        "slug": "water-dashboard",
        "site_slug": "aqualine-water-site",
        "brand": "AquaLine Water Services",
        "brand_em": "Water Services",
        "brand_short": "AquaLine",
        "tagline": "Wells, pumps, filtration, and softener systems for homes that aren't on city water.",
        "eyebrow": "Water Systems",
        "primary": "#0891b2",
        "primary_dark": "#155e75",
        "favicon_letter": "A",
        "phone": "(205) 555-9220",
        "email": "service@aqualinewater.com",
        "address": "4815 Highway 31 · Pelham, AL 35124",
        "hours": "Mon–Fri 7a–6p · Sat 8a–2p",
        "founded": 2006,
        "founder_name": "Wade Sutherland",
        "founder_title": "Master Well Driller",
        "founder_short": "Wade Sutherland",
        "founder_quote": "Your water either works or it doesn't. When it doesn't, you need someone who's pulled a thousand pumps and seen every weird thing a well can do.",
        "philosophy": "Every well is different. <em>We treat them that way.</em>",
        "story_p1": "AquaLine has been drilling wells, pulling pumps, and fixing water systems across central Alabama since 2006. We work on rural homes, farms, hunting properties, and the occasional commercial site.",
        "story_p2": "When you call us out, you get an actual diagnosis — not a sales pitch. We test your water, check your pump's pressure switch and tank, look at your filtration, and tell you what's actually wrong.",
        "story_p3": "We install softeners, whole-house filters, UV systems, and reverse osmosis. We replace submersible pumps and jet pumps. And we pull and replace pumps with a rig truck — not a hand crank in your back yard.",
        "hero_img": "https://images.unsplash.com/photo-1541890289-7d8eb86e635a?w=1800&q=85",
        "hero_alt": "Water well system in rural setting",
        "story_img": "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=900&q=85",
        "story_alt": "Water filtration system",
        "services": [
            {"name": "Well Pumps", "desc": "Submersible and jet pump replacement. Same-day on most calls — we keep the common HP ratings on the truck.", "img": "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=900&q=85"},
            {"name": "Pressure Tanks", "desc": "Bladder tank replacement, pressure switch service, and full pressure-side rebuilds.", "img": "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=900&q=85"},
            {"name": "Whole-House Filtration", "desc": "Sediment, iron, sulfur, and chlorine removal. Sized to your flow rate, not a one-size-fits-all kit.", "img": "https://images.unsplash.com/photo-1502810190503-8303352d0dd1?w=900&q=85"},
            {"name": "Water Softeners", "desc": "Salt-based ion exchange and salt-free conditioning. Annual service plans available.", "img": "https://images.unsplash.com/photo-1574691250077-03a929faece5?w=900&q=85"},
            {"name": "UV & Reverse Osmosis", "desc": "Bacterial disinfection and drinking-water RO. Cartridge swaps included with our service membership.", "img": "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=900&q=85"},
            {"name": "Water Testing", "desc": "Lab-certified water quality reports — bacterial, mineral, hardness. We tell you what's in your water before we sell you anything.", "img": "https://images.unsplash.com/photo-1532634726-8b9fb99825ec?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1541890289-7d8eb86e635a?w=1200&q=85",
            "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=85",
            "https://images.unsplash.com/photo-1502810190503-8303352d0dd1?w=600&q=85",
            "https://images.unsplash.com/photo-1574691250077-03a929faece5?w=600&q=85",
            "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=85",
        ],
        "press": [
            {"q": "Lost water on a Sunday morning at our hunting cabin. They had a new pump in by 2pm. From three counties away.", "by": "Bill R. · Chilton County"},
            {"q": "The water tested fine on the chemical side but smelled like sulfur. They installed a small aeration tank instead of pushing me toward a $4,000 system.", "by": "Tracy O. · Shelby County"},
            {"q": "Wade himself came out to look at our well. Twenty minutes later he had it figured out. The big franchises had been by twice.", "by": "Hank L. · Bibb County"},
        ],
        "cta_label": "Schedule a Visit",
        "cta_sub": "Free water testing with any service call · 24/7 well-pump emergency line",
        "footer_lines": ["Central Alabama", "AL Master Well Driller #4421", "Licensed · Bonded · Insured"],
    },
    {
        "slug": "power-dashboard",
        "site_slug": "voltworks-electrical-site",
        "brand": "VoltWorks Electrical",
        "brand_em": "Electrical",
        "brand_short": "VoltWorks",
        "tagline": "Panel upgrades, EV chargers, generators, and the wiring you can trust.",
        "eyebrow": "Electrical",
        "primary": "#d97706",
        "primary_dark": "#92400e",
        "favicon_letter": "V",
        "phone": "(205) 555-7780",
        "email": "service@voltworkselectrical.com",
        "address": "2400 Greensprings Hwy · Birmingham, AL 35209",
        "hours": "Mon–Fri 7a–6p · Sat 8a–4p",
        "founded": 2011,
        "founder_name": "Andre Coker",
        "founder_title": "Master Electrician",
        "founder_short": "Andre Coker",
        "founder_quote": "Every panel I open, I'm thinking about the family that lives in this house. That's how I want my guys thinking too.",
        "philosophy": "Permitted. Inspected. <em>Done right.</em>",
        "story_p1": "VoltWorks does residential and light commercial electrical work — and we do it the way the code book says. Every panel upgrade is permitted. Every EV charger we put in is connected to a circuit sized for the car, not the wire we had on the truck.",
        "story_p2": "We put in standby generators, level-2 EV chargers, panel upgrades from 100 to 200 amp, whole-house surge protection, and the kind of accent lighting that makes a backyard usable after 8pm.",
        "story_p3": "Our electricians are licensed, our trucks carry copper not aluminum, and our installs pass inspection on the first walk every time. If they don't, we eat the re-trip — not you.",
        "hero_img": "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1800&q=85",
        "hero_alt": "Electrician working on a panel",
        "story_img": "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=900&q=85",
        "story_alt": "Electrical panel close-up",
        "services": [
            {"name": "Panel Upgrades", "desc": "100-to-200 amp panel upgrades. Square D and Eaton stocked. Permit pulled before we cut power.", "img": "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=900&q=85"},
            {"name": "EV Chargers", "desc": "Level-2 home chargers — Tesla Wall Connector, ChargePoint, Wallbox, Grizzl-E. Sized to the car, not the wire we had handy.", "img": "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=85"},
            {"name": "Standby Generators", "desc": "Generac, Kohler, Briconix. Whole-home and partial-home transfer switches. Annual service contracts.", "img": "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=900&q=85"},
            {"name": "Lighting & Accent", "desc": "Recessed cans, under-cabinet, landscape, and patio lighting. Lutron and Leviton dimmer integration.", "img": "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=900&q=85"},
            {"name": "Whole-House Surge", "desc": "Type-2 surge protection at the panel. The single best dollar-per-protection upgrade in the house.", "img": "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=900&q=85"},
            {"name": "Diagnostics", "desc": "Tripping breakers, hot outlets, flickering lights. We find the cause — not just the symptom.", "img": "https://images.unsplash.com/photo-1573164574048-f968d7e6d8ff?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&q=85",
            "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?w=600&q=85",
            "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=85",
            "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=85",
            "https://images.unsplash.com/photo-1573164574048-f968d7e6d8ff?w=600&q=85",
        ],
        "press": [
            {"q": "Generator install on a Tuesday, inspected on a Wednesday, power went out Saturday. Worked exactly as advertised.", "by": "Theresa B. · Greystone"},
            {"q": "EV charger installed by VoltWorks. Two friends had theirs done by the dealership's installer — both had to be redone. VoltWorks did it right the first time.", "by": "Marcus D. · Highland Park"},
            {"q": "Found a buried junction box behind drywall during a kitchen reno. Cleaned it up to code on the spot.", "by": "Susan H. · Vestavia Hills"},
        ],
        "cta_label": "Request a Quote",
        "cta_sub": "Free estimates on installs · Licensed master electricians · Permitted work",
        "footer_lines": ["Birmingham, Alabama", "AL Master Electrician #18840", "Licensed · Bonded · Insured"],
    },
    {
        "slug": "flooring-dashboard",
        "site_slug": "grainline-flooring-site",
        "brand": "Grainline Flooring Co.",
        "brand_em": "Flooring Co.",
        "brand_short": "Grainline",
        "tagline": "Hardwood, refinishing, carpet, and the floors that hold up to a real life.",
        "eyebrow": "Hardwood / Carpet",
        "primary": "#92400e",
        "primary_dark": "#451a03",
        "favicon_letter": "G",
        "phone": "(205) 555-4408",
        "email": "showroom@grainlineflooring.com",
        "address": "1820 Greensprings Hwy · Birmingham, AL 35209",
        "hours": "Mon–Sat 9a–5p · Sun by appointment",
        "founded": 2003,
        "founder_name": "Beau Whitfield",
        "founder_title": "Owner · Third-generation flooring",
        "founder_short": "Beau Whitfield",
        "founder_quote": "A floor isn't a finish — it's a substrate, a moisture problem, an expansion gap, and a finish. Get the first three right and the last one takes care of itself.",
        "philosophy": "Old-house wood. New-house wood. <em>Done the same way.</em>",
        "story_p1": "Grainline has been laying floors in Birmingham since 2003. My grandfather started in the business in 1962 and my father took it over in 1984. I came on full-time in 1998 and bought it from him in 2009.",
        "story_p2": "We do site-finished and prefinished hardwood, engineered, refinishing of original old-growth oak in the bungalows over in Forest Park, carpet, LVT, and the occasional tile job when we like the customer enough.",
        "story_p3": "We measure twice. We acclimate the wood. We use the right moisture meter. And we don't apologize for taking longer than the cheap guys, because the cheap guys' floors don't last.",
        "hero_img": "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1800&q=85",
        "hero_alt": "Wide-plank hardwood floor in a sunlit room",
        "story_img": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=85",
        "story_alt": "Hardwood floor refinishing in progress",
        "services": [
            {"name": "Site-Finished Hardwood", "desc": "White oak, red oak, hickory, walnut. Custom stains. Water-based or oil-modified finishes.", "img": "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=900&q=85"},
            {"name": "Refinishing", "desc": "Sand and refinish original-to-the-house oak. Dust-containment systems on every job.", "img": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=85"},
            {"name": "Engineered & Prefinished", "desc": "Below-grade-rated engineered for basements. Site-acclimated before we install. We don't pull from a cold trailer and start nailing.", "img": "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=900&q=85"},
            {"name": "Carpet", "desc": "Shaw, Mohawk, and wool from Antrim. Stretched-in over premium pad — not stapled-and-glued.", "img": "https://images.unsplash.com/photo-1574691250077-03a929faece5?w=900&q=85"},
            {"name": "LVT & Vinyl Plank", "desc": "Click-lock LVT for kitchens and basements. Subfloor leveling included on every estimate.", "img": "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=900&q=85"},
            {"name": "Stair Treads", "desc": "Solid stair treads, custom risers, and runners. We handle the math on rise and run — no contractor skim coats.", "img": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200&q=85",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=85",
            "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=600&q=85",
            "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&q=85",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85",
        ],
        "press": [
            {"q": "We had original 1924 oak under three layers of carpet glue. Grainline brought it back. Looks like new wood.", "by": "Karen H. · Forest Park"},
            {"q": "Five other companies told me the basement couldn't hold a floor without a moisture barrier. Grainline measured first, then proposed engineered. Two years in, no issues.", "by": "Phil R. · Vestavia Hills"},
            {"q": "Showed up with the wood three weeks before the install to let it acclimate. That alone tells you who you're dealing with.", "by": "Margaret T. · Mountain Brook"},
        ],
        "cta_label": "Visit the Showroom",
        "cta_sub": "Free in-home measure · Samples on request · Financing available",
        "footer_lines": ["Birmingham, Alabama", "NWFA-Certified Installer", "Three generations · Since 1962"],
    },
    {
        "slug": "windows-dashboard",
        "site_slug": "clearview-windows-site",
        "brand": "ClearView Window Installers",
        "brand_em": "Windows",
        "brand_short": "ClearView",
        "tagline": "Single windows to whole-home installs, plus the glass replacements nobody else wants to touch.",
        "eyebrow": "Window Install",
        "primary": "#1e40af",
        "primary_dark": "#1e3a8a",
        "favicon_letter": "C",
        "phone": "(205) 555-2401",
        "email": "estimate@clearviewwindows.com",
        "address": "3100 Lorna Rd · Birmingham, AL 35216",
        "hours": "Mon–Fri 8a–5p · Sat 9a–1p",
        "founded": 2009,
        "founder_name": "Drew Calloway",
        "founder_title": "Owner · Pella & Marvin Certified",
        "founder_short": "Drew Calloway",
        "founder_quote": "Most window companies are sales companies that happen to install. We're an install company that happens to sell.",
        "philosophy": "Measured right. <em>Installed right.</em> Caulked right.",
        "story_p1": "ClearView opened in 2009 to do one thing well: install windows the way the manufacturer specified. Sounds simple. It's the part most companies skip.",
        "story_p2": "We do new construction, replacement, full-frame and pocket installs, custom shapes, picture windows, French doors, and storm-damage glass replacement. We work primarily with Pella, Marvin, Andersen, and Provia.",
        "story_p3": "Every install gets flashed, sealed, and trimmed to spec. Every replacement gets a proper sash balance and a working lock. And we don't sub the work out — every install is done by our own crews, with our own foreman on site.",
        "hero_img": "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1800&q=85",
        "hero_alt": "Modern home with large windows at golden hour",
        "story_img": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=85",
        "story_alt": "Window installer at work",
        "services": [
            {"name": "Whole-Home Replacement", "desc": "All-windows packages with single-day-per-room install. Pella, Marvin, Andersen.", "img": "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=900&q=85"},
            {"name": "Single Window", "desc": "Single failed window, single foggy IGU, single broken sash. We do the small jobs other companies won't.", "img": "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=900&q=85"},
            {"name": "Custom Shapes", "desc": "Arches, half-rounds, picture windows, eyebrow units. Hand-measured and ordered direct from the factory.", "img": "https://images.unsplash.com/photo-1565623833408-d77e39b88af6?w=900&q=85"},
            {"name": "French Doors & Sliders", "desc": "Patio doors, French swing-pairs, multi-slide units up to 16 feet. Properly headered and flashed.", "img": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85"},
            {"name": "Glass Replacement", "desc": "Foggy double-pane (failed seal) replacement. Tempered glass for code-required locations.", "img": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=85"},
            {"name": "Storm-Damage Claims", "desc": "Insurance-paid hail and wind damage replacements. We work directly with the adjuster.", "img": "https://images.unsplash.com/photo-1591472670710-d18e08d7a9b2?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&q=85",
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=85",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=85",
            "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=600&q=85",
            "https://images.unsplash.com/photo-1565623833408-d77e39b88af6?w=600&q=85",
        ],
        "press": [
            {"q": "Replaced 22 windows in our 1962 split-level. Every opening got new flashing tape and a foam seal before the unit went in. Three other quotes wanted to skip that.", "by": "James W. · Hoover"},
            {"q": "Custom arched picture window for a stair landing. Measured to the millimeter, fit on the first try.", "by": "Lisa K. · Mountain Brook"},
            {"q": "Single foggy window in a bedroom. Most companies wouldn't even quote it. ClearView swapped just the IGU and saved me $1,800.", "by": "Mark D. · Crestline"},
        ],
        "cta_label": "Book an Estimate",
        "cta_sub": "Free in-home measure · Manufacturer-certified · No subcontractors",
        "footer_lines": ["Birmingham, Alabama", "Pella · Marvin · Andersen Certified", "Licensed & Insured"],
    },
    {
        "slug": "roofing-dashboard",
        "site_slug": "summit-ridge-roofing-site",
        "brand": "Summit Ridge Roofing",
        "brand_em": "Roofing",
        "brand_short": "Summit Ridge",
        "tagline": "Storm damage, full replacements, and the roofs that don't leak when the rain finally comes.",
        "eyebrow": "Roof Install",
        "primary": "#991b1b",
        "primary_dark": "#7f1d1d",
        "favicon_letter": "S",
        "phone": "(205) 555-8800",
        "email": "claims@summitridgeroofing.com",
        "address": "5005 Cahaba River Rd · Birmingham, AL 35243",
        "hours": "Mon–Sat 7a–7p · 24/7 Emergency Tarp",
        "founded": 2005,
        "founder_name": "Tate McAllister",
        "founder_title": "Owner · GAF Master Elite",
        "founder_short": "Tate McAllister",
        "founder_quote": "If your roof leaks, it's because someone skipped a step. Underlayment, flashing, valleys, ridge — get any one of them wrong and the whole thing fails.",
        "philosophy": "GAF Master Elite. <em>Local. Permitted.</em>",
        "story_p1": "Summit Ridge has been roofing Birmingham and the surrounding counties since 2005. We're a GAF Master Elite contractor — the top 2% of roofers nationwide. That comes with a Golden Pledge warranty most contractors can't offer.",
        "story_p2": "We do full residential replacements, storm-damage insurance work, ridge ventilation upgrades, soffit and fascia repair, and the occasional commercial flat-roof job. We pull permits. We tear off down to deck. We replace bad sheathing — we don't cover it up.",
        "story_p3": "Every roof gets new ice-and-water shield in the valleys and at the eaves. Every penetration gets a fresh boot. And every job gets a final walk-around with the homeowner before we collect the check.",
        "hero_img": "https://images.unsplash.com/photo-1632132142911-1a4d77c0f8a2?w=1800&q=85",
        "hero_alt": "Residential roof at sunset with new shingles",
        "story_img": "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=900&q=85",
        "story_alt": "Roofers working on a steep pitch",
        "services": [
            {"name": "Full Replacement", "desc": "Tear-off, deck inspection, new ice-and-water, synthetic underlayment, GAF or Owens Corning architectural shingles.", "img": "https://images.unsplash.com/photo-1632132142911-1a4d77c0f8a2?w=900&q=85"},
            {"name": "Storm-Damage Claims", "desc": "Hail and wind damage. We work directly with your adjuster and document with full photo reports.", "img": "https://images.unsplash.com/photo-1591472670710-d18e08d7a9b2?w=900&q=85"},
            {"name": "Repair", "desc": "Flashing, valleys, pipe boots, ridge cap. We find the source — not just the symptom — before we patch.", "img": "https://images.unsplash.com/photo-1581092446327-9b52bd1570c2?w=900&q=85"},
            {"name": "Ventilation", "desc": "Ridge vent upgrades, soffit balance, attic fan replacement. Most leaks aren't roof leaks — they're condensation.", "img": "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=900&q=85"},
            {"name": "Soffit & Fascia", "desc": "Wood, aluminum, or vinyl. Replaced with new flashing where the roof terminates.", "img": "https://images.unsplash.com/photo-1542896410-f70a52ce6f1f?w=900&q=85"},
            {"name": "24/7 Emergency Tarp", "desc": "Tree-on-roof, tornado damage, after-hours leaks. We tarp it tonight and write the claim tomorrow.", "img": "https://images.unsplash.com/photo-1591472670710-d18e08d7a9b2?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1632132142911-1a4d77c0f8a2?w=1200&q=85",
            "https://images.unsplash.com/photo-1591472670710-d18e08d7a9b2?w=600&q=85",
            "https://images.unsplash.com/photo-1542896410-f70a52ce6f1f?w=600&q=85",
            "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=600&q=85",
            "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=600&q=85",
        ],
        "press": [
            {"q": "Hail storm in April 2024. Summit Ridge had a tarp on by midnight, paperwork to my insurance the next morning, new roof in three weeks. Painless.", "by": "Curtis F. · Trussville"},
            {"q": "They opened up two squares of decking and showed me the rot before I asked. Replaced what they needed to. Didn't over-bill.", "by": "Renee P. · Vestavia Hills"},
            {"q": "Ten years on this roof. Ridge vent upgrade Summit did year two has paid for itself in attic temps.", "by": "Walt K. · Hoover"},
        ],
        "cta_label": "Free Inspection",
        "cta_sub": "GAF Master Elite · Insurance-claim experts · 24/7 emergency tarp",
        "footer_lines": ["Birmingham, Alabama", "GAF Master Elite Contractor", "Licensed · Bonded · Fully Insured"],
    },
    {
        "slug": "sheetrock-dashboard",
        "site_slug": "plumline-drywall-site",
        "brand": "PlumLine Drywall",
        "brand_em": "Drywall",
        "brand_short": "PlumLine",
        "tagline": "Hang, tape, mud, and texture — done by crews that take pride in a level-five wall.",
        "eyebrow": "Sheetrock & Drywall",
        "primary": "#4338ca",
        "primary_dark": "#312e81",
        "favicon_letter": "P",
        "phone": "(205) 555-1180",
        "email": "schedule@plumlinedrywall.com",
        "address": "3401 1st Ave South · Birmingham, AL 35222",
        "hours": "Mon–Fri 7a–5p",
        "founded": 2010,
        "founder_name": "Roy Patterson",
        "founder_title": "Foreman · 30 yrs in the trade",
        "founder_short": "Roy Patterson",
        "founder_quote": "A wall is either flat or it isn't. The light at six in the morning will tell you which one you've got.",
        "philosophy": "Level-five smooth where it matters. <em>Honest texture</em> where it doesn't.",
        "story_p1": "PlumLine has hung and finished drywall for general contractors and homeowners across Jefferson and Shelby County since 2010. We work on new construction, additions, basement finishes, and the painful punch-list repairs after a flood or a fire.",
        "story_p2": "Our crews hang square-off-the-truck sheets — square edges in, factory edges to the corners — and our finishers run level-three on most jobs and level-five where it'll show. We don't cut corners on the corner bead.",
        "story_p3": "Texture matching, popcorn removal, tape-and-bed repairs after plumbing or electrical, full-room re-skims when previous work just won't sand out. If the wall is bad enough that the painter is complaining, we're the call.",
        "hero_img": "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1800&q=85",
        "hero_alt": "Drywall finisher running joint compound on a seam",
        "story_img": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=900&q=85",
        "story_alt": "Drywall installation in progress",
        "services": [
            {"name": "Hang & Finish", "desc": "New construction and additions. Hung square, taped, three-coated, sanded, and ready for primer.", "img": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=900&q=85"},
            {"name": "Texture Match", "desc": "Knockdown, orange peel, slap-brush, smooth. The hardest part is matching old work — we do it.", "img": "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=900&q=85"},
            {"name": "Popcorn Removal", "desc": "Scrape, skim, sand, ready for paint. Asbestos-tested before we touch anything pre-1980.", "img": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=85"},
            {"name": "Repair After Trades", "desc": "Plumber and electrician access holes patched and finished — no more painter excuses.", "img": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85"},
            {"name": "Water Damage", "desc": "Cut out, hang, finish, and re-texture water-damaged ceilings and walls. Insurance documentation included.", "img": "https://images.unsplash.com/photo-1591472670710-d18e08d7a9b2?w=900&q=85"},
            {"name": "Level-5 Smooth", "desc": "Skim-coated to gallery-quality smooth. For modern homes where every imperfection catches light.", "img": "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=85",
            "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=600&q=85",
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=85",
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=85",
            "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=600&q=85",
        ],
        "press": [
            {"q": "Hung 90 sheets in a basement finish. The painter said it was the flattest work he'd primed all year.", "by": "GC · Hoover Builders"},
            {"q": "Matched a 30-year-old knockdown texture so well I can't find the seam in the right light.", "by": "Karen B. · English Village"},
            {"q": "Three trades opened up the laundry-room ceiling. PlumLine put it back together so it looks like nobody touched it.", "by": "Andre M. · Crestline"},
        ],
        "cta_label": "Get a Quote",
        "cta_sub": "Free measure on jobs over 8 sheets · GC and homeowner welcome",
        "footer_lines": ["Birmingham, Alabama", "Licensed & Insured", "Over 800 jobs · 14 years"],
    },
    {
        "slug": "framing-dashboard",
        "site_slug": "ironwood-framing-site",
        "brand": "Ironwood Framing Co.",
        "brand_em": "Framing Co.",
        "brand_short": "Ironwood",
        "tagline": "Walls, floors, and roof systems framed plumb, square, and on schedule.",
        "eyebrow": "Framing",
        "primary": "#166534",
        "primary_dark": "#14532d",
        "favicon_letter": "I",
        "phone": "(205) 555-9900",
        "email": "estimate@ironwoodframing.com",
        "address": "5500 Pinson Valley Pkwy · Birmingham, AL 35215",
        "hours": "Mon–Fri 6:30a–4p",
        "founded": 2007,
        "founder_name": "Kris Bourne",
        "founder_title": "Lead Framer · Owner",
        "founder_short": "Kris Bourne",
        "founder_quote": "Frame it square, frame it plumb, frame it once. Everything that comes after the framers depends on what the framers leave behind.",
        "philosophy": "<em>Plumb. Square.</em> Out of your way.",
        "story_p1": "Ironwood has been framing custom homes, additions, and light-commercial buildings across Jefferson and Shelby County since 2007. We work for builders we trust and we expect them to work for us.",
        "story_p2": "Our crews frame walls, floors, ceilings, roof systems, dormers, decks, and stair landings. We can read truss layouts, work to engineered drawings, and pre-cut on the trailer when the layout calls for it.",
        "story_p3": "We don't slow projects down. We don't argue with inspectors. And we don't leave a job until the GC walks it and signs off — no callbacks, no list of \"oh, by the ways.\"",
        "hero_img": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1800&q=85",
        "hero_alt": "Framers working on a residential build at golden hour",
        "story_img": "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=900&q=85",
        "story_alt": "Framing crew at work",
        "services": [
            {"name": "Wall Framing", "desc": "Stick-built or panelized. Engineered headers, structural sheathing, properly nailed corners.", "img": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=85"},
            {"name": "Floor Systems", "desc": "Engineered I-joists, LVL beams, blocked subfloors. We follow the plan — and call out problems with the plan when we see them.", "img": "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=900&q=85"},
            {"name": "Roof Framing", "desc": "Stick-framed or truss-set roof systems. Ridge vents blocked properly, valley jacks cut to fit.", "img": "https://images.unsplash.com/photo-1632132142911-1a4d77c0f8a2?w=900&q=85"},
            {"name": "Additions & Pop-Tops", "desc": "Tying new framing into existing structure — the hardest part of the job. Header design and load transfer to spec.", "img": "https://images.unsplash.com/photo-1503584683347-eb35e57d33fa?w=900&q=85"},
            {"name": "Decks & Outdoor", "desc": "Pressure-treated and PT-cap framing. Code-compliant joist hangers and ledger flashing.", "img": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85"},
            {"name": "Light Commercial", "desc": "Restaurant build-outs, retail spaces, professional offices. Steel-stud capable when the plans call for it.", "img": "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=85",
            "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=600&q=85",
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=85",
            "https://images.unsplash.com/photo-1632132142911-1a4d77c0f8a2?w=600&q=85",
            "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&q=85",
        ],
        "press": [
            {"q": "Framed our addition in 11 days. Plumb to the eighth on every wall. The drywall guys hadn't seen anything like it.", "by": "Steve R. · Liberty Park"},
            {"q": "We've put Ironwood on the last six homes we've built. They show up. They finish. They don't haggle.", "by": "Bham Custom Homes"},
            {"q": "Our addition tied into a 1925 farmhouse where nothing was square. They scribed every connection. Looks original.", "by": "Patricia D. · Edgewood"},
        ],
        "cta_label": "Request a Bid",
        "cta_sub": "Custom homes · Additions · Light commercial · Insured & WC-covered",
        "footer_lines": ["Birmingham, Alabama", "Licensed · Workers' Comp Covered", "Member · NAHB & ABC Alabama"],
    },
    {
        "slug": "brick-dashboard",
        "site_slug": "cornerstone-masonry-site",
        "brand": "Cornerstone Masonry",
        "brand_em": "Masonry",
        "brand_short": "Cornerstone",
        "tagline": "Brick, stone, tuckpointing, chimneys, and walls that'll outlive everyone who built them.",
        "eyebrow": "Brick & Masonry",
        "primary": "#b45309",
        "primary_dark": "#78350f",
        "favicon_letter": "C",
        "phone": "(205) 555-3340",
        "email": "estimate@cornerstonemasonry.com",
        "address": "910 18th St North · Birmingham, AL 35203",
        "hours": "Mon–Fri 7a–5p",
        "founded": 1998,
        "founder_name": "Hugo Marchetti",
        "founder_title": "Master Mason · Italian-trained",
        "founder_short": "Hugo Marchetti",
        "founder_quote": "Brick lasts a hundred years if you build it right. Mortar might last fifty. The pointing is where the building lives or dies.",
        "philosophy": "Lime mortar. Hand-cut stone. <em>Built to outlive us.</em>",
        "story_p1": "Cornerstone has been laying brick and stone in Birmingham since 1998. The owner trained in Italy in his early twenties and brought back techniques you don't see on a typical jobsite — proper batter on retaining walls, lime mortar that breathes, hand-tooled joints.",
        "story_p2": "We do new brick on custom homes and additions, full chimney rebuilds, tuckpointing on historic Forest Park and Highland Park houses, retaining walls, fireplaces, brick patios, and stone veneer.",
        "story_p3": "The work isn't fast. It isn't cheap. But the mortar joints we tooled in 2002 still look the way they looked the day we tooled them — and that's the only test that matters in this trade.",
        "hero_img": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1800&q=85",
        "hero_alt": "Brick masonry with hand-tooled joints",
        "story_img": "https://images.unsplash.com/photo-1503584683347-eb35e57d33fa?w=900&q=85",
        "story_alt": "Master mason laying brick",
        "services": [
            {"name": "New Brick & Stone", "desc": "Custom homes, additions, exterior facades. Hand-laid by master masons — not piecework.", "img": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=900&q=85"},
            {"name": "Tuckpointing", "desc": "Historic homes in Highland and Forest Park. Lime mortar, color-matched, hand-tooled joints.", "img": "https://images.unsplash.com/photo-1567608198289-a13d7e3ad5cf?w=900&q=85"},
            {"name": "Chimneys", "desc": "Full rebuilds, crown repairs, flue liner, cap and damper replacement. CSIA-trained sweeps on staff.", "img": "https://images.unsplash.com/photo-1542896410-f70a52ce6f1f?w=900&q=85"},
            {"name": "Retaining Walls", "desc": "Engineered or dry-stack. Proper drainage, weep holes, and batter — not the leaning monstrosities you see in subdivisions.", "img": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85"},
            {"name": "Fireplaces", "desc": "Indoor and outdoor masonry fireplaces. Firebrick and refractory mortar — not red brick on the inside.", "img": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=85"},
            {"name": "Patios & Walks", "desc": "Brick, flagstone, and bluestone. Mortared or sand-set. Thirty-year warranty on workmanship.", "img": "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=85",
            "https://images.unsplash.com/photo-1503584683347-eb35e57d33fa?w=600&q=85",
            "https://images.unsplash.com/photo-1567608198289-a13d7e3ad5cf?w=600&q=85",
            "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=85",
            "https://images.unsplash.com/photo-1542896410-f70a52ce6f1f?w=600&q=85",
        ],
        "press": [
            {"q": "Tuckpointed our 1923 house in Forest Park. You can't tell where the new mortar starts. That's the whole job.", "by": "Catherine M. · Forest Park"},
            {"q": "Built a 60-foot retaining wall on a 14-foot grade change. Engineered, drained, battered. Five years and not a single shifted stone.", "by": "Robert F. · Mountain Brook"},
            {"q": "Took down and rebuilt our chimney. Hugo himself laid the corners. The neighbors still ask who did it.", "by": "Sandra K. · Crestline"},
        ],
        "cta_label": "Schedule a Walk",
        "cta_sub": "Free in-person consult · Historic preservation experience · Insured",
        "footer_lines": ["Birmingham, Alabama", "Master Mason · Since 1998", "MCAA · CSIA Certified"],
    },
    {
        "slug": "landscaping-dashboard",
        "site_slug": "greenline-landscape-site",
        "brand": "Greenline Landscape Co.",
        "brand_em": "Landscape Co.",
        "brand_short": "Greenline",
        "tagline": "Mowing, sod, mulch, and the kind of yard the neighbors take pictures of.",
        "eyebrow": "Landscaping",
        "primary": "#15803d",
        "primary_dark": "#14532d",
        "favicon_letter": "G",
        "phone": "(205) 555-4400",
        "email": "service@greenlinelandscape.com",
        "address": "2900 Old Montgomery Hwy · Pelham, AL 35124",
        "hours": "Mon–Sat 6a–6p · Mar–Nov",
        "founded": 2001,
        "founder_name": "Carter Reeves",
        "founder_title": "Owner · Certified Landscape Tech",
        "founder_short": "Carter Reeves",
        "founder_quote": "Mowing is the easy part. Mowing the same yard every Tuesday for ten years and having the homeowner still happy — that's the job.",
        "philosophy": "Mowed clean. <em>Edged sharp.</em> On time.",
        "story_p1": "Greenline started in 2001 with one truck and twelve customers. Today we run nine crews across the metro and we still mow some of those original twelve yards. That's the part of the business we're proudest of.",
        "story_p2": "We do recurring lawn maintenance, sod installs, mulch refreshes, seasonal cleanups, leaf removal, light landscape design, and annual aeration and overseeding. We don't do tree work over 30 feet — we'll refer you to someone who does.",
        "story_p3": "Every crew runs a route — same Tuesday yards every Tuesday, all season. The same crew leader works your property all year. Your gate code stays in our system. Your dog learns their faces.",
        "hero_img": "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1800&q=85",
        "hero_alt": "Manicured residential lawn with golden hour light",
        "story_img": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85",
        "story_alt": "Landscape crew at work",
        "services": [
            {"name": "Recurring Lawn Service", "desc": "Weekly or bi-weekly mow, edge, trim, blow. Same crew, same day, all season.", "img": "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=900&q=85"},
            {"name": "Sod Install", "desc": "Zoysia, Bermuda, fescue. Site prep, leveling, install, watering schedule. Proper job — not just rolled-out grass.", "img": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85"},
            {"name": "Mulch & Pine Straw", "desc": "Spring refresh and fall top-up. Hardwood, cypress, pine bark, long-needle pine straw. Clean edges every time.", "img": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=85"},
            {"name": "Seasonal Cleanup", "desc": "Spring kickoff, fall leaf removal, winter prep. Branches, debris, gutter rinse — included.", "img": "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=900&q=85"},
            {"name": "Aeration & Overseeding", "desc": "Core aeration in fall, fescue overseeding for the cooler season. The single best thing you can do for a tired yard.", "img": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85"},
            {"name": "Light Design", "desc": "Bed redesigns, plant swaps, walk borders, dry-creek erosion fixes. We don't do whole-yard re-imaginings — we make what's there better.", "img": "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1200&q=85",
            "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=85",
            "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=85",
            "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=85",
            "https://images.unsplash.com/photo-1503594384566-461fe158e797?w=600&q=85",
        ],
        "press": [
            {"q": "Same crew every Wednesday for nine years. They know where the dog gate is. They know which beds are mine vs my neighbor's. That's worth paying for.", "by": "Linda B. · Mountain Brook"},
            {"q": "Sod install in May. Watered it on schedule. Three months in it looks like it's been there ten years.", "by": "Trent W. · Liberty Park"},
            {"q": "I've fired three lawn services. Greenline showed up on the same day, two seasons running. That's the bar.", "by": "Anna H. · Vestavia Hills"},
        ],
        "cta_label": "Get a Quote",
        "cta_sub": "Free in-person estimate · Recurring service plans · Senior discount available",
        "footer_lines": ["Birmingham, Alabama", "Certified Landscape Technician", "Member · NALP & TNLA"],
    },
    {
        "slug": "verbatim",
        "site_slug": "verbatim-site",
        "brand": "Verbatim & Co.",
        "brand_em": "& Co.",
        "brand_short": "Verbatim",
        "tagline": "Court reporting, legal videography, and trial-ready transcripts that hold up.",
        "eyebrow": "Court Reporting",
        "primary": "#1a3a5f",
        "primary_dark": "#0f2440",
        "favicon_letter": "V",
        "phone": "(205) 555-1899",
        "email": "schedule@verbatimco.com",
        "address": "2200 1st Avenue North, Suite 410 · Birmingham, AL 35203",
        "hours": "Mon–Fri 7:30a–6p · 24/7 Dispatch",
        "founded": 1998,
        "founder_name": "Eleanor Kessler",
        "founder_title": "Managing Partner · RPR · CRR",
        "founder_short": "Eleanor Kessler",
        "founder_quote": "A transcript isn't a recording. It's a record. The difference is whether someone heard the room — or just heard the audio.",
        "philosophy": "Reporters in the room. <em>Realtime when it matters.</em> Certified, every time.",
        "story_p1": "Verbatim & Co. has been the court reporting agency of record for litigation firms across the Southeast since 1998. We staff in-room and remote depositions, hearings, EUOs, 30(b)(6) testimony, and trials.",
        "story_p2": "Our reporters hold RPR, RMR, and CRR certifications. We offer realtime feeds to taking attorneys, rough drafts within hours, and certified transcripts on standard or expedited turnaround. Our scopist and proofreader bench is in-house.",
        "story_p3": "We also offer legal videography, AI-assisted transcript search across your firm's case archive, and a secure client portal for downloading certified work and tracking read-and-sign deadlines. Eight hundred firms trust us with their record. We don't take that lightly.",
        "hero_img": "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=1800&q=85",
        "hero_alt": "Court reporter working with stenotype at a deposition table",
        "story_img": "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=900&q=85",
        "story_alt": "Certified court reporter at work",
        "services": [
            {"name": "Depositions", "desc": "In-room or remote. RPR-certified reporters, realtime available, rough draft within hours.", "img": "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=900&q=85"},
            {"name": "Realtime", "desc": "CRR-certified realtime stenographers. Stream to taking attorney's laptop with full search and annotation.", "img": "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=900&q=85"},
            {"name": "Legal Video", "desc": "Synchronized video and transcript. Trial-ready clip generation. ENG-certified videographers.", "img": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=85"},
            {"name": "Trial & Hearings", "desc": "Daily-copy and rough turnaround for multi-day trials. Quad-screen monitor setup at the lectern.", "img": "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=900&q=85"},
            {"name": "AI-Assisted Search", "desc": "Semantic search across your firm's archive. Find every reference to a witness, exhibit, or topic across years of testimony.", "img": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=85"},
            {"name": "Client Portal", "desc": "Download certified transcripts, track read-and-sign deadlines, request new jobs, manage invoices.", "img": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=85"},
        ],
        "gallery": [
            "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&q=85",
            "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=600&q=85",
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=85",
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=85",
            "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=85",
        ],
        "press": [
            {"q": "We've used Verbatim for six years and never had a delivery slip past their committed turnaround. That's the entire ballgame in this business.", "by": "Karen Hartwell · Hartwell & Reed LLP"},
            {"q": "Their CRR realtime saved us a witness's contradiction in real-time. We pivoted before lunch. That's what realtime is supposed to be.", "by": "Sarah Beaumont · Beaumont Litigation Group"},
            {"q": "The AI-assisted archive search has changed how we prep depositions. Cross-references in minutes that used to take days.", "by": "Renu Patel · Whitfield Patel & Associates"},
        ],
        "cta_label": "Schedule a Reporter",
        "cta_sub": "RPR · RMR · CRR certified · Realtime · Same-day rough · 24/7 dispatch",
        "footer_lines": ["Birmingham, Alabama · Serving the Southeast", "Certified · NCRA Member · 800+ firms", "Since 1998"],
    },
]

# ────────────────────────────────────────────────────────────────
# TEMPLATE
# ────────────────────────────────────────────────────────────────

def build_html(c):
    services_html = "\n".join([
        f'''        <a class="svc-card reveal" href="#contact">
            <div class="svc-img"><img src="{s['img']}&auto=format&fit=crop&w=900&q=80" alt="{s['name']}" loading="lazy"></div>
            <div class="svc-body">
                <div class="svc-name">{s['name']}</div>
                <div class="svc-desc">{s['desc']}</div>
            </div>
        </a>'''
        for s in c['services']
    ])

    gallery_html = "\n".join([
        f'        <div class="gal"><img src="{img}&auto=format&fit=crop&w=1200&q=80" alt="" loading="lazy"></div>'
        for img in c['gallery']
    ])

    press_html = "\n".join([
        f'''        <div class="press-card reveal">
            <div class="press-q">"{p['q']}"</div>
            <div class="press-by">— {p['by']}</div>
        </div>'''
        for p in c['press']
    ])

    footer_lines_html = " · ".join(c['footer_lines'])

    favicon = (
        f"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>"
        f"<rect width='64' height='64' rx='14' fill='{c['primary'].replace('#','%23')}'/>"
        f"<text x='32' y='42' font-family='Georgia,serif' font-size='28' font-weight='600' fill='%23d4af37' text-anchor='middle'>{c['favicon_letter']}</text></svg>"
    )

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{c['brand']} · {c['eyebrow']} · Birmingham, Alabama</title>
<meta name="description" content="{c['tagline']}">
<meta property="og:title" content="{c['brand']} — {c['eyebrow']}">
<meta property="og:description" content="{c['tagline']}">
<meta property="og:image" content="{c['hero_img']}">
<meta name="theme-color" content="#070b1a">
<link rel="icon" href="{favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,200;9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{{margin:0;padding:0;box-sizing:border-box}}
:root{{
    --primary:{c['primary']};--primary-dark:{c['primary_dark']};
    --gold:#d4af37;--gold-soft:#b8941f;--gold-glow:rgba(212,175,55,0.18);
    --bg:#070b1a;
    --surface:rgba(255,255,255,0.04);
    --text:#f1f3f9;--text-soft:#c8cfdb;--text-mute:#7a86a0;
    --border:rgba(255,255,255,0.10);--border-soft:rgba(255,255,255,0.06);
    --serif:'Fraunces',Georgia,serif;
}}
html{{scroll-behavior:smooth;background:var(--bg)}}
body{{font-family:'Inter',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased;letter-spacing:-0.005em;overflow-x:hidden}}
::selection{{background:var(--gold-glow);color:var(--text)}}
img{{display:block;max-width:100%}}
a{{color:inherit;text-decoration:none}}

/* NAV */
.nav{{position:fixed;top:0;left:0;right:0;z-index:50;padding:18px 36px;display:flex;justify-content:space-between;align-items:center;transition:all .3s;background:linear-gradient(180deg, rgba(7,11,26,0.6), transparent)}}
.nav.scrolled{{background:rgba(7,11,26,0.85);backdrop-filter:blur(16px) saturate(140%);border-bottom:1px solid var(--border-soft);padding:14px 36px}}
.nav .brand{{font-family:var(--serif);font-weight:400;font-size:1.5rem;letter-spacing:-0.01em;color:#fff}}
.nav .brand em{{font-style:italic;color:var(--gold);font-weight:400}}
.nav-links{{display:flex;gap:28px;align-items:center}}
.nav-links a{{font-size:.74rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--text-soft);transition:color .2s;position:relative}}
.nav-links a:hover{{color:var(--gold)}}
.nav-links a::after{{content:'';position:absolute;bottom:-4px;left:0;right:0;height:1px;background:var(--gold);transform:scaleX(0);transform-origin:right;transition:transform .3s}}
.nav-links a:hover::after{{transform:scaleX(1);transform-origin:left}}
.nav .cta{{background:linear-gradient(135deg, var(--gold), var(--gold-soft));color:#070b1a;padding:10px 22px;border-radius:50px;font-size:.74rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;border:1px solid rgba(255,255,255,0.18);box-shadow:0 4px 14px -4px var(--gold-glow);transition:all .25s}}
.nav .cta:hover{{transform:translateY(-1px);box-shadow:0 8px 22px -4px rgba(212,175,55,0.4)}}
.nav .nav-toggle{{display:none;background:none;border:none;color:var(--text);cursor:pointer;padding:6px}}
.nav .nav-toggle svg{{width:24px;height:24px}}

/* HERO */
.hero{{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:120px 24px 60px;overflow:hidden}}
.hero-bg{{position:absolute;inset:0;z-index:0}}
.hero-bg img{{width:100%;height:100%;object-fit:cover;filter:brightness(0.45) saturate(1.05)}}
.hero-bg::after{{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center, transparent 30%, rgba(7,11,26,0.85) 100%),linear-gradient(180deg, rgba(7,11,26,0.5) 0%, rgba(7,11,26,0.3) 50%, rgba(7,11,26,1) 100%)}}
.hero-content{{position:relative;z-index:1;max-width:880px;text-align:center}}
.hero .eye{{font-size:.7rem;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:4px;display:inline-flex;align-items:center;gap:18px;margin-bottom:32px;animation:fade-in 1.2s ease-out}}
.hero .eye::before,.hero .eye::after{{content:'';width:36px;height:1px;background:var(--gold);opacity:0.6}}
.hero h1{{font-family:var(--serif);font-weight:200;font-size:clamp(2.6rem, 7vw, 5.5rem);letter-spacing:-0.03em;line-height:1.05;color:var(--text);animation:fade-in 1.2s ease-out 0.2s both}}
.hero h1 em{{font-style:italic;color:var(--gold);font-weight:300}}
.hero .tagline{{font-size:1.05rem;color:var(--text-soft);margin-top:28px;font-style:italic;font-weight:300;letter-spacing:0.01em;max-width:600px;margin-left:auto;margin-right:auto;animation:fade-in 1.2s ease-out 0.4s both}}
.hero-actions{{display:flex;gap:14px;justify-content:center;margin-top:44px;flex-wrap:wrap;animation:fade-in 1.2s ease-out 0.6s both}}
.btn{{display:inline-flex;align-items:center;gap:10px;padding:14px 32px;border-radius:50px;font-weight:700;font-size:.78rem;letter-spacing:2px;text-transform:uppercase;font-family:inherit;cursor:pointer;border:1px solid transparent;text-decoration:none;transition:all .25s;white-space:nowrap}}
.btn-gold{{background:linear-gradient(135deg, var(--gold), var(--gold-soft));color:#070b1a;border-color:rgba(255,255,255,0.18);box-shadow:0 6px 20px -4px var(--gold-glow), inset 0 1px 0 rgba(255,255,255,0.25)}}
.btn-gold:hover{{transform:translateY(-2px);box-shadow:0 10px 28px -4px rgba(212,175,55,0.4)}}
.btn-ghost{{background:transparent;color:var(--text);border:1px solid rgba(255,255,255,0.25);backdrop-filter:blur(8px)}}
.btn-ghost:hover{{border-color:var(--gold);color:var(--gold);background:rgba(212,175,55,0.06)}}
.scroll-cue{{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);z-index:1;animation:bob 2.4s ease-in-out infinite;font-size:.66rem;color:var(--text-mute);text-transform:uppercase;letter-spacing:3px;font-weight:600}}
.scroll-cue::after{{content:'';display:block;width:1px;height:36px;background:linear-gradient(180deg, transparent, var(--gold));margin:14px auto 0}}
@keyframes bob{{0%,100%{{transform:translateX(-50%) translateY(0)}}50%{{transform:translateX(-50%) translateY(8px)}}}}
@keyframes fade-in{{from{{opacity:0;transform:translateY(24px)}}to{{opacity:1;transform:translateY(0)}}}}

/* SECTION SCAFFOLD */
section{{position:relative;padding:120px 36px;max-width:1280px;margin:0 auto}}
.section-eye{{display:inline-flex;align-items:center;gap:14px;font-size:.66rem;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:3.5px;margin-bottom:20px}}
.section-eye::before{{content:'';width:24px;height:1px;background:var(--gold);opacity:0.6}}
.section-title{{font-family:var(--serif);font-weight:300;font-size:clamp(2rem, 4.5vw, 3.6rem);letter-spacing:-0.02em;line-height:1.05;color:var(--text);margin-bottom:18px}}
.section-title em{{font-style:italic;color:var(--gold);font-weight:400}}
.section-lead{{font-size:1.05rem;color:var(--text-soft);max-width:600px;line-height:1.7}}
.reveal{{opacity:0;transform:translateY(28px);transition:opacity .9s ease, transform .9s ease}}
.reveal.in{{opacity:1;transform:translateY(0)}}

/* PHILOSOPHY */
.philosophy{{padding:90px 36px;text-align:center;background:linear-gradient(180deg, transparent, {c['primary']}11, transparent)}}
.philosophy-quote{{font-family:var(--serif);font-weight:300;font-style:italic;font-size:clamp(1.6rem, 3.5vw, 2.4rem);line-height:1.3;letter-spacing:-0.01em;color:var(--text);max-width:900px;margin:0 auto}}
.philosophy-quote em{{color:var(--gold);font-style:italic}}
.philosophy-attr{{font-size:.74rem;color:var(--gold);text-transform:uppercase;letter-spacing:3px;font-weight:600;margin-top:24px}}
.philosophy-attr::before{{content:'';display:inline-block;width:30px;height:1px;background:var(--gold);vertical-align:middle;margin-right:14px;opacity:0.6}}

/* SERVICES */
.svc-grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}}
.svc-card{{position:relative;border-radius:18px;overflow:hidden;cursor:pointer;border:1px solid var(--border);transition:transform .4s, border-color .4s;background:var(--surface);display:flex;flex-direction:column;text-decoration:none;color:inherit}}
.svc-card:hover{{transform:translateY(-6px);border-color:rgba(212,175,55,0.35)}}
.svc-img{{aspect-ratio:4/3;overflow:hidden;position:relative}}
.svc-img img{{width:100%;height:100%;object-fit:cover;transition:transform .8s}}
.svc-card:hover .svc-img img{{transform:scale(1.06)}}
.svc-img::after{{content:'';position:absolute;inset:0;background:linear-gradient(180deg, transparent 50%, rgba(7,11,26,0.4) 100%)}}
.svc-body{{padding:24px}}
.svc-name{{font-family:var(--serif);font-weight:500;font-size:1.3rem;letter-spacing:-0.01em;color:var(--text);margin-bottom:10px}}
.svc-desc{{font-size:.88rem;color:var(--text-mute);line-height:1.6}}

/* STORY */
.story{{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}}
.story-img{{position:relative;border-radius:18px;overflow:hidden;aspect-ratio:4/5;border:1px solid var(--border)}}
.story-img img{{width:100%;height:100%;object-fit:cover}}
.story-content p{{color:var(--text-soft);margin-top:18px;line-height:1.85;font-size:1rem}}
.story-content p em{{color:var(--gold);font-style:italic}}
.story-sig{{margin-top:36px;font-family:var(--serif);font-style:italic;font-size:1.15rem;color:var(--text);font-weight:400}}
.story-sig small{{display:block;font-family:'Inter',sans-serif;font-style:normal;font-size:.72rem;color:var(--gold);text-transform:uppercase;letter-spacing:2px;margin-top:6px;font-weight:600}}

/* GALLERY STRIP */
.gallery{{display:grid;grid-template-columns:2fr 1fr 1fr;gap:14px;margin-top:80px;max-height:500px}}
.gallery .gal{{border-radius:14px;overflow:hidden;border:1px solid var(--border-soft);background:var(--surface)}}
.gallery .gal:first-child{{grid-row:span 2}}
.gallery .gal img{{width:100%;height:100%;object-fit:cover;aspect-ratio:auto}}

/* PRESS */
.press{{padding:120px 36px;background:linear-gradient(180deg, transparent, {c['primary']}0a, transparent)}}
.press-grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px;max-width:1280px;margin-left:auto;margin-right:auto}}
.press-card{{background:var(--surface);border:1px solid var(--border);border-radius:18px;padding:36px 28px;backdrop-filter:blur(12px);position:relative}}
.press-card::before{{content:'"';position:absolute;top:-18px;left:24px;font-family:var(--serif);font-size:5rem;color:var(--gold);opacity:0.55;line-height:1;font-weight:300}}
.press-q{{font-family:var(--serif);font-weight:300;font-style:italic;font-size:1.1rem;line-height:1.55;color:var(--text);margin-top:12px}}
.press-by{{margin-top:20px;font-size:.72rem;color:var(--gold);text-transform:uppercase;letter-spacing:2px;font-weight:600;border-top:1px solid var(--border-soft);padding-top:16px}}

/* CONTACT */
.contact{{padding:120px 36px;text-align:center;background:radial-gradient(circle at center, {c['primary']}1a, transparent 60%)}}
.contact-info{{display:grid;grid-template-columns:repeat(3,1fr);gap:48px;margin-top:48px;max-width:900px;margin-left:auto;margin-right:auto}}
.contact-block{{text-align:center}}
.contact-label{{font-size:.66rem;color:var(--text-mute);text-transform:uppercase;letter-spacing:3px;font-weight:600;margin-bottom:10px}}
.contact-val{{font-family:var(--serif);font-size:1.15rem;color:var(--text);line-height:1.5}}
.contact-val a{{color:var(--gold);transition:color .2s}}
.contact-val a:hover{{color:var(--text)}}

/* FOOTER */
footer{{padding:48px 36px;text-align:center;border-top:1px solid var(--border-soft);background:rgba(7,11,26,0.5)}}
footer .brand{{font-family:var(--serif);font-weight:400;font-size:1.3rem;color:#fff;margin-bottom:8px}}
footer .brand em{{color:var(--gold);font-style:italic}}
footer .meta{{font-size:.78rem;color:var(--text-mute);margin-top:8px;letter-spacing:0.02em}}
footer .legal{{font-size:.7rem;color:var(--text-mute);margin-top:18px;opacity:0.7}}
footer .legal a{{color:var(--gold)}}

/* STICKY DASHBOARD LINK (REVERSE - go to dashboard from public site) */
.sticky-dash{{position:fixed;bottom:24px;right:24px;z-index:60;background:rgba(15,21,40,0.92);backdrop-filter:blur(16px);border:1px solid var(--border-strong, rgba(255,255,255,0.18));border-radius:50px;padding:11px 22px;font-size:.72rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--text);box-shadow:0 12px 32px -8px rgba(0,0,0,0.5);text-decoration:none;display:inline-flex;align-items:center;gap:10px;transition:all .25s}}
.sticky-dash:hover{{border-color:var(--gold);color:var(--gold);transform:translateY(-2px)}}
.sticky-dash::after{{content:'→';font-size:.92rem}}

/* RESPONSIVE */
@media(max-width:960px){{
    .svc-grid{{grid-template-columns:repeat(2,1fr)}}
    .press-grid{{grid-template-columns:1fr;gap:18px}}
    .story{{grid-template-columns:1fr;gap:48px}}
    .gallery{{grid-template-columns:1fr 1fr;max-height:none}}
    .gallery .gal:first-child{{grid-row:auto;grid-column:span 2}}
    .contact-info{{grid-template-columns:1fr;gap:32px}}
}}
@media(max-width:680px){{
    .nav{{padding:14px 18px}}
    .nav.scrolled{{padding:12px 18px}}
    .nav-links{{display:none}}
    .nav-links.open{{display:flex;position:absolute;top:100%;left:0;right:0;background:rgba(7,11,26,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border-soft);flex-direction:column;padding:24px;gap:18px}}
    .nav .nav-toggle{{display:block}}
    .nav .cta{{display:none}}
    section{{padding:80px 18px}}
    .philosophy{{padding:60px 18px}}
    .press{{padding:80px 18px}}
    .contact{{padding:80px 18px}}
    .svc-grid{{grid-template-columns:1fr;gap:14px;margin-top:32px}}
    .gallery{{grid-template-columns:1fr;margin-top:48px}}
    .gallery .gal:first-child{{grid-column:auto}}
    .hero{{padding:100px 18px 60px}}
    .hero-actions .btn{{padding:12px 22px;font-size:.7rem}}
    .sticky-dash{{bottom:14px;right:14px;padding:9px 16px;font-size:.64rem;letter-spacing:1.2px}}
}}
</style>
</head>
<body>

<!-- NAV -->
<nav class="nav" id="nav">
    <a href="#top" class="brand">{c['brand_short']} <em>{c['brand_em']}</em></a>
    <div class="nav-links" id="navLinks">
        <a href="#services">Services</a>
        <a href="#story">Our Story</a>
        <a href="#press">Reviews</a>
        <a href="#contact">Contact</a>
        <a href="#contact" class="cta">{c['cta_label']}</a>
    </div>
    <button class="nav-toggle" onclick="document.getElementById('navLinks').classList.toggle('open')" aria-label="Menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
</nav>

<!-- HERO -->
<section class="hero" id="top" style="padding-top:0;padding-bottom:0;max-width:none;margin:0">
    <div class="hero-bg"><img src="{c['hero_img']}&auto=format&fit=crop&w=1800&q=85" alt="{c['hero_alt']}"></div>
    <div class="hero-content">
        <div class="eye">{c['eyebrow']} · Birmingham, AL</div>
        <h1>{c['brand_short']}<br><em>{c['brand_em']}</em></h1>
        <p class="tagline">{c['tagline']}</p>
        <div class="hero-actions">
            <a href="#contact" class="btn btn-gold">{c['cta_label']}</a>
            <a href="#services" class="btn btn-ghost">See Services</a>
        </div>
    </div>
    <div class="scroll-cue">Scroll</div>
</section>

<!-- PHILOSOPHY -->
<section class="philosophy" style="padding-top:90px;padding-bottom:90px;max-width:none">
    <div class="philosophy-quote reveal">{c['philosophy']}</div>
    <div class="philosophy-attr">— {c['founder_short']}, {c['founder_title']}</div>
</section>

<!-- SERVICES -->
<section id="services">
    <div class="reveal">
        <div class="section-eye">What We Do</div>
        <h2 class="section-title">Built for the <em>real work.</em></h2>
        <p class="section-lead">Every job we take on, we take seriously. Here's the work we do best — and the work we'll honestly tell you when we're not the right call.</p>
    </div>
    <div class="svc-grid">
{services_html}
    </div>
</section>

<!-- STORY -->
<section id="story">
    <div class="story">
        <div class="story-img reveal">
            <img src="{c['story_img']}&auto=format&fit=crop&w=900&q=85" alt="{c['story_alt']}">
        </div>
        <div class="story-content reveal">
            <div class="section-eye">Our Story</div>
            <h2 class="section-title">Founded in <em>{c['founded']}</em>.</h2>
            <p>{c['story_p1']}</p>
            <p>{c['story_p2']}</p>
            <p>{c['story_p3']}</p>
            <div class="story-sig">— {c['founder_name']}<small>{c['founder_title']}</small></div>
        </div>
    </div>

    <!-- GALLERY -->
    <div class="gallery reveal">
{gallery_html}
    </div>
</section>

<!-- PRESS / REVIEWS -->
<section class="press" id="press" style="max-width:none">
    <div style="max-width:1280px;margin:0 auto">
        <div class="reveal" style="text-align:center;max-width:680px;margin:0 auto 0">
            <div class="section-eye" style="justify-content:center">What People Say</div>
            <h2 class="section-title">Word of <em>mouth.</em></h2>
            <p class="section-lead" style="margin-left:auto;margin-right:auto">The customers we keep are the ones we hear from again. Here's what a few of them have said.</p>
        </div>
        <div class="press-grid">
{press_html}
        </div>
    </div>
</section>

<!-- CONTACT -->
<section class="contact" id="contact" style="max-width:none">
    <div class="reveal" style="max-width:680px;margin:0 auto">
        <div class="section-eye" style="justify-content:center">Get In Touch</div>
        <h2 class="section-title">Ready when <em>you are.</em></h2>
        <p class="section-lead" style="margin:0 auto 32px">{c['cta_sub']}</p>
        <a href="tel:{c['phone'].replace('(','').replace(')','').replace(' ','').replace('-','')}" class="btn btn-gold" style="margin:8px">Call {c['phone']}</a>
        <a href="mailto:{c['email']}" class="btn btn-ghost" style="margin:8px">Email Us</a>
    </div>
    <div class="contact-info">
        <div class="contact-block">
            <div class="contact-label">Phone</div>
            <div class="contact-val"><a href="tel:{c['phone'].replace('(','').replace(')','').replace(' ','').replace('-','')}">{c['phone']}</a></div>
        </div>
        <div class="contact-block">
            <div class="contact-label">Email</div>
            <div class="contact-val"><a href="mailto:{c['email']}">{c['email']}</a></div>
        </div>
        <div class="contact-block">
            <div class="contact-label">Address &amp; Hours</div>
            <div class="contact-val">{c['address']}<br><span style="font-size:.84rem;color:var(--text-mute)">{c['hours']}</span></div>
        </div>
    </div>
</section>

<!-- FOOTER -->
<footer>
    <div class="brand">{c['brand_short']} <em>{c['brand_em']}</em></div>
    <div class="meta">{footer_lines_html}</div>
    <div class="legal">© {c['founded']}–2026 {c['brand']}. Demo site by <a href="https://williamsdigital.io">Williams Digital</a>.</div>
</footer>

<!-- STICKY DASHBOARD LINK -->
<a href="../{c['slug']}/" class="sticky-dash">See Operations Dashboard</a>

<script>
// NAV scroll state
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{{nav.classList.toggle('scrolled',window.scrollY>40)}},{{passive:true}});

// REVEAL on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{{if(e.isIntersecting){{e.target.classList.add('in');io.unobserve(e.target)}}}}),{{threshold:0.12}});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Close mobile nav after click
document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open')));
</script>
</body>
</html>
'''


def main():
    for c in SITES:
        out_dir = HERE / c['site_slug']
        out_dir.mkdir(exist_ok=True)
        out_path = out_dir / 'index.html'
        out_path.write_text(build_html(c), encoding='utf-8')
        print(f"  wrote {out_path.relative_to(HERE.parent)}")
    print(f"\nDone. {len(SITES)} public sites generated.")


if __name__ == '__main__':
    main()
