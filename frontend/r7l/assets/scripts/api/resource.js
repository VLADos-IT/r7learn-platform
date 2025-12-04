import { apiRequest, baseRequest } from './request.js';

export async function getMdFiles(unitName) {
	return apiRequest('GET', `/resource/list/${unitName}/mds`);
}

export async function fetchMdContent(url) {
	return baseRequest('GET', url, null, { responseType: 'text' });
}

export async function uploadTempExercise(file, userId) {
	const formData = new FormData();
	formData.append('file', file);
	if (userId) {
		formData.append('userId', userId);
	}
	return apiRequest('POST', '/resource/upload/temp_exercise', formData);
}
