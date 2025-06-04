import { escapeHtml } from '../utils/escape.js';

export async function injectExerciseTemplates() {
	if (document.getElementById('exercise-desc')) return;
	const res = await fetch('assets/pages/exercise.templates.html');
	const html = await res.text();
	const temp = document.createElement('div');
	temp.innerHTML = html;
	document.body.appendChild(temp);
}

export function renderTemplate(id, data = {}) {
	const tpl = document.getElementById(id);
	if (!tpl) return '';
	const clone = tpl.content.cloneNode(true);
	let html = clone.firstElementChild ? clone.firstElementChild.outerHTML : clone.textContent;
	for (const key in data) {
		html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
	}
	const temp = document.createElement('div');
	temp.innerHTML = html;
	return temp.children.length === 1 ? temp.firstElementChild : temp;
}

export function renderExerciseDesc(unit) {
	return renderTemplate('exercise-desc', {
		name: unit.name || 'Задание',
		description: unit.description || ''
	});
}

export function renderExerciseSuccess() {
	return renderTemplate('exercise-success');
}

export function renderExerciseFail(differences) {
	let errors = [];
	if (Array.isArray(differences)) {
		errors = differences;
	} else if (typeof differences === 'string' && differences) {
		errors = [differences];
	}
	const errorsHtml = errors.length
		? errors.map(e => `<li>${escapeHtml(e)}</li>`).join('')
		: '<li>Неизвестная ошибка</li>';

	const failBlock = renderTemplate('exercise-fail', { errors: errorsHtml });
	if (!failBlock) {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = `<span style="color:red;">Есть ошибки:</span><ul>${errorsHtml}</ul>`;
		return wrapper;
	}
	return failBlock;
}

export function renderExerciseLoading() {
	return renderTemplate('exercise-loading');
}

export function renderExerciseError(error) {
	return renderTemplate('exercise-load-error', { error });
}