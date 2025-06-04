import { getTest } from '../../api/test.js';
import { renderTest } from '../test.js';

export async function renderTestUnit(unit, container) {
	container.innerHTML = '';
	try {
		const test = await getTest(unit.id);
		if (test && test.questions && test.questions.length) {
			renderTest(test, container);
		} else {
			container.innerHTML = "<p>Тест не найден</p>";
		}
	} catch (e) {
		container.innerHTML = `<p>Ошибка загрузки теста: ${e.message}</p>`;
	}
}