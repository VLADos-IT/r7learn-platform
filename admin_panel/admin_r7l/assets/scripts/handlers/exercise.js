import { renderUnits, fillTestCourseSelect, fillExerciseCourseSelect } from '../modules/ui.js';

function getCookie(name) {
	const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

async function uploadExerciseFile(file, courseId, orderInCourse, name) {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('subdir', 'exercises');
	formData.append('courseId', courseId);
	formData.append('orderInCourse', orderInCourse);
	let safeName = name && name.trim() ? name.trim() : file.name.replace(/\.[^.]+$/, '');
	formData.append('name', safeName);
	let headers = {};
	const token = getCookie('jwt');
	if (token) headers['Authorization'] = `Bearer ${token}`;
	const res = await fetch('/api/resource/upload', {
		method: 'POST',
		body: formData,
		headers,
		credentials: 'include'
	});
	if (!res.ok) throw new Error('Ошибка загрузки файла: ' + (await res.text()));
	return await res.json();
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

		if (descInput && descInput.files.length) {
			const descFile = descInput.files[0];
			const descFormData = new FormData();
			descFormData.append('file', descFile);
			descFormData.append('subdir', 'exercise_desc');
			descFormData.append('courseId', courseId);
			descFormData.append('orderInCourse', orderInCourse);
			let safeName = name && name.trim() ? name.trim() : descFile.name.replace(/\.[^.]+$/, '');
			descFormData.append('name', safeName);
			let headers = {};
			const token = getCookie('jwt');
			if (token) headers['Authorization'] = `Bearer ${token}`;
			try {
				await fetch('/api/resource/upload', {
					method: 'POST',
					body: descFormData,
					headers,
					credentials: 'include'
				});
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