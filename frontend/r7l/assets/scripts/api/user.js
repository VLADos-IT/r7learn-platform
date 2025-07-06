import { apiRequest } from './request.js';
import { getUser as getUserUtil } from '../utils/user.js';

export function userCreate(data) { return apiRequest('POST', '/User/Create', data); }
export function userAuth(data) { return apiRequest('POST', '/User/Authenticate', data); }
export async function userGet() {
	const token = localStorage.getItem('jwt');
	const res = await fetch('/api/User/CurrentUser', {
		headers: token ? { 'Authorization': `Bearer ${token}` } : {}
	});
	if (res.status === 401) {
		localStorage.removeItem('jwt');
		return { error: 'unauthorized' };
	}
	if (!res.ok) return { error: 'load error' };
	return res.json();
}
export function userCheckUnique(data) { return apiRequest('POST', '/User/CheckLoginAndEmailUniqueness', data); }
export function userUpdate(data) { return apiRequest('PUT', '/User/Update', data); }
export function userChangePassword(data) {
	return apiRequest('PUT', '/User/ChangePassword', data);
}
export { getUserUtil as getUser };