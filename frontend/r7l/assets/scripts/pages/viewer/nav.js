import {
	courseUnits,
	mdFiles,
	getCurrentIndex,
	getCurrentMdIndex,
} from './core.js';
import { loadPage } from './core.js';

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