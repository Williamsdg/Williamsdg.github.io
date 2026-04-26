#!/usr/bin/env python3
"""Generate trade-specific contractor dashboards from a shared template.

Produces preview/<slug>/index.html for each trade in TRADES below.
Run: python3 preview/_dashboard_generator.py
"""
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent  # .../preview

# ------------------------------------------------------------------------------
# Trade configs
# ------------------------------------------------------------------------------
TRADES = [
    {
        "slug": "hvac-dashboard",
        "biz": "Climate Air Pros",
        "sub": "HVAC",
        "initials": "CA",
        "phone": "(205) 555-COOL",
        "domain": "climateairpros.com",
        "primary": "#2563eb",
        "primary_dark": "#1a2a5e",
        "hero": "HVAC Operations Dashboard",
        "kpis": [
            {"label": "Service Calls This Week", "value": "12", "sub": "5 emergency"},
            {"label": "Tons Installed (MTD)", "value": "47", "sub": "AC + heat pump"},
            {"label": "Filters / Coils Replaced", "value": "84", "sub": "This month"},
            {"label": "Active Maintenance Plans", "value": "126", "sub": "Recurring revenue"},
        ],
        "job_types": [
            "AC Maintenance", "AC Installation", "AC Repair",
            "Furnace Install", "Furnace Repair", "Heat Pump Install",
            "Duct Cleaning", "Emergency Service", "Energy Audit",
        ],
        "employee_role_senior": "Senior Technician",
        "employee_role_mid": "HVAC Technician",
        "employee_role_junior": "Apprentice Tech",
        "inventory": [
            ("AC Condenser 3-Ton", "Units", 4, 2, "$1,850"),
            ("16x25 Air Filter", "Cases", 12, 10, "$38"),
            ("Refrigerant R-410A", "Cylinders", 6, 4, "$220"),
            ("Copper Line Set 3/8\"", "Rolls", 8, 5, "$145"),
            ("Furnace Ignitor", "Units", 14, 8, "$42"),
            ("Thermostat (Smart)", "Units", 9, 5, "$180"),
        ],
        "estimates_seed": [
            {"client": "Patterson Family", "email": "patterson@email.com", "addr": "412 Brookwood Dr, Vestavia Hills, AL", "service": "AC Installation - 3 Ton", "amount": 5840, "status": "Sent", "date": "Apr 22, 2026", "notes": "Includes new condenser, evaporator coil, and 10-year warranty."},
            {"client": "Henderson Residence", "email": "k.henderson@email.com", "addr": "188 Oakdale Ln, Mountain Brook, AL", "service": "Furnace Replacement", "amount": 3290, "status": "Pending", "date": "Apr 24, 2026", "notes": "Existing furnace is 22 years old. Replacing with high-efficiency 96% AFUE unit."},
            {"client": "Riverside Apartments", "email": "manager@riversideapts.com", "addr": "2300 Cahaba Rd, Birmingham, AL", "service": "Annual Maintenance Contract (12 units)", "amount": 4800, "status": "Sent", "date": "Apr 19, 2026", "notes": "Quarterly maintenance for all 12 HVAC units. Net 30."},
        ],
        "jobs_seed": [
            {"client": "Mrs. Patterson", "service": "AC Installation - 3 Ton", "addr": "412 Brookwood Dr, Vestavia Hills, AL", "emp": "Marcus Reed", "time": "08:00", "offset_days": 0},
            {"client": "Greg Sanders", "service": "Emergency Service - No Cool", "addr": "75 Mountain Park Rd, Hoover, AL", "emp": "Tony Vasquez", "time": "11:30", "offset_days": 0},
            {"client": "Riverside Apts Unit 4B", "service": "Quarterly Maintenance", "addr": "2300 Cahaba Rd, Birmingham, AL", "emp": "Devon Carter", "time": "09:00", "offset_days": 1},
        ],
        "extras": ["maintenance"],
    },
    {
        "slug": "plumbing-dashboard",
        "biz": "FlowRight Plumbing & Gas",
        "sub": "Plumbing / Gas",
        "initials": "FR",
        "phone": "(205) 555-FLOW",
        "domain": "flowrightplumbing.com",
        "primary": "#0d9488",
        "primary_dark": "#134e4a",
        "hero": "Plumbing & Gas Operations",
        "kpis": [
            {"label": "Service Calls This Week", "value": "18", "sub": "4 emergency"},
            {"label": "Drains Cleared (MTD)", "value": "42", "sub": "Avg 2.1 hrs each"},
            {"label": "Water Heaters Installed", "value": "11", "sub": "This month"},
            {"label": "Gas Line Permits Pulled", "value": "6", "sub": "Active jobs"},
        ],
        "job_types": [
            "Leak Repair", "Drain Cleaning", "Water Heater Install",
            "Gas Line Install", "Gas Line Repair", "Sewer Line Service",
            "Repipe Job", "Fixture Install", "Emergency Service",
        ],
        "employee_role_senior": "Master Plumber",
        "employee_role_mid": "Journeyman Plumber",
        "employee_role_junior": "Apprentice Plumber",
        "inventory": [
            ("PEX Tubing 1/2\"", "Rolls", 14, 8, "$68"),
            ("Copper Pipe 3/4\"", "Sticks", 22, 12, "$32"),
            ("Water Heater 50gal", "Units", 3, 2, "$720"),
            ("Black Gas Pipe 1\"", "Sticks", 18, 10, "$44"),
            ("Wax Ring Seal", "Units", 36, 20, "$5"),
            ("Copper Fittings Kit", "Cases", 9, 6, "$85"),
        ],
        "estimates_seed": [
            {"client": "Patricia Lawson", "email": "p.lawson@email.com", "addr": "1820 Glen Iris Dr, Birmingham, AL", "service": "Water Heater Install (50gal)", "amount": 1840, "status": "Sent", "date": "Apr 23, 2026", "notes": "Old tank leaking. Includes haul-away and 6-year warranty."},
            {"client": "Henderson Kitchen Remodel", "email": "k.henderson@email.com", "addr": "188 Oakdale Ln, Mountain Brook, AL", "service": "Repipe + Gas Line for Range", "amount": 4720, "status": "Pending", "date": "Apr 24, 2026", "notes": "Coordinating with general contractor. Inspector visit scheduled May 5."},
            {"client": "Cahaba Bistro", "email": "manager@cahababistro.com", "addr": "1100 28th St S, Birmingham, AL", "service": "Commercial Sewer Line Service", "amount": 1280, "status": "Pending", "date": "Apr 22, 2026", "notes": "Recurring quarterly. Net 15 terms."},
        ],
        "jobs_seed": [
            {"client": "Mrs. Lawson", "service": "Water Heater Install", "addr": "1820 Glen Iris Dr, Birmingham, AL", "emp": "Brian Mitchell", "time": "07:30", "offset_days": 0},
            {"client": "John Walker", "service": "Emergency Leak Repair", "addr": "44 Indian Hill Rd, Mountain Brook, AL", "emp": "Dale Robertson", "time": "10:00", "offset_days": 0},
            {"client": "Henderson Residence", "service": "Gas Line Install - Range", "addr": "188 Oakdale Ln, Mountain Brook, AL", "emp": "Brian Mitchell", "time": "08:00", "offset_days": 1},
        ],
        "extras": [],
    },
    {
        "slug": "home-services-dashboard",
        "biz": "HomeCare Services Co.",
        "sub": "Home Services",
        "initials": "HC",
        "phone": "(205) 555-HOME",
        "domain": "homecareservices.com",
        "primary": "#059669",
        "primary_dark": "#064e3b",
        "hero": "Home Services Dashboard",
        "kpis": [
            {"label": "Visits This Week", "value": "22", "sub": "Across 18 customers"},
            {"label": "Service Requests Open", "value": "9", "sub": "Awaiting schedule"},
            {"label": "Avg Job Length", "value": "1.8 hrs", "sub": "On-site time"},
            {"label": "Repeat Customers (MTD)", "value": "63%", "sub": "+8% vs last month"},
        ],
        "job_types": [
            "Handyman Repair", "Appliance Install", "Drywall Patch",
            "Painting", "Fixture Swap", "Door / Lock Repair",
            "Seasonal Maintenance", "Pressure Washing", "Emergency Call",
        ],
        "employee_role_senior": "Lead Service Pro",
        "employee_role_mid": "Service Technician",
        "employee_role_junior": "Service Assistant",
        "inventory": [
            ("Sheetrock Mud Bucket", "Buckets", 10, 5, "$22"),
            ("Paint (Primer White)", "Gallons", 18, 10, "$34"),
            ("Caulk (Silicone)", "Tubes", 48, 24, "$8"),
            ("Light Fixtures Stock", "Units", 14, 8, "$45"),
            ("Door Hardware Kit", "Sets", 22, 12, "$38"),
            ("Cleaning Supplies Kit", "Cases", 8, 4, "$65"),
        ],
        "estimates_seed": [
            {"client": "Diane Whitmore", "email": "d.whitmore@email.com", "addr": "55 Crestline Park, Birmingham, AL", "service": "Spring Maintenance Bundle", "amount": 480, "status": "Sent", "date": "Apr 21, 2026", "notes": "Gutter clean, deck pressure wash, deck stain. Bundled at 15% off."},
            {"client": "The Walkers", "email": "walkers@email.com", "addr": "320 Camp Horner Rd, Mountain Brook, AL", "service": "Interior Painting (3 rooms)", "amount": 1620, "status": "Pending", "date": "Apr 23, 2026", "notes": "Sherwin-Williams Emerald, includes prep and 2 coats."},
            {"client": "Carter Family", "email": "carters@email.com", "addr": "780 Cherokee Rd, Vestavia Hills, AL", "service": "Door Hardware + Fixture Swap", "amount": 320, "status": "Sent", "date": "Apr 24, 2026", "notes": "Replace 6 door knobs, 4 light fixtures. Customer-supplied parts."},
        ],
        "jobs_seed": [
            {"client": "Diane Whitmore", "service": "Pressure Washing - Deck", "addr": "55 Crestline Park, Birmingham, AL", "emp": "Robert Pearson", "time": "08:00", "offset_days": 0},
            {"client": "Lisa Thompson", "service": "Drywall Patch + Paint Touch-up", "addr": "210 Oak Ridge Cir, Hoover, AL", "emp": "Carla Mendoza", "time": "10:30", "offset_days": 0},
            {"client": "Carter Family", "service": "Fixture Swap (4 lights)", "addr": "780 Cherokee Rd, Vestavia Hills, AL", "emp": "Robert Pearson", "time": "13:00", "offset_days": 1},
        ],
        "extras": [],
    },
    {
        "slug": "water-dashboard",
        "biz": "AquaLine Water Services",
        "sub": "Water",
        "initials": "AQ",
        "phone": "(205) 555-AQUA",
        "domain": "aqualinewater.com",
        "primary": "#0891b2",
        "primary_dark": "#155e75",
        "hero": "Water Systems Dashboard",
        "kpis": [
            {"label": "Wells Serviced (MTD)", "value": "14", "sub": "Inspect + filter"},
            {"label": "Pumps Installed", "value": "6", "sub": "This month"},
            {"label": "Filtration Systems Live", "value": "82", "sub": "Under contract"},
            {"label": "Emergency Calls", "value": "3", "sub": "This week"},
        ],
        "job_types": [
            "Well Drilling", "Pump Installation", "Water Filtration",
            "Softener Install", "Water Line Repair", "Pressure Test",
            "Well Inspection", "Filter Service", "Emergency Service",
        ],
        "employee_role_senior": "Lead Water Specialist",
        "employee_role_mid": "Water Systems Tech",
        "employee_role_junior": "Field Assistant",
        "inventory": [
            ("Submersible Pump 1HP", "Units", 3, 2, "$680"),
            ("Water Filter Cartridge", "Cases", 14, 8, "$48"),
            ("Softener Resin Bag", "Bags", 12, 6, "$72"),
            ("PVC Well Pipe 1.25\"", "Sticks", 28, 15, "$22"),
            ("Pressure Tank 20gal", "Units", 4, 2, "$340"),
            ("Well Seal Kit", "Units", 9, 5, "$55"),
        ],
        "estimates_seed": [
            {"client": "Bartlett Farm", "email": "bartlett@email.com", "addr": "4400 Hwy 280, Chelsea, AL", "service": "Pump Replacement (1HP Submersible)", "amount": 2840, "status": "Sent", "date": "Apr 22, 2026", "notes": "Existing pump 14 years old, intermittent failures. Includes pull, install, pressure test."},
            {"client": "Cooper Property", "email": "j.cooper@email.com", "addr": "1820 Hwy 119, Alabaster, AL", "service": "Whole-Home Filtration + Softener", "amount": 3680, "status": "Pending", "date": "Apr 24, 2026", "notes": "Hard water issues. Includes annual filter service plan."},
            {"client": "Reynolds Family", "email": "reynolds@email.com", "addr": "295 Lake Ridge Dr, Pelham, AL", "service": "Annual Well Inspection + Test", "amount": 320, "status": "Sent", "date": "Apr 18, 2026", "notes": "Recurring annual contract. Water quality test included."},
        ],
        "jobs_seed": [
            {"client": "Bartlett Farm", "service": "Pump Pull + Replace", "addr": "4400 Hwy 280, Chelsea, AL", "emp": "Eli Marshall", "time": "07:00", "offset_days": 0},
            {"client": "Reynolds Family", "service": "Filter Service - 6mo", "addr": "295 Lake Ridge Dr, Pelham, AL", "emp": "Jamal Chen", "time": "10:30", "offset_days": 0},
            {"client": "Cooper Property", "service": "Filtration System Install", "addr": "1820 Hwy 119, Alabaster, AL", "emp": "Eli Marshall", "time": "08:00", "offset_days": 1},
        ],
        "extras": ["maintenance"],
    },
    {
        "slug": "power-dashboard",
        "biz": "VoltWorks Electrical",
        "sub": "Electrical / Power",
        "initials": "VW",
        "phone": "(205) 555-VOLT",
        "domain": "voltworkselectrical.com",
        "primary": "#d97706",
        "primary_dark": "#7c2d12",
        "hero": "Electrical Operations Dashboard",
        "kpis": [
            {"label": "Service Calls This Week", "value": "16", "sub": "2 emergency"},
            {"label": "Panel Upgrades (MTD)", "value": "8", "sub": "200A avg"},
            {"label": "Permits Pending", "value": "5", "sub": "Awaiting inspection"},
            {"label": "EV Chargers Installed", "value": "12", "sub": "This year"},
        ],
        "job_types": [
            "Panel Upgrade", "New Circuit Install", "Outlet Install",
            "Lighting Install", "Generator Install", "EV Charger Install",
            "Troubleshoot / Diagnose", "Surge Protection", "Emergency Service",
        ],
        "employee_role_senior": "Master Electrician",
        "employee_role_mid": "Journeyman Electrician",
        "employee_role_junior": "Apprentice Electrician",
        "inventory": [
            ("12-2 Romex Wire", "Rolls", 22, 12, "$98"),
            ("200A Breaker Panel", "Units", 3, 2, "$520"),
            ("20A Breaker", "Units", 44, 24, "$14"),
            ("Outlet (GFCI)", "Boxes", 18, 10, "$28"),
            ("EV Charger Hardware", "Units", 4, 2, "$640"),
            ("LED Recessed Light", "Units", 38, 20, "$22"),
        ],
        "estimates_seed": [
            {"client": "Smith Residence", "email": "smith@email.com", "addr": "612 Highland Park Dr, Birmingham, AL", "service": "200A Panel Upgrade + EV Charger", "amount": 4280, "status": "Sent", "date": "Apr 23, 2026", "notes": "Tesla Wall Connector. Permit pulled, inspection May 1."},
            {"client": "Bishop Building Co.", "email": "ops@bishopbuild.com", "addr": "1810 1st Ave N, Birmingham, AL", "service": "Commercial Lighting Retrofit", "amount": 8640, "status": "Pending", "date": "Apr 24, 2026", "notes": "60 LED recessed fixtures, 3 circuits. Net 30."},
            {"client": "Greenwood Home", "email": "greenwood@email.com", "addr": "44 Brookhaven Cir, Vestavia Hills, AL", "service": "Whole-Home Surge + Generator Connect", "amount": 2160, "status": "Sent", "date": "Apr 21, 2026", "notes": "Includes 22kW Generac transfer switch installation."},
        ],
        "jobs_seed": [
            {"client": "Smith Residence", "service": "Panel Upgrade Day 1", "addr": "612 Highland Park Dr, Birmingham, AL", "emp": "Frank Delgado", "time": "07:00", "offset_days": 0},
            {"client": "Wilson Property", "service": "Emergency - Power Out", "addr": "330 Mountain Brook Pkwy, Mountain Brook, AL", "emp": "Sarah Knox", "time": "11:00", "offset_days": 0},
            {"client": "Greenwood Home", "service": "Generator Transfer Switch", "addr": "44 Brookhaven Cir, Vestavia Hills, AL", "emp": "Frank Delgado", "time": "08:30", "offset_days": 1},
        ],
        "extras": ["maintenance"],
    },
    {
        "slug": "flooring-dashboard",
        "biz": "Grainline Flooring Co.",
        "sub": "Hardwood / Carpet",
        "initials": "GL",
        "phone": "(205) 555-WOOD",
        "domain": "grainlineflooring.com",
        "primary": "#92400e",
        "primary_dark": "#451a03",
        "hero": "Flooring Install Dashboard",
        "kpis": [
            {"label": "Sqft Installed (MTD)", "value": "8,420", "sub": "Hardwood + carpet"},
            {"label": "Active Job Sites", "value": "5", "sub": "Crews dispatched"},
            {"label": "Material Lead Time", "value": "9 days", "sub": "Avg from order"},
            {"label": "Refinish Jobs Booked", "value": "7", "sub": "Next 30 days"},
        ],
        "job_types": [
            "Hardwood Install", "Hardwood Refinish", "Carpet Install",
            "Carpet Repair", "Subfloor Prep", "Tile Transition",
            "Measure / Estimate", "Stair Tread Install", "Floor Repair",
        ],
        "employee_role_senior": "Lead Installer",
        "employee_role_mid": "Flooring Installer",
        "employee_role_junior": "Install Assistant",
        "inventory": [
            ("Oak Hardwood 3/4\"", "Sqft", 1800, 800, "$6.80"),
            ("Carpet Pad Roll", "Rolls", 14, 8, "$110"),
            ("Carpet - Mid Grade", "Sqyd", 420, 200, "$28"),
            ("Underlayment Roll", "Rolls", 18, 10, "$42"),
            ("Floor Finish (Poly)", "Gallons", 22, 12, "$58"),
            ("Tack Strip Bundle", "Bundles", 12, 6, "$34"),
        ],
        "estimates_seed": [
            {"client": "The Murphy Residence", "email": "murphy@email.com", "addr": "1240 Cherokee Bend, Mountain Brook, AL", "service": "Hardwood Install - 1,200 sqft Main Floor", "amount": 14640, "status": "Sent", "date": "Apr 21, 2026", "notes": "Red oak 3/4\". Includes subfloor prep, demo of existing carpet, install, and finish."},
            {"client": "Henderson Renovation", "email": "k.henderson@email.com", "addr": "188 Oakdale Ln, Mountain Brook, AL", "service": "Hardwood Refinish - Whole House", "amount": 4820, "status": "Pending", "date": "Apr 24, 2026", "notes": "Sand and refinish 1,400 sqft existing oak. 4-day project."},
            {"client": "Lakeside Townhomes", "email": "manager@lakesidetownhomes.com", "addr": "750 Inverness Pkwy, Hoover, AL", "service": "Carpet Replacement - Unit 12", "amount": 1840, "status": "Sent", "date": "Apr 23, 2026", "notes": "Mid-grade carpet, 320 sqyd. Move-out turnover."},
        ],
        "jobs_seed": [
            {"client": "Murphy Residence", "service": "Hardwood Install Day 2", "addr": "1240 Cherokee Bend, Mountain Brook, AL", "emp": "Vince Holloway", "time": "07:30", "offset_days": 0},
            {"client": "Lakeside Unit 12", "service": "Carpet Install", "addr": "750 Inverness Pkwy, Hoover, AL", "emp": "Marco Rivera", "time": "09:00", "offset_days": 0},
            {"client": "Henderson Renovation", "service": "Refinish Day 1 - Sand", "addr": "188 Oakdale Ln, Mountain Brook, AL", "emp": "Vince Holloway", "time": "08:00", "offset_days": 1},
        ],
        "takeoff_unit": "sqft",
        "takeoff_waste_default": 12,
        "extras": ["takeoff"],
    },
    {
        "slug": "windows-dashboard",
        "biz": "ClearView Window Installers",
        "sub": "Window Install",
        "initials": "CV",
        "phone": "(205) 555-VIEW",
        "domain": "clearviewwindows.com",
        "primary": "#1e40af",
        "primary_dark": "#1e3a8a",
        "hero": "Window Install Dashboard",
        "kpis": [
            {"label": "Windows Installed (MTD)", "value": "184", "sub": "Across 22 homes"},
            {"label": "Pending Measurements", "value": "8", "sub": "Awaiting site visit"},
            {"label": "Full-Home Projects", "value": "3", "sub": "Active this week"},
            {"label": "Avg Project Size", "value": "9 windows", "sub": "Per home"},
        ],
        "job_types": [
            "Window Measurement", "Single Window Install", "Full-Home Install",
            "Glass Replacement", "Frame Repair", "Seal / Weatherize",
            "Storm Window Install", "Screen Install", "Inspection",
        ],
        "employee_role_senior": "Lead Window Installer",
        "employee_role_mid": "Window Installer",
        "employee_role_junior": "Install Assistant",
        "inventory": [
            ("Double-Hung Window 36x54", "Units", 12, 6, "$385"),
            ("Picture Window 48x48", "Units", 4, 2, "$520"),
            ("Casement Window 30x48", "Units", 6, 3, "$440"),
            ("Shim Bundle", "Bundles", 28, 15, "$12"),
            ("Window Caulk", "Tubes", 60, 30, "$9"),
            ("Fiberglass Insulation", "Rolls", 14, 8, "$48"),
        ],
        "estimates_seed": [
            {"client": "The Beaumont Family", "email": "beaumont@email.com", "addr": "920 Roebuck Dr, Birmingham, AL", "service": "Full-Home Replacement (14 windows)", "amount": 8960, "status": "Sent", "date": "Apr 22, 2026", "notes": "Energy-efficient double-hung. Includes haul-away, lifetime warranty."},
            {"client": "Hartwell Renovation", "email": "hartwell@email.com", "addr": "210 Lakeshore Dr, Vestavia Hills, AL", "service": "5-Window Replacement (Front Elevation)", "amount": 3240, "status": "Pending", "date": "Apr 24, 2026", "notes": "Custom casement on living room. 6-week lead time on units."},
            {"client": "Crestwood HOA", "email": "board@crestwoodhoa.com", "addr": "Multiple addresses, Crestwood, AL", "service": "Storm Window Audit (40 units)", "amount": 1200, "status": "Sent", "date": "Apr 19, 2026", "notes": "Recurring annual seal/weatherize check across HOA."},
        ],
        "jobs_seed": [
            {"client": "Beaumont Family", "service": "Full-Home Install Day 1", "addr": "920 Roebuck Dr, Birmingham, AL", "emp": "Wade Harrison", "time": "07:00", "offset_days": 0},
            {"client": "Owens Property", "service": "Glass Replacement (storm damage)", "addr": "412 Cahaba Heights Rd, Birmingham, AL", "emp": "Tomas Gallardo", "time": "10:00", "offset_days": 0},
            {"client": "Hartwell Renovation", "service": "Window Measurement", "addr": "210 Lakeshore Dr, Vestavia Hills, AL", "emp": "Wade Harrison", "time": "08:30", "offset_days": 1},
        ],
        "extras": [],
    },
    {
        "slug": "roofing-dashboard",
        "biz": "Summit Ridge Roofing",
        "sub": "Roof Install",
        "initials": "SR",
        "phone": "(205) 555-ROOF",
        "domain": "summitridgeroofing.com",
        "primary": "#991b1b",
        "primary_dark": "#7f1d1d",
        "hero": "Roofing Operations Dashboard",
        "kpis": [
            {"label": "Squares Installed (MTD)", "value": "286", "sub": "Across 14 homes"},
            {"label": "Pending Inspections", "value": "9", "sub": "Storm damage claims"},
            {"label": "Active Job Sites", "value": "4", "sub": "Crews dispatched"},
            {"label": "Insurance Claims Open", "value": "12", "sub": "Awaiting adjuster"},
        ],
        "job_types": [
            "Roof Inspection", "Shingle Replacement", "Full Roof Install",
            "Metal Roof Install", "Leak Repair", "Flashing Repair",
            "Gutter Install", "Storm Damage Assessment", "Emergency Tarp",
        ],
        "employee_role_senior": "Lead Roofer",
        "employee_role_mid": "Roofing Installer",
        "employee_role_junior": "Roofing Assistant",
        "estimates_seed": [
            {"client": "The Calloway Family", "email": "calloway@email.com", "addr": "1820 Riverchase Pkwy, Hoover, AL", "service": "Full Roof Replacement (Storm Damage)", "amount": 18420, "status": "Pending", "date": "Apr 23, 2026", "notes": "Hail damage from March 2026 storm. Insurance claim #SF-44872 — Allstate."},
            {"client": "Whitfield Residence", "email": "whitfield@email.com", "addr": "640 Cahaba River Rd, Birmingham, AL", "service": "Shingle Replacement (south slope)", "amount": 4280, "status": "Sent", "date": "Apr 22, 2026", "notes": "30-year architectural shingles. 3-day project."},
            {"client": "Mt. Laurel Church", "email": "office@mtlaurel.org", "addr": "100 Church Hill Dr, Birmingham, AL", "service": "Metal Roof Install (Sanctuary)", "amount": 28640, "status": "Pending", "date": "Apr 18, 2026", "notes": "Standing seam, 22-gauge. Capital project — board approval pending."},
        ],
        "jobs_seed": [
            {"client": "Calloway Family", "service": "Storm Damage Inspection", "addr": "1820 Riverchase Pkwy, Hoover, AL", "emp": "Cole Bennett", "time": "08:00", "offset_days": 0},
            {"client": "Whitfield Residence", "service": "Shingle Replacement Day 1", "addr": "640 Cahaba River Rd, Birmingham, AL", "emp": "Drew Phillips", "time": "06:30", "offset_days": 0},
            {"client": "Anderson Property", "service": "Emergency Tarp - Active Leak", "addr": "55 Brookwood Trail, Vestavia Hills, AL", "emp": "Cole Bennett", "time": "13:00", "offset_days": 0},
        ],
        "inventory": [
            ("Architectural Shingles", "Squares", 68, 30, "$110"),
            ("Metal Roof Panels", "Panels", 42, 20, "$85"),
            ("Roofing Underlayment", "Rolls", 18, 10, "$95"),
            ("Roofing Nails", "Boxes", 24, 12, "$38"),
            ("Flashing (Aluminum)", "Rolls", 14, 8, "$52"),
            ("Ridge Vent", "Sticks", 22, 12, "$28"),
        ],
        "extras": ["aerial", "claims"],
    },
    {
        "slug": "sheetrock-dashboard",
        "biz": "PlumLine Drywall",
        "sub": "Sheetrock",
        "initials": "PL",
        "phone": "(205) 555-WALL",
        "domain": "plumlinedrywall.com",
        "primary": "#4338ca",
        "primary_dark": "#312e81",
        "hero": "Drywall Dashboard",
        "kpis": [
            {"label": "Sheets Hung (MTD)", "value": "1,240", "sub": "Across 8 jobs"},
            {"label": "Active Job Sites", "value": "6", "sub": "Crews dispatched"},
            {"label": "Patch Jobs This Week", "value": "11", "sub": "Avg 2 hrs each"},
            {"label": "Sqft Finished (MTD)", "value": "39,680", "sub": "Tape + texture"},
        ],
        "job_types": [
            "Hang Sheetrock", "Tape & Mud", "Texture / Finish",
            "Patch Repair", "Ceiling Repair", "Full Room Install",
            "Skim Coat", "Demo", "Remodel Prep",
        ],
        "employee_role_senior": "Lead Drywall Finisher",
        "employee_role_mid": "Drywall Hanger",
        "employee_role_junior": "Drywall Apprentice",
        "inventory": [
            ("1/2\" Drywall 4x8", "Sheets", 220, 100, "$14"),
            ("5/8\" Fire-Rated 4x8", "Sheets", 88, 40, "$18"),
            ("Joint Compound Bucket", "Buckets", 34, 18, "$16"),
            ("Drywall Tape Roll", "Rolls", 42, 20, "$5"),
            ("Corner Bead", "Sticks", 60, 30, "$4"),
            ("Drywall Screws 1-1/4\"", "Boxes", 18, 10, "$28"),
        ],
        "estimates_seed": [
            {"client": "Brookhaven Custom Homes", "email": "build@brookhavenhomes.com", "addr": "Lot 14, Brookhaven Estates, Hoover, AL", "service": "New Construction Drywall (4,200 sqft)", "amount": 12480, "status": "Sent", "date": "Apr 22, 2026", "notes": "Hang, tape, mud, knockdown texture. Coordinated with framer schedule."},
            {"client": "Henderson Renovation", "email": "k.henderson@email.com", "addr": "188 Oakdale Ln, Mountain Brook, AL", "service": "Kitchen + Living Room (820 sqft)", "amount": 3640, "status": "Pending", "date": "Apr 24, 2026", "notes": "Includes ceiling skim coat to remove popcorn texture."},
            {"client": "Riverview Apts B-202", "email": "manager@riverviewapts.com", "addr": "2300 Cahaba Rd, Birmingham, AL", "service": "Water Damage Repair (ceiling + wall)", "amount": 980, "status": "Sent", "date": "Apr 23, 2026", "notes": "Insurance work — Liberty Mutual claim."},
        ],
        "jobs_seed": [
            {"client": "Brookhaven Lot 14", "service": "Hang Day 2 - Upstairs", "addr": "Lot 14, Brookhaven Estates, Hoover, AL", "emp": "Hector Salinas", "time": "07:00", "offset_days": 0},
            {"client": "Riverview Apts B-202", "service": "Patch + Mud", "addr": "2300 Cahaba Rd, Birmingham, AL", "emp": "Wes Cardona", "time": "10:00", "offset_days": 0},
            {"client": "Henderson Renovation", "service": "Skim Coat - Kitchen Ceiling", "addr": "188 Oakdale Ln, Mountain Brook, AL", "emp": "Hector Salinas", "time": "08:00", "offset_days": 1},
        ],
        "takeoff_unit": "sqft",
        "takeoff_waste_default": 10,
        "extras": ["takeoff"],
    },
    {
        "slug": "framing-dashboard",
        "biz": "Ironwood Framing Co.",
        "sub": "Framing",
        "initials": "IW",
        "phone": "(205) 555-WOOD",
        "domain": "ironwoodframing.com",
        "primary": "#166534",
        "primary_dark": "#14532d",
        "hero": "Framing Operations Dashboard",
        "kpis": [
            {"label": "Linear Ft Framed (MTD)", "value": "12,640", "sub": "Walls + floor"},
            {"label": "Active Builds", "value": "5", "sub": "New + addition"},
            {"label": "Inspections Pending", "value": "3", "sub": "Rough-in framing"},
            {"label": "Sqft Under Roof (MTD)", "value": "8,940", "sub": "Closed-in this month"},
        ],
        "job_types": [
            "Framing Estimate", "Wall Framing", "Floor Framing",
            "Roof Framing", "Addition Frame", "Remodel Frame",
            "Deck Frame", "Structural Repair", "Demo & Rebuild",
        ],
        "employee_role_senior": "Lead Framer",
        "employee_role_mid": "Carpenter / Framer",
        "employee_role_junior": "Framing Apprentice",
        "inventory": [
            ("2x4x8 Studs", "Pieces", 480, 200, "$4.20"),
            ("2x6x10 Studs", "Pieces", 220, 100, "$8.80"),
            ("2x10x12 Joists", "Pieces", 120, 60, "$19"),
            ("OSB Sheathing 7/16\"", "Sheets", 180, 80, "$22"),
            ("LVL Beam 11-7/8\"", "Pieces", 14, 8, "$180"),
            ("Framing Nails 16d", "Boxes", 28, 12, "$48"),
        ],
        "estimates_seed": [
            {"client": "Brookhaven Lot 14", "email": "build@brookhavenhomes.com", "addr": "Lot 14, Brookhaven Estates, Hoover, AL", "service": "Full Frame - 3,200 sqft New Construction", "amount": 38400, "status": "Sent", "date": "Apr 21, 2026", "notes": "Wall + floor + roof framing. Includes engineered LVL beams. 3-week schedule."},
            {"client": "The Garrick Addition", "email": "garrick@email.com", "addr": "455 Mountain Brook Pkwy, Mountain Brook, AL", "service": "440 sqft Addition Frame", "amount": 9200, "status": "Pending", "date": "Apr 24, 2026", "notes": "Tying into existing structure. Requires structural inspection."},
            {"client": "Tucker Custom Deck", "email": "tucker@email.com", "addr": "1812 Cliff Rd, Birmingham, AL", "service": "Deck Frame (16x20)", "amount": 4640, "status": "Sent", "date": "Apr 22, 2026", "notes": "Pressure-treated. Permit pulled. Inspection scheduled May 8."},
        ],
        "jobs_seed": [
            {"client": "Brookhaven Lot 14", "service": "Wall Framing - First Floor", "addr": "Lot 14, Brookhaven Estates, Hoover, AL", "emp": "Cliff Bowman", "time": "06:30", "offset_days": 0},
            {"client": "Tucker Deck", "service": "Deck Frame - Set Posts", "addr": "1812 Cliff Rd, Birmingham, AL", "emp": "Mike Tanaka", "time": "09:00", "offset_days": 0},
            {"client": "Garrick Addition", "service": "Demo + Tie-In Prep", "addr": "455 Mountain Brook Pkwy, Mountain Brook, AL", "emp": "Cliff Bowman", "time": "07:30", "offset_days": 1},
        ],
        "takeoff_unit": "sqft",
        "takeoff_waste_default": 15,
        "extras": ["takeoff"],
    },
    {
        "slug": "brick-dashboard",
        "biz": "Cornerstone Masonry",
        "sub": "Brick & Masonry",
        "initials": "CM",
        "phone": "(205) 555-BRIK",
        "domain": "cornerstonemasonry.com",
        "primary": "#b45309",
        "primary_dark": "#78350f",
        "hero": "Masonry Operations Dashboard",
        "kpis": [
            {"label": "Bricks Laid (MTD)", "value": "18,420", "sub": "Across 6 jobs"},
            {"label": "Active Job Sites", "value": "4", "sub": "Crews dispatched"},
            {"label": "Tuckpointing Jobs", "value": "7", "sub": "This week"},
            {"label": "Chimney Repairs (MTD)", "value": "9", "sub": "Inspect + repair"},
        ],
        "job_types": [
            "Brick Install", "Brick Repair", "Tuckpointing",
            "Chimney Repair", "Retaining Wall", "Patio Install",
            "Fireplace Build", "Stone Veneer", "Inspection",
        ],
        "employee_role_senior": "Master Mason",
        "employee_role_mid": "Bricklayer",
        "employee_role_junior": "Mason's Helper",
        "inventory": [
            ("Standard Red Brick", "Pallets", 18, 8, "$420"),
            ("Mortar Mix (Type N)", "Bags", 240, 120, "$9"),
            ("Portland Cement", "Bags", 88, 40, "$14"),
            ("Stone Veneer Panel", "Sqft", 680, 300, "$9.50"),
            ("Rebar #4", "Sticks", 140, 60, "$8"),
            ("Brick Ties", "Boxes", 32, 16, "$24"),
        ],
        "estimates_seed": [
            {"client": "Brookhaven Lot 14", "email": "build@brookhavenhomes.com", "addr": "Lot 14, Brookhaven Estates, Hoover, AL", "service": "Full Brick Veneer (3,200 sqft)", "amount": 26880, "status": "Sent", "date": "Apr 21, 2026", "notes": "Standard red brick. Coordinated with framer schedule. 4-week project."},
            {"client": "The Atherton Patio", "email": "atherton@email.com", "addr": "920 Country Club Dr, Mountain Brook, AL", "service": "Brick Patio (480 sqft) + Retaining Wall", "amount": 11240, "status": "Pending", "date": "Apr 23, 2026", "notes": "Includes 32 ft retaining wall, 24\" tall. Permit submitted."},
            {"client": "Henderson Chimney", "email": "k.henderson@email.com", "addr": "188 Oakdale Ln, Mountain Brook, AL", "service": "Chimney Tuckpointing + Cap Repair", "amount": 1840, "status": "Sent", "date": "Apr 22, 2026", "notes": "Failing mortar joints. New stainless cap. 2-day job."},
        ],
        "jobs_seed": [
            {"client": "Brookhaven Lot 14", "service": "Brick Veneer Day 3 - Front", "addr": "Lot 14, Brookhaven Estates, Hoover, AL", "emp": "Antonio Pereira", "time": "06:30", "offset_days": 0},
            {"client": "Henderson Chimney", "service": "Tuckpointing - Day 1", "addr": "188 Oakdale Ln, Mountain Brook, AL", "emp": "Reggie Tate", "time": "08:00", "offset_days": 0},
            {"client": "Atherton Patio", "service": "Footing Pour - Retaining Wall", "addr": "920 Country Club Dr, Mountain Brook, AL", "emp": "Antonio Pereira", "time": "07:00", "offset_days": 1},
        ],
        "takeoff_unit": "sqft",
        "takeoff_waste_default": 8,
        "extras": ["takeoff"],
    },
    {
        "slug": "landscaping-dashboard",
        "biz": "Greenline Landscape Co.",
        "sub": "Landscaping",
        "initials": "GL",
        "phone": "(205) 555-LAWN",
        "domain": "greenlinelandscape.com",
        "primary": "#15803d",
        "primary_dark": "#14532d",
        "hero": "Landscaping Operations Dashboard",
        "kpis": [
            {"label": "Active Mow Routes", "value": "8", "sub": "126 weekly stops"},
            {"label": "Installs This Week", "value": "5", "sub": "Sod, mulch, plants"},
            {"label": "MRR (Maintenance)", "value": "$18,420", "sub": "+$640 vs last month"},
            {"label": "Crews in Field Today", "value": "4", "sub": "22 stops total"},
        ],
        "job_types": [
            "Mow & Edge", "Fertilization", "Mulch Install",
            "Sod Install", "Tree / Shrub Install", "Hedge Trim",
            "Leaf Cleanup", "Aeration / Overseed", "Landscape Design",
        ],
        "employee_role_senior": "Crew Lead",
        "employee_role_mid": "Landscape Tech",
        "employee_role_junior": "Crew Member",
        "inventory": [
            ("Hardwood Mulch (Brown)", "Yards", 28, 15, "$42"),
            ("Pine Straw Bales", "Bales", 240, 100, "$5.50"),
            ("Centipede Sod", "Pallets", 14, 8, "$220"),
            ("Bermuda Sod", "Pallets", 9, 5, "$240"),
            ("13-13-13 Fertilizer", "Bags", 38, 20, "$28"),
            ("Trimmer Line .095", "Spools", 22, 12, "$18"),
        ],
        "estimates_seed": [
            {"client": "The Atherton Residence", "email": "atherton@email.com", "addr": "920 Country Club Dr, Mountain Brook, AL", "service": "Landscape Refresh — Mulch + Plant Install", "amount": 4280, "status": "Sent", "date": "Apr 23, 2026", "notes": "16 yards hardwood mulch, 24 azaleas, 8 boxwoods. Front bed redesign."},
            {"client": "Ridgewood HOA", "email": "board@ridgewoodhoa.com", "addr": "Ridgewood Subdivision, Hoover, AL", "service": "Annual Maintenance Contract (42 lots)", "amount": 38640, "status": "Pending", "date": "Apr 24, 2026", "notes": "Weekly mow, monthly fertilizer, leaf cleanup x2/yr. Net 30 quarterly billing."},
            {"client": "The Henderson Backyard", "email": "k.henderson@email.com", "addr": "188 Oakdale Ln, Mountain Brook, AL", "service": "Sod Install — 4,200 sqft", "amount": 6440, "status": "Sent", "date": "Apr 22, 2026", "notes": "Bermuda sod. Includes soil prep, irrigation tie-in, 30-day water plan."},
        ],
        "jobs_seed": [
            {"client": "Mountain Brook Route 3", "service": "Mow & Edge — 6 stops", "addr": "Mountain Brook (Route 3)", "emp": "Diego Vega", "time": "07:00", "offset_days": 0},
            {"client": "Atherton Residence", "service": "Mulch + Plant Install Day 1", "addr": "920 Country Club Dr, Mountain Brook, AL", "emp": "Sam Whitfield", "time": "08:30", "offset_days": 0},
            {"client": "Henderson Backyard", "service": "Sod Install", "addr": "188 Oakdale Ln, Mountain Brook, AL", "emp": "Diego Vega", "time": "07:00", "offset_days": 1},
        ],
        "takeoff_unit": "sqft",
        "takeoff_waste_default": 10,
        "extras": ["maintenance", "takeoff", "aerial", "route"],
    },
]

AREA = "Birmingham Metro, AL"


# ------------------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------------------
def js_escape(s):
    """Embed a Python string into a JS string literal safely."""
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")


def jobs_seed_js(t):
    """Build a JS array literal of seed jobs with offset_days resolved at load time."""
    items = []
    for i, j in enumerate(t["jobs_seed"]):
        items.append({
            "id": f"JOB-{i+1:03d}",
            "offsetDays": j["offset_days"],
            "time": j["time"],
            "job": j["service"],
            "addr": j["addr"],
            "emp": j["emp"],
            "client": j["client"],
        })
    return json.dumps(items)


def estimates_seed_js(t):
    items = {}
    for i, e in enumerate(t["estimates_seed"]):
        eid = f"EST-{i+1:03d}"
        items[eid] = {
            "num": eid,
            "client": e["client"],
            "email": e["email"],
            "addr": e["addr"],
            "items": [{"desc": e["service"], "qty": 1, "price": e["amount"]}],
            "notes": e["notes"],
            "date": e["date"],
            "status": e["status"],
        }
    return json.dumps(items)


def employee_options(domain):
    return "".join(
        f'<option value="emp{i}@{domain}">Employee {name}</option>'
        for i, name in enumerate(["One", "Two", "Three", "Four"], start=1)
    )


# ------------------------------------------------------------------------------
# Build the HTML
# ------------------------------------------------------------------------------
def build_html(t):
    biz = t["biz"]
    sub = t["sub"]
    primary = t["primary"]
    primary_dark = t["primary_dark"]
    initials = t["initials"]
    phone = t["phone"]
    domain = t["domain"]
    slug = t["slug"]
    roles = {
        "senior": t["employee_role_senior"],
        "mid": t["employee_role_mid"],
        "junior": t["employee_role_junior"],
    }
    jobs_list = t["job_types"]
    job_options_html = "".join(f"<option>{j}</option>" for j in jobs_list)
    inv_rows = "".join(
        f'<tr><td style="font-weight:600">{name}</td><td>{unit}</td>'
        f'<td>{qty}</td><td>{reorder}</td>'
        f'<td>{cost}</td>'
        f'<td>{"<span class=\"badge badge-completed\">In Stock</span>" if qty > reorder else "<span class=\"badge badge-pending\">Reorder</span>"}</td></tr>'
        for (name, unit, qty, reorder, cost) in t["inventory"]
    )
    kpi_cards_html = "".join(
        f'<div class="stat-card"><div class="stat-label">{k["label"]}</div>'
        f'<div class="stat-value">{k["value"]}</div>'
        f'<div class="stat-sub">{k["sub"]}</div></div>'
        for k in t["kpis"]
    )
    seed_estimates_json = estimates_seed_js(t)
    seed_jobs_json = jobs_seed_js(t)
    extras = t.get("extras", [])

    # Conditional nav items + pages
    nav_extras = ""
    page_extras = ""
    if "maintenance" in extras:
        nav_extras += (
            '<button class="nav-item" data-page="maintenance" onclick="switchPage(\'maintenance\',this)">'
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
            '<path d="M21 12a9 9 0 1 1-9-9c2.485 0 4.736.998 6.364 2.636L21 8"/>'
            '<polyline points="21 3 21 8 16 8"/></svg>Maintenance Plans</button>'
        )
        page_extras += MAINTENANCE_PAGE_HTML
    if "takeoff" in extras:
        unit = t.get("takeoff_unit", "sqft")
        waste = t.get("takeoff_waste_default", 10)
        nav_extras += (
            '<button class="nav-item" data-page="takeoff" onclick="switchPage(\'takeoff\',this)">'
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
            '<rect x="3" y="3" width="18" height="18" rx="2"/>'
            '<line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>'
            '<line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>Takeoff Calculator</button>'
        )
        page_extras += takeoff_page_html(t, unit, waste)
    if "claims" in extras:
        nav_extras += (
            '<button class="nav-item" data-page="claims" onclick="switchPage(\'claims\',this)">'
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
            '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>'
            '<polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/>'
            '<line x1="9" y1="17" x2="15" y2="17"/></svg>Insurance Claims</button>'
        )
        page_extras += CLAIMS_PAGE_HTML
    if "aerial" in extras:
        nav_extras += (
            '<button class="nav-item" data-page="aerial" onclick="switchPage(\'aerial\',this)">'
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
            '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>'
            '<line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>Aerial Measure</button>'
        )
        page_extras += AERIAL_PAGE_HTML
    if "route" in extras:
        nav_extras += (
            '<button class="nav-item" data-page="route" onclick="switchPage(\'route\',this)">'
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
            '<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/>'
            '<path d="M6 16V8a4 4 0 0 1 4-4h8"/></svg>Today\'s Route</button>'
        )
        page_extras += ROUTE_PAGE_HTML

    page_titles_extra = ""
    for extra, title in [
        ("maintenance", "Maintenance Plans"),
        ("takeoff", "Takeoff Calculator"),
        ("claims", "Insurance Claims"),
        ("aerial", "Aerial Measurement"),
        ("route", "Today's Route"),
    ]:
        if extra in extras:
            page_titles_extra += f",{extra}:'{js_escape(title)}'"

    # Leaflet on dashboards that have a map page (aerial or route)
    aerial_libs = ""
    if "aerial" in extras or "route" in extras:
        aerial_libs = (
            '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>\n'
            '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>\n'
        )
    if "aerial" in extras:
        aerial_libs += (
            '<link rel="stylesheet" href="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css"/>\n'
            '<script src="https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js"></script>\n'
        )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>{biz} | Operations Dashboard</title>
    <meta property="og:title" content="{biz} — Operations Dashboard">
    <meta property="og:description" content="{t['hero']} powered by Williams Digital">
    <meta property="og:type" content="website">
    <meta name="theme-color" content="{primary}">
    <link rel="icon" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='{primary}'/><text x='32' y='42' font-family='Inter,sans-serif' font-size='28' font-weight='800' fill='white' text-anchor='middle'>{initials}</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet">
    {aerial_libs}<style>
        *,*::before,*::after{{margin:0;padding:0;box-sizing:border-box}}
        :root{{
            --primary:{primary};--primary-dark:{primary_dark};
            --gold:#d4af37;--gold-soft:#b8941f;--gold-glow:rgba(212,175,55,0.18);
            --green:#34d399;--green-l:rgba(52,211,153,0.14);
            --orange:#fbbf24;--orange-l:rgba(251,191,36,0.14);
            --red:#f87171;--red-l:rgba(248,113,113,0.14);
            --r:14px;
            --serif:'Fraunces',Georgia,serif;
            /* Default = dark luxury */
            --bg:#070b1a;
            --canvas:radial-gradient(1200px 800px at 85% -10%, rgba(108,99,255,0.12), transparent 60%), radial-gradient(900px 700px at -10% 100%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%), #070b1a;
            --surface:rgba(255,255,255,0.035);
            --surface-strong:rgba(255,255,255,0.06);
            --surface-soft:rgba(255,255,255,0.02);
            --text:#f1f3f9;
            --text-soft:#c8cfdb;
            --text-mute:#7a86a0;
            --border:rgba(255,255,255,0.09);
            --border-soft:rgba(255,255,255,0.05);
            --border-strong:rgba(255,255,255,0.16);
            --row-hover:rgba(255,255,255,0.035);
            --shadow-glow:0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px -28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
            /* legacy aliases used by other code */
            --white:rgba(255,255,255,0.06);
            --g50:rgba(255,255,255,0.03);
            --g100:rgba(255,255,255,0.04);
            --g200:rgba(255,255,255,0.08);
            --g300:#cbd5e1;--g400:#94a3b8;--g500:var(--text-mute);--g700:var(--text-soft);--g800:var(--text);--g900:var(--text);
        }}
        [data-theme="light"]{{
            --bg:#f5f4ef;
            --canvas:radial-gradient(1200px 800px at 90% -20%, rgba(212,175,55,0.10), transparent 60%), #f5f4ef;
            --surface:#ffffff;
            --surface-strong:#ffffff;
            --surface-soft:#fafaf6;
            --text:#0b1120;
            --text-soft:#39414f;
            --text-mute:#6b7280;
            --border:rgba(11,17,32,0.10);
            --border-soft:rgba(11,17,32,0.05);
            --border-strong:rgba(11,17,32,0.18);
            --row-hover:rgba(11,17,32,0.025);
            --shadow-glow:0 1px 3px rgba(11,17,32,0.06), 0 8px 24px -12px rgba(11,17,32,0.10);
            --white:#fff;--g50:#f8f7f1;--g100:#eeece2;--g200:#e2e0d2;--g700:#39414f;--g800:#0b1120;--g900:#0b1120;
        }}
        html{{scroll-behavior:smooth}}
        body{{font-family:'Inter',system-ui,sans-serif;background:var(--canvas) fixed;color:var(--text);line-height:1.55;min-height:100vh;-webkit-font-smoothing:antialiased;letter-spacing:-0.005em}}
        .layout{{display:flex;min-height:100vh}}
        ::selection{{background:var(--gold-glow);color:var(--text)}}
        /* SIDEBAR */
        .sidebar{{width:264px;background:linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));border-right:1px solid var(--border-soft);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);position:fixed;top:0;left:0;bottom:0;display:flex;flex-direction:column;z-index:50;transition:transform .3s}}
        [data-theme="light"] .sidebar{{background:linear-gradient(180deg, #0b1120, #0b1120);border-right:none}}
        .sidebar-header{{padding:30px 24px 22px;border-bottom:1px solid rgba(255,255,255,0.06)}}
        .sidebar-logo{{font-family:var(--serif);font-weight:500;font-size:1.4rem;letter-spacing:-0.01em;color:#fff;text-decoration:none;line-height:1.1;display:block}}
        .sidebar-sub{{font-size:.66rem;color:var(--gold);text-transform:uppercase;letter-spacing:2.5px;margin-top:8px;font-weight:600}}
        .sidebar-nav{{flex:1;padding:18px 14px;display:flex;flex-direction:column;gap:2px;overflow-y:auto}}
        .nav-item{{display:flex;align-items:center;gap:14px;padding:11px 16px;border-radius:10px;color:#9ca3b0;text-decoration:none;font-size:.88rem;font-weight:500;letter-spacing:0.01em;transition:all .2s;cursor:pointer;border:none;background:none;width:100%;text-align:left;position:relative}}
        .nav-item:hover{{background:rgba(255,255,255,0.04);color:#fff}}
        .nav-item.active{{background:rgba(255,255,255,0.06);color:#fff}}
        .nav-item.active::before{{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:18px;background:var(--gold);border-radius:0 2px 2px 0}}
        .nav-item svg{{width:18px;height:18px;flex-shrink:0;opacity:0.7}}
        .nav-item.active svg{{opacity:1}}
        .sidebar-footer{{padding:18px 22px;border-top:1px solid rgba(255,255,255,0.06);font-size:.72rem;color:#5e6878;display:flex;align-items:center;justify-content:space-between;gap:8px}}
        .theme-toggle{{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#cfd5e0;border-radius:6px;padding:5px 10px;cursor:pointer;font-size:.7rem;font-weight:600;letter-spacing:0.02em;font-family:inherit}}
        .theme-toggle:hover{{background:rgba(255,255,255,0.12)}}
        /* MAIN + TOPBAR */
        .main{{margin-left:264px;flex:1}}
        .topbar{{background:rgba(7,11,26,0.65);backdrop-filter:blur(20px) saturate(140%);-webkit-backdrop-filter:blur(20px) saturate(140%);border-bottom:1px solid var(--border-soft);padding:18px 36px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:40;gap:12px;flex-wrap:wrap}}
        [data-theme="light"] .topbar{{background:rgba(245,244,239,0.85)}}
        .topbar h1{{font-family:var(--serif);font-weight:400;font-size:1.45rem;letter-spacing:-0.015em;color:var(--text)}}
        .topbar-right{{display:flex;align-items:center;gap:10px;flex-wrap:wrap}}
        .avatar{{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 60%, var(--gold) 40%));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.8rem;letter-spacing:0.02em;border:1px solid rgba(255,255,255,0.12);box-shadow:0 4px 12px -4px rgba(0,0,0,0.4)}}
        .content{{padding:36px 36px 60px;max-width:1500px}}
        /* GLASS CARDS */
        .card{{background:var(--surface);border-radius:18px;box-shadow:var(--shadow-glow);overflow:hidden;border:1px solid var(--border);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:border-color .25s, transform .25s}}
        .card:hover{{border-color:var(--border-strong)}}
        [data-theme="light"] .card{{backdrop-filter:none;-webkit-backdrop-filter:none}}
        .card-header{{padding:22px 26px 18px;border-bottom:1px solid var(--border-soft);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}}
        .card-header h2{{font-family:var(--serif);font-weight:400;font-size:1.2rem;letter-spacing:-0.01em;color:var(--text)}}
        .card-body{{padding:26px}}
        /* HERO KPI CARDS */
        .stats-row{{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:32px}}
        .stat-card{{background:var(--surface);border-radius:16px;padding:24px 26px 22px;box-shadow:var(--shadow-glow);border:1px solid var(--border);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);position:relative;overflow:hidden;transition:transform .3s, border-color .3s}}
        .stat-card::after{{content:'';position:absolute;top:0;left:24px;right:24px;height:1px;background:linear-gradient(90deg, transparent, var(--gold) 50%, transparent);opacity:0.5}}
        .stat-card:hover{{transform:translateY(-2px);border-color:var(--border-strong)}}
        [data-theme="light"] .stat-card{{backdrop-filter:none;-webkit-backdrop-filter:none}}
        .stat-label{{font-size:.7rem;font-weight:600;color:var(--text-mute);text-transform:uppercase;letter-spacing:1.8px}}
        .stat-value{{font-family:var(--serif);font-weight:400;font-size:2.6rem;line-height:1.05;color:var(--text);margin-top:10px;letter-spacing:-0.02em}}
        .stat-sub{{font-size:.78rem;color:var(--text-mute);margin-top:6px;letter-spacing:0.01em}}
        /* FORMS */
        .form-group{{margin-bottom:20px}}
        .form-group label{{display:block;font-size:.74rem;font-weight:600;color:var(--text-mute);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:8px}}
        .form-group input,.form-group select,.form-group textarea{{width:100%;padding:11px 14px;border:1px solid var(--border);border-radius:10px;font-size:.92rem;font-family:inherit;color:var(--text);background:var(--surface-soft);transition:border-color .2s,box-shadow .2s}}
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus{{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px var(--gold-glow)}}
        .form-group textarea{{resize:vertical;min-height:80px}}
        .form-row{{display:grid;grid-template-columns:1fr 1fr;gap:14px}}
        .form-row-3{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}}
        /* BUTTONS */
        .btn{{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:8px;font-weight:600;font-size:.84rem;letter-spacing:0.02em;font-family:inherit;text-decoration:none;transition:all .25s;cursor:pointer;border:1px solid transparent;white-space:nowrap}}
        .btn-primary{{background:linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 75%, var(--primary-dark)));color:#fff;border-color:rgba(255,255,255,0.12);box-shadow:0 4px 14px -6px color-mix(in srgb, var(--primary) 40%, transparent), inset 0 1px 0 rgba(255,255,255,0.15)}}
        .btn-primary:hover{{box-shadow:0 6px 22px -6px color-mix(in srgb, var(--primary) 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.18);transform:translateY(-1px)}}
        .btn-success{{background:linear-gradient(135deg, var(--green), #10b981);color:#06281e;border-color:rgba(255,255,255,0.18);box-shadow:0 4px 14px -6px rgba(52,211,153,0.4),inset 0 1px 0 rgba(255,255,255,0.2);font-weight:700}}
        .btn-success:hover{{box-shadow:0 6px 22px -6px rgba(52,211,153,0.6),inset 0 1px 0 rgba(255,255,255,0.25);transform:translateY(-1px)}}
        .btn-outline{{background:var(--surface-soft);color:var(--text-soft);border:1px solid var(--border)}}
        .btn-outline:hover{{border-color:var(--gold);color:var(--gold);background:var(--gold-glow)}}
        .btn-ghost{{background:transparent;color:var(--text-mute);border:none;padding:7px 12px}}
        .btn-ghost:hover{{color:var(--text)}}
        .btn-sm{{padding:6px 12px;font-size:.74rem;border-radius:6px}}
        .btn-group{{display:flex;gap:8px;flex-wrap:wrap}}
        /* TABLES */
        table{{width:100%;border-collapse:collapse}}
        th{{text-align:left;padding:12px 18px;font-size:.66rem;font-weight:600;color:var(--text-mute);text-transform:uppercase;letter-spacing:1.8px;border-bottom:1px solid var(--border-soft);background:var(--surface-soft)}}
        td{{padding:14px 18px;font-size:.88rem;border-bottom:1px solid var(--border-soft);vertical-align:middle;color:var(--text);font-weight:500}}
        td:first-child{{color:var(--text-mute);font-weight:500}}
        tr:hover td{{background:var(--row-hover)}}
        /* BADGES */
        .badge{{display:inline-block;padding:3px 10px;border-radius:50px;font-size:.7rem;font-weight:600;letter-spacing:0.02em;white-space:nowrap;border:1px solid transparent}}
        .badge-pending{{background:var(--orange-l);color:var(--orange);border-color:rgba(251,191,36,0.3)}}
        .badge-sent{{background:var(--green-l);color:var(--green);border-color:rgba(52,211,153,0.3)}}
        .badge-scheduled{{background:color-mix(in srgb, var(--primary) 18%, transparent);color:color-mix(in srgb, var(--primary) 60%, white);border-color:color-mix(in srgb, var(--primary) 35%, transparent)}}
        .badge-completed{{background:var(--green-l);color:var(--green);border-color:rgba(52,211,153,0.3)}}
        .badge-claim{{background:var(--red-l);color:var(--red);border-color:rgba(248,113,113,0.3)}}
        .badge-accepted{{background:var(--gold-glow);color:var(--gold);border-color:rgba(212,175,55,0.4);box-shadow:0 0 12px rgba(212,175,55,0.2)}}
        .acceptance-strip{{display:flex;align-items:center;gap:12px;margin-top:14px;padding:14px 16px;background:var(--gold-glow);border:1px solid rgba(212,175,55,0.3);border-radius:10px;font-size:.85rem;color:var(--text-soft)}}
        .acceptance-strip strong{{color:var(--gold);font-weight:700;text-transform:uppercase;letter-spacing:1.5px;font-size:.7rem}}
        .acceptance-strip img{{max-height:48px;background:rgba(255,255,255,0.04);border-radius:6px;padding:4px;border:1px solid var(--border-soft)}}
        .acceptance-strip .accept-name{{font-family:var(--serif);font-size:1.1rem;color:var(--text);letter-spacing:-0.005em;font-weight:500}}
        /* PAGES */
        .page{{display:none}}.page.active{{display:block;animation:fadeIn .3s ease-out}}
        @keyframes fadeIn{{from{{opacity:0;transform:translateY(6px)}}to{{opacity:1;transform:none}}}}
        /* MODALS */
        .modal-overlay{{display:none;position:fixed;inset:0;z-index:100;background:rgba(7,11,26,0.7);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:20px}}
        .modal-overlay.open{{display:flex;animation:fadeIn .25s}}
        .modal{{background:rgba(15,21,40,0.92);border-radius:18px;box-shadow:0 24px 80px -16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);width:100%;max-width:600px;max-height:90vh;overflow-y:auto;border:1px solid var(--border-strong);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px)}}
        [data-theme="light"] .modal{{background:#fff;border:1px solid var(--border)}}
        .modal.modal-lg{{max-width:880px}}
        .modal-header{{padding:22px 26px;border-bottom:1px solid var(--border-soft);display:flex;align-items:center;justify-content:space-between}}
        .modal-header h2{{font-family:var(--serif);font-weight:400;font-size:1.25rem;letter-spacing:-0.01em;color:var(--text)}}
        .modal-close{{background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-mute);line-height:1}}
        .modal-close:hover{{color:var(--text)}}
        .modal-body{{padding:26px}}
        .modal-footer{{padding:18px 26px;border-top:1px solid var(--border-soft);display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap}}
        /* SCHEDULE */
        .schedule-list{{display:flex;flex-direction:column;gap:10px}}
        .schedule-card{{display:flex;align-items:flex-start;gap:16px;padding:16px 20px;background:var(--surface-soft);border-radius:12px;border:1px solid var(--border-soft);border-left:3px solid var(--gold)}}
        .schedule-time{{font-family:var(--serif);font-size:1rem;font-weight:500;color:var(--gold);white-space:nowrap;min-width:72px;letter-spacing:-0.01em}}
        .schedule-info{{flex:1}}
        .schedule-info h4{{font-size:.95rem;font-weight:600;color:var(--text)}}
        .schedule-info p{{font-size:.82rem;color:var(--text-mute);margin-top:3px}}
        .schedule-employee{{display:inline-flex;align-items:center;gap:6px;background:rgba(212,175,55,0.12);color:var(--gold);padding:3px 10px;border-radius:50px;font-size:.7rem;font-weight:600;margin-top:8px;letter-spacing:0.02em;border:1px solid rgba(212,175,55,0.25)}}
        /* ESTIMATE PREVIEW */
        .ep-header{{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:18px;border-bottom:1px solid var(--gold)}}
        .ep-company h3{{font-family:var(--serif);font-weight:400;font-size:1.5rem;color:var(--text);letter-spacing:-0.015em}}
        .ep-company p{{font-size:.8rem;color:var(--text-mute)}}
        .ep-est-num{{text-align:right}}
        .ep-est-num h4{{font-size:.74rem;font-weight:600;color:var(--gold);text-transform:uppercase;letter-spacing:2px}}
        .ep-est-num p{{font-size:.85rem;color:var(--text-mute);margin-top:4px}}
        .ep-parties{{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}}
        .ep-parties h5{{font-size:.66rem;font-weight:700;color:var(--text-mute);text-transform:uppercase;letter-spacing:2px;margin-bottom:6px}}
        .ep-parties p{{font-size:.92rem;color:var(--text-soft);line-height:1.5}}
        .ep-table{{width:100%;border-collapse:collapse;margin-bottom:14px}}
        .ep-table th{{background:transparent;color:var(--gold);padding:10px 14px;font-size:.7rem;text-transform:uppercase;letter-spacing:1.8px;text-align:left;border-bottom:1px solid var(--border)}}
        .ep-table td{{padding:14px;font-size:.92rem;border-bottom:1px solid var(--border-soft)}}
        .ep-table .right{{text-align:right}}
        .ep-totals{{text-align:right;margin-top:8px}}
        .ep-totals .line{{display:flex;justify-content:flex-end;gap:32px;padding:5px 0;font-size:.92rem;color:var(--text-soft)}}
        .ep-totals .line.total{{font-family:var(--serif);font-weight:500;font-size:1.4rem;color:var(--gold);border-top:1px solid var(--border);padding-top:10px;margin-top:6px;letter-spacing:-0.01em}}
        .estimate-preview{{border:1px solid var(--border);border-radius:14px;padding:32px;background:var(--surface-soft);margin-top:14px}}
        /* TOAST */
        .toast{{position:fixed;bottom:32px;right:32px;z-index:200;background:rgba(15,21,40,0.95);color:var(--text);padding:14px 22px;border-radius:10px;font-size:.86rem;font-weight:500;border:1px solid var(--border-strong);box-shadow:0 12px 32px -8px rgba(0,0,0,0.5);transform:translateY(100px);opacity:0;transition:all .3s;max-width:340px;backdrop-filter:blur(12px)}}
        .toast.show{{transform:translateY(0);opacity:1}}
        .toast.success{{border-color:rgba(52,211,153,0.4);background:linear-gradient(135deg, rgba(52,211,153,0.18), rgba(15,21,40,0.95))}}
        .sidebar-toggle{{display:none;background:none;border:none;cursor:pointer;padding:4px}}
        .sidebar-toggle svg{{width:24px;height:24px;color:var(--text)}}
        .sidebar-close{{display:none;position:absolute;top:14px;right:14px;background:none;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer}}
        .report-grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:24px}}
        .bar-row{{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--border-soft)}}
        .bar-row:last-child{{border-bottom:none}}
        .bar-label{{width:160px;font-size:.86rem;font-weight:500;color:var(--text-soft)}}
        .bar-track{{flex:1;height:6px;background:var(--border-soft);border-radius:50px;overflow:hidden}}
        .bar-fill{{height:100%;background:linear-gradient(90deg, var(--primary), var(--gold));border-radius:50px}}
        .bar-value{{width:74px;text-align:right;font-family:var(--serif);font-size:1rem;font-weight:500;color:var(--gold);letter-spacing:-0.01em}}
        .photo-strip{{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}}
        .photo-thumb{{width:44px;height:44px;border-radius:8px;object-fit:cover;border:1px solid var(--border);cursor:pointer}}
        .empty-state{{text-align:center;padding:38px 20px;color:var(--text-mute);font-size:.9rem;font-style:italic}}
        /* TOUR */
        .tour-overlay{{display:none;position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:24px}}
        .tour-overlay.open{{display:flex}}
        .tour-card{{background:rgba(15,21,40,0.95);border:1px solid var(--border-strong);border-radius:18px;max-width:480px;width:100%;padding:32px;box-shadow:0 24px 64px -16px rgba(0,0,0,0.7);backdrop-filter:blur(24px)}}
        [data-theme="light"] .tour-card{{background:#fff}}
        .tour-card h3{{font-family:var(--serif);font-weight:400;font-size:1.55rem;color:var(--text);margin-bottom:10px;letter-spacing:-0.015em}}
        .tour-card p{{color:var(--text-soft);font-size:.95rem;line-height:1.65;margin-bottom:8px}}
        .tour-step-counter{{font-size:.7rem;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:2.5px;margin-bottom:10px}}
        .tour-actions{{display:flex;justify-content:space-between;align-items:center;margin-top:20px;gap:10px}}
        /* TOPBAR ACTIONS */
        .topbar-action{{background:var(--surface);border:1px solid var(--border);color:var(--text-soft);border-radius:8px;padding:8px 14px;font-size:.78rem;font-weight:600;letter-spacing:0.01em;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:6px;transition:all .2s}}
        .topbar-action:hover{{border-color:var(--gold);color:var(--gold);background:var(--gold-glow)}}
        .recording-pulse{{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--red);animation:pulse 1s infinite;margin-right:8px}}
        @keyframes pulse{{0%,100%{{opacity:1}}50%{{opacity:0.4}}}}
        .annotation-tools{{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;padding:12px;background:var(--surface-soft);border-radius:10px;border:1px solid var(--border-soft)}}
        .ann-btn{{padding:6px 12px;border-radius:7px;border:1px solid var(--border);background:var(--surface-soft);color:var(--text-soft);cursor:pointer;font-size:.78rem;font-family:inherit;font-weight:600}}
        .ann-btn.active{{background:var(--gold);color:#070b1a;border-color:var(--gold)}}
        #aerialMap,#routeMap{{height:520px;min-height:520px;border-radius:14px;overflow:hidden;border:1px solid var(--border);background:#0f1530}}
        /* Leaflet UI — make toolbars + attribution legible on dark glass */
        .leaflet-control-attribution{{background:rgba(7,11,26,0.7) !important;color:var(--text-mute) !important;backdrop-filter:blur(8px);font-size:.7rem !important;border-radius:6px 0 0 0;padding:2px 8px !important}}
        .leaflet-control-attribution a{{color:var(--gold) !important}}
        .leaflet-bar a,.leaflet-bar a:hover{{background:rgba(15,21,40,0.92) !important;color:var(--text) !important;border-color:var(--border-strong) !important;backdrop-filter:blur(8px)}}
        .leaflet-bar a.leaflet-disabled{{color:var(--text-mute) !important}}
        .leaflet-draw-toolbar a{{filter:invert(0.9) hue-rotate(180deg)}}
        .leaflet-draw-actions a{{background:rgba(15,21,40,0.95) !important;color:var(--text) !important;border-color:var(--border) !important}}
        .leaflet-popup-content-wrapper,.leaflet-popup-tip{{background:rgba(15,21,40,0.95) !important;color:var(--text) !important;backdrop-filter:blur(12px);border:1px solid var(--border)}}
        .leaflet-tooltip{{background:rgba(15,21,40,0.95) !important;color:var(--text) !important;border:1px solid var(--border) !important}}
        .leaflet-container{{background:#0f1530}}
        /* PALETTE */
        .palette-overlay{{display:none;position:fixed;inset:0;z-index:400;background:rgba(7,11,26,0.7);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);align-items:flex-start;justify-content:center;padding:96px 16px 16px}}
        .palette-overlay.open{{display:flex}}
        .palette{{background:rgba(15,21,40,0.95);border-radius:16px;width:100%;max-width:620px;box-shadow:0 32px 80px -16px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06);overflow:hidden;border:1px solid var(--border-strong);backdrop-filter:blur(24px)}}
        [data-theme="light"] .palette{{background:#fff}}
        .palette-input{{width:100%;padding:20px 24px;border:none;font-size:1rem;font-family:inherit;background:transparent;color:var(--text);outline:none;border-bottom:1px solid var(--border-soft);letter-spacing:0.01em}}
        .palette-input::placeholder{{color:var(--text-mute)}}
        .palette-results{{max-height:420px;overflow-y:auto;padding:8px 0}}
        .palette-section{{font-size:.66rem;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:2px;padding:12px 24px 6px}}
        .palette-item{{display:flex;align-items:center;gap:14px;padding:11px 24px;cursor:pointer;font-size:.92rem;transition:background .15s}}
        .palette-item:hover,.palette-item.active{{background:rgba(212,175,55,0.08)}}
        .palette-item.active{{box-shadow:inset 2px 0 0 var(--gold)}}
        .palette-item .pi-icon{{width:34px;height:34px;border-radius:8px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:700;color:var(--gold);flex-shrink:0;border:1px solid var(--border-soft)}}
        .palette-item .pi-body{{flex:1;min-width:0}}
        .palette-item .pi-title{{font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
        .palette-item .pi-sub{{font-size:.76rem;color:var(--text-mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
        .palette-empty{{padding:40px 20px;text-align:center;color:var(--text-mute);font-size:.9rem;font-style:italic}}
        .palette-hint{{padding:10px 20px;font-size:.7rem;color:var(--text-mute);border-top:1px solid var(--border-soft);display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;background:var(--surface-soft)}}
        .palette-hint kbd{{background:var(--surface);border:1px solid var(--border);padding:1px 6px;border-radius:4px;font-family:inherit;font-size:.68rem;font-weight:600;color:var(--text-soft)}}
        /* BULK BAR */
        .bulk-bar{{display:none;position:sticky;top:74px;z-index:35;background:linear-gradient(135deg, var(--gold) 0%, var(--gold-soft) 100%);color:#070b1a;padding:12px 22px;border-radius:12px;margin-bottom:14px;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;box-shadow:0 8px 24px -8px var(--gold-glow), inset 0 1px 0 rgba(255,255,255,0.3)}}
        .bulk-bar.show{{display:flex}}
        .bulk-bar .bb-count{{font-family:var(--serif);font-weight:500;font-size:1rem;letter-spacing:-0.01em}}
        .bulk-bar .btn{{background:rgba(7,11,26,0.15);color:#070b1a;border:1px solid rgba(7,11,26,0.2);font-weight:700}}
        .bulk-bar .btn:hover{{background:rgba(7,11,26,0.25)}}
        .row-check{{accent-color:var(--gold);width:16px;height:16px;cursor:pointer}}
        /* BOTTOM TABS */
        .bottom-tabs{{display:none;position:fixed;left:0;right:0;bottom:0;background:rgba(7,11,26,0.9);border-top:1px solid var(--border-soft);box-shadow:0 -4px 24px -8px rgba(0,0,0,0.4);backdrop-filter:blur(20px);z-index:38;padding:8px 4px calc(8px + env(safe-area-inset-bottom));justify-content:space-around}}
        [data-theme="light"] .bottom-tabs{{background:rgba(255,255,255,0.95)}}
        .bottom-tabs button{{flex:1;background:none;border:none;color:var(--text-mute);padding:9px 4px;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:.66rem;font-weight:600;letter-spacing:0.04em;cursor:pointer;font-family:inherit;border-radius:8px;text-transform:uppercase}}
        .bottom-tabs button svg{{width:22px;height:22px;opacity:0.8}}
        .bottom-tabs button.active{{color:var(--gold)}}
        .bottom-tabs button.active svg{{opacity:1}}
        /* SCHED CARDS */
        .sched-card{{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px;margin-bottom:12px;box-shadow:var(--shadow-glow);backdrop-filter:blur(14px)}}
        [data-theme="light"] .sched-card{{backdrop-filter:none}}
        .sched-card-head{{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:10px}}
        .sched-card-title{{font-family:var(--serif);font-weight:500;font-size:1.05rem;letter-spacing:-0.005em;color:var(--text)}}
        .sched-card-meta{{font-size:.76rem;color:var(--text-mute);margin-top:3px;letter-spacing:0.02em}}
        .sched-card-body{{font-size:.86rem;color:var(--text);line-height:1.65}}
        .sched-card-body a{{color:var(--gold);text-decoration:none}}
        .sched-card-body strong{{color:var(--text-mute);font-weight:600;font-size:.7rem;text-transform:uppercase;letter-spacing:1.8px;margin-right:8px}}
        .sched-card-actions{{display:flex;gap:6px;flex-wrap:wrap;margin-top:14px}}
        .sched-card-actions .btn{{flex:1;min-width:88px;justify-content:center}}
        .desktop-only{{display:revert}}.mobile-only{{display:none}}
        @media(max-width:1024px){{.stats-row,.report-grid{{grid-template-columns:repeat(2,1fr)}}.form-row-3{{grid-template-columns:1fr}}.content{{padding:24px}}}}
        @media(max-width:768px){{.sidebar{{transform:translateX(-100%)}}.sidebar.open{{transform:translateX(0)}}.sidebar-close,.sidebar-toggle{{display:block}}.main{{margin-left:0;padding-bottom:80px}}.content{{padding:18px 16px 24px}}.topbar{{padding:14px 18px}}.stat-value{{font-size:2.2rem}}.topbar h1{{font-size:1.2rem}}.stats-row,.report-grid{{grid-template-columns:1fr}}.form-row{{grid-template-columns:1fr}}.btn{{padding:9px 16px;font-size:.82rem}}.btn-sm{{padding:6px 10px;font-size:.72rem}}.bottom-tabs{{display:flex}}.desktop-only{{display:none !important}}.mobile-only{{display:block}}.modal-footer{{flex-direction:column-reverse;align-items:stretch}}.modal-footer .btn{{width:100%;justify-content:center}}.bulk-bar{{top:60px}}.palette-overlay{{padding-top:24px}}}}
        @media print{{
            body{{background:#fff;color:#000}}
            .sidebar,.topbar,.btn,.btn-group,.card-header button,.bottom-tabs{{display:none !important}}
            .main{{margin-left:0}}
            .content{{padding:0}}
            .page{{display:none !important}}
            .page#page-estimates{{display:block !important}}
            .page#page-estimates > div:not(#estPreviewArea){{display:none}}
            #estPreviewArea{{display:block !important;margin:0}}
            #estPreviewArea .card{{box-shadow:none;border:none;background:#fff}}
            .estimate-preview{{border:none;padding:0;background:#fff}}
            .ep-company h3,.ep-est-num h4,.ep-totals .line.total{{color:#000}}
            .toast,.tour-overlay,.modal-overlay{{display:none !important}}
        }}
    </style>
</head>
<body>
<aside class="sidebar" id="sidebar">
    <button class="sidebar-close" onclick="document.getElementById('sidebar').classList.remove('open')">&times;</button>
    <div class="sidebar-header">
        <div class="sidebar-logo">{biz}</div>
        <div class="sidebar-sub">{sub} Dashboard</div>
    </div>
    <nav class="sidebar-nav">
        <button class="nav-item active" data-page="dashboard" onclick="switchPage('dashboard',this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Dashboard</button>
        <button class="nav-item" data-page="estimates" onclick="switchPage('estimates',this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>Estimates</button>
        <button class="nav-item" data-page="scheduling" onclick="switchPage('scheduling',this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Scheduling</button>
        <button class="nav-item" data-page="employees" onclick="switchPage('employees',this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Employees</button>
        <button class="nav-item" data-page="inventory" onclick="switchPage('inventory',this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>Inventory</button>
        <button class="nav-item" data-page="reports" onclick="switchPage('reports',this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>Reports</button>
        {nav_extras}
    </nav>
    <div class="sidebar-footer">
        <span>&copy; 2026 {biz}</span>
        <button class="theme-toggle" id="themeToggle" onclick="toggleTheme()" title="Toggle theme">Light</button>
    </div>
</aside>
<div class="main">
    <div class="topbar">
        <div style="display:flex;align-items:center;gap:12px">
            <button class="sidebar-toggle" onclick="document.getElementById('sidebar').classList.toggle('open')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>
            <h1 id="pageTitle">Dashboard</h1>
        </div>
        <div class="topbar-right">
            <button class="topbar-action" onclick="openPalette()" title="Search (⌘K)">🔍 Search <kbd style="background:var(--g100);border-radius:4px;padding:1px 5px;font-size:.7rem;margin-left:4px">⌘K</kbd></button>
            <button class="topbar-action" onclick="shareDemo()" title="Share this demo with current data">↗ Share</button>
            <button class="topbar-action" onclick="startTour()" title="Take the tour">? Tour</button>
            <span style="font-size:.85rem;color:var(--text-mute);display:none" class="hide-mobile">Owner</span>
            <div class="avatar">{initials}</div>
        </div>
    </div>
    <div class="content">
        <!-- DASHBOARD -->
        <div class="page active" id="page-dashboard">
            <div class="stats-row">
                {kpi_cards_html}
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">
                <div class="card"><div class="card-header"><h2>Recent Estimates</h2></div><table><thead><tr><th>Client</th><th>Amount</th><th>Status</th></tr></thead><tbody id="recentEstBody"></tbody></table></div>
                <div class="card"><div class="card-header"><h2>Today's Schedule</h2></div><div class="card-body"><div class="schedule-list" id="todayScheduleBody"></div></div></div>
            </div>
        </div>
        <!-- ESTIMATES -->
        <div class="page" id="page-estimates">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;gap:10px;flex-wrap:wrap">
                <div class="btn-group">
                    <button class="btn btn-primary" onclick="openModal('estimateModal')">+ New Estimate</button>
                    <button class="btn btn-outline" onclick="startVoiceEstimate()" title="Voice-to-estimate (demo)">🎙 Voice Estimate</button>
                    <button class="btn btn-outline" onclick="importAcceptance()" title="Paste a client receipt code to mark accepted (cross-device)">Import Acceptance</button>
                </div>
                <button class="btn btn-ghost btn-sm" onclick="resetDemo()" title="Clear local data">Reset Demo Data</button>
            </div>
            <div class="bulk-bar" id="estBulkBar">
                <span class="bb-count" id="estBulkCount">0 selected</span>
                <div class="btn-group">
                    <button class="btn btn-sm" onclick="bulkEstStatus('Sent')">Mark Sent</button>
                    <button class="btn btn-sm" onclick="bulkEstStatus('Accepted')">Mark Accepted</button>
                    <button class="btn btn-sm" onclick="bulkEstStatus('Paid')">Mark Paid</button>
                    <button class="btn btn-sm" onclick="bulkEstDelete()">Delete</button>
                    <button class="btn btn-sm" onclick="clearSelection('est')">Clear</button>
                </div>
            </div>
            <div class="card"><div class="card-header"><h2>All Estimates</h2></div><div class="desktop-only" style="overflow-x:auto"><table><thead><tr><th style="width:36px"><input type="checkbox" class="row-check" id="estSelectAll" onchange="toggleSelectAll('est',this.checked)"></th><th>#</th><th>Client</th><th>Service</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody id="estBody"></tbody></table></div><div class="mobile-only" id="estMobileBody" style="padding:12px"></div></div>
            <div id="estPreviewArea" style="margin-top:22px;display:none"><div class="card"><div class="card-header"><h2>Estimate Preview</h2><div class="btn-group"><button class="btn btn-primary btn-sm" onclick="sendEst('client')">Email to Client</button><button class="btn btn-outline btn-sm" onclick="openClientView()">Preview as Client</button><button class="btn btn-outline btn-sm" onclick="aiFollowup()">AI Follow-up Draft</button><button class="btn btn-outline btn-sm" onclick="window.print()">Print / PDF</button></div></div><div class="card-body"><div class="estimate-preview" id="estPreviewContent"></div></div></div></div>
        </div>
        <!-- SCHEDULING -->
        <div class="page" id="page-scheduling">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;flex-wrap:wrap;gap:10px">
                <span style="font-family:var(--serif);font-weight:500;color:var(--gold);font-size:1.1rem;letter-spacing:-0.01em">This Week</span>
                <button class="btn btn-primary" onclick="openModal('schedModal')">+ Schedule Job</button>
            </div>
            <div class="bulk-bar" id="schedBulkBar">
                <span class="bb-count" id="schedBulkCount">0 selected</span>
                <div class="btn-group">
                    <button class="btn btn-sm" onclick="bulkSchedStatus('Completed')">Mark Completed</button>
                    <button class="btn btn-sm" onclick="bulkSchedStatus('En Route')">Mark En Route</button>
                    <button class="btn btn-sm" onclick="bulkSchedDelete()">Delete</button>
                    <button class="btn btn-sm" onclick="clearSelection('sched')">Clear</button>
                </div>
            </div>
            <div class="card"><div class="card-header"><h2>Scheduled Jobs</h2></div><div class="desktop-only" style="overflow-x:auto"><table><thead><tr><th style="width:36px"><input type="checkbox" class="row-check" id="schedSelectAll" onchange="toggleSelectAll('sched',this.checked)"></th><th>Date</th><th>Time</th><th>Job</th><th>Address</th><th>Assigned</th><th>Status</th><th></th></tr></thead><tbody id="schedBody"></tbody></table></div><div class="mobile-only" id="schedMobileBody" style="padding:12px"></div></div></div>
        </div>
        <!-- EMPLOYEES -->
        <div class="page" id="page-employees">
            <div class="card"><div class="card-header"><h2>Team Members</h2></div><div style="overflow-x:auto"><table><thead><tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Status</th></tr></thead><tbody>
                <tr><td style="font-weight:600">Employee One</td><td>{roles["senior"]}</td><td>emp1@{domain}</td><td>(205) 555-0001</td><td><span class="badge badge-completed">Active</span></td></tr>
                <tr><td style="font-weight:600">Employee Two</td><td>{roles["mid"]}</td><td>emp2@{domain}</td><td>(205) 555-0002</td><td><span class="badge badge-completed">Active</span></td></tr>
                <tr><td style="font-weight:600">Employee Three</td><td>{roles["mid"]}</td><td>emp3@{domain}</td><td>(205) 555-0003</td><td><span class="badge badge-completed">Active</span></td></tr>
                <tr><td style="font-weight:600">Employee Four</td><td>{roles["junior"]}</td><td>emp4@{domain}</td><td>(205) 555-0004</td><td><span class="badge badge-completed">Active</span></td></tr>
            </tbody></table></div></div>
        </div>
        <!-- INVENTORY -->
        <div class="page" id="page-inventory">
            <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
                <div class="stat-card"><div class="stat-label">SKUs Tracked</div><div class="stat-value">{len(t["inventory"])}</div><div class="stat-sub">Active items</div></div>
                <div class="stat-card"><div class="stat-label">Reorder Needed</div><div class="stat-value">0</div><div class="stat-sub">Below threshold</div></div>
                <div class="stat-card"><div class="stat-label">Est. Inventory Value</div><div class="stat-value">$24.8k</div><div class="stat-sub">On hand</div></div>
            </div>
            <div class="card"><div class="card-header"><h2>Materials &amp; Equipment</h2><button class="btn btn-primary btn-sm">+ Add Item</button></div><div style="overflow-x:auto"><table><thead><tr><th>Item</th><th>Unit</th><th>On Hand</th><th>Reorder Level</th><th>Unit Cost</th><th>Status</th></tr></thead><tbody>
                {inv_rows}
            </tbody></table></div></div>
        </div>
        <!-- REPORTS -->
        <div class="page" id="page-reports">
            <div class="report-grid">
                <div class="stat-card"><div class="stat-label">Revenue (MTD)</div><div class="stat-value">$42,800</div><div class="stat-sub">+12% vs last month</div></div>
                <div class="stat-card"><div class="stat-label">Jobs Completed</div><div class="stat-value">27</div><div class="stat-sub">This month</div></div>
                <div class="stat-card"><div class="stat-label">Avg Ticket Size</div><div class="stat-value">$1,587</div><div class="stat-sub">Per completed job</div></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">
                <div class="card"><div class="card-header"><h2>Revenue by Service</h2></div><div class="card-body">
                    <div class="bar-row"><div class="bar-label">{jobs_list[0]}</div><div class="bar-track"><div class="bar-fill" style="width:82%"></div></div><div class="bar-value">$18.4k</div></div>
                    <div class="bar-row"><div class="bar-label">{jobs_list[1] if len(jobs_list)>1 else jobs_list[0]}</div><div class="bar-track"><div class="bar-fill" style="width:64%"></div></div><div class="bar-value">$12.1k</div></div>
                    <div class="bar-row"><div class="bar-label">{jobs_list[2] if len(jobs_list)>2 else jobs_list[0]}</div><div class="bar-track"><div class="bar-fill" style="width:46%"></div></div><div class="bar-value">$7.8k</div></div>
                    <div class="bar-row"><div class="bar-label">Other</div><div class="bar-track"><div class="bar-fill" style="width:28%"></div></div><div class="bar-value">$4.5k</div></div>
                </div></div>
                <div class="card"><div class="card-header"><h2>Crew Productivity</h2></div><div class="card-body">
                    <div class="bar-row"><div class="bar-label">Employee One</div><div class="bar-track"><div class="bar-fill" style="width:90%"></div></div><div class="bar-value">12 jobs</div></div>
                    <div class="bar-row"><div class="bar-label">Employee Two</div><div class="bar-track"><div class="bar-fill" style="width:72%"></div></div><div class="bar-value">9 jobs</div></div>
                    <div class="bar-row"><div class="bar-label">Employee Three</div><div class="bar-track"><div class="bar-fill" style="width:58%"></div></div><div class="bar-value">7 jobs</div></div>
                    <div class="bar-row"><div class="bar-label">Employee Four</div><div class="bar-track"><div class="bar-fill" style="width:40%"></div></div><div class="bar-value">5 jobs</div></div>
                </div></div>
            </div>
        </div>
        {page_extras}
    </div>
</div>

<!-- ESTIMATE MODAL -->
<div class="modal-overlay" id="estimateModal"><div class="modal">
    <div class="modal-header"><h2>Create Estimate</h2><button class="modal-close" onclick="closeModal('estimateModal')">&times;</button></div>
    <div class="modal-body">
        <div class="form-row"><div class="form-group"><label>Client Name</label><input type="text" id="ecName" placeholder="Client name"></div><div class="form-group"><label>Client Email</label><input type="email" id="ecEmail" placeholder="client@email.com"></div></div>
        <div class="form-group"><label>Client Address</label><input type="text" id="ecAddr" placeholder="Address"></div>
        <div id="lineItems"><div class="form-row-3 li-row"><div class="form-group"><label>Description</label><input type="text" placeholder="Service item"></div><div class="form-group"><label>Qty</label><input type="number" value="1" min="1"></div><div class="form-group"><label>Unit Price ($)</label><input type="number" placeholder="0.00" step="0.01"></div></div></div>
        <button class="btn btn-outline btn-sm" onclick="addLine()" style="margin-bottom:14px">+ Add Line</button>
        <div class="form-group"><label>Notes</label><textarea id="ecNotes" placeholder="Payment terms, special instructions..."></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal('estimateModal')">Cancel</button><button class="btn btn-primary" onclick="createEst()">Create Estimate</button></div>
</div></div>

<!-- SCHEDULE MODAL -->
<div class="modal-overlay" id="schedModal"><div class="modal">
    <div class="modal-header"><h2>Schedule a Job</h2><button class="modal-close" onclick="closeModal('schedModal')">&times;</button></div>
    <div class="modal-body">
        <div class="form-row">
            <div class="form-group"><label>Job Type</label><select id="sjType">{job_options_html}</select></div>
            <div class="form-group"><label>Assign Team Member</label><select id="sjEmp">{employee_options(domain)}</select></div>
        </div>
        <div class="form-group"><label>Job Address</label><input type="text" id="sjAddr" placeholder="Full address"></div>
        <div class="form-row"><div class="form-group"><label>Date</label><input type="date" id="sjDate"></div><div class="form-group"><label>Time</label><input type="time" id="sjTime" value="09:00"></div></div>
        <div class="form-group"><label>Client Name</label><input type="text" id="sjClient" placeholder="Client name"></div>
        <div class="form-group"><label>Notes</label><textarea id="sjNotes" placeholder="Special instructions..."></textarea></div>
        <div style="background:color-mix(in srgb, var(--primary) 12%, transparent);border-radius:10px;padding:13px 16px;margin-top:6px"><p style="font-size:.85rem;color:var(--primary);font-weight:600;margin-bottom:4px">Turn-by-Turn from Current Location</p><p style="font-size:.8rem;color:var(--text-mute)">The notification includes a Google Maps deep-link that opens turn-by-turn navigation from wherever your tech is right now — no manual address entry on their end.</p></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal('schedModal')">Cancel</button><button class="btn btn-outline" onclick="scheduleJob('sms')">Schedule + SMS</button><button class="btn btn-success" onclick="scheduleJob('email')">Schedule + Email</button></div>
</div></div>

<!-- VOICE MODAL -->
<div class="modal-overlay" id="voiceModal"><div class="modal">
    <div class="modal-header"><h2>Voice-to-Estimate</h2><button class="modal-close" onclick="closeModal('voiceModal')">&times;</button></div>
    <div class="modal-body">
        <div id="voiceStage1">
            <p style="font-size:.9rem;color:var(--text-mute);margin-bottom:14px">Tap below and describe the job out loud — your voice gets parsed into a draft estimate.</p>
            <div style="text-align:center;padding:24px">
                <button class="btn btn-primary" onclick="simulateVoice()" style="font-size:1rem;padding:14px 28px">🎙 Start Recording</button>
            </div>
        </div>
        <div id="voiceStage2" style="display:none">
            <p><span class="recording-pulse"></span><span style="font-size:.9rem;color:var(--text-mute)">Listening... say "stop" when done</span></p>
            <div style="margin-top:18px;padding:18px;background:var(--g50);border-radius:10px;font-style:italic;color:var(--g700)" id="voiceTranscript">"..."</div>
        </div>
        <div id="voiceStage3" style="display:none">
            <p style="font-size:.85rem;color:var(--text-mute);margin-bottom:6px">Transcript:</p>
            <div style="padding:14px;background:var(--g50);border-radius:10px;font-style:italic;color:var(--g700);margin-bottom:18px" id="voiceFinalTranscript"></div>
            <p style="font-size:.85rem;color:var(--text-mute);margin-bottom:6px">Parsed estimate:</p>
            <div id="voiceParsedEst"></div>
        </div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal('voiceModal')">Cancel</button><button class="btn btn-primary" id="voiceCreateBtn" onclick="createFromVoice()" style="display:none">Create Estimate</button></div>
</div></div>

<!-- AI FOLLOW-UP MODAL -->
<div class="modal-overlay" id="aiModal"><div class="modal">
    <div class="modal-header"><h2>AI Follow-up Draft</h2><button class="modal-close" onclick="closeModal('aiModal')">&times;</button></div>
    <div class="modal-body">
        <p style="font-size:.85rem;color:var(--text-mute);margin-bottom:10px">Generated draft — edit before sending.</p>
        <div class="form-group"><label>Subject</label><input type="text" id="aiSubject"></div>
        <div class="form-group"><label>Body</label><textarea id="aiBody" rows="10" style="min-height:240px"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal('aiModal')">Cancel</button><button class="btn btn-primary" onclick="aiSend()">Open in Email</button></div>
</div></div>

<!-- PHOTO ANNOTATION MODAL -->
<div class="modal-overlay" id="annModal"><div class="modal modal-lg">
    <div class="modal-header"><h2>Annotate Photo</h2><button class="modal-close" onclick="closeModal('annModal')">&times;</button></div>
    <div class="modal-body">
        <div class="annotation-tools">
            <button class="ann-btn active" onclick="setAnnTool('arrow',this)">↗ Arrow</button>
            <button class="ann-btn" onclick="setAnnTool('circle',this)">○ Circle</button>
            <button class="ann-btn" onclick="setAnnTool('pen',this)">✎ Pen</button>
            <button class="ann-btn" onclick="undoAnn()" style="margin-left:auto">Undo</button>
            <button class="ann-btn" onclick="clearAnn()">Clear</button>
        </div>
        <div style="position:relative;text-align:center;background:var(--g50);border-radius:10px;overflow:hidden">
            <canvas id="annCanvas" style="max-width:100%;cursor:crosshair"></canvas>
        </div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal('annModal')">Cancel</button><button class="btn btn-primary" onclick="saveAnnotation()">Save Annotated Copy</button></div>
</div></div>

<!-- SHARE MODAL -->
<div class="modal-overlay" id="shareModal"><div class="modal">
    <div class="modal-header"><h2>Share This Demo</h2><button class="modal-close" onclick="closeModal('shareModal')">&times;</button></div>
    <div class="modal-body">
        <p style="font-size:.9rem;color:var(--text-mute);margin-bottom:14px">This link includes your current estimates and scheduled jobs. Open it on any device to see the demo with your data.</p>
        <textarea id="shareLink" rows="3" readonly style="width:100%;padding:12px;border:1.5px solid var(--border);border-radius:10px;font-size:.8rem;font-family:monospace;color:var(--text);background:var(--g50)"></textarea>
        <div class="btn-group" style="margin-top:14px"><button class="btn btn-primary btn-sm" onclick="copyShareLink()">Copy Link</button><a class="btn btn-outline btn-sm" id="shareSmsLink" href="#">Open in SMS</a></div>
    </div>
</div></div>

<!-- TOUR -->
<div class="tour-overlay" id="tourOverlay">
    <div class="tour-card">
        <div class="tour-step-counter" id="tourStep">Step 1 of 5</div>
        <h3 id="tourTitle"></h3>
        <p id="tourBody"></p>
        <div class="tour-actions">
            <button class="btn btn-ghost btn-sm" onclick="endTour()">Skip tour</button>
            <div class="btn-group">
                <button class="btn btn-outline btn-sm" id="tourPrev" onclick="tourPrev()">Back</button>
                <button class="btn btn-primary btn-sm" id="tourNext" onclick="tourNext()">Next</button>
            </div>
        </div>
    </div>
</div>

<!-- COMMAND PALETTE -->
<div class="palette-overlay" id="paletteOverlay">
    <div class="palette" role="dialog" aria-label="Search">
        <input type="text" class="palette-input" id="paletteInput" placeholder="Search clients, estimates, jobs… or jump to a page" autocomplete="off">
        <div class="palette-results" id="paletteResults"></div>
        <div class="palette-hint">
            <span><kbd>↑↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>Esc</kbd> Close</span>
        </div>
    </div>
</div>

<!-- BOTTOM TAB BAR (mobile) -->
<nav class="bottom-tabs" aria-label="Mobile navigation">
    <button data-page="dashboard" onclick="switchPage('dashboard')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>Home</button>
    <button data-page="estimates" onclick="switchPage('estimates')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Estimates</button>
    <button data-page="scheduling" onclick="switchPage('scheduling')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Schedule</button>
    <button onclick="openPalette()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Search</button>
    <button onclick="document.getElementById('sidebar').classList.toggle('open')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>Menu</button>
</nav>

<div class="toast" id="toast"></div>

<script>
const BIZ="{js_escape(biz)}",AREA="{AREA}",PHONE="{phone}",SLUG="{slug}";
const STORAGE_KEY="wd-dash-"+SLUG;
const SEED_ESTIMATES={seed_estimates_json};
const SEED_JOB_TEMPLATES={seed_jobs_json};
const PAGE_TITLES={{dashboard:'Dashboard',estimates:'Estimates',scheduling:'Scheduling',employees:'Employees',inventory:'Inventory',reports:'Reports'{page_titles_extra}}};

let estimates={{}},sched=[],ec=3,jc=3,annPhotoCtx={{}};

// ---------- format helpers ----------
const FMT_USD=new Intl.NumberFormat('en-US',{{style:'currency',currency:'USD',maximumFractionDigits:2}});
const FMT_USD0=new Intl.NumberFormat('en-US',{{style:'currency',currency:'USD',maximumFractionDigits:0}});
const FMT_NUM=new Intl.NumberFormat('en-US');
function fmtUsd(v){{return FMT_USD.format(v||0)}}
function fmtUsd0(v){{return FMT_USD0.format(v||0)}}
function fmtNum(v){{return FMT_NUM.format(v||0)}}
function fmtTime(t){{let h=parseInt(t.split(':')[0]),m=t.split(':')[1],ap=h>=12?'PM':'AM';h=h%12||12;return h+':'+m+' '+ap}}
function fmtDate(d,style){{const dt=new Date(d+'T00:00:00');return dt.toLocaleDateString('en-US',style||{{month:'short',day:'numeric'}})}}
function todayISO(off){{const d=new Date();d.setDate(d.getDate()+(off||0));return d.toISOString().slice(0,10)}}

// ---------- persistence ----------
function buildSeedJobs(){{
    return SEED_JOB_TEMPLATES.map(j=>({{...j,date:todayISO(j.offsetDays),email:'emp'+(['Employee One','Employee Two','Employee Three','Employee Four'].indexOf(j.emp)+1)+'@'+'{domain}',status:'Scheduled',photos:[]}}));
}}
function load(){{
    // Check URL fragment for shared state
    if(location.hash.startsWith('#d=')){{
        try{{
            const d=JSON.parse(atob(decodeURIComponent(location.hash.slice(3))));
            estimates=d.estimates||{{}};sched=d.sched||[];ec=d.ec||3;jc=d.jc||3;
            save();
            history.replaceState(null,'',location.pathname+location.search);
            showToast('Demo data loaded from share link','success');
            return;
        }}catch(e){{console.warn('share decode failed',e)}}
    }}
    try{{
        const raw=localStorage.getItem(STORAGE_KEY);
        if(raw){{
            const d=JSON.parse(raw);
            estimates=d.estimates||{{}};sched=d.sched||[];ec=d.ec||3;jc=d.jc||3;
            return;
        }}
    }}catch(e){{}}
    estimates=JSON.parse(JSON.stringify(SEED_ESTIMATES));sched=buildSeedJobs();ec=Object.keys(estimates).length;jc=sched.length;
}}
function save(){{try{{localStorage.setItem(STORAGE_KEY,JSON.stringify({{estimates,sched,ec,jc}}));}}catch(e){{}}}}
function resetDemo(){{if(confirm('Reset demo data? Estimates and scheduled jobs will be cleared.')){{localStorage.removeItem(STORAGE_KEY);load();renderAll();showToast('Demo reset.','success');}}}}

// ---------- share ----------
function shareDemo(){{
    const payload=btoa(JSON.stringify({{estimates,sched,ec,jc}}));
    const url=location.origin+location.pathname+'#d='+encodeURIComponent(payload);
    document.getElementById('shareLink').value=url;
    document.getElementById('shareSmsLink').href='sms:?body='+encodeURIComponent('Check out the demo: '+url);
    openModal('shareModal');
}}
function copyShareLink(){{const t=document.getElementById('shareLink');t.select();document.execCommand('copy');showToast('Link copied to clipboard','success')}}

// ---------- theme ----------
function toggleTheme(){{
    const isLight=document.documentElement.getAttribute('data-theme')==='light';
    if(isLight){{document.documentElement.removeAttribute('data-theme');try{{localStorage.setItem('wd-theme','dark')}}catch(e){{}}document.getElementById('themeToggle').textContent='Light'}}
    else{{document.documentElement.setAttribute('data-theme','light');try{{localStorage.setItem('wd-theme','light')}}catch(e){{}}document.getElementById('themeToggle').textContent='Dark'}}
}}
(function applyTheme(){{try{{
    if(localStorage.getItem('wd-theme')==='light')document.documentElement.setAttribute('data-theme','light');
    setTimeout(()=>{{const t=document.getElementById('themeToggle');if(t)t.textContent=document.documentElement.getAttribute('data-theme')==='light'?'Dark':'Light'}},0);
}}catch(e){{}}}})();

// ---------- nav ----------
function switchPage(p,el){{document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));const target=document.getElementById('page-'+p);if(target)target.classList.add('active');document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));if(el)el.classList.add('active');else{{const navBtn=document.querySelector('.nav-item[data-page="'+p+'"]');if(navBtn)navBtn.classList.add('active')}}document.getElementById('pageTitle').textContent=PAGE_TITLES[p]||'Dashboard';document.getElementById('sidebar').classList.remove('open');if(p==='aerial'&&typeof initAerialMap==='function')initAerialMap();if(p==='route'&&typeof initRouteMap==='function')initRouteMap();syncBottomTabs(p)}}
function openModal(id){{document.getElementById(id).classList.add('open')}}
function closeModal(id){{document.getElementById(id).classList.remove('open')}}
function showToast(m,t){{const e=document.getElementById('toast');e.textContent=m;e.className='toast show'+(t?' '+t:'');setTimeout(()=>e.className='toast',3500)}}

// ---------- estimates ----------
function renderEstimates(){{
    const list=Object.values(estimates).sort((a,b)=>(b.num>a.num?1:-1));
    const tb=document.getElementById('estBody');
    const mob=document.getElementById('estMobileBody');
    tb.innerHTML=list.length?list.map(e=>{{
        const tot=e.items.reduce((s,i)=>s+i.qty*i.price,0);
        const badge=badgeForStatus(e.status);
        const checked=selection.est.has(e.num)?'checked':'';
        return`<tr><td><input type="checkbox" class="row-check" ${{checked}} onchange="toggleSelect('est','${{e.num}}',this.checked)"></td><td>#${{e.num}}</td><td>${{e.client}}<br><span style="font-size:.78rem;color:var(--text-mute)">${{e.email}}</span></td><td>${{e.items[0]?.desc||'Service'}}</td><td>${{fmtUsd(tot)}}</td><td>${{e.date}}</td><td><span class="badge ${{badge}}">${{e.status}}</span></td><td><button class="btn btn-outline btn-sm" onclick="previewEst('${{e.num}}')">View</button></td></tr>`;
    }}).join(''):'<tr><td colspan="8" class="empty-state">No estimates yet. Click "+ New Estimate" to create one.</td></tr>';
    if(mob){{
        mob.innerHTML=list.length?list.map(e=>{{
            const tot=e.items.reduce((s,i)=>s+i.qty*i.price,0);
            const badge=badgeForStatus(e.status);
            return`<div class="sched-card" onclick="previewEst('${{e.num}}')" style="cursor:pointer"><div class="sched-card-head"><div><div class="sched-card-title">${{e.client}}</div><div class="sched-card-meta">#${{e.num}} · ${{e.date}}</div></div><span class="badge ${{badge}}">${{e.status}}</span></div><div class="sched-card-body">${{e.items[0]?.desc||'Service'}}<div style="font-family:var(--serif);font-size:1.4rem;font-weight:500;color:var(--gold);margin-top:8px;letter-spacing:-0.01em">${{fmtUsd(tot)}}</div></div></div>`;
        }}).join(''):'<div class="empty-state">No estimates yet. Tap "+ New Estimate" to create one.</div>';
    }}
    const recent=document.getElementById('recentEstBody');
    if(recent)recent.innerHTML=list.slice(0,3).map(e=>{{const tot=e.items.reduce((s,i)=>s+i.qty*i.price,0);const badge=badgeForStatus(e.status);return`<tr><td>${{e.client}}</td><td>${{fmtUsd0(tot)}}</td><td><span class="badge ${{badge}}">${{e.status}}</span></td></tr>`}}).join('')||'<tr><td colspan="3" class="empty-state">No estimates yet</td></tr>';
    refreshBulkBar('est');
}}
function badgeForStatus(s){{return s==='Accepted'?'badge-accepted':s==='Sent'?'badge-sent':s==='Paid'?'badge-completed':'badge-pending'}}
function previewEst(id){{
    const e=estimates[id];if(!e)return;currentEst=id;
    const sub=e.items.reduce((s,i)=>s+i.qty*i.price,0),tax=sub*0.09,tot=sub+tax;
    let acceptanceHtml='';
    if(e.acceptance){{
        const ts=new Date(e.acceptance.ts);
        const stamp=ts.toLocaleDateString('en-US',{{month:'long',day:'numeric',year:'numeric'}})+' at '+ts.toLocaleTimeString('en-US',{{hour:'numeric',minute:'2-digit'}});
        const sigBlock=e.acceptance.method==='drawn'&&e.acceptance.signature
            ? `<img src="${{e.acceptance.signature}}" alt="Signature">`
            : `<span class="accept-name">${{e.acceptance.name||'Approved'}}</span>`;
        acceptanceHtml=`<div class="acceptance-strip"><div style="flex:1"><strong>Approved by client</strong><div style="margin-top:6px">${{sigBlock}}${{e.acceptance.method==='drawn'&&e.acceptance.name?'<div style="margin-top:6px;font-size:.85rem;color:var(--text-soft)">— '+e.acceptance.name+'</div>':''}}</div><div style="margin-top:8px;font-size:.78rem;color:var(--text-mute)">${{stamp}} · ${{e.acceptance.method==='drawn'?'Drawn signature':'Typed signature'}}</div></div></div>`;
    }}
    document.getElementById('estPreviewContent').innerHTML=`<div class="ep-header"><div class="ep-company"><h3>${{BIZ}}</h3><p>${{AREA}}</p><p>${{PHONE}}</p></div><div class="ep-est-num"><h4>Estimate #${{e.num}}</h4><p>${{e.date}}</p></div></div><div class="ep-parties"><div><h5>From</h5><p><strong>${{BIZ}}</strong><br>${{AREA}}</p></div><div><h5>To</h5><p><strong>${{e.client}}</strong><br>${{e.addr}}<br>${{e.email}}</p></div></div><table class="ep-table"><thead><tr><th>Description</th><th>Qty</th><th class="right">Price</th><th class="right">Total</th></tr></thead><tbody>${{e.items.map(i=>`<tr><td>${{i.desc}}</td><td>${{i.qty}}</td><td class="right">${{fmtUsd(i.price)}}</td><td class="right">${{fmtUsd(i.qty*i.price)}}</td></tr>`).join('')}}</tbody></table><div class="ep-totals"><div class="line"><span>Subtotal</span><span>${{fmtUsd(sub)}}</span></div><div class="line"><span>Tax (9%)</span><span>${{fmtUsd(tax)}}</span></div><div class="line total"><span>Total</span><span>${{fmtUsd(tot)}}</span></div></div>${{e.notes?`<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border-soft)"><p style="font-size:.8rem;color:var(--text-mute)">${{e.notes}}</p></div>`:''}}${{acceptanceHtml}}`;
    document.getElementById('estPreviewArea').style.display='block';
    document.getElementById('estPreviewArea').scrollIntoView({{behavior:'smooth'}});
}}
let currentEst=null;
function approveUrl(e){{
    const base=new URL('../estimate-view/?id='+encodeURIComponent(e.num)+'&trade='+encodeURIComponent(SLUG),location.href).toString();
    const slim={{num:e.num,client:e.client,email:e.email,addr:e.addr,items:e.items,notes:e.notes||'',date:e.date,status:e.status||'Pending'}};
    try{{return base+'#e='+encodeURIComponent(btoa(JSON.stringify(slim)))}}catch(err){{return base}}
}}
function openClientView(){{if(!currentEst){{showToast('Open an estimate first.');return}}window.open(approveUrl(estimates[currentEst]),'_blank')}}
function sendEst(target){{
    if(!currentEst){{showToast('Open an estimate first.');return}}
    const e=estimates[currentEst];if(!e)return;
    const tot=e.items.reduce((s,i)=>s+i.qty*i.price,0);
    const totWithTax=tot*1.09;
    const link=approveUrl(e);
    const firstName=(e.client||'').split(' ')[0]||'there';
    const lineSummary=e.items.map(i=>'• '+i.desc+' — '+fmtUsd(i.qty*i.price)).join('\\n');
    const subj=encodeURIComponent(BIZ+' — Estimate #'+e.num+' for your review');
    const body=encodeURIComponent('Hi '+firstName+',\\n\\nYour estimate from '+BIZ+' is ready for your review.\\n\\nESTIMATE #'+e.num+'\\n'+lineSummary+'\\n\\nTotal (incl. 9% tax): '+fmtUsd(totWithTax)+'\\n\\nApprove & sign:\\n'+link+'\\n\\nThe link above takes you to a private page where you can review every detail and approve with a typed name or signature. No account or app required.\\n\\nQuestions? Reply to this email or call '+PHONE+'.\\n\\nThank you,\\n'+BIZ);
    const to=target==='client'?(e.email||''):'';
    window.open('mailto:'+to+'?subject='+subj+'&body='+body,'_self');
    // Mark as Sent if it wasn't already
    if(target==='client'&&e.status==='Pending'){{e.status='Sent';save();renderEstimates();previewEst(e.num)}}
    showToast(target==='client'?'Estimate emailed to '+(e.client||'client')+' with Approve & Sign link':'Estimate copy emailed to company','success');
}}
// Allow client to import an acceptance receipt manually (cross-device fallback)
function importAcceptance(){{
    const code=prompt('Paste the acceptance receipt code from your client:');
    if(!code)return;
    try{{
        const data=JSON.parse(atob(code.trim()));
        const target=estimates[data.id];
        if(!target){{showToast('No matching estimate (#'+data.id+') in this dashboard.');return}}
        target.status='Accepted';
        target.acceptance={{ts:data.ts,method:data.method||'typed',name:data.name||''}};
        save();renderEstimates();showToast('Acceptance imported for #'+data.id,'success');
    }}catch(e){{showToast('Invalid receipt code.')}}
}}
function addLine(){{const c=document.getElementById('lineItems'),r=document.createElement('div');r.className='form-row-3 li-row';r.innerHTML='<div class="form-group"><label>Description</label><input type="text" placeholder="Service item"></div><div class="form-group"><label>Qty</label><input type="number" value="1" min="1"></div><div class="form-group"><label>Unit Price ($)</label><input type="number" placeholder="0.00" step="0.01"></div>';c.appendChild(r)}}
function createEst(){{const n=document.getElementById('ecName').value.trim(),em=document.getElementById('ecEmail').value.trim(),ad=document.getElementById('ecAddr').value.trim();if(!n||!em){{showToast('Please fill in client name and email.');return}}ec++;const id='EST-'+String(ec).padStart(3,'0'),rows=document.querySelectorAll('#lineItems .li-row'),items=[];rows.forEach(r=>{{const inp=r.querySelectorAll('input');items.push({{desc:inp[0].value.trim()||'Service',qty:parseInt(inp[1].value)||1,price:parseFloat(inp[2].value)||0}})}});const today=new Date().toLocaleDateString('en-US',{{month:'short',day:'numeric',year:'numeric'}});estimates[id]={{num:id,client:n,email:em,addr:ad,items,notes:document.getElementById('ecNotes').value.trim(),date:today,status:'Pending'}};save();renderEstimates();closeModal('estimateModal');showToast('Estimate #'+id+' created!','success');document.getElementById('ecName').value='';document.getElementById('ecEmail').value='';document.getElementById('ecAddr').value='';document.getElementById('ecNotes').value='';document.getElementById('lineItems').innerHTML='<div class="form-row-3 li-row"><div class="form-group"><label>Description</label><input type="text" placeholder="Service item"></div><div class="form-group"><label>Qty</label><input type="number" value="1" min="1"></div><div class="form-group"><label>Unit Price ($)</label><input type="number" placeholder="0.00" step="0.01"></div></div>'}}

// ---------- voice estimate (faked) ----------
const VOICE_SAMPLES=[
    {{transcript:"Need to quote a 3-ton AC installation for the Henderson property at 188 Oakdale Lane. Includes a new condenser, evaporator coil, and the standard 10-year warranty.",client:"Henderson Property",email:"client@email.com",addr:"188 Oakdale Lane",lines:[{{d:"3-Ton AC Installation - Condenser + Coil",q:1,p:5840}},{{d:"10-Year Warranty Coverage",q:1,p:0}}]}},
    {{transcript:"Quote for the Smith job — panel upgrade to 200 amp plus a Tesla wall connector. Permit's already pulled, inspection is scheduled.",client:"Smith Residence",email:"smith@email.com",addr:"Job site address",lines:[{{d:"200A Panel Upgrade",q:1,p:2680}},{{d:"Tesla Wall Connector Install",q:1,p:1280}},{{d:"Permit Fee",q:1,p:320}}]}},
    {{transcript:"Patterson family wants a quote for a full hardwood install — about 1200 square feet of red oak on the main floor, including subfloor prep and finish.",client:"Patterson Family",email:"client@email.com",addr:"Job site address",lines:[{{d:"Red Oak Hardwood 1200 sqft @ $9.20/sqft",q:1,p:11040}},{{d:"Subfloor Prep + Demo",q:1,p:1800}},{{d:"Finish Coat (Poly)",q:1,p:1800}}]}}
];
let voicePick=null;
function startVoiceEstimate(){{
    document.getElementById('voiceStage1').style.display='block';
    document.getElementById('voiceStage2').style.display='none';
    document.getElementById('voiceStage3').style.display='none';
    document.getElementById('voiceCreateBtn').style.display='none';
    openModal('voiceModal');
}}
function simulateVoice(){{
    document.getElementById('voiceStage1').style.display='none';
    document.getElementById('voiceStage2').style.display='block';
    voicePick=VOICE_SAMPLES[Math.floor(Math.random()*VOICE_SAMPLES.length)];
    let i=0;const t=voicePick.transcript;
    const tEl=document.getElementById('voiceTranscript');tEl.textContent='"';
    const interval=setInterval(()=>{{
        if(i>=t.length){{clearInterval(interval);finishVoice()}}
        else{{tEl.textContent='"'+t.slice(0,i+1)+'..."';i+=Math.max(2,Math.floor(Math.random()*4))}}
    }},35);
}}
function finishVoice(){{
    setTimeout(()=>{{
        document.getElementById('voiceStage2').style.display='none';
        document.getElementById('voiceStage3').style.display='block';
        document.getElementById('voiceCreateBtn').style.display='inline-flex';
        document.getElementById('voiceFinalTranscript').textContent='"'+voicePick.transcript+'"';
        const tot=voicePick.lines.reduce((s,l)=>s+l.q*l.p,0);
        document.getElementById('voiceParsedEst').innerHTML=`<div style="border:1.5px solid var(--border);border-radius:10px;padding:14px"><div style="font-weight:700;margin-bottom:6px">${{voicePick.client}}</div><div style="font-size:.85rem;color:var(--text-mute);margin-bottom:10px">${{voicePick.addr}}</div>${{voicePick.lines.map(l=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-soft);font-size:.88rem"><span>${{l.d}}</span><span style="font-weight:600">${{fmtUsd(l.q*l.p)}}</span></div>`).join('')}}<div style="display:flex;justify-content:space-between;padding-top:10px;font-weight:800"><span>Total</span><span>${{fmtUsd(tot)}}</span></div></div>`;
    }},700);
}}
function createFromVoice(){{
    if(!voicePick)return;
    ec++;const id='EST-'+String(ec).padStart(3,'0');
    const today=new Date().toLocaleDateString('en-US',{{month:'short',day:'numeric',year:'numeric'}});
    estimates[id]={{num:id,client:voicePick.client,email:voicePick.email,addr:voicePick.addr,items:voicePick.lines.map(l=>({{desc:l.d,qty:l.q,price:l.p}})),notes:'Created via voice — review before sending.',date:today,status:'Pending'}};
    save();renderEstimates();closeModal('voiceModal');showToast('Voice estimate #'+id+' created — review and send','success');
}}

// ---------- AI follow-up (canned) ----------
function aiFollowup(){{
    if(!currentEst){{showToast('Open an estimate first.');return}}
    const e=estimates[currentEst];const tot=e.items.reduce((s,i)=>s+i.qty*i.price,0);
    const subj=`Following up on your estimate from ${{BIZ}}`;
    const body=`Hi ${{(e.client||'').split(' ')[0]||'there'}},

I wanted to circle back on the estimate I sent over for ${{e.items[0]?.desc||'your project'}} (Estimate #${{e.num}}, ${{fmtUsd(tot)}}).

A few things worth knowing as you weigh next steps:
• We can typically schedule the work within 2 weeks once you give us the green light.
• The estimate is valid for 30 days — material costs have been steady but I want to lock in your pricing if you're ready.
• If anything in the scope needs to change (smaller, larger, or different timing), happy to revise — just reply with what you're thinking.

Would early next week work to get this on the calendar, or would you rather chat through any of the line items first? Either way is fine — whichever helps you decide.

Thanks,
${{BIZ}}
${{PHONE}}`;
    document.getElementById('aiSubject').value=subj;
    document.getElementById('aiBody').value=body;
    openModal('aiModal');
}}
function aiSend(){{
    if(!currentEst)return;const e=estimates[currentEst];
    const subj=encodeURIComponent(document.getElementById('aiSubject').value);
    const body=encodeURIComponent(document.getElementById('aiBody').value);
    window.open('mailto:'+e.email+'?subject='+subj+'&body='+body,'_self');
    closeModal('aiModal');showToast('Follow-up draft opened in email','success');
}}

// ---------- scheduling ----------
function trackerUrl(job){{
    const base=new URL('../job-tracker/?id='+encodeURIComponent(job.id)+'&trade='+encodeURIComponent(SLUG),location.href).toString();
    // Inline minimal job data so the link works on any device, not just the contractor's
    const slim={{id:job.id,date:job.date,time:job.time,job:job.job,addr:job.addr,emp:job.emp,client:job.client,status:job.status,photos:(job.photos||[]).slice(0,4)}};
    try{{return base+'#j='+encodeURIComponent(btoa(JSON.stringify(slim)))}}catch(e){{return base}}
}}
// Builds a Google Maps URL that opens turn-by-turn navigation FROM THE EMPLOYEE'S CURRENT LOCATION
// to the destination address. Origin is omitted so Maps uses the device's GPS.
function navUrl(addr){{return 'https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination='+encodeURIComponent(addr)}}
function dispatchEmail(empEmail,empName,job,client,date,time,addr,notes){{
    const ds=fmtDate(date,{{weekday:'long',month:'long',day:'numeric',year:'numeric'}}),ts=fmtTime(time);
    const url=navUrl(addr);
    const firstName=empName.replace(/^Employee /,'').split(' ')[0];
    const subj=encodeURIComponent('Job Assignment: '+job+' — '+ds);
    const body=encodeURIComponent('Hi '+firstName+',\\n\\nYou have been scheduled:\\n\\nJob: '+job+'\\nClient: '+(client||'N/A')+'\\nDate: '+ds+'\\nTime: '+ts+'\\nAddress: '+addr+'\\n\\nTap to navigate from your current location:\\n'+url+'\\n\\n'+(notes?'Notes: '+notes+'\\n\\n':'')+'Thank you,\\n'+BIZ+'\\n'+PHONE);
    window.open('mailto:'+empEmail+'?subject='+subj+'&body='+body,'_self');
}}
function dispatchSms(empName,job,client,date,time,addr){{
    const ds=fmtDate(date,{{weekday:'short',month:'short',day:'numeric'}}),ts=fmtTime(time);
    const url=navUrl(addr);
    const firstName=empName.replace(/^Employee /,'').split(' ')[0];
    const body=encodeURIComponent(BIZ+': New job for '+firstName+'.\\n'+job+(client?' for '+client:'')+'\\n'+ds+' at '+ts+'\\n'+addr+'\\nNavigate: '+url);
    window.open('sms:?&body='+body,'_self');
}}
function renderSched(){{
    const tb=document.getElementById('schedBody');
    const mob=document.getElementById('schedMobileBody');
    tb.innerHTML=sched.length?sched.map((s,i)=>{{
        const url=navUrl(s.addr);
        const photoCount=(s.photos||[]).length;
        const photoLabel=photoCount?photoCount+' photo'+(photoCount===1?'':'s'):'+ Photos';
        const checked=selection.sched.has(s.id)?'checked':'';
        return`<tr><td><input type="checkbox" class="row-check" ${{checked}} onchange="toggleSelect('sched','${{s.id}}',this.checked)"></td><td>${{fmtDate(s.date)}}</td><td>${{fmtTime(s.time)}}</td><td style="font-weight:600">${{s.job}}</td><td><a href="${{url}}" target="_blank" style="color:var(--primary);text-decoration:none">${{s.addr}}</a></td><td>${{s.emp}}</td><td><select onchange="setStatus(${{i}},this.value)" style="border:1px solid var(--border);border-radius:8px;padding:4px 8px;font-size:.78rem;background:var(--surface);color:var(--text)"><option ${{s.status==='Scheduled'?'selected':''}}>Scheduled</option><option ${{s.status==='En Route'?'selected':''}}>En Route</option><option ${{s.status==='Completed'?'selected':''}}>Completed</option></select></td><td><div class="btn-group"><button class="btn btn-outline btn-sm" onclick="sendTracker(${{i}})" title="Send tracker link to customer">Tracker</button><label class="btn btn-outline btn-sm" style="cursor:pointer;margin:0">${{photoLabel}}<input type="file" accept="image/*" multiple style="display:none" onchange="addPhotos(${{i}},this)"></label>${{photoCount?`<button class="btn btn-outline btn-sm" onclick="viewPhotos(${{i}})">View</button>`:''}}<button class="btn btn-outline btn-sm" onclick="resend(${{i}},'email')" title="Resend dispatch email">Email</button><button class="btn btn-outline btn-sm" onclick="resend(${{i}},'sms')" title="SMS dispatch">SMS</button></div></td></tr>`;
    }}).join(''):'<tr><td colspan="8" class="empty-state">No jobs scheduled. Click "+ Schedule Job".</td></tr>';
    if(mob){{
        mob.innerHTML=sched.length?sched.map((s,i)=>{{
            const url=navUrl(s.addr);
            const photoCount=(s.photos||[]).length;
            const badge=s.status==='Completed'?'badge-completed':s.status==='En Route'?'badge-sent':'badge-scheduled';
            return`<div class="sched-card" data-job-id="${{s.id}}"><div class="sched-card-head"><div><div class="sched-card-title">${{s.job}}</div><div class="sched-card-meta">${{fmtDate(s.date)}} · ${{fmtTime(s.time)}} · ${{s.emp}}</div></div><span class="badge ${{badge}}">${{s.status}}</span></div><div class="sched-card-body"><strong>Client</strong>${{s.client}}<br><strong>Where</strong><a href="${{url}}" target="_blank">${{s.addr}}</a></div><div class="sched-card-actions"><button class="btn btn-primary btn-sm" onclick="window.open('${{url}}','_blank')">📍 Navigate</button><button class="btn btn-outline btn-sm" onclick="sendTracker(${{i}})">Tracker</button><button class="btn btn-outline btn-sm" onclick="resend(${{i}},'sms')">SMS Tech</button><label class="btn btn-outline btn-sm" style="cursor:pointer;margin:0">${{photoCount?photoCount+' 📷':'📷 Photo'}}<input type="file" accept="image/*" capture="environment" multiple style="display:none" onchange="addPhotos(${{i}},this)"></label>${{photoCount?`<button class="btn btn-outline btn-sm" onclick="viewPhotos(${{i}})">View</button>`:''}}<select onchange="setStatus(${{i}},this.value);renderSched()" style="flex:1;min-width:120px;border:1.5px solid var(--border);border-radius:8px;padding:6px 10px;font-size:.78rem;background:var(--surface);color:var(--text)"><option ${{s.status==='Scheduled'?'selected':''}}>Scheduled</option><option ${{s.status==='En Route'?'selected':''}}>En Route</option><option ${{s.status==='Completed'?'selected':''}}>Completed</option></select></div></div>`;
        }}).join(''):'<div class="empty-state">No jobs scheduled. Tap "+ Schedule Job".</div>';
    }}
    const today=todayISO();
    const todayList=document.getElementById('todayScheduleBody');
    if(todayList){{
        const todays=sched.filter(s=>s.date===today).sort((a,b)=>a.time.localeCompare(b.time));
        const display=todays.length?todays:sched.slice(0,2);
        todayList.innerHTML=display.length?display.map(s=>`<div class="schedule-card"><div class="schedule-time">${{fmtTime(s.time)}}</div><div class="schedule-info"><h4>${{s.job}}</h4><p>${{s.addr}}</p><span class="schedule-employee">${{s.emp}}</span></div></div>`).join(''):'<p class="empty-state">No jobs scheduled today.</p>';
    }}
    refreshBulkBar('sched');
}}
function setStatus(i,v){{if(!sched[i])return;sched[i].status=v;save();renderSched();showToast('Status updated to '+v,'success')}}
function addPhotos(i,inp){{const files=Array.from(inp.files||[]);if(!files.length)return;sched[i].photos=sched[i].photos||[];let pending=files.length;files.forEach(f=>{{const r=new FileReader();r.onload=ev=>{{sched[i].photos.push({{src:ev.target.result,ts:Date.now(),name:f.name}});if(--pending===0){{save();renderSched();showToast(files.length+' photo(s) added','success')}}}};r.readAsDataURL(f)}});inp.value=''}}
function viewPhotos(i){{const s=sched[i];if(!s||!s.photos||!s.photos.length)return;const w=window.open('','_blank');w.document.write(`<title>${{s.job}} — Photos</title><body style="margin:0;background:#000;font-family:system-ui">${{s.photos.map((p,idx)=>`<div style="text-align:center;padding:16px"><img src="${{p.src}}" style="max-width:100%;max-height:90vh;cursor:pointer" onclick="annotatePhoto(${{idx}})"><div style="color:#fff;margin-top:8px"><button style="padding:8px 16px;border:none;background:#fff;color:#000;border-radius:6px;cursor:pointer" onclick="window.opener.startAnnotate(${{i}},${{idx}});">Annotate</button></div></div>`).join('')}}</body>`)}}
function sendTracker(i){{const s=sched[i];if(!s)return;const link=trackerUrl(s);const subj=encodeURIComponent(BIZ+': Track your '+s.job+' appointment'),body=encodeURIComponent('Hi '+s.client+',\\n\\nYou can track your upcoming '+s.job+' appointment with '+BIZ+' here:\\n'+link+'\\n\\nWe will text you updates as our team gets closer to arrival.\\n\\nThank you,\\n'+BIZ+'\\n'+PHONE);window.open('mailto:?subject='+subj+'&body='+body,'_self');showToast('Tracker link ready to send to '+s.client,'success')}}
function scheduleJob(method){{
    method=method||'email';
    const type=document.getElementById('sjType').value,empSel=document.getElementById('sjEmp'),empEmail=empSel.value,empName=empSel.options[empSel.selectedIndex].text,addr=document.getElementById('sjAddr').value.trim(),date=document.getElementById('sjDate').value,time=document.getElementById('sjTime').value,client=document.getElementById('sjClient').value.trim(),notes=document.getElementById('sjNotes').value.trim();
    if(!addr||!date||!time){{showToast('Please fill in address, date, and time.');return}}
    jc++;const id='JOB-'+String(jc).padStart(3,'0');
    sched.push({{id,date,time,job:type,addr,emp:empName,email:empEmail,client:client||'Client',status:'Scheduled',photos:[]}});save();
    if(method==='sms')dispatchSms(empName,type,client,date,time,addr);
    else dispatchEmail(empEmail,empName,type,client,date,time,addr,notes);
    renderSched();closeModal('schedModal');
    const firstName=empName.replace(/^Employee /,'').split(' ')[0];
    showToast('Job scheduled — '+(method==='sms'?'SMS':'email')+' opened for '+firstName+' (Maps will navigate from their current location)','success');
    document.getElementById('sjAddr').value='';document.getElementById('sjClient').value='';document.getElementById('sjNotes').value='';
}}
function resend(i,method){{
    const s=sched[i];if(!s)return;
    method=method||'email';
    if(method==='sms')dispatchSms(s.emp,s.job,s.client,s.date,s.time,s.addr);
    else dispatchEmail(s.email,s.emp,s.job,s.client,s.date,s.time,s.addr,'');
    const firstName=s.emp.replace(/^Employee /,'').split(' ')[0];
    showToast('Reminder opened for '+firstName+' (turn-by-turn from current location)','success');
}}

// ---------- photo annotation ----------
let annJobIdx=null,annPhotoIdx=null,annTool='arrow',annHistory=[];
function startAnnotate(jobIdx,photoIdx){{
    annJobIdx=jobIdx;annPhotoIdx=photoIdx;annHistory=[];
    const s=sched[jobIdx];if(!s||!s.photos[photoIdx])return;
    const img=new Image();img.onload=()=>{{
        const cv=document.getElementById('annCanvas');const ctx=cv.getContext('2d');
        const maxW=800;const scale=Math.min(1,maxW/img.width);
        cv.width=img.width*scale;cv.height=img.height*scale;
        ctx.drawImage(img,0,0,cv.width,cv.height);
        annPhotoCtx={{img,scale,baseImageData:ctx.getImageData(0,0,cv.width,cv.height)}};
    }};img.src=s.photos[photoIdx].src;
    openModal('annModal');
}}
function setAnnTool(tool,btn){{annTool=tool;document.querySelectorAll('.ann-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}}
let annDrawing=false,annStartX=0,annStartY=0;
(function attachCanvas(){{
    const cv=document.getElementById('annCanvas');if(!cv)return;
    cv.addEventListener('mousedown',e=>{{annDrawing=true;const r=cv.getBoundingClientRect();annStartX=e.clientX-r.left;annStartY=e.clientY-r.top;const ctx=cv.getContext('2d');annHistory.push(ctx.getImageData(0,0,cv.width,cv.height));if(annTool==='pen'){{ctx.strokeStyle='#ef4444';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(annStartX,annStartY)}}}});
    cv.addEventListener('mousemove',e=>{{if(!annDrawing)return;const r=cv.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const ctx=cv.getContext('2d');if(annTool==='pen'){{ctx.lineTo(x,y);ctx.stroke()}}else{{const last=annHistory[annHistory.length-1];if(last){{ctx.putImageData(last,0,0);ctx.strokeStyle='#ef4444';ctx.lineWidth=3;if(annTool==='arrow'){{ctx.beginPath();ctx.moveTo(annStartX,annStartY);ctx.lineTo(x,y);ctx.stroke();const dx=x-annStartX,dy=y-annStartY,a=Math.atan2(dy,dx),len=14;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-len*Math.cos(a-Math.PI/6),y-len*Math.sin(a-Math.PI/6));ctx.lineTo(x-len*Math.cos(a+Math.PI/6),y-len*Math.sin(a+Math.PI/6));ctx.closePath();ctx.fillStyle='#ef4444';ctx.fill()}}else if(annTool==='circle'){{const r2=Math.hypot(x-annStartX,y-annStartY);ctx.beginPath();ctx.arc(annStartX,annStartY,r2,0,Math.PI*2);ctx.stroke()}}}}}}}});
    cv.addEventListener('mouseup',()=>{{annDrawing=false}});
    cv.addEventListener('mouseleave',()=>{{annDrawing=false}});
}})();
function undoAnn(){{const cv=document.getElementById('annCanvas');const ctx=cv.getContext('2d');if(annHistory.length){{ctx.putImageData(annHistory.pop(),0,0)}}}}
function clearAnn(){{const cv=document.getElementById('annCanvas');const ctx=cv.getContext('2d');if(annPhotoCtx.baseImageData){{ctx.putImageData(annPhotoCtx.baseImageData,0,0);annHistory=[]}}}}
function saveAnnotation(){{if(annJobIdx===null)return;const cv=document.getElementById('annCanvas');const data=cv.toDataURL('image/jpeg',0.85);sched[annJobIdx].photos.push({{src:data,ts:Date.now(),name:'annotated.jpg',annotated:true}});save();renderSched();closeModal('annModal');showToast('Annotated copy saved to job photos','success')}}

// ---------- onboarding tour ----------
const TOUR=[
    {{title:'Welcome to your dashboard',body:'This is the Owner view of '+BIZ+'. You\\'ll see jobs, estimates, scheduling, and reports here. The whole demo runs in your browser — try anything.'}},
    {{title:'Create estimates fast',body:'Click "+ New Estimate" — or try voice-to-estimate ("🎙 Voice Estimate") to dictate a quote and have it auto-parsed into line items.'}},
    {{title:'Schedule and dispatch',body:'On the Scheduling tab, dispatch by Email or SMS — each notification includes a Google Maps link that opens turn-by-turn from your tech\\'s CURRENT location (no manual address entry). Plus tracker links, photo upload, and live status updates.'}},
    {{title:'Customer-facing tracker',body:'Click "Tracker" on any job and your customer gets a phone-friendly page with live status, your tech\\'s ETA, and call/directions buttons. They never have to call you for an update.'}},
    {{title:'Clients can sign on the spot',body:'On any estimate, hit "Email to Client" — they receive an Approve & Sign link. They review, type their name (or draw a signature), and your dashboard updates to "Accepted" instantly.'}},
    {{title:'Search anything (⌘K)',body:'Press ⌘K (or "/" on a keyboard, "Search" tab on mobile) to jump to any client, estimate, job, or page in seconds. The fastest way to navigate.'}},
    {{title:'Share this demo',body:'Hit "↗ Share" up top — your current data gets baked into a link. Send it to a contractor, they open it, see exactly what you set up. The demo travels.'}},
];
let tourIdx=0;
function startTour(){{tourIdx=0;showTour();document.getElementById('tourOverlay').classList.add('open')}}
function showTour(){{const s=TOUR[tourIdx];document.getElementById('tourStep').textContent='Step '+(tourIdx+1)+' of '+TOUR.length;document.getElementById('tourTitle').textContent=s.title;document.getElementById('tourBody').textContent=s.body;document.getElementById('tourPrev').style.visibility=tourIdx===0?'hidden':'visible';document.getElementById('tourNext').textContent=tourIdx===TOUR.length-1?'Got it':'Next'}}
function tourNext(){{if(tourIdx<TOUR.length-1){{tourIdx++;showTour()}}else endTour()}}
function tourPrev(){{if(tourIdx>0){{tourIdx--;showTour()}}}}
function endTour(){{document.getElementById('tourOverlay').classList.remove('open');try{{localStorage.setItem('wd-tour-seen-'+SLUG,'1')}}catch(e){{}}}}

// ---------- keyboard shortcuts ----------
document.addEventListener('keydown',e=>{{
    if(e.target.matches('input,textarea,select'))return;
    if(e.key==='/'){{openPalette();e.preventDefault()}}
    else if(e.key==='n'){{openModal('estimateModal');e.preventDefault()}}
    else if(e.key==='s'){{openModal('schedModal');e.preventDefault()}}
    else if(e.key==='g'){{switchPage('dashboard');e.preventDefault()}}
    else if(e.key==='?'){{startTour();e.preventDefault()}}
    else if(e.key==='Escape'){{document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));document.getElementById('tourOverlay').classList.remove('open')}}
}});

// ---------- multi-select / bulk actions ----------
const selection={{est:new Set(),sched:new Set()}};
function toggleSelect(kind,id,checked){{
    if(checked)selection[kind].add(id);else selection[kind].delete(id);
    refreshBulkBar(kind);
}}
function toggleSelectAll(kind,checked){{
    selection[kind].clear();
    if(checked){{
        if(kind==='est')Object.keys(estimates).forEach(k=>selection.est.add(k));
        else sched.forEach(s=>selection.sched.add(s.id));
    }}
    if(kind==='est')renderEstimates();else renderSched();
}}
function refreshBulkBar(kind){{
    const bar=document.getElementById(kind+'BulkBar');const count=document.getElementById(kind+'BulkCount');
    if(!bar)return;const n=selection[kind].size;
    if(n>0){{bar.classList.add('show');count.textContent=n+' selected'}}else bar.classList.remove('show');
    const all=document.getElementById(kind+'SelectAll');
    if(all){{const total=kind==='est'?Object.keys(estimates).length:sched.length;all.checked=n>0&&n===total;all.indeterminate=n>0&&n<total}}
}}
function clearSelection(kind){{selection[kind].clear();if(kind==='est')renderEstimates();else renderSched()}}
function bulkEstStatus(s){{selection.est.forEach(id=>{{if(estimates[id])estimates[id].status=s}});save();renderEstimates();showToast(selection.est.size+' estimate(s) marked '+s,'success');selection.est.clear();refreshBulkBar('est')}}
function bulkEstDelete(){{if(!confirm('Delete '+selection.est.size+' estimate(s)?'))return;selection.est.forEach(id=>{{delete estimates[id]}});save();renderEstimates();showToast('Estimates deleted','success');selection.est.clear();refreshBulkBar('est')}}
function bulkSchedStatus(s){{selection.sched.forEach(id=>{{const j=sched.find(x=>x.id===id);if(j)j.status=s}});save();renderSched();showToast(selection.sched.size+' job(s) marked '+s,'success');selection.sched.clear();refreshBulkBar('sched')}}
function bulkSchedDelete(){{if(!confirm('Delete '+selection.sched.size+' job(s)?'))return;sched=sched.filter(j=>!selection.sched.has(j.id));save();renderSched();showToast('Jobs deleted','success');selection.sched.clear();refreshBulkBar('sched')}}

// ---------- command palette (Cmd-K / Ctrl-K) ----------
let palItems=[],palIdx=0;
const PAL_PAGES=[
    {{title:'Dashboard',sub:'Overview + KPIs',page:'dashboard',icon:'⌂'}},
    {{title:'Estimates',sub:'Quotes & invoices',page:'estimates',icon:'$'}},
    {{title:'Scheduling',sub:'Jobs & dispatch',page:'scheduling',icon:'📅'}},
    {{title:'Employees',sub:'Team',page:'employees',icon:'👥'}},
    {{title:'Inventory',sub:'Materials & equipment',page:'inventory',icon:'📦'}},
    {{title:'Reports',sub:'Revenue + crew metrics',page:'reports',icon:'📊'}},
];
function openPalette(){{
    document.getElementById('paletteOverlay').classList.add('open');
    const inp=document.getElementById('paletteInput');inp.value='';inp.focus();
    runPalette('');
}}
function closePalette(){{document.getElementById('paletteOverlay').classList.remove('open')}}
function runPalette(q){{
    q=(q||'').toLowerCase().trim();
    const out=[];
    // Pages always show, filtered
    for(const p of PAL_PAGES){{
        // Hide pages that don't exist on this trade
        if(!document.getElementById('page-'+p.page))continue;
        if(!q||p.title.toLowerCase().includes(q)||p.sub.toLowerCase().includes(q))out.push({{...p,kind:'page'}});
    }}
    // Estimates
    Object.values(estimates).forEach(e=>{{
        const hay=[e.client,e.email,e.num,e.items[0]?.desc||''].join(' ').toLowerCase();
        if(q&&hay.includes(q)){{
            const tot=e.items.reduce((s,i)=>s+i.qty*i.price,0);
            out.push({{kind:'est',id:e.num,title:e.client+' — '+(e.items[0]?.desc||'Service'),sub:'#'+e.num+' · '+fmtUsd0(tot)+' · '+e.status,icon:'$'}});
        }}
    }});
    // Jobs
    sched.forEach(s=>{{
        const hay=[s.client,s.job,s.addr,s.emp].join(' ').toLowerCase();
        if(q&&hay.includes(q))out.push({{kind:'sched',id:s.id,title:s.job+' — '+s.client,sub:fmtDate(s.date)+' · '+fmtTime(s.time)+' · '+s.emp,icon:'📅'}});
    }});
    palItems=out.slice(0,20);palIdx=0;
    const list=document.getElementById('paletteResults');
    if(!palItems.length){{list.innerHTML='<div class="palette-empty">No matches. Try a client name, estimate #, or page.</div>';return}}
    list.innerHTML=palItems.map((it,i)=>`<div class="palette-item ${{i===palIdx?'active':''}}" data-i="${{i}}" onclick="palOpen(${{i}})"><div class="pi-icon">${{it.icon}}</div><div class="pi-body"><div class="pi-title">${{it.title}}</div><div class="pi-sub">${{it.sub||''}}</div></div></div>`).join('');
}}
function palMove(d){{if(!palItems.length)return;palIdx=(palIdx+d+palItems.length)%palItems.length;document.querySelectorAll('.palette-item').forEach((el,i)=>el.classList.toggle('active',i===palIdx));const el=document.querySelectorAll('.palette-item')[palIdx];if(el)el.scrollIntoView({{block:'nearest'}})}}
function palOpen(i){{
    const it=palItems[i];if(!it)return;closePalette();
    if(it.kind==='page')switchPage(it.page);
    else if(it.kind==='est'){{switchPage('estimates');setTimeout(()=>previewEst(it.id),50)}}
    else if(it.kind==='sched'){{switchPage('scheduling');setTimeout(()=>{{const card=document.querySelector('[data-job-id="'+it.id+'"]');if(card)card.scrollIntoView({{behavior:'smooth',block:'center'}})}},50)}}
}}
document.addEventListener('keydown',e=>{{
    const isMod=(e.metaKey||e.ctrlKey);
    if(isMod&&e.key.toLowerCase()==='k'){{e.preventDefault();openPalette();return}}
    if(document.getElementById('paletteOverlay').classList.contains('open')){{
        if(e.key==='Escape'){{closePalette();e.preventDefault()}}
        else if(e.key==='ArrowDown'){{palMove(1);e.preventDefault()}}
        else if(e.key==='ArrowUp'){{palMove(-1);e.preventDefault()}}
        else if(e.key==='Enter'){{palOpen(palIdx);e.preventDefault()}}
    }}
}});
document.addEventListener('DOMContentLoaded',()=>{{
    const inp=document.getElementById('paletteInput');
    if(inp)inp.addEventListener('input',e=>runPalette(e.target.value));
    const overlay=document.getElementById('paletteOverlay');
    if(overlay)overlay.addEventListener('click',e=>{{if(e.target===overlay)closePalette()}});
}});

// ---------- bottom tab bar sync ----------
function syncBottomTabs(page){{document.querySelectorAll('.bottom-tabs button[data-page]').forEach(b=>{{b.classList.toggle('active',b.dataset.page===page)}})}}

// ---------- live sync from estimate-view tab ----------
window.addEventListener('storage',e=>{{
    if(e.key===STORAGE_KEY&&e.newValue){{
        try{{
            const d=JSON.parse(e.newValue);
            // Find newly accepted estimates
            const newlyAccepted=[];
            Object.values(d.estimates||{{}}).forEach(ne=>{{
                const old=estimates[ne.num];
                if(ne.status==='Accepted'&&(!old||old.status!=='Accepted'))newlyAccepted.push(ne);
            }});
            estimates=d.estimates||{{}};sched=d.sched||sched;ec=d.ec||ec;jc=d.jc||jc;
            renderEstimates();renderSched();
            newlyAccepted.forEach(e=>{{
                showToast('✓ '+e.client+' approved Estimate #'+e.num,'success');
            }});
        }}catch(err){{}}
    }}
}});

// ---------- init ----------
function renderAll(){{renderEstimates();renderSched();}}
load();renderAll();
try{{document.getElementById('sjDate').valueAsDate=new Date()}}catch(e){{}}
document.querySelectorAll('.modal-overlay').forEach(m=>{{m.addEventListener('click',e=>{{if(e.target===m)m.classList.remove('open')}})}});
// First-visit auto-tour
try{{if(!localStorage.getItem('wd-tour-seen-'+SLUG))setTimeout(startTour,800)}}catch(e){{}}
</script>
{extra_scripts(t, extras)}
</body>
</html>
"""


# ------------------------------------------------------------------------------
# Extra page HTML (string constants — no f-string interpolation needed inside)
# ------------------------------------------------------------------------------
MAINTENANCE_PAGE_HTML = """
        <!-- MAINTENANCE PLANS -->
        <div class="page" id="page-maintenance">
            <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
                <div class="stat-card"><div class="stat-label">Active Plans</div><div class="stat-value">126</div><div class="stat-sub">Recurring revenue</div></div>
                <div class="stat-card"><div class="stat-label">MRR (Monthly)</div><div class="stat-value">$8,420</div><div class="stat-sub">+$340 vs last month</div></div>
                <div class="stat-card"><div class="stat-label">Due This Week</div><div class="stat-value">11</div><div class="stat-sub">Service visits</div></div>
            </div>
            <div class="card"><div class="card-header"><h2>Customers Under Contract</h2><button class="btn btn-primary btn-sm">+ New Plan</button></div><div style="overflow-x:auto"><table><thead><tr><th>Customer</th><th>Plan</th><th>Last Service</th><th>Next Due</th><th>Annual</th><th>Status</th></tr></thead><tbody>
                <tr><td style="font-weight:600">Patterson Family</td><td>Premium Annual</td><td>Jan 15, 2026</td><td>Jul 15, 2026</td><td>$420</td><td><span class="badge badge-completed">Active</span></td></tr>
                <tr><td style="font-weight:600">Henderson Residence</td><td>Standard Bi-Annual</td><td>Mar 22, 2026</td><td>Sep 22, 2026</td><td>$240</td><td><span class="badge badge-completed">Active</span></td></tr>
                <tr><td style="font-weight:600">Riverside Apts (12 units)</td><td>Commercial Quarterly</td><td>Apr 02, 2026</td><td>Jul 02, 2026</td><td>$4,800</td><td><span class="badge badge-completed">Active</span></td></tr>
                <tr><td style="font-weight:600">Mountain Brook Office Suites</td><td>Commercial Quarterly</td><td>Mar 18, 2026</td><td>Jun 18, 2026</td><td>$3,200</td><td><span class="badge badge-completed">Active</span></td></tr>
                <tr><td style="font-weight:600">The Walkers</td><td>Standard Annual</td><td>May 04, 2025</td><td>May 04, 2026</td><td>$180</td><td><span class="badge badge-pending">Due Soon</span></td></tr>
                <tr><td style="font-weight:600">Brookhaven HOA Common Areas</td><td>Premium Quarterly</td><td>Jan 28, 2026</td><td>Apr 28, 2026</td><td>$2,400</td><td><span class="badge badge-pending">Due Soon</span></td></tr>
            </tbody></table></div></div>
        </div>
"""

CLAIMS_PAGE_HTML = """
        <!-- INSURANCE CLAIMS -->
        <div class="page" id="page-claims">
            <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
                <div class="stat-card"><div class="stat-label">Open Claims</div><div class="stat-value">12</div><div class="stat-sub">In progress</div></div>
                <div class="stat-card"><div class="stat-label">Awaiting Adjuster</div><div class="stat-value">5</div><div class="stat-sub">Bottleneck</div></div>
                <div class="stat-card"><div class="stat-label">Approved Total</div><div class="stat-value">$87,200</div><div class="stat-sub">YTD claim payouts</div></div>
            </div>
            <div class="card"><div class="card-header"><h2>Claims Pipeline</h2><button class="btn btn-primary btn-sm">+ Log Claim</button></div><div style="overflow-x:auto"><table><thead><tr><th>Customer</th><th>Carrier</th><th>Claim #</th><th>Adjuster</th><th>Deductible</th><th>Approved</th><th>Stage</th></tr></thead><tbody>
                <tr><td style="font-weight:600">Calloway Family</td><td>Allstate</td><td>SF-44872</td><td>R. Daniels — (205) 555-2210</td><td>$2,500</td><td>$18,420</td><td><span class="badge badge-claim">Adjuster Review</span></td></tr>
                <tr><td style="font-weight:600">Anderson Property</td><td>State Farm</td><td>SF-29103</td><td>L. Park — (205) 555-3340</td><td>$1,000</td><td>—</td><td><span class="badge badge-pending">Tarp In Place</span></td></tr>
                <tr><td style="font-weight:600">Walters Residence</td><td>USAA</td><td>USAA-77810</td><td>J. Brewer — (800) 555-9090</td><td>$1,500</td><td>$12,840</td><td><span class="badge badge-sent">Approved</span></td></tr>
                <tr><td style="font-weight:600">Burke Family</td><td>Liberty Mutual</td><td>LM-66421</td><td>M. Tomlin — (205) 555-4711</td><td>$2,000</td><td>$8,200</td><td><span class="badge badge-sent">Supplement Sent</span></td></tr>
                <tr><td style="font-weight:600">McKenzie Property</td><td>Travelers</td><td>TR-19288</td><td>—</td><td>$2,500</td><td>—</td><td><span class="badge badge-claim">Awaiting Adjuster</span></td></tr>
                <tr><td style="font-weight:600">Owens Property</td><td>Farmers</td><td>FAR-50912</td><td>D. Walsh — (205) 555-7720</td><td>$1,500</td><td>$4,640</td><td><span class="badge badge-completed">Paid</span></td></tr>
            </tbody></table></div></div>
        </div>
"""

ROUTE_PAGE_HTML = """
        <!-- ROUTE -->
        <div class="page" id="page-route">
            <div class="card" style="margin-bottom:18px"><div class="card-body">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
                    <div>
                        <div class="stat-label">Today's Stops</div>
                        <div id="routeStopCount" style="font-family:var(--serif);font-size:1.7rem;font-weight:500;color:var(--gold);margin-top:6px;letter-spacing:-0.01em">—</div>
                    </div>
                    <div>
                        <div class="stat-label">Total Drive Time</div>
                        <div id="routeDriveTime" style="font-family:var(--serif);font-size:1.7rem;font-weight:500;color:var(--gold);margin-top:6px;letter-spacing:-0.01em">—</div>
                    </div>
                    <div>
                        <div class="stat-label">Estimated Finish</div>
                        <div id="routeFinish" style="font-family:var(--serif);font-size:1.7rem;font-weight:500;color:var(--gold);margin-top:6px;letter-spacing:-0.01em">—</div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="optimizeRoute()">Optimize Order</button>
                        <button class="btn btn-outline" onclick="exportRoute('email')">Email Crew</button>
                        <button class="btn btn-outline" onclick="exportRoute('sms')">SMS Crew</button>
                    </div>
                </div>
            </div></div>
            <div style="display:grid;grid-template-columns:1fr 360px;gap:18px" class="route-grid">
                <div id="routeMap" style="height:520px;border-radius:var(--r);overflow:hidden;border:1px solid var(--border)"></div>
                <div class="card" style="overflow:hidden"><div class="card-header"><h2>Stop Order</h2></div><div id="routeList" style="max-height:480px;overflow-y:auto"></div></div>
            </div>
            <p style="margin-top:10px;font-size:.8rem;color:var(--text-mute)">Stops are pulled from today's scheduled jobs. "Optimize Order" runs a quick nearest-neighbor sort from the depot.</p>
        </div>
        <style>@media(max-width:900px){.route-grid{grid-template-columns:1fr !important}}</style>
"""

AERIAL_PAGE_HTML = """
        <!-- AERIAL MEASURE -->
        <div class="page" id="page-aerial">
            <div class="card" style="margin-bottom:18px"><div class="card-body">
                <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
                    <div class="form-group" style="flex:1;min-width:240px;margin-bottom:0"><label>Property Address</label><input type="text" id="aerialAddress" placeholder="412 Brookwood Dr, Vestavia Hills, AL" value="1820 Riverchase Pkwy, Hoover, AL"></div>
                    <button class="btn btn-primary" onclick="aerialGo()">Locate</button>
                    <button class="btn btn-outline" onclick="aerialClear()">Clear Polygon</button>
                </div>
                <div id="aerialResult" style="margin-top:18px;display:none;padding:20px;background:rgba(255,255,255,0.025);border:1px solid var(--border-soft);border-radius:14px">
                    <div style="font-size:.66rem;color:var(--gold);text-transform:uppercase;letter-spacing:2.5px;font-weight:600;margin-bottom:14px">Measurement</div>
                    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:18px">
                        <div><div class="stat-label" id="aerialLbl1">Area (sqft)</div><div id="aerialSqft" style="font-family:var(--serif);font-size:1.8rem;font-weight:500;color:var(--text);margin-top:8px;letter-spacing:-0.015em">—</div></div>
                        <div><div class="stat-label" id="aerialLbl2">Squares</div><div id="aerialSquares" style="font-family:var(--serif);font-size:1.8rem;font-weight:500;color:var(--text);margin-top:8px;letter-spacing:-0.015em">—</div></div>
                        <div><div class="stat-label" id="aerialLbl3">Material Est.</div><div id="aerialMaterial" style="font-family:var(--serif);font-size:1.8rem;font-weight:500;color:var(--gold);margin-top:8px;letter-spacing:-0.015em">—</div></div>
                        <div><div class="stat-label" id="aerialLbl4">Labor Est.</div><div id="aerialLabor" style="font-family:var(--serif);font-size:1.8rem;font-weight:500;color:var(--gold);margin-top:8px;letter-spacing:-0.015em">—</div></div>
                    </div>
                </div>
            </div></div>
            <div id="aerialMap"></div>
            <p style="margin-top:12px;font-size:.78rem;color:var(--text-mute);text-align:center;letter-spacing:0.02em">Use the polygon tool (top-right of the map) to outline the property. Area and rough cost are calculated from the polygon.</p>
        </div>
"""


def takeoff_page_html(t, unit, waste_default):
    biz = t["biz"]
    inv = t["inventory"]
    inv_options = "".join(
        f'<option value=\'{json.dumps({"name": name, "unit": iunit, "cost": cost})}\'>{name} — {cost} per {iunit}</option>'
        for (name, iunit, qty, reorder, cost) in inv
    )
    return f"""
        <!-- TAKEOFF -->
        <div class="page" id="page-takeoff">
            <div class="card"><div class="card-body">
                <p style="font-size:.9rem;color:var(--text-mute);margin-bottom:14px">Enter project area + waste %, get a materials list pulled from your inventory.</p>
                <div class="form-row-3" style="grid-template-columns:1fr 1fr 1fr">
                    <div class="form-group"><label>Project Area ({unit})</label><input type="number" id="toArea" placeholder="1200" min="0"></div>
                    <div class="form-group"><label>Waste Allowance (%)</label><input type="number" id="toWaste" value="{waste_default}" min="0" max="50"></div>
                    <div class="form-group"><label>Primary Material</label><select id="toMaterial">{inv_options}</select></div>
                </div>
                <button class="btn btn-primary" onclick="runTakeoff()">Calculate Takeoff</button>
            </div></div>
            <div id="takeoffResult" style="margin-top:18px;display:none"></div>
        </div>
        <script>
        function runTakeoff(){{
            const area=parseFloat(document.getElementById('toArea').value)||0;
            const waste=(parseFloat(document.getElementById('toWaste').value)||0)/100;
            const mat=JSON.parse(document.getElementById('toMaterial').value);
            const adjusted=area*(1+waste);
            const costPerUnit=parseFloat(mat.cost.replace(/[^0-9.]/g,''))||0;
            const matCost=adjusted*costPerUnit/(mat.unit==='Sqft'?1:32);
            const laborCost=area*1.85;
            const total=matCost+laborCost;
            document.getElementById('takeoffResult').innerHTML=`<div class="card"><div class="card-header"><h2>Takeoff for ${{fmtNum(area)}} {unit}</h2></div><div class="card-body">
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px">
                    <div class="stat-card"><div class="stat-label">Adjusted Area</div><div class="stat-value" style="font-size:1.2rem">${{fmtNum(Math.round(adjusted))}}</div><div class="stat-sub">Includes ${{Math.round(waste*100)}}% waste</div></div>
                    <div class="stat-card"><div class="stat-label">Material Cost</div><div class="stat-value" style="font-size:1.2rem">${{fmtUsd0(matCost)}}</div><div class="stat-sub">${{mat.name}}</div></div>
                    <div class="stat-card"><div class="stat-label">Labor Est.</div><div class="stat-value" style="font-size:1.2rem">${{fmtUsd0(laborCost)}}</div><div class="stat-sub">$1.85/{unit}</div></div>
                    <div class="stat-card"><div class="stat-label">Total</div><div class="stat-value" style="font-size:1.2rem">${{fmtUsd0(total)}}</div><div class="stat-sub">Material + labor</div></div>
                </div>
                <div class="btn-group"><button class="btn btn-primary btn-sm" onclick="takeoffToEstimate(${{area}},${{adjusted}},${{costPerUnit}},${{matCost}},${{laborCost}},'${{mat.name}}')">Convert to Estimate</button><button class="btn btn-outline btn-sm" onclick="window.print()">Print</button></div>
            </div></div>`;
            document.getElementById('takeoffResult').style.display='block';
            document.getElementById('takeoffResult').scrollIntoView({{behavior:'smooth'}});
        }}
        function takeoffToEstimate(area,adjusted,costPerUnit,matCost,laborCost,matName){{
            ec++;const id='EST-'+String(ec).padStart(3,'0');
            const today=new Date().toLocaleDateString('en-US',{{month:'short',day:'numeric',year:'numeric'}});
            estimates[id]={{num:id,client:'New Project',email:'client@email.com',addr:'TBD',items:[
                {{desc:matName+' — '+fmtNum(Math.round(adjusted))+' {unit} (with waste)',qty:1,price:Math.round(matCost)}},
                {{desc:'Installation Labor — '+fmtNum(area)+' {unit}',qty:1,price:Math.round(laborCost)}}
            ],notes:'Generated from Takeoff Calculator. Update client info before sending.',date:today,status:'Pending'}};
            save();renderEstimates();showToast('Estimate #'+id+' created from takeoff','success');
            switchPage('estimates',document.querySelector('.nav-item[data-page="estimates"]'));
        }}
        </script>
"""


def extra_scripts(t, extras):
    out = ""
    if "aerial" in extras:
        if t["slug"] == "landscaping-dashboard":
            aerial_cfg = (
                "{label1:'Lawn Sqft',label2:'Mow Time',label3:'Sod Cost',label4:'Mow Job Price',"
                "fmt2:s=>Math.round(s/2200*60)+' min',"
                "calc3:s=>s*0.85,calc4:s=>Math.max(45,s*0.012)}"
            )
        else:
            aerial_cfg = (
                "{label1:'Area (sqft)',label2:'Squares',label3:'Material Est.',label4:'Labor Est.',"
                "fmt2:s=>(s/100).toFixed(1),"
                "calc3:s=>s*1.10,calc4:s=>s*2.40}"
            )
        out += """
<script>
const AERIAL_CFG=""" + aerial_cfg + """;
let aerialMap=null,aerialDrawn=null,aerialMarker=null;
function initAerialMap(){
    if(aerialMap)return;
    // Set labels from cfg
    const l1=document.getElementById('aerialLbl1');if(l1)l1.textContent=AERIAL_CFG.label1;
    const l2=document.getElementById('aerialLbl2');if(l2)l2.textContent=AERIAL_CFG.label2;
    const l3=document.getElementById('aerialLbl3');if(l3)l3.textContent=AERIAL_CFG.label3;
    const l4=document.getElementById('aerialLbl4');if(l4)l4.textContent=AERIAL_CFG.label4;
    aerialMap=L.map('aerialMap').setView([33.4044,-86.7944],18);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:20,attribution:'Imagery © Esri'}).addTo(aerialMap);
    const drawn=new L.FeatureGroup();aerialMap.addLayer(drawn);aerialDrawn=drawn;
    const drawControl=new L.Control.Draw({draw:{polygon:{shapeOptions:{color:'#ef4444',weight:3}},marker:false,circle:false,rectangle:false,polyline:false,circlemarker:false},edit:{featureGroup:drawn}});
    aerialMap.addControl(drawControl);
    aerialMap.on(L.Draw.Event.CREATED,e=>{drawn.clearLayers();drawn.addLayer(e.layer);computeArea(e.layer)});
    aerialMap.on(L.Draw.Event.EDITED,e=>{e.layers.eachLayer(l=>computeArea(l))});
    setTimeout(()=>aerialMap.invalidateSize(),120);
    aerialGo();
}
function computeArea(layer){
    const latlngs=layer.getLatLngs()[0];
    let area=0;const R=6378137;
    for(let i=0;i<latlngs.length;i++){
        const j=(i+1)%latlngs.length;
        const xi=latlngs[i].lng*Math.PI/180,yi=latlngs[i].lat*Math.PI/180;
        const xj=latlngs[j].lng*Math.PI/180,yj=latlngs[j].lat*Math.PI/180;
        area+=(xj-xi)*(2+Math.sin(yi)+Math.sin(yj));
    }
    area=Math.abs(area*R*R/2);
    const sqft=Math.round(area*10.7639);
    document.getElementById('aerialSqft').textContent=fmtNum(sqft);
    document.getElementById('aerialSquares').textContent=AERIAL_CFG.fmt2(sqft);
    document.getElementById('aerialMaterial').textContent=fmtUsd0(AERIAL_CFG.calc3(sqft));
    document.getElementById('aerialLabor').textContent=fmtUsd0(AERIAL_CFG.calc4(sqft));
    document.getElementById('aerialResult').style.display='block';
}
async function aerialGo(){
    const addr=document.getElementById('aerialAddress').value.trim();if(!addr)return;
    try{
        const r=await fetch('https://nominatim.openstreetmap.org/search?format=json&q='+encodeURIComponent(addr));
        const data=await r.json();
        if(data&&data.length){
            const lat=parseFloat(data[0].lat),lon=parseFloat(data[0].lon);
            aerialMap.setView([lat,lon],19);
            if(aerialMarker)aerialMap.removeLayer(aerialMarker);
            aerialMarker=L.marker([lat,lon]).addTo(aerialMap);
        }else showToast('Address not found.','');
    }catch(e){showToast('Geocoding failed — check connection.','')}
}
function aerialClear(){if(aerialDrawn)aerialDrawn.clearLayers();document.getElementById('aerialResult').style.display='none'}
</script>
"""
    if "route" in extras:
        out += """
<script>
let routeMap=null,routeMarkers=[],routeLine=null,routeStops=[];
const ROUTE_DEPOT=[33.4870,-86.7733]; // Birmingham metro depot
async function geocodeOnce(addr){
    try{
        const r=await fetch('https://nominatim.openstreetmap.org/search?format=json&q='+encodeURIComponent(addr));
        const d=await r.json();
        if(d&&d.length)return[parseFloat(d[0].lat),parseFloat(d[0].lon)];
    }catch(e){}
    // Fallback: spread fake points around the depot so the demo still draws
    const seed=addr.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
    const dx=((seed%17)-8)*0.008,dy=(((seed*7)%19)-9)*0.008;
    return[ROUTE_DEPOT[0]+dx,ROUTE_DEPOT[1]+dy];
}
async function initRouteMap(){
    if(routeMap){setTimeout(()=>routeMap.invalidateSize(),60);await drawRoute();return}
    routeMap=L.map('routeMap').setView(ROUTE_DEPOT,12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(routeMap);
    L.marker(ROUTE_DEPOT,{title:'Depot'}).addTo(routeMap).bindPopup('Depot — '+BIZ);
    setTimeout(()=>routeMap.invalidateSize(),120);
    await drawRoute();
}
async function drawRoute(){
    routeMarkers.forEach(m=>routeMap.removeLayer(m));routeMarkers=[];
    if(routeLine){routeMap.removeLayer(routeLine);routeLine=null}
    const today=todayISO();
    routeStops=sched.filter(s=>s.date===today).sort((a,b)=>a.time.localeCompare(b.time));
    if(!routeStops.length){
        document.getElementById('routeStopCount').textContent='0';
        document.getElementById('routeDriveTime').textContent='—';
        document.getElementById('routeFinish').textContent='—';
        document.getElementById('routeList').innerHTML='<div class="empty-state">No jobs scheduled today.</div>';
        return;
    }
    // Geocode all stops in parallel
    const coords=await Promise.all(routeStops.map(s=>geocodeOnce(s.addr)));
    routeStops.forEach((s,i)=>s._coord=coords[i]);
    // Draw markers
    routeStops.forEach((s,i)=>{
        const icon=L.divIcon({html:`<div style="background:var(--primary,#15803d);color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.85rem;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)">${i+1}</div>`,iconSize:[30,30],iconAnchor:[15,15],className:''});
        const m=L.marker(s._coord,{icon}).addTo(routeMap).bindPopup(`<strong>${i+1}. ${s.client}</strong><br>${s.job}<br><span style="color:#666;font-size:.85em">${s.addr}</span>`);
        routeMarkers.push(m);
    });
    // Draw polyline depot -> stops -> depot
    const path=[ROUTE_DEPOT,...routeStops.map(s=>s._coord),ROUTE_DEPOT];
    routeLine=L.polyline(path,{color:'#15803d',weight:4,opacity:0.7,dashArray:'8,8'}).addTo(routeMap);
    routeMap.fitBounds(routeLine.getBounds(),{padding:[40,40]});
    // Calculate drive time (rough: avg 25mph in metro)
    let totalMiles=0;
    for(let i=0;i<path.length-1;i++){
        const [a,b]=[path[i],path[i+1]];
        const dx=(b[0]-a[0])*69,dy=(b[1]-a[1])*54.6;
        totalMiles+=Math.sqrt(dx*dx+dy*dy);
    }
    const driveMin=Math.round(totalMiles/25*60);
    const onSiteMin=routeStops.length*45;
    const totalMin=driveMin+onSiteMin;
    document.getElementById('routeStopCount').textContent=routeStops.length+' stops';
    document.getElementById('routeDriveTime').textContent=Math.floor(driveMin/60)+'h '+(driveMin%60)+'m';
    const start=routeStops[0]?routeStops[0].time:'07:00';
    const sh=parseInt(start.split(':')[0])*60+parseInt(start.split(':')[1])+totalMin;
    const fh=Math.floor(sh/60)%24,fm=sh%60;
    document.getElementById('routeFinish').textContent=fmtTime(String(fh).padStart(2,'0')+':'+String(fm).padStart(2,'0'));
    // Stop list
    const list=document.getElementById('routeList');
    list.innerHTML=routeStops.map((s,i)=>`<div style="display:flex;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border-soft);align-items:center"><div style="background:var(--primary);color:#fff;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0">${i+1}</div><div style="flex:1;min-width:0"><div style="font-weight:600;font-size:.9rem">${s.client}</div><div style="font-size:.78rem;color:var(--text-mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.job} · ${fmtTime(s.time)}</div></div></div>`).join('');
}
function optimizeRoute(){
    if(!routeStops.length){showToast('No stops to optimize');return}
    // Nearest-neighbor from depot
    const remaining=routeStops.slice();
    const ordered=[];let current=ROUTE_DEPOT;
    while(remaining.length){
        let bestIdx=0,bestDist=Infinity;
        remaining.forEach((s,i)=>{
            const dx=(s._coord[0]-current[0]),dy=(s._coord[1]-current[1]);
            const d=dx*dx+dy*dy;
            if(d<bestDist){bestDist=d;bestIdx=i}
        });
        const next=remaining.splice(bestIdx,1)[0];
        ordered.push(next);current=next._coord;
    }
    // Reassign times in 45-min increments starting from earliest scheduled
    const earliest=routeStops.reduce((m,s)=>s.time<m?s.time:m,'23:59');
    let mins=parseInt(earliest.split(':')[0])*60+parseInt(earliest.split(':')[1]);
    ordered.forEach(s=>{
        const t=String(Math.floor(mins/60)).padStart(2,'0')+':'+String(mins%60).padStart(2,'0');
        const idx=sched.findIndex(x=>x.id===s.id);
        if(idx>=0)sched[idx].time=t;
        mins+=45;
    });
    save();renderSched();drawRoute();showToast('Route optimized — times updated','success');
}
function exportRoute(method){
    if(!routeStops.length){showToast('No stops today');return}
    method=method||'email';
    const lines=routeStops.map((s,i)=>`${i+1}. ${fmtTime(s.time)} — ${s.client}\\n   ${s.job}\\n   ${s.addr}\\n   Navigate: ${navUrl(s.addr)}`).join('\\n\\n');
    if(method==='sms'){
        const body=encodeURIComponent(BIZ+': Route — '+routeStops.length+' stops\\n\\n'+lines);
        window.open('sms:?&body='+body,'_self');
    }else{
        const subj=encodeURIComponent(BIZ+': Today\\'s route — '+routeStops.length+' stops');
        const body=encodeURIComponent('Today\\'s route — '+routeStops.length+' stops. Each link opens turn-by-turn from your current location.\\n\\n'+lines+'\\n\\nDepot: '+BIZ+'\\n'+PHONE);
        window.open('mailto:?subject='+subj+'&body='+body,'_self');
    }
    showToast('Route '+(method==='sms'?'SMS':'email')+' opened (links navigate from current location)','success');
}
</script>
"""
    return out


def main():
    for trade in TRADES:
        out_dir = ROOT / trade["slug"]
        out_dir.mkdir(exist_ok=True)
        out_file = out_dir / "index.html"
        html = build_html(trade)
        out_file.write_text(html)
        print(f"wrote {out_file.relative_to(ROOT.parent)}")


if __name__ == "__main__":
    main()
