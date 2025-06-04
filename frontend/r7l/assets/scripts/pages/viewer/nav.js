import {
	getCourseIdFromURL,
	getUserId,
	courseUnits,
	mdFiles,
	setCurrentIndex,
	getCurrentIndex,
	setCurrentMdIndex,
	getCurrentMdIndex,
	parseMdPathFromName,
} from './core.js';
import { loadMdFile } from './md.js';
import { getTest } from '../../api/test.js';
import { renderTest } from '../test.js';
import { renderExerciseUnit } from './exerciseUnit.js';

export function updateNavButtons() {
	const navButtons = document.querySelector('.nav-buttons');
	if (!navButtons) return;
	const prevBtn = navButtons.querySelector('[data-nav="prev"]');
	const nextBtn = navButtons.querySelector('[data-nav="next"]');
	if (!prevBtn || !nextBtn) return;

	let centerBtn = navButtons.querySelector('.next-unit-btn');

	const unit = courseUnits[getCurrentIndex()];
	const isTest = unit && unit.courseUnitTypeName === "test";
	const isLesson = unit && unit.courseUnitTypeName === "lesson";
	const isLastUnit = getCurrentIndex() >= courseUnits.length - 1;
	const hasMd = mdFiles.length > 0;
	const isFirstMd = getCurrentMdIndex() === 0;
	const isLastMd = hasMd && getCurrentMdIndex() === mdFiles.length - 1;

	if (isLesson && hasMd && !isFirstMd) prevBtn.classList.remove('hidden');
	else prevBtn.classList.add('hidden');

	if (isLesson && hasMd && getCurrentMdIndex() < mdFiles.length - 1) nextBtn.classList.remove('hidden');
	else nextBtn.classList.add('hidden');

	const needCenter = (
		(isLesson && hasMd && isLastMd && !isLastUnit) ||
		(isTest && !isLastUnit)
	);
	if (needCenter) {
		if (!centerBtn) {
			centerBtn = document.createElement('button');
			centerBtn.className = 'next-unit-btn';
			centerBtn.textContent = 'Перейти к следующему уроку';
			centerBtn.onclick = () => loadPage(getCurrentIndex() + 1);
			navButtons.appendChild(centerBtn);
		}
		centerBtn.classList.remove('hidden');
	} else if (centerBtn) {
		centerBtn.classList.add('hidden');
	}
}

export function loadPage(index) {
	setCurrentIndex(index);
	const courseId = getCourseIdFromURL();
	const userId = getUserId();
	if (courseId && userId) {
		localStorage.setItem(`currentUnit_${courseId}_${userId}`, index);
	}
	const unit = courseUnits[index];

	document.querySelectorAll('.menu-section').forEach((el, idx) => {
		el.classList.toggle('active', idx === index);
	});

	const container = document.getElementById("markdown-content");

	if (unit.courseUnitTypeName === "test") {
		setCurrentMdIndex(0);
		mdFiles.length = 0;
		container.innerHTML = '';
		getTest(unit.id).then(test => {
			if (test && test.questions && test.questions.length) {
				renderTest(test, container);
			} else {
				container.innerHTML = "<p>Тест не найден</p>";
			}
		}).catch(e => {
			container.innerHTML = `<p>Ошибка загрузки теста: ${e.message}</p>`;
		});
		updateNavButtons();
	} else if (unit.courseUnitTypeName === "exercise") {
		setCurrentMdIndex(0);
		mdFiles.length = 0;
		container.innerHTML = '';
		renderExerciseUnit(unit, container);
		updateNavButtons();
	} else if (unit.courseUnitTypeName === "lesson") {
		setCurrentMdIndex(0);
		const mdPath = parseMdPathFromName(unit.name);
		if (mdPath) {
			loadMdFile(mdPath, 0, unit.id);
		}
	} else {
		setCurrentMdIndex(0);
		mdFiles.length = 0;
		container.innerHTML = `
            <h1>${unit.name}</h1>
            <p>Тип: ${unit.courseUnitTypeName}</p>
            <p>Максимальный балл: ${unit.maxDegree}</p>
        `;
		updateNavButtons();
	}
}