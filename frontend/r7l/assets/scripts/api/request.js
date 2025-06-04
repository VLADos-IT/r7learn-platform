const API_BASE = window.BACKEND_URL || '/api';

export async function apiRequest(method, url, body = null) {
	const options = {
		method,
		headers: { 'Content-Type': 'application/json' }
	};
	if (body) options.body = JSON.stringify(body);
	const res = await fetch(`${API_BASE}${url}`, options);
	if (!res.ok) throw new Error(await res.text());
	return res.status === 204 ? null : res.json();
}