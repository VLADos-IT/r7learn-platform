import { apiRequest } from './request.js';

export async function getComments(unitId, since, count) {
	return apiRequest('GET', `/Comment/${unitId}/false/${since}/${count}`);
}

export async function getReplies(unitId, commentId, since, count) {
	return apiRequest('GET', `/Comment/${unitId}/RepliesTo/${commentId}/${since}/${count}`);
}

export async function createComment(data) {
	return apiRequest('POST', '/Comment/Create', data);
}

export async function deleteComment(commentId) {
	return apiRequest('DELETE', `/Comment/${commentId}`);
}
