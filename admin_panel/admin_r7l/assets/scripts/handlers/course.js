import { renderCourses } from '../modules/ui.js';
import { createCourse } from '../modules/api.js';

export async function initCourseHandlers() {
	await renderCourses();

	document.getElementById('add-course-form').addEventListener('submit', async e => {
		e.preventDefault();
		const form = e.target;
		const name = form.name.value.trim();
		const description = form.description.value.trim();
		const systemName = name.replace(/\s+/g, '_').toLowerCase();

		try {
			await createCourse({ name, systemName, description });
			await renderCourses();
			form.reset();
			alert('Курс успешно создан!');
		} catch (err) {
			alert('Ошибка при создании курса: ' + err.message);
		}
	});
}