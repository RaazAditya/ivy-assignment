const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const ACCESS_TOKEN_KEY = "ivy_access_token";
const REFRESH_TOKEN_KEY = "ivy_refresh_token";

// localStorage instead of sessionStorage: sessionStorage is cleared the
// moment a tab closes, so closing the browser (or opening the app in a new
// tab) logged the user out even though the refresh token was still good.
// localStorage survives both, which is what "session survives a refresh and
// still works 30 minutes later" actually requires.
let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
let refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

function setTokens({ access_token, refresh_token }) {
  accessToken = access_token;
  refreshToken = refresh_token;
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// A route guard can check this before rendering a protected page. Only the
// refresh token is required — apiFetch mints a fresh access token off it
// automatically the moment a request actually needs one.
export function isAuthenticated() {
  return Boolean(refreshToken);
}

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

  setTokens(data);
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
    clearTokens();
    throw new Error(data.detail || "Session expired");
  }

  setTokens(data);
  return accessToken;
}

export async function apiFetch(endpoint, options = {}) {
  const makeRequest = async () => {
    return fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        "X-API-Key": API_KEY,
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
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
    clearTokens();
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
    clearTokens();
  }
}

export async function getFavourites() {
  return apiFetch("/v1/saved");
}

export async function addFavourite(listingId) {
  return apiFetch("/v1/saved", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listing_id: listingId }),
  });
}

export async function removeFavourite(listingId) {
  return apiFetch(`/v1/saved/${listingId}`, {
    method: "DELETE",
  });
}
