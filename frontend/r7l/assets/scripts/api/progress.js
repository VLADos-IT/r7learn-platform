import { apiRequest } from './request.js';

export function getCourseProgress(courseId, userId) { return apiRequest('GET', `/CourseProgress/${courseId}/${userId}`); }
export function updateCourseProgress(data) { return apiRequest('PUT', '/CourseProgress/Update', data); }