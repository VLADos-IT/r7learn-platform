import { renderUnits, fillTestCourseSelect } from '../modules/ui.js';
import { uploadResource } from '../modules/resource.js';

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

		try {
			await uploadResource(formData);
			alert('Юнит успешно добавлен!');
			form.reset();
			await renderUnits(courseId);
			await fillTestCourseSelect();
		} catch (e) {
			alert('Ошибка загрузки: ' + e.message);
		}
	});
}
