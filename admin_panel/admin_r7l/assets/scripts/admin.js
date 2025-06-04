import { fetchCourses, createCourse, fetchUnits, createUnit } from './modules/api.js';
import { renderCourses, renderUnits, fillTestCourseSelect, fillExerciseCourseSelect } from './modules/ui.js';
import { uploadTestTxt } from './modules/test.js';

document.addEventListener('DOMContentLoaded', async () => {
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

	document.getElementById('docx-file').addEventListener('change', function () {
		const label = document.getElementById('file-name-label');
		label.textContent = this.files.length ? this.files[0].name : 'Файл не выбран';
	});

	document.getElementById('test-txt-file').addEventListener('change', function () {
		const label = document.getElementById('test-file-name-label');
		label.textContent = this.files.length ? this.files[0].name : 'Файл не выбран';
	});

	document.getElementById('upload-exercise-form').addEventListener('submit', async e => {
		e.preventDefault();
		const form = e.target;
		const status = document.getElementById('upload-exercise-status');
		const formData = new FormData(form);
		const courseId = form.courseId.value;
		const orderInCourse = form.orderInCourse.value;
		const name = form.name.value.trim();
		const fileInput = form.exerciseDocx;
		status.textContent = 'Загрузка...';

		if (!fileInput.files.length) {
			status.textContent = 'Загрузите docx-файл!';
			return;
		}

		// 1. Загружаем файл во временную папку
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

		// 2. Создаём задание через ExerciseCheck API
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
		status.textContent = 'Задание успешно создано!';
		form.reset();
		await renderUnits(courseId);
		await fillTestCourseSelect();
		await fillExerciseCourseSelect();
	});

	document.getElementById('exercise-docx-file').addEventListener('change', function () {
		const label = document.getElementById('exercise-file-name-label');
		label.textContent = this.files.length ? this.files[0].name : 'Файл не выбран';
	});

	await fillTestCourseSelect();
	await fillExerciseCourseSelect();
});
