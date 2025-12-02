import { sendRequest } from './api.js';

export async function uploadResource(formData) {
	try {
		return await sendRequest('POST', '/resource/upload', formData, true);
	} catch (e) {
		throw new Error('Ошибка загрузки файла: ' + e.message);
	}
}
