import {
	courseUnits,
	mdFiles,
	getCurrentIndex,
	getCurrentMdIndex,
} from './core.js';

export function updateNavButtons() {
	const navButtons = document.querySelector('.nav-buttons');
	if (!navButtons) return;

	navButtons.innerHTML = '';

	const unit = courseUnits[getCurrentIndex()];
	if (!unit) return;

	const isLesson = unit.courseUnitTypeName === "lesson";
	const isTest = unit.courseUnitTypeName === "test";
	const isExercise = unit.courseUnitTypeName === "exercise";
	const hasMd = mdFiles.length > 0;
	const isFirstMd = getCurrentMdIndex() === 0;
	const isLastMd = hasMd && getCurrentMdIndex() === mdFiles.length - 1;
	const isLastUnit = getCurrentIndex() === courseUnits.length - 1;

	const btnContainer = document.createElement('div');
	btnContainer.className = 'nav-btns-flex';

	const prevBtn = document.createElement('button');
	prevBtn.className = 'nav-btn nav-btn-prev';
	prevBtn.setAttribute('data-nav', 'prev');
	prevBtn.textContent = 'Назад';
	if (!(isLesson && hasMd && !isFirstMd)) {
		prevBtn.disabled = true;
		prevBtn.classList.add('nav-btn-hidden');
	}
	btnContainer.appendChild(prevBtn);

	const nextBtn = document.createElement('button');
	nextBtn.className = 'nav-btn nav-btn-next';
	nextBtn.setAttribute('data-nav', 'next');
	nextBtn.textContent = 'Вперед';
	if (!(isLesson && hasMd && !isLastMd)) {
		nextBtn.disabled = true;
		nextBtn.classList.add('nav-btn-hidden');
	}
	btnContainer.appendChild(nextBtn);

	navButtons.appendChild(btnContainer);

	const needNextUnitBtn =
		(isLesson && hasMd && isLastMd && !isLastUnit) ||
		((isTest || isExercise) && !isLastUnit);

	if (needNextUnitBtn) {
		const nextUnitBtn = document.createElement('button');
		nextUnitBtn.className = 'next-unit-btn';
		nextUnitBtn.textContent = 'Перейти к следующему уроку';
		nextUnitBtn.onclick = () => {
			import('./core.js').then(({ loadPage }) => {
				loadPage(getCurrentIndex() + 1);
			});
		};
		navButtons.appendChild(nextUnitBtn);
	}

	if (
		(isLesson && hasMd) ||
		(isTest && !isLastUnit) ||
		(isExercise && !isLastUnit)
	) {
		navButtons.classList.add('visible');
	} else {
		navButtons.classList.remove('visible');
	}

	setupNavigation(window.prevPage, window.nextPage);
}

export function setupNavigation(onPrev, onNext) {
	const navButtons = document.querySelector('.nav-buttons');
	if (!navButtons) return;
	const prevBtn = navButtons.querySelector('[data-nav="prev"]');
	const nextBtn = navButtons.querySelector('[data-nav="next"]');
	if (prevBtn) prevBtn.onclick = onPrev;
	if (nextBtn) nextBtn.onclick = onNext;
}