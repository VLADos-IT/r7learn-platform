import { buildicons } from '../../components/menu.js';
import { updateNavButtons } from './nav.js';
import * as core from './core.js';
import './prevNext.js';
import { injectSplashScreen, showSplashScreen, hideSplashOnImagesLoad } from '../../components/splash.js';

injectSplashScreen();

async function handlePageLoad(idx) {
	showSplashScreen();
	await core.loadPage(idx);
	const unit = core.courseUnits[idx];

	const titleEl = document.getElementById('unit-title');
	if (titleEl && unit) {
		titleEl.textContent = unit.name;
	}

	const commentsContainer = document.getElementById('comments-section');
	if (unit && commentsContainer) {
		try {
			const { renderComments } = await import('../../components/comments.js');
			if (typeof renderComments === 'function') {
				renderComments(unit.id, commentsContainer);
			} else {
				console.error("renderComments not found in module");
			}
		} catch (err) {
			console.error("Failed to load comments:", err);
		}
	}
	hideSplashOnImagesLoad();
	updateNavButtons();
}

function setupFontControls() {
	const markdownContent = document.getElementById('markdown-content');
	const increaseBtn = document.getElementById('font-size-increase');
	const decreaseBtn = document.getElementById('font-size-decrease');
	const display = document.getElementById('font-size-display');
	const familySelect = document.getElementById('font-family-select');

	if (!markdownContent || !increaseBtn || !decreaseBtn || !familySelect) return;

	let currentSize = parseInt(localStorage.getItem('viewerFontSize')) || 100;
	let currentFamily = localStorage.getItem('viewerFontFamily') || 'sans-serif';

	const updateStyles = () => {
		markdownContent.style.fontSize = `${currentSize}%`;
		if (currentFamily === 'serif') {
			markdownContent.style.fontFamily = "'Merriweather', 'Georgia', serif";
			markdownContent.style.lineHeight = "1.8";
		} else {
			markdownContent.style.fontFamily = ""; // Reset to default (Inter/Segoe UI from CSS)
			markdownContent.style.lineHeight = "1.6";
		}
		if (display) display.textContent = `${currentSize}%`;

		localStorage.setItem('viewerFontSize', currentSize);
		localStorage.setItem('viewerFontFamily', currentFamily);
		familySelect.value = currentFamily;
	};

	increaseBtn.onclick = () => {
		if (currentSize < 200) {
			currentSize += 10;
			updateStyles();
		}
	};

	decreaseBtn.onclick = () => {
		if (currentSize > 50) {
			currentSize -= 10;
			updateStyles();
		}
	};

	familySelect.onchange = (e) => {
		currentFamily = e.target.value;
		updateStyles();
	};

	updateStyles();
}

document.addEventListener("DOMContentLoaded", async () => {
	setupFontControls();
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