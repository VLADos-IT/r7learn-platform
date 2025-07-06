const API_BASE = window.BACKEND_URL || '/api';

export async function apiRequest(method, url, body = null) {
	const options = {
		method,
		headers: { 'Content-Type': 'application/json' }
	};
	const token = localStorage.getItem('jwt');
	if (token) {
		options.headers['Authorization'] = `Bearer ${token}`;
	}
	if (body) options.body = JSON.stringify(body);
	const res = await fetch(`${API_BASE}${url}`, { ...options, credentials: 'include' });
	if (res.status === 401) {
		localStorage.clear();
		window.location.href = 'auth.html';
		return;
	}
	if (!res.ok) throw new Error(await res.text());
	return res.status === 204 ? null : res.json();
}