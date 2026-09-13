const BASE_URL = process.env.VITE_API_BASE_URL;
const API_KEY = process.env.VITE_API_KEY;
import fs from "fs";
import path from "path";

const LIMIT = 50;

async function login() {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      email: "demo1@ivy.homes",
      password: "8ca1cf7f01",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data.access_token;
}

async function fetchListings(accessToken) {
  let offset = 0;
  let allListings = [];
  let total = null;

  while (true) {
    console.log(`Fetching listings: offset=${offset}, limit=${LIMIT}`);

    const response = await fetch(
      `${BASE_URL}/v1/listings?limit=${LIMIT}&offset=${offset}`,
      {
        headers: {
          "X-API-Key": API_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to fetch listings");
    }

    if (total === null) {
      total = data.total;
      console.log(`Total listings reported by API: ${total}`);
    }

    allListings.push(...data.results);

    console.log(
      `Received ${data.results.length}, collected ${allListings.length}/${total}`,
    );

    if (!data.has_more) {
      break;
    }

    offset += LIMIT;
  }

  return allListings;
}

async function main() {
  if (!BASE_URL || !API_KEY) {
    throw new Error("Missing VITE_API_BASE_URL or VITE_API_KEY");
  }

  console.log("Logging in...");

  const accessToken = await login();

  console.log("Login successful.\n");

  const listings = await fetchListings(accessToken);

  const dataDir = path.join(process.cwd(), "data");

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outputPath = path.join(dataDir, "listings.json");

  fs.writeFileSync(outputPath, JSON.stringify(listings, null, 2));

  console.log("\nFinished!");
  console.log(`Total records collected: ${listings.length}`);
  console.log(`Saved to: ${outputPath}`);
}

main().catch((error) => {
  console.error("\nDownload failed:");
  console.error(error.message);
  process.exit(1);
});
