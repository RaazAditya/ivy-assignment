import json
from collections import Counter

with open("data/listings.json", "r", encoding="utf-8") as f:
    listings = json.load(f)

# 1. Swapped coordinate check
swapped_coords = [
    l["listing_id"] for l in listings 
    if l.get("latitude") and l.get("latitude") > 50  # Longitude in latitude
]
print(f"Listings with swapped lat/lon: {len(swapped_coords)}")
print(f"Sample swapped IDs: {swapped_coords[:5]}")

# 2. Sq Metre area check (carpet < 300 for 2+ BHK or obvious sq m scale)
sq_m_records = [
    l["listing_id"] for l in listings 
    if l.get("carpet_area") and l.get("carpet_area") < 300 and l.get("bedroom", 0) >= 1
]
print(f"\nListings with area in sq metres: {len(sq_m_records)}")
print(f"Sample sq m IDs: {sq_m_records[:5]}")

# 3. Duplicate properties (same apartment name, floor, bedroom count, and approximate area)
def property_identity(l):
    apt = str(l.get("apartment_name") or "").strip().lower()
    floor = l.get("floor")
    bhk = l.get("bedroom")
    carpet = l.get("carpet_area")
    # Normalize sq m if detected
    if carpet and carpet < 300:
        carpet = round(carpet * 10.7639)
    return (apt, floor, bhk, carpet)

identities = [property_identity(l) for l in listings if l.get("apartment_name")]
duplicates = [item for item, count in Counter(identities).items() if count > 1]
print(f"\nDuplicate unit fingerprints identified: {len(duplicates)}")