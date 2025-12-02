const API_BASE = '/api';

export function getCookie(name) {
	const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

export async function sendRequest(method, endpoint, body, isFileUpload = false) {
	const token = getCookie('jwt');
	const headers = {};
	if (!isFileUpload) {
		headers['Content-Type'] = 'application/json';
	}
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const options = {
		method,
		headers,
		credentials: 'include'
	};

	if (body) {
		options.body = isFileUpload ? body : JSON.stringify(body);
	}

	const res = await fetch(`${API_BASE}${endpoint}`, options);
	if (!res.ok) throw new Error(await res.text());
	return res.status === 204 ? null : res.json();
}

export async function fetchCourses() {
	return sendRequest('GET', '/Course/GetAllCourses');
}

export async function createCourse(data) {
	return sendRequest('POST', '/Course/Create', data);
}

export async function fetchUnits(courseId) {
	return sendRequest('GET', `/Course/${courseId}/Units`);
}

export async function createUnit(data) {
	return sendRequest('POST', '/CourseUnit/Create', data);
}