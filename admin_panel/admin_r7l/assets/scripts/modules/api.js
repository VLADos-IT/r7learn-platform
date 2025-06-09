const API_BASE = 'https://r7learn.xorg.su/api';

export async function sendRequest(method, endpoint, body) {
	const res = await fetch(`${API_BASE}${endpoint}`, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: body ? JSON.stringify(body) : undefined
	});
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