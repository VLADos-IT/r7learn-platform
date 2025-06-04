import { apiRequest } from './request.js';
import { getUser as getUserUtil } from '../utils/user.js';

export function userCreate(data) { return apiRequest('POST', '/User/Create', data); }
export function userAuth(data) { return apiRequest('POST', '/User/Authenticate', data); }
export function userGet(id) { return apiRequest('GET', `/User/${id}`); }
export function userCheckUnique(data) { return apiRequest('POST', '/User/CheckLoginAndEmailUniqueness', data); }
export function userUpdate(data) { return apiRequest('PUT', '/User/Update', data); }
export function userChangePassword(userId, data) { return apiRequest('PATCH', `/User/ChangePassword/${userId}`, data); }
export { getUserUtil as getUser };