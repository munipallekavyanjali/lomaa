const BASE_URL = import.meta.env.VITE_AUTH_URL || '/api/auth';

export async function loginUser(identifier, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function registerUser({ username, email, password, avatar_color }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, avatar_color })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

export async function fetchCurrentUser(token) {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to authenticate token');
  }
  return data;
}

//google Sign IN
export async function googleLoginUser(credential) {
  const res = await fetch(`${BASE_URL}/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ credential })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Google login failed');
  }

  return data;
}

export async function fetchDemoCredentials() {
  const res = await fetch(`${BASE_URL}/demo`);
  return res.json();
}
