import json
import os
import re
from datetime import datetime, timezone, timedelta
from collections import Counter

# ==========================================
# CONFIGURATION
# ==========================================
API_KEY = "IVY26-XXXXXXXXXXXX"  # Replace with your actual key
CANDIDATE_NAME = "Aditya"       # Update your name
CANDIDATE_EMAIL = "aditya@mnnit.ac.in"
REPO_URL = "https://github.com/your-username/ivy-assignment"
DEMO_URL = "https://ivy-assignment.vercel.app"

ASSIGNED_LOCALITY = "borivali west"

DATA_DIR = "data"
LISTINGS_PATH = os.path.join(DATA_DIR, "listings.json")
PROJECTS_PATH = os.path.join(DATA_DIR, "projects.json")
RENTALS_PATH = os.path.join(DATA_DIR, "rentals-borivali-west.json")

IST = timezone(timedelta(hours=5, minutes=30))
REFERENCE = datetime(2026, 9, 10, 0, 0, 0, tzinfo=IST)

def load_data(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, dict):
        for k in ["results", "data", "listings", "rentals", "projects"]:
            if k in data and isinstance(data[k], list):
                return data[k]
    return data

listings = load_data(LISTINGS_PATH)
projects = load_data(PROJECTS_PATH)
rentals = load_data(RENTALS_PATH)

# ==========================================
# UNIT NORMALIZATION HELPER
# ==========================================
def get_normalized_carpet_area(l):
    raw_area = l.get("carpet_area", 0) or 0
    # Values under 300 sq ft for full apartments indicate square metres
    if 0 < raw_area < 300 and l.get("bedroom", 0) >= 1:
        return raw_area * 10.7639, True
    return raw_area, False

# ==========================================
# Q4: CORRUPT LISTINGS (Physically Impossible)
# ==========================================
corrupt_listing_ids = []
swapped_coord_ids = []
sqm_unit_ids = []

for l in listings:
    lid = l.get("listing_id")
    floor = l.get("floor")
    total_floors = l.get("total_floors")
    raw_carpet = l.get("carpet_area", 0) or 0
    super_built = l.get("super_built_up_area", 0) or 0
    price = l.get("price", 0) or 0
    lat = l.get("latitude")
    lon = l.get("longitude")

    # Track swapped coordinates (Documentation finding, NOT corrupt physical property)
    if lat and lat > 50:
        swapped_coord_ids.append(lid)
        lat, lon = lon, lat

    carpet, was_sqm = get_normalized_carpet_area(l)
    if was_sqm:
        sqm_unit_ids.append(lid)

    is_corrupt = False

    # Negative price or impossible negative/zero carpet
    if price <= 0 or raw_carpet <= 0:
        is_corrupt = True
    # Floor level higher than total floors
    elif floor is not None and total_floors is not None and total_floors > 0 and floor > total_floors:
        is_corrupt = True
    # Carpet area larger than super built-up area (comparing like units)
    elif super_built > 0:
        effective_super = super_built * 10.7639 if was_sqm and super_built < 300 else super_built
        if carpet > effective_super:
            is_corrupt = True

    if is_corrupt:
        corrupt_listing_ids.append(lid)

corrupt_listing_ids = sorted(list(set(corrupt_listing_ids)))

# ==========================================
# Q9: FAKE LISTINGS (Fraud / Bait)
# ==========================================
fake_listing_ids = []
for l in listings:
    lid = l.get("listing_id")
    if lid in corrupt_listing_ids:
        continue

    price = l.get("price", 0) or 0
    contact = str(l.get("posted_by_contact", "")).strip()
    digits = re.sub(r"\D", "", contact)

    is_fake = False
    # Repeated sequence phone numbers
    if any(pat in digits for pat in ["000000", "123456", "999999", "111111"]):
        is_fake = True
    # Unrealistically low sale prices (e.g. ₹15,000 - ₹45,000 for entire apartment)
    elif "apartment" in str(l.get("property_type", "")).lower() and 0 < price < 500000:
        is_fake = True

    if is_fake:
        fake_listing_ids.append(lid)

fake_listing_ids = sorted(list(set(fake_listing_ids)))

# ==========================================
# CORE ANSWERS
# ==========================================
total_listing_records = len(listings)
active_listings = sum(1 for l in listings if l.get("is_live") is True)

# Q5: total_monthly_rent
locality_rentals = [
    r for r in rentals 
    if str(r.get("locality", "")).strip().lower() == ASSIGNED_LOCALITY
]
total_monthly_rent = sum(r.get("price", 0) for r in locality_rentals)

# Q6: avg_price_per_sqft_2bhk
excluded = set(corrupt_listing_ids) | set(fake_listing_ids)
rates = []
for l in listings:
    if l.get("listing_id") in excluded:
        continue
    if l.get("is_live") is True and l.get("bedroom") == 2:
        price = l.get("price", 0) or 0
        carpet, _ = get_normalized_carpet_area(l)
        if price > 0 and carpet > 0:
            rates.append(price / carpet)

avg_price_per_sqft_2bhk = round(sum(rates) / len(rates), 2) if rates else 0.0

# Q7: costliest_project
costliest = max(projects, key=lambda p: p.get("price_max", p.get("price_max_inr", 0)))
raw_max = costliest.get("price_max", costliest.get("price_max_inr", 0))
# Convert Crores to INR
price_max_inr = int(round(raw_max * 10000000)) if raw_max < 1000 else int(raw_max)

costliest_project = {
    "project_id": str(costliest.get("project_id")),
    "price_max_inr": price_max_inr
}

# Q8: listings_last_7_days
window_start = REFERENCE - timedelta(days=7)
listings_last_7_days = 0
for l in listings:
    ts = l.get("posted_at")
    if ts:
        dt = datetime.fromisoformat(ts.replace("Z", "+00:00")).astimezone(IST)
        if window_start <= dt < REFERENCE:
            listings_last_7_days += 1

# Q2: unique_properties
def get_unique_property_key(l):
    apt = str(l.get("apartment_name") or "").strip().lower()
    floor = l.get("floor")
    bhk = l.get("bedroom")
    carpet, _ = get_normalized_carpet_area(l)
    return (apt, floor, bhk, round(carpet, -1))

unique_properties = len(set(get_unique_property_key(l) for l in listings))

# Q10: projects_with_wrong_listing_count
counts = Counter(str(l.get("project_id")).strip() for l in listings if l.get("project_id"))
projects_with_wrong_listing_count = sum(
    1 for p in projects 
    if p.get("total_listings", 0) != counts.get(str(p.get("project_id")).strip(), 0)
)

# ==========================================
# FINDINGS (Part 3)
# ==========================================
findings = [
    {
        "endpoint": "/v1/projects",
        "category": "units",
        "documented": "Money: Indian rupees, integer, everywhere in the API (price_min, price_max in INR)",
        "actual": "price_min and price_max are given in Crores (decimal float) rather than integer Indian Rupees",
        "how_found": "Observed maximum price value of 12.44 instead of integer rupees",
        "impact": "Requires client-side conversion by factor of 10^7 (Cr to INR) to avoid displaying incorrect prices",
        "evidence": [str(costliest.get("project_id"))]
    },
    {
        "endpoint": "/v1/listings",
        "category": "units",
        "documented": "Area: Square feet, integer, everywhere in the API",
        "actual": "Certain listings (primarily MagicBricks MAG- prefix) report carpet_area in square metres instead of square feet",
        "how_found": "Audited listings where 2-4 BHK apartments reported carpet areas under 200",
        "impact": "Calculations of price per square foot are inflated by ~10.76x without unit conversion",
        "evidence": sqm_unit_ids[:15]
    },
    {
        "endpoint": "/v1/listings",
        "category": "data_quality",
        "documented": "Returns valid geographic latitude and longitude coordinates",
        "actual": "Several listing records have latitude and longitude values transposed (latitude > 70 and longitude ~ 19)",
        "how_found": "Plotted coordinates against Mumbai bounding box; observed coordinates inverted",
        "impact": "Map markers render in Antarctica / Indian Ocean unless coordinates are swapped back",
        "evidence": swapped_coord_ids[:15]
    },
    {
        "endpoint": "/v1/listings",
        "category": "completeness",
        "documented": "Returns active sale listings in your city. Inactive, expired and withdrawn listings are excluded server side",
        "actual": "The endpoint returns inactive listings where is_live is false",
        "how_found": "Counted active listings where is_live == True vs total retrieved records",
        "impact": "Frontend must explicitly filter is_live on client side to avoid displaying inactive properties",
        "evidence": [l["listing_id"] for l in listings if l.get("is_live") is False][:15]
    },
    {
        "endpoint": "/v1/projects",
        "category": "consistency",
        "documented": "total_listings is recomputed whenever a listing is added or withdrawn, so it always agrees with GET /v1/listings?project_id=...",
        "actual": "Reported total_listings contradicts the count of retrievable listings for the project_id across most projects",
        "how_found": "Aggregated listings by project_id and compared against project total_listings field",
        "impact": "Frontend displays incorrect listing counts on project pages if trusting the project metadata",
        "evidence": [p["project_id"] for p in projects if p.get("total_listings", 0) != counts.get(p["project_id"], 0)][:15]
    }
]

submission = {
    "api_key": API_KEY,
    "candidate": {
        "name": CANDIDATE_NAME,
        "email": CANDIDATE_EMAIL,
        "repo_url": REPO_URL,
        "demo_url": DEMO_URL
    },
    "answers": {
        "total_listing_records": total_listing_records,
        "unique_properties": unique_properties,
        "active_listings": active_listings,
        "corrupt_listing_ids": corrupt_listing_ids,
        "total_monthly_rent": total_monthly_rent,
        "avg_price_per_sqft_2bhk": avg_price_per_sqft_2bhk,
        "costliest_project": costliest_project,
        "listings_last_7_days": listings_last_7_days,
        "fake_listing_ids": fake_listing_ids,
        "projects_with_wrong_listing_count": projects_with_wrong_listing_count
    },
    "findings": findings
}

with open("submission.json", "w", encoding="utf-8") as f:
    json.dump(submission, f, indent=2)

print("\n--- UPDATED ANSWERS ---")
print(json.dumps(submission["answers"], indent=2))