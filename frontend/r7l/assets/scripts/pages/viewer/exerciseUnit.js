import {
	injectExerciseTemplates,
	renderExerciseSuccess,
	renderExerciseFail,
	renderExerciseLoading,
	renderExerciseError
} from '../exercise.js';
import { renderMarkdown } from '../../components/markdown.js';
import { setupLightbox } from '../../components/lightbox.js';
import { updateProgress } from './core.js';
import { fetchMdContent, uploadTempExercise } from '../../api/resource.js';
import { checkExercise } from '../../api/exercise.js';

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
		const md = await fetchMdContent(descMdPath);
		const mdBasePath = `/api/resource/exercise_desc/${encodeURIComponent(unit.name)}/mds`;
		await renderMarkdown(md, descContainer, mdBasePath, '0-start.md');
		setupLightbox(descContainer);
	} catch (e) {
		descContainer.innerHTML = '<p>Описание задания не найдено или нет доступа</p>';
	}
	container.appendChild(descContainer);

	const form = document.createElement('form');
	form.id = 'exercise-upload-form';
	form.enctype = 'multipart/form-data';
	form.innerHTML = `
		<div class="file-upload-container">
			<label for="user-docx-file" class="file-upload-label">
				<span class="file-upload-text">Выберите файл .docx</span>
				<span class="file-upload-button">Обзор</span>
			</label>
			<input type="file" name="userDocx" id="user-docx-file" accept=".docx" required class="file-upload-input">
		</div>
		<button type="submit">Проверить</button>
	`;
	container.appendChild(form);

	const fileInput = form.querySelector('#user-docx-file');
	const fileLabelText = form.querySelector('.file-upload-text');
	fileInput.addEventListener('change', (e) => {
		if (e.target.files.length > 0) {
			fileLabelText.textContent = e.target.files[0].name;
		} else {
			fileLabelText.textContent = 'Выберите файл .docx';
		}
	});

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

		let uploadData;
		try {
			uploadData = await uploadTempExercise(file, userId);
		} catch (e) {
			resultBlock.innerHTML = '';
			resultBlock.appendChild(renderExerciseError('Ошибка загрузки файла: ' + e.message));
			return;
		}

		const userSolutionPath = `/resources/${uploadData.path}`;
		const body = {
			courseUnitId: Number(unit.id),
			userId: Number(userId),
			userSolutionPath
		};

		try {
			const data = await checkExercise(body);
			resultBlock.innerHTML = '';
			if (data.result) {
				resultBlock.appendChild(renderExerciseSuccess());
				await updateProgress(unit.id, 0);
				if (window.refreshProgressAndicons) window.refreshProgressAndicons();
			} else {
				resultBlock.appendChild(renderExerciseFail(data.differences));
			}
		} catch (err) {
			resultBlock.innerHTML = '';
			resultBlock.appendChild(renderExerciseError(err.message || 'Ошибка проверки'));
		}
	});
}