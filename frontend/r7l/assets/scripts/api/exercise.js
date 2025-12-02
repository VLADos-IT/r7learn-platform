import { baseRequest } from './request.js';

export async function checkExercise(data) {
	return baseRequest('PUT', '/exercisecheck/CheckExercise', data);
}
