import { renderUnits, fillTestCourseSelect, fillExerciseCourseSelect } from '../modules/ui.js';

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

		// 1. Загружаем эталон
		const file = fileInput.files[0];
		const filename = `exercise_${Date.now()}.docx`;
		const uploadRes = await fetch('/resources/temp_exercise/' + filename, {
			method: 'PUT',
			body: file
		});
		if (!uploadRes.ok) {
			status.textContent = 'Ошибка загрузки файла на сервер';
			return;
		}

		// 2. Создаём задание
		const body = {
			courseId: Number(courseId),
			orderInCourse: Number(orderInCourse),
			name,
			expectedSolutionPath: `/resources/temp_exercise/${filename}`
		};
		const res = await fetch("/exercisecheck/CreateNewExercise", {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			status.textContent = 'Ошибка: ' + await res.text();
			return;
		}

		// 3. Загружаем описание (docx) через конвертер
		if (descInput && descInput.files.length) {
			const descFile = descInput.files[0];
			const descFormData = new FormData();
			descFormData.append('descDocx', descFile);
			descFormData.append('name', name);
			const convRes = await fetch('/converter/CreateExerciseInfo', {
				method: 'POST',
				body: descFormData
			});
			if (!convRes.ok) {
				status.textContent = 'Ошибка загрузки описания: ' + await convRes.text();
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