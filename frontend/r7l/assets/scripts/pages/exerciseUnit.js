export async function renderExerciseUnit(unit, container) {
	const exercise = await import('../exercise.js');
	await exercise.injectExerciseTemplates();

	const userId = localStorage.getItem('userId');
	if (!userId) {
		container.innerHTML = '<p>Задание доступно только для зарегистрированных пользователей.</p>';
		return;
	}

	container.innerHTML = '';
	container.appendChild(exercise.renderExerciseDesc(unit));

	const form = document.createElement('form');
	form.id = 'exercise-upload-form';
	form.enctype = 'multipart/form-data';
	form.innerHTML = `
		<label>Загрузите ваш .docx файл для проверки:
			<input type="file" name="userDocx" id="user-docx-file" accept=".docx" required>
		</label>
		<button type="submit">Проверить</button>
	`;
	container.appendChild(form);

	const resultBlock = document.createElement('div');
	resultBlock.id = 'exercise-result';
	container.appendChild(resultBlock);

	form.addEventListener('submit', async e => {
		e.preventDefault();
		resultBlock.innerHTML = '';
		resultBlock.appendChild(exercise.renderExerciseLoading());
		const fileInput = form.userDocx;
		if (!fileInput.files.length) {
			resultBlock.innerHTML = 'Выберите файл!';
			return;
		}
		const file = fileInput.files[0];
		const filename = `user_${Date.now()}.docx`;
		let uploadRes;
		try {
			uploadRes = await fetch('/resources/temp_exercise/' + filename, {
				method: 'PUT',
				body: file
			});
		} catch (err) {
			resultBlock.innerHTML = 'Ошибка соединения с сервером';
			return;
		}
		if (!uploadRes.ok) {
			if (uploadRes.status === 413) {
				resultBlock.innerHTML = 'Файл слишком большой';
			} else {
				resultBlock.innerHTML = 'Ошибка загрузки файла: ' + uploadRes.status;
			}
			return;
		}
		const body = {
			courseUnitId: Number(unit.id),
			userSolutionPath: `/resources/temp_exercise/${filename}`
		};
		let res;
		try {
			res = await fetch("/exercisecheck/CheckExercise", {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
		} catch (err) {
			resultBlock.innerHTML = 'Ошибка соединения с сервисом проверки';
			return;
		}
		if (!res.ok) {
			let msg = await res.text();
			resultBlock.innerHTML = '';
			resultBlock.appendChild(exercise.renderExerciseError(msg || ('Ошибка проверки: ' + res.status)));
			return;
		}
		const data = await res.json();
		resultBlock.innerHTML = '';
		if (data.result) {
			resultBlock.appendChild(exercise.renderExerciseSuccess());
		} else {
			resultBlock.appendChild(exercise.renderExerciseFail(data.differences));
		}
		if (window.refreshProgressAndicons) window.refreshProgressAndicons();
	});
}