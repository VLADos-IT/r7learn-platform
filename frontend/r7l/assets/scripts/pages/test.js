import { sendTestAnswers } from '../api/test.js';
import { showAlert } from '../components/alert.js';
import { escapeHtml } from '../utils/escape.js';

async function injectTestTemplates() {
	if (document.getElementById('test-not-available')) return;
	const res = await fetch('assets/pages/test.templates.html');
	const html = await res.text();
	const temp = document.createElement('div');
	temp.innerHTML = html;
	document.body.appendChild(temp);
}

function renderTemplate(id, data = {}) {
	const tpl = document.getElementById(id);
	if (!tpl) return document.createTextNode('');
	let html = tpl.innerHTML;
	for (const key in data) {
		html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
	}
	const temp = document.createElement('div');
	temp.innerHTML = html.trim();
	return temp.firstElementChild || document.createTextNode(html);
}

function renderTest(test, container) {
	const userId = localStorage.getItem('userId');
	injectTestTemplates().then(() => {
		if (!userId) {
			container.innerHTML = '';
			container.appendChild(renderTemplate('test-not-available'));
			return;
		}

		container.innerHTML = '';
		container.appendChild(renderTemplate('test-loading'));

		setTimeout(() => {
			const form = document.createElement('form');
			form.id = 'test-form';
			form.className = 'test-form';

			const title = document.createElement('h2');
			title.className = 'test-title';
			title.textContent = escapeHtml(test.description || 'Тест');
			container.innerHTML = '';
			container.appendChild(title);
			container.appendChild(form);

			test.questions.forEach((q, idx) => {
				let optionsHtml = '';
				const type = q.typeName === 'multi' ? 'checkbox' : 'radio';
				q.options.forEach(opt => {
					optionsHtml += renderTemplate('test-option', {
						type,
						name: `q${q.id}${type === 'checkbox' ? '[]' : ''}`,
						value: opt.id,
						text: escapeHtml(opt.content)
					}).outerHTML;
				});
				form.appendChild(renderTemplate('test-question', {
					number: idx + 1,
					question: escapeHtml(q.question),
					options: optionsHtml
				}));
			});

			const submitWrapper = document.createElement('div');
			submitWrapper.className = 'test-submit-wrapper';
			submitWrapper.appendChild(renderTemplate('test-submit-btn'));
			form.appendChild(submitWrapper);

			const resultBlock = document.createElement('div');
			resultBlock.id = 'test-result';
			form.after(resultBlock);

			form.onsubmit = async (e) => {
				e.preventDefault();
				const btn = form.querySelector('button[type="submit"]');
				btn.querySelector('.btn-text').style.display = 'none';
				btn.querySelector('.btn-spinner').style.display = '';

				const answers = [];
				test.questions.forEach(q => {
					let selected = [];
					if (q.typeName === 'multi') {
						selected = Array.from(form.querySelectorAll(`input[name="q${q.id}[]"]:checked`)).map(i => +i.value);
					} else {
						const checked = form.querySelector(`input[name="q${q.id}"]:checked`);
						if (checked) selected = [+checked.value];
					}
					answers.push({ questionId: q.id, answers: selected });
				});
				try {
					const res = await sendTestAnswers({
						testId: test.id,
						userId: userId,
						questionsAnswers: answers
					});
					showAlert(`Ваш результат: ${res}`, 'success');
					resultBlock.innerHTML = '';
					resultBlock.appendChild(renderTemplate('test-result', { score: res }));

					if (window.refreshProgressAndMenu) {
						await window.refreshProgressAndMenu();
					}
				} catch (err) {
					showAlert('Ошибка отправки теста: ' + (err.message || 'Попробуйте позже'));
				} finally {
					btn.querySelector('.btn-text').style.display = '';
					btn.querySelector('.btn-spinner').style.display = 'none';
				}
			};
		}, 300);
	});
}

export { renderTest };