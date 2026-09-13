const BASE_URL = process.env.VITE_API_BASE_URL;
const API_KEY = process.env.VITE_API_KEY;

const email = "demo1@ivy.homes";
const password = "8ca1cf7f01";

async function testLogin() {
  if (!BASE_URL || !API_KEY) {
    console.error("Missing VITE_API_BASE_URL or VITE_API_KEY");
    process.exit(1);
  }

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

  console.log("Status:", response.status);

  const data = await response.json();

  console.log("Response:");
  console.log(JSON.stringify(data, null, 2));
}

testLogin().catch((error) => {
  console.error("Request failed:", error);
});