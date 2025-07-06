import { renderUnits, fillTestCourseSelect } from '../modules/ui.js';

export async function initUnitHandlers() {
	document.getElementById('add-unit-form').addEventListener('submit', async e => {
		e.preventDefault();
		const form = e.target;
		const courseId = form.courseId.value;
		const orderInCourse = form.orderInCourse.value;
		const fileInput = form.docx;

		if (!fileInput.files.length) {
			alert('Загрузите docx-файл для темы!');
			return;
		}

		const formData = new FormData();
		formData.append('file', fileInput.files[0]);
		const fileName = fileInput.files[0].name;
		const folderName = fileName.replace(/\.[^.]+$/, '');
		formData.append('name', folderName);
		formData.append('subdir', 'docx');
		formData.append('courseId', courseId);
		formData.append('orderInCourse', orderInCourse);
		let headers = {};
		const token = document.cookie.match(/(?:^|; )jwt=([^;]*)/);
		if (token) headers['Authorization'] = `Bearer ${decodeURIComponent(token[1])}`;
		const convRes = await fetch('/api/resource/upload', {
			method: 'POST',
			body: formData,
			headers,
			credentials: 'include'
		});
		if (!convRes.ok) {
			alert('Ошибка загрузки: ' + await convRes.text());
			return;
		}
		alert('Юнит успешно добавлен!');
		form.reset();
		await renderUnits(courseId);
		await fillTestCourseSelect();
	});
}