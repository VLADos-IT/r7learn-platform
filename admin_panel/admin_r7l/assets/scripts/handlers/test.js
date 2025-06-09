import { uploadTestTxt } from '../modules/test.js';

export async function initTestHandlers() {
	document.getElementById('upload-test-form').addEventListener('submit', async e => {
		e.preventDefault();
		const form = e.target;
		const status = document.getElementById('upload-test-status');
		const formData = new FormData(form);
		const courseId = form.courseId.value;
		const orderInCourse = form.orderInCourse.value;
		status.textContent = 'Загрузка...';
		try {
			await uploadTestTxt(formData, courseId, orderInCourse);
			status.textContent = 'Тест успешно создан!';
			form.reset();
		} catch (err) {
			status.textContent = 'Ошибка: ' + err.message;
		}
	});
}