const BASE_URL = "https://solve.ivy.homes";

async function testHealth() {
  const response = await fetch(`${BASE_URL}/health`);

  console.log("Status:", response.status);

  const data = await response.json();

  console.log("Response:");
  console.log(JSON.stringify(data, null, 2));
}

testHealth();