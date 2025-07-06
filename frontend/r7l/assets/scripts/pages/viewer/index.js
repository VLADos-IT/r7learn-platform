import { buildicons } from '../../components/menu.js';
import { updateNavButtons } from './nav.js';
import * as core from './core.js';
import './prevNext.js';
import { injectSplashScreen, showSplashScreen, hideSplashOnImagesLoad } from '../../components/splash.js';

injectSplashScreen();

async function handlePageLoad(idx) {
	showSplashScreen();
	await core.loadPage(idx);
	hideSplashOnImagesLoad();
	updateNavButtons();
}

document.addEventListener("DOMContentLoaded", async () => {
	const courseId = core.getCourseIdFromURL();
	const container = document.getElementById("markdown-content");
	if (!container) return;
	if (!courseId) {
		container.innerHTML = `<h1>Ошибка</h1><p>Курс не определён.</p>`;
		hideSplashOnImagesLoad();
		return;
	}
	try {
		showSplashScreen();
		await core.loadCourseUnits(courseId);
		await core.loadProgress(courseId);
		let savedIndex = 0;
		const saved = localStorage.getItem(`currentUnit_${courseId}`);
		if (saved !== null && !isNaN(Number(saved))) {
			savedIndex = Number(saved);
			if (savedIndex < 0 || savedIndex >= core.courseUnits.length) savedIndex = 0;
		}
		if (core.courseUnits && core.courseUnits.length > 0) {
			buildicons(core.courseUnits, savedIndex, core.progressList, (idx) => {
				handlePageLoad(idx);
			});
			await handlePageLoad(savedIndex);
		} else {
			container.innerHTML = `<h1>Нет тем в курсе</h1>`;
			document.getElementById("icons").innerHTML = "";
			hideSplashOnImagesLoad();
		}
	} catch (e) {
		container.innerHTML = `<h1>Ошибка</h1><p>${e.message}</p>`;
		document.getElementById("icons").innerHTML = "";
		hideSplashOnImagesLoad();
	}
});

window.refreshProgressAndicons = async function () {
	const courseId = core.getCourseIdFromURL();
	await core.loadProgress(courseId);
	buildicons(core.courseUnits, core.getCurrentIndex(), core.progressList, (idx) => {
		handlePageLoad(idx);
	});
};