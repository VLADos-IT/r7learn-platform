import { apiRequest } from './request.js';

export function getTest(courseUnitId) { return apiRequest('GET', `/Test/${courseUnitId}`); }
export function sendTestAnswers(data) { return apiRequest('PUT', '/Test/Answer/Update', data); }