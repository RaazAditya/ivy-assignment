const BASE_URL = process.env.VITE_API_BASE_URL;
const API_KEY = process.env.VITE_API_KEY;

const email = "demo1@ivy.homes";
const password = "8ca1cf7f01";

async function login() {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data.access_token;
}

async function test(offset, limit) {
  const token = await login();

  const response = await fetch(
    `${BASE_URL}/v1/listings?limit=${limit}&offset=${offset}`,
    {
      headers: {
        "X-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  console.log(`\nlimit=${limit}, offset=${offset}`);
  console.log("total:", data.total);
  console.log("count:", data.count);
  console.log("has_more:", data.has_more);

  console.log(
    "IDs:",
    data.results.map((listing) => listing.listing_id)
  );
}

async function main() {
  await test(0, 10);
  await test(10, 10);
  await test(20, 10);
  await test(50, 10);
  await test(100, 10);
}

main().catch((error) => {
  console.error(error);
});