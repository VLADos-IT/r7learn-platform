import { apiRequest } from './request.js';

export function getCourseProgress(courseId) {
	return apiRequest('GET', `/CourseProgress/${courseId}`);
}
export function updateCourseProgress(data) { return apiRequest('PUT', '/CourseProgress/Update', data); }