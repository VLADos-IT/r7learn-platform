import { renderUnits, fillTestCourseSelect, fillExerciseCourseSelect } from '../modules/ui.js';
import { uploadResource } from '../modules/resource.js';

async function uploadExerciseFile(file, courseId, orderInCourse, name) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('subdir', 'exercises');
	formData.append('courseId', courseId);
	formData.append('orderInCourse', orderInCourse);
	let safeName = name && name.trim() ? name.trim() : file.name.replace(/\.[^.]+$/, '');
	formData.append('name', safeName);

	return await uploadResource(formData);
}

export async function initExerciseHandlers() {
	document.getElementById('upload-exercise-form').addEventListener('submit', async e => {
		e.preventDefault();
		const form = e.target;
		const status = document.getElementById('upload-exercise-status');
		const courseId = form.courseId.value;
		const orderInCourse = form.orderInCourse.value;
		const name = form.name.value.trim();
		const fileInput = form.exerciseDocx;
		const descInput = form['descDocx'];
		status.textContent = 'Загрузка...';

		if (!fileInput.files.length) {
			status.textContent = 'Загрузите docx-файл!';
			return;
		}

		const file = fileInput.files[0];
		try {
			await uploadExerciseFile(file, courseId, orderInCourse, name);
		} catch (err) {
			status.textContent = 'Ошибка: ' + err.message;
			return;
		}

		if (descInput.files.length) {
			const descFile = descInput.files[0];
			const descFormData = new FormData();
			descFormData.append('file', descFile);
			descFormData.append('subdir', 'exercise_desc');
			descFormData.append('courseId', courseId);
			descFormData.append('orderInCourse', orderInCourse);
			let safeName = name && name.trim() ? name.trim() : file.name.replace(/\.[^.]+$/, '');
			descFormData.append('name', safeName);

			try {
				await uploadResource(descFormData);
			} catch (err) {
				status.textContent = 'Ошибка загрузки описания: ' + err.message;
				return;
			}
		}

		status.textContent = 'Задание успешно создано!';
		form.reset();
		await renderUnits(courseId);
		await fillTestCourseSelect();
		await fillExerciseCourseSelect();
	});
}