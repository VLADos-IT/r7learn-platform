import {
	injectExerciseTemplates,
	renderExerciseSuccess,
	renderExerciseFail,
	renderExerciseLoading,
	renderExerciseError
} from '../exercise.js';
import { renderMarkdown } from '../../components/markdown.js';
import { updateProgress } from './core.js';

export async function renderExerciseUnit(unit, container) {
	await injectExerciseTemplates();

	const userId = localStorage.getItem('userId');
	if (!userId) {
		container.innerHTML = '<p>Задание доступно только для зарегистрированных пользователей.</p>';
		return;
	}

	container.innerHTML = '';

	const descMdPath = `/api/resource/exercise_desc/${encodeURIComponent(unit.name)}/mds/0-start.md`;
	const descMdBasePath = `/api/resource/exercise_desc/${encodeURIComponent(unit.name)}/mds`;
	const descContainer = document.createElement('div');
	descContainer.className = 'exercise-desc-markdown';
	try {
		const token = localStorage.getItem('jwt');
		const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
		const resp = await fetch(descMdPath, { headers, credentials: 'include' });
		if (resp.ok) {
			const md = await resp.text();
			// Передаем правильный mdBasePath для корректной подстановки картинок
			const mdBasePath = `/api/resource/exercise_desc/${encodeURIComponent(unit.name)}/mds`;
			renderMarkdown(md, descContainer, mdBasePath, '0-start.md');
		} else if (resp.status === 401 || resp.status === 403) {
			descContainer.innerHTML = '<p>Нет доступа к описанию задания (авторизуйтесь)</p>';
		} else {
			descContainer.innerHTML = '<p>Описание задания не найдено</p>';
		}
	} catch (e) {
		descContainer.innerHTML = '<p>Ошибка загрузки описания задания</p>';
	}
	container.appendChild(descContainer);

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
		resultBlock.appendChild(renderExerciseLoading());
		const fileInput = form.userDocx;
		if (!fileInput.files.length) {
			resultBlock.innerHTML = 'Выберите файл!';
			return;
		}
		const file = fileInput.files[0];
		const formData = new FormData();
		formData.append('file', file);
		formData.append('userId', userId);
		let uploadRes;
		try {
			const token = localStorage.getItem('jwt');
			const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
			uploadRes = await fetch('/api/resource/upload/temp_exercise', {
				method: 'POST',
				body: formData,
				headers,
				credentials: 'include'
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
		const uploadData = await uploadRes.json();
		const userSolutionPath = `/resources/${uploadData.path}`;
		const body = {
			courseUnitId: Number(unit.id),
			userId: Number(userId),
			userSolutionPath
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
			resultBlock.appendChild(renderExerciseError(msg || ('Ошибка проверки: ' + res.status)));
			return;
		}
		const data = await res.json();
		resultBlock.innerHTML = '';
		if (data.result) {
			resultBlock.appendChild(renderExerciseSuccess());
			await updateProgress(unit.id, 0);
			if (window.refreshProgressAndicons) window.refreshProgressAndicons();
		} else {
			resultBlock.appendChild(renderExerciseFail(data.differences));
		}
	});
}