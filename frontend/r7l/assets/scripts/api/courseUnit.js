import { apiRequest } from './request.js';

export function courseUnitCreate(data) { return apiRequest('POST', '/CourseUnit/Create', data); }
export function courseUnitUpdate(data) { return apiRequest('PUT', '/CourseUnit', data); }
export function courseUnitReorder(id, newOrder) { return apiRequest('PATCH', `/CourseUnit/${id}/${newOrder}`); }
export function courseUnitDelete(id) { return apiRequest('DELETE', `/CourseUnit/${id}`); }