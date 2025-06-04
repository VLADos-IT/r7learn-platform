import { buildMenu } from '../../components/menu.js';
import { setupNavigation } from '../../components/navigation.js';
import * as core from './core.js';
import * as nav from './nav.js';
import './prevNext.js';

let currentIndex = 0;
export function getCurrentIndex() { return currentIndex; }
export function setCurrentIndex(val) { currentIndex = val; }

document.addEventListener("DOMContentLoaded", async () => {
	const courseId = core.getCourseIdFromURL();
	const userId = core.getUserId();
	const container = document.getElementById("markdown-content");
	if (!courseId || !userId) {
		container.innerHTML = `<h1>Ошибка</h1><p>Курс или пользователь не определён.</p>`;
		return;
	}
	try {
		await core.loadCourseUnits(courseId);
		await core.loadProgress(courseId, userId);
		let savedIndex = 0;
		const saved = localStorage.getItem(`currentUnit_${courseId}_${userId}`);
		if (saved !== null && !isNaN(Number(saved))) {
			savedIndex = Number(saved);
			if (savedIndex < 0 || savedIndex >= core.courseUnits.length) savedIndex = 0;
		}
		if (core.courseUnits && core.courseUnits.length > 0) {
			buildMenu(core.courseUnits, savedIndex, core.progressList, (idx) => {
				nav.loadPage(idx);
			});
			nav.loadPage(savedIndex);
			setupNavigation(
				() => { window.prevPage(); },
				() => { window.nextPage(); }
			);
		} else {
			container.innerHTML = `<h1>Нет тем в курсе</h1>`;
			document.getElementById("menu").innerHTML = "";
		}
	} catch (e) {
		container.innerHTML = `<h1>Ошибка</h1><p>${e.message}</p>`;
		document.getElementById("menu").innerHTML = "";
	}
});

window.refreshProgressAndMenu = async function () {
	const courseId = core.getCourseIdFromURL();
	const userId = core.getUserId();
	if (!courseId || !userId) return;
	await core.loadProgress(courseId, userId);
	buildMenu(core.courseUnits, core.currentIndex, core.progressList, (idx) => {
		nav.loadPage(idx);
	});
};

document.addEventListener('DOMContentLoaded', () => {
	const markdown = document.querySelector('.markdown');
	const navButtons = document.querySelector('.nav-buttons');
	if (!markdown || !navButtons) return;

	function updateNavVisibility() {
		if (markdown.scrollTop > 85) {
			navButtons.classList.add('visible');
		} else {
			navButtons.classList.remove('visible');
		}
	}

	navButtons.classList.remove('visible');
	markdown.addEventListener('scroll', updateNavVisibility);

	updateNavVisibility();
});