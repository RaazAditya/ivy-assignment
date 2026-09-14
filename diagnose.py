import json

with open("data/listings.json") as f:
    listings = json.load(f)

# Inspect MAG listings
mag_samples = [l for l in listings if str(l.get("listing_id")).startswith("MAG")][:5]
print("--- MAG Listing Area Samples ---")
for m in mag_samples:
    print(f"ID: {m.get('listing_id')} | Carpet: {m.get('carpet_area')} | Super: {m.get('super_built_up_area')} | BHK: {m.get('bedroom')}")

# Inspect coordinates on suspected coordinate-corrupt listings
print("\n--- Coordinate Checks ---")
sample_coords = [l for l in listings if l.get("listing_id") in ["100-5001382", "MAG-5002818", "DWE-5003960"]]
for s in sample_coords:
    print(f"ID: {s.get('listing_id')} | Lat: {s.get('latitude')} | Lon: {s.get('longitude')}")

with open("data/projects.json") as f:
    projects = json.load(f)

costliest = max(projects, key=lambda p: p.get("price_max", 0))
print(f"\nCostliest project raw: {costliest.get('project_id')} -> {costliest.get('price_max')}")