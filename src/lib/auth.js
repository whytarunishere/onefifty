const TOKEN_KEY = 'onefifty_token';
const CURRENT_USER_KEY = 'onefifty_current_user';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getCurrentUser() {
  return readJson(CURRENT_USER_KEY, null);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function getAuthHeaders() {
  const token = getToken();
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

function persistSession({ user, token }) {
  localStorage.setItem(TOKEN_KEY, token);
  writeJson(CURRENT_USER_KEY, user);
}

export function setCurrentUser(user) {
  writeJson(CURRENT_USER_KEY, user);
}

export async function signup({ name, email, password }) {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Signup failed'));
  }

  persistSession(data);
  return data.user;
}

export async function login({ email, password }) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Login failed'));
  }

  persistSession(data);
  return data.user;
}

export async function validateSession() {
  const token = getToken();
  if (!token) return null;

  const response = await fetch('/api/me', {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    logout();
    return null;
  }

  const data = await response.json();
  writeJson(CURRENT_USER_KEY, data.user);
  return data.user;
}

export async function updateProfile({ name, profilePhoto }) {
  const response = await fetch('/api/update-profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      name,
      profile_photo: profilePhoto || '',
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail ? `${data.error}: ${data.detail}` : (data.error || 'Profile update failed'));
  }

  writeJson(CURRENT_USER_KEY, data.user);
  return data.user;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}
