import {
	injectExerciseTemplates,
	renderExerciseSuccess,
	renderExerciseFail,
	renderExerciseLoading,
	renderExerciseError
} from '../exercise.js';
import { renderMarkdown } from '../../components/markdown.js';

export async function renderExerciseUnit(unit, container) {
	await injectExerciseTemplates();

	const userId = localStorage.getItem('userId');
	if (!userId) {
		container.innerHTML = '<p>Задание доступно только для зарегистрированных пользователей.</p>';
		return;
	}

	container.innerHTML = '';

	const descMdPath = `/resources/exercise_desc/${encodeURIComponent(unit.name)}/mds/0-start.md`;
	const descMdBasePath = `/resources/exercise_desc/${encodeURIComponent(unit.name)}/mds`;
	const descContainer = document.createElement('div');
	descContainer.className = 'exercise-desc-markdown';
	try {
		const resp = await fetch(descMdPath);
		if (resp.ok) {
			const md = await resp.text();
			renderMarkdown(md, descContainer, descMdBasePath, '0-start.md');
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
		const filename = `user_${userId}_${Date.now()}.docx`;
		const uploadRes = await fetch('/resources/temp_exercise/' + filename, {
			method: 'PUT',
			body: file
		});
		if (!uploadRes.ok) {
			resultBlock.innerHTML = 'Ошибка загрузки файла';
			return;
		}
		const body = {
			courseUnitId: Number(unit.id),
			userId: Number(userId),
			userSolutionPath: `/resources/temp_exercise/${filename}`
		};
		const res = await fetch("/exercisecheck/CheckExercise", {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
		if (!res.ok) {
			resultBlock.innerHTML = '';
			resultBlock.appendChild(renderExerciseError(await res.text()));
			return;
		}
		const data = await res.json();
		resultBlock.innerHTML = '';
		if (data.result) {
			resultBlock.appendChild(renderExerciseSuccess());
		} else {
			resultBlock.appendChild(renderExerciseFail(data.differences));
		}
		if (window.refreshProgressAndicons) window.refreshProgressAndicons();
	});
}