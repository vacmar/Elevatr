export const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

export async function login(email: string, password: string) {
  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function register(email: string, password: string) {
  const res = await fetch(`${apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
}

export async function fetchJobs() {
  const res = await fetch(`${apiBase}/jobs`);
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function applyToJob(id: number|string, file: File, token?: string) {
  const fd = new FormData();
  fd.append('resume', file);
  const res = await fetch(`${apiBase}/jobs/${id}/apply`, {
    method: 'POST',
    body: fd,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error('Apply failed');
  return res.json();
}
