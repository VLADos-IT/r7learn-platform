import { apiRequest } from './request.js';

export function getAllCourses() { return apiRequest('GET', '/Course/GetAllCourses'); }
export function courseCreate(data) { return apiRequest('POST', '/Course/Create', data); }
export function getCourseUnits(courseId) { return apiRequest('GET', `/Course/${courseId}/Units`); }