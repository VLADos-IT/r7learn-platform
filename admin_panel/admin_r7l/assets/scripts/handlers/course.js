import { renderCourses, renderUnits, fillTestCourseSelect } from '../modules/ui.js';
import { createCourse } from '../modules/api.js';

export async function initCourseHandlers() {
	await renderCourses();
	const select = document.getElementById('course-select');
	select.addEventListener('change', () => renderUnits(select.value));

	document.getElementById('add-course-form').addEventListener('submit', async e => {
		e.preventDefault();
		const form = e.target;
		const name = form.name.value.trim();
		const description = form.description.value.trim();
		const systemName = name.replace(/\s+/g, '_').toLowerCase();
		await createCourse({ name, systemName, description });
		await renderCourses();
		const select = document.getElementById('course-select');
		select.value = select.options[select.options.length - 1].value;
		await renderUnits(select.value);
		form.reset();
		await fillTestCourseSelect();
	});
}