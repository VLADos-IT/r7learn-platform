const API_BASE = window.BACKEND_URL || '/api';

export async function baseRequest(method, url, body = null, { handle401 = true, headers = {}, responseType = 'json' } = {}) {
	const isFormData = body instanceof FormData;
	const defaultHeaders = {};
	if (!isFormData) {
		defaultHeaders['Content-Type'] = 'application/json';
	}

	const options = {
		method,
		headers: { ...defaultHeaders, ...headers }
	};

	const token = localStorage.getItem('jwt');
	if (token) {
		options.headers['Authorization'] = `Bearer ${token}`;
	}

	if (body) {
		options.body = isFormData ? body : JSON.stringify(body);
	}

	const res = await fetch(url, { ...options, credentials: 'include' });

	if (res.status === 401) {
		if (handle401) {
			localStorage.clear();
			window.location.href = 'auth.html';
			return;
		}
	}
	if (!res.ok) {
		const error = new Error(await res.text());
		error.status = res.status;
		throw error;
	}

	if (responseType === 'text') return res.text();
	if (responseType === 'blob') return res.blob();
	return res.status === 204 ? null : res.json();
}

export async function apiRequest(method, endpoint, body = null, options = {}) {
	return baseRequest(method, `${API_BASE}${endpoint}`, body, options);
}