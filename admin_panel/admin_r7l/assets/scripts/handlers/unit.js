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
		formData.append('docx', fileInput.files[0]);
		formData.append('courseId', courseId);
		formData.append('orderInCourse', orderInCourse);

		const convRes = await fetch('/converter/convertDocx', {
			method: 'POST',
			body: formData
		});
		if (!convRes.ok) {
			alert('Ошибка конвертации: ' + await convRes.text());
			return;
		}
		alert('Юнит успешно добавлен!');
		form.reset();
		await renderUnits(courseId);
		await fillTestCourseSelect();
	});
}