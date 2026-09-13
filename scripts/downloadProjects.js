import fs from "fs";

const BASE_URL = process.env.VITE_API_BASE_URL;
const API_KEY = process.env.VITE_API_KEY;

const email = "demo1@ivy.homes";
const password = "8ca1cf7f01";

const LIMIT = 50;

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

  const allProjects = [];
  let offset = 0;
  let total = null;

  while (true) {
    const response = await fetch(
      `${BASE_URL}/v1/projects?limit=${LIMIT}&offset=${offset}`,
      {
        headers: {
          "X-API-Key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Project request failed");
    }

    if (total === null) {
      total = data.total;
      console.log("API total:", total);
    }

    allProjects.push(...data.results);

    console.log(
      `Fetched ${data.results.length} records at offset ${offset}`
    );

    if (!data.has_more) {
      break;
    }

    offset += LIMIT;
  }

  console.log("Total downloaded:", allProjects.length);

  fs.writeFileSync(
    "data/projects.json",
    JSON.stringify(allProjects, null, 2)
  );

  console.log("Saved to data/projects.json");
}

main().catch(console.error);