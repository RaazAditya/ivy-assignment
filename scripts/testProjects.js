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
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data.access_token;
}

async function main() {
  const token = await login();

  const response = await fetch(
    `${BASE_URL}/v1/projects?limit=2&offset=0`,
    {
      headers: {
        "X-API-Key": API_KEY,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("Status:", response.status);

  const data = await response.json();

  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);