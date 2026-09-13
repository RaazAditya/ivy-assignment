const BASE_URL = process.env.VITE_API_BASE_URL;
const API_KEY = process.env.VITE_API_KEY;

const email = "demo1@ivy.homes";
const password = "8ca1cf7f01";

async function testLogin() {
  if (!BASE_URL || !API_KEY) {
    console.error("Missing VITE_API_BASE_URL or VITE_API_KEY");
    process.exit(1);
  }

  // 1. Login
  const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
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

  console.log("Login status:", loginResponse.status);

  const loginData = await loginResponse.json();

  console.log("Login response:");
  console.log({
    ...loginData,
    access_token: "<REDACTED>",
    refresh_token: "<REDACTED>",
  });

  if (!loginResponse.ok) {
    return;
  }

  // 2. Test refresh
  const refreshResponse = await fetch(
    `${BASE_URL}${loginData.refresh_url}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        refresh_token: loginData.refresh_token,
      }),
    }
  );

  console.log("\nRefresh status:", refreshResponse.status);

  const refreshData = await refreshResponse.json();

  console.log("Refresh response:");

  console.log({
    ...refreshData,
    access_token: refreshData.access_token
      ? "<REDACTED>"
      : undefined,
    refresh_token: refreshData.refresh_token
      ? "<REDACTED>"
      : undefined,
  });
}

testLogin().catch((error) => {
  console.error("Request failed:", error);
});