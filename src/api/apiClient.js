const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

let accessToken = null;
let refreshToken = null;

export async function login(email, password) {
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

  accessToken = data.access_token;
  refreshToken = data.refresh_token;

  return data.user;
}

async function refreshAccessToken() {
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    accessToken = null;
    refreshToken = null;
    throw new Error(data.detail || "Session expired");
  }

  accessToken = data.access_token;
  refreshToken = data.refresh_token;

  return accessToken;
}

export async function apiFetch(endpoint, options = {}) {
  const makeRequest = async () => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        "X-API-Key": API_KEY,
        Authorization: accessToken
          ? `Bearer ${accessToken}`
          : undefined,
      },
    });
  };

  let response = await makeRequest();

  // Access token may have expired.
  if (response.status === 401 && refreshToken) {
    await refreshAccessToken();
    response = await makeRequest();
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "API request failed");
  }

  return data;
}

export async function logout() {
  if (!accessToken) {
    return;
  }

  try {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "X-API-Key": API_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } finally {
    accessToken = null;
    refreshToken = null;
  }
}