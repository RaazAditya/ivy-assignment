import fs from "fs";

const listings = JSON.parse(
  fs.readFileSync("data/listings.json", "utf8")
);

function numericId(listingId) {
  return listingId.split("-")[1];
}

const groups = new Map();

for (const listing of listings) {
  const id = numericId(listing.listing_id);

  if (!groups.has(id)) {
    groups.set(id, []);
  }

  groups.get(id).push(listing);
}

const duplicateGroups = [...groups.entries()]
  .filter(([, records]) => records.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

console.log("Total records:", listings.length);
console.log("Unique numeric IDs:", groups.size);
console.log(
  "Numeric IDs shared by multiple listings:",
  duplicateGroups.length
);

console.log("\nTop 20 shared numeric IDs:");

for (const [id, records] of duplicateGroups.slice(0, 20)) {
  console.log("\n-----------------------------");
  console.log("Numeric ID:", id);

  console.log(
    records.map((listing) => ({
      listing_id: listing.listing_id,
      website: listing.website,
      apartment_name: listing.apartment_name,
      locality: listing.locality,
      bedroom: listing.bedroom,
      floor: listing.floor,
      carpet_area: listing.carpet_area,
      project_id: listing.project_id,
    }))
  );
}