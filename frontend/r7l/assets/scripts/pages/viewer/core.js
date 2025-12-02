import { getCourseUnits } from '../../api/course.js';
import { getCourseProgress, updateCourseProgress } from '../../api/progress.js';
import { getTest } from '../../api/test.js';
import { loadMdFile, updatePageIndicator } from './md.js';
import { updateNavButtons, setupNavigation } from './nav.js';
import { buildicons } from '../../components/menu.js';
import { showSplashScreen, hideSplashOnImagesLoad } from '../../components/splash.js';

export let progressList = [];
export let currentIndex = 0;
export function getCurrentIndex() { return currentIndex; }
export function setCurrentIndex(val) { currentIndex = val; }

export let currentMdIndex = 0;
export function getCurrentMdIndex() { return currentMdIndex; }
export function setCurrentMdIndex(val) { currentMdIndex = val; }

export let userMdProgress = {}; // { unitId: mdIndex }

export let mdBasePath = '';
export function setMdBasePath(val) { mdBasePath = val; }

export let mdFiles = [];
export function setMdFiles(val) { mdFiles = val; }

export let courseUnits = [];

export function loadPage(index) {
	return new Promise((resolve) => {
		showSplashScreen();
		setCurrentIndex(index);
		const courseId = getCourseIdFromURL();
		if (courseId) {
			localStorage.setItem(`currentUnit_${courseId}`, index);
		}
		const unit = courseUnits[index];
		const container = document.getElementById("markdown-content");

		// Update Title
		const titleEl = document.getElementById('unit-title');
		if (titleEl && unit) {
			titleEl.textContent = unit.name;
		}

		// Reload Comments
		const commentsContainer = document.getElementById('comments-section');
		if (unit && commentsContainer) {
			import('../../components/comments.js').then(({ renderComments }) => {
				if (typeof renderComments === 'function') {
					renderComments(unit.id, commentsContainer);
				}
			}).catch(err => console.error("Failed to load comments:", err));
		}

		buildicons(courseUnits, index, progressList, (idx) => {
			showSplashScreen();
			loadPage(idx).then(() => {
				hideSplashOnImagesLoad();
				setupNavigation(window.prevPage, window.nextPage);
			});
		});

		updatePageIndicator(container);

		if (unit.courseUnitTypeName === "test") {
			setCurrentMdIndex(0);
			mdFiles.length = 0;
			container.innerHTML = '';
			import('../test.js').then(({ renderTest }) => {
				getTest(unit.id).then(test => {
					if (test && test.questions && test.questions.length) {
						renderTest(test, container);
					} else {
						container.innerHTML = "<p>Тест не найден</p>";
					}
					hideSplashOnImagesLoad();
					updateNavButtons();
					setupNavigation(window.prevPage, window.nextPage);
					resolve();
				}).catch(e => {
					container.innerHTML = `<p>Ошибка загрузки теста: ${e.message}</p>`;
					hideSplashOnImagesLoad();
					updateNavButtons();
					setupNavigation(window.prevPage, window.nextPage);
					resolve();
				});
			});
		} else if (unit.courseUnitTypeName === "exercise") {
			setCurrentMdIndex(0);
			mdFiles.length = 0;
			container.innerHTML = '';
			import('./exerciseUnit.js').then(({ renderExerciseUnit }) => {
				renderExerciseUnit(unit, container).then(() => {
					hideSplashOnImagesLoad();
					updateNavButtons();
					setupNavigation(window.prevPage, window.nextPage);
					resolve();
				}).catch(() => {
					hideSplashOnImagesLoad();
					updateNavButtons();
					setupNavigation(window.prevPage, window.nextPage);
					resolve();
				});
			});
		} else if (unit.courseUnitTypeName === "lesson") {
			setCurrentMdIndex(0);
			const mdPath = parseMdPathFromName(unit.name);
			if (mdPath) {
				loadMdFile(mdPath, 0, unit.id).then(() => {
					hideSplashOnImagesLoad();
					resolve();
				}).catch(() => {
					hideSplashOnImagesLoad();
					resolve();
				});
			} else {
				container.innerHTML = `<h2>Ошибка</h2><p>Файлы урока не найдены</p>`;
				setMdFiles([]);
				setCurrentMdIndex(0);
				updateNavButtons();
				setupNavigation(window.prevPage, window.nextPage);
				hideSplashOnImagesLoad();
				resolve();
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
			setupNavigation(window.prevPage, window.nextPage);
			hideSplashOnImagesLoad();
			resolve();
		}

		const navButtons = document.querySelector('.nav-buttons');
		if (navButtons) {
			navButtons.classList.add('visible');
		}
	});
}

export async function loadCourseUnits(courseId) {
	courseUnits = await getCourseUnits(courseId);
}

export async function loadProgress(courseId) {
	progressList = await getCourseProgress(courseId);
	userMdProgress = {};
	progressList.forEach(p => {
		userMdProgress[p.courseUnitId] = Math.max(0, (p.degree || 1) - 1);
	});
	try {
		const saved = localStorage.getItem(`mdProgress_${courseId}`);
		if (saved) Object.assign(userMdProgress, JSON.parse(saved));
	} catch (err) {
		console.error('Ошибка восстановления локального прогресса:', err);
	}
}

export async function updateProgress(unitId, mdIndex) {
	userMdProgress[unitId] = mdIndex;
	await updateCourseProgress({
		courseUnitId: unitId,
		degree: mdIndex + 1
	});
}

export function parseMdPathFromName(name) {
	return `/api/resource/${encodeURIComponent(name)}/mds/`;
}

export function getCourseIdFromURL() {
	const params = new URLSearchParams(window.location.search);
	return params.get('course');
}