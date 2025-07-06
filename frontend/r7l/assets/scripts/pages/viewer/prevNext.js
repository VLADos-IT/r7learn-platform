import { showSplashScreen, hideSplashOnImagesLoad } from '../../components/splash.js';
import { renderMarkdown } from '../../components/markdown.js';
import { mdFiles, mdBasePath } from './core.js';
import {
	updateProgress, loadProgress, getCourseIdFromURL,
	courseUnits, progressList, getCurrentIndex, setCurrentMdIndex, getCurrentMdIndex
} from './core.js';
import { loadPage } from './core.js';
import { updateNavButtons, setupNavigation } from './nav.js';
import { updatePageIndicator } from './md.js';

window.prevPage = async function () {
	if (mdFiles.length && getCurrentMdIndex() > 0) {
		showSplashScreen();
		setCurrentMdIndex(getCurrentMdIndex() - 1);
		const container = document.getElementById("markdown-content");
		const mdFileName = mdFiles[getCurrentMdIndex()].split('/').pop();
		const token = localStorage.getItem('jwt');
		const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
		const md = await fetch(mdFiles[getCurrentMdIndex()], { headers, credentials: 'include' }).then(resp => resp.text());
		renderMarkdown(md, container, mdBasePath, mdFileName);
		updatePageIndicator(container);
		updateNavButtons();
		const unit = courseUnits[getCurrentIndex()];
		await updateProgress(unit.id, getCurrentMdIndex());
		await loadProgress(getCourseIdFromURL());
		const { buildicons } = await import('../../components/menu.js');
		buildicons(courseUnits, getCurrentIndex(), progressList, (idx) => {
			showSplashScreen();
			loadPage(idx).then(() => {
				hideSplashOnImagesLoad();
				setupNavigation(window.prevPage, window.nextPage);
			});
		});
		hideSplashOnImagesLoad();
		setupNavigation(window.prevPage, window.nextPage);
	} else if (getCurrentIndex() > 0) {
		showSplashScreen();
		await loadPage(getCurrentIndex() - 1);
		hideSplashOnImagesLoad();
		setupNavigation(window.prevPage, window.nextPage);
	}
};

window.nextPage = async function () {
	if (mdFiles.length && getCurrentMdIndex() < mdFiles.length - 1) {
		showSplashScreen();
		setCurrentMdIndex(getCurrentMdIndex() + 1);
		const container = document.getElementById("markdown-content");
		const mdFileName = mdFiles[getCurrentMdIndex()].split('/').pop();
		const token = localStorage.getItem('jwt');
		const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
		const md = await fetch(mdFiles[getCurrentMdIndex()], { headers, credentials: 'include' }).then(resp => resp.text());
		renderMarkdown(md, container, mdBasePath, mdFileName);
		updatePageIndicator(container);
		updateNavButtons();
		const unit = courseUnits[getCurrentIndex()];
		await updateProgress(unit.id, getCurrentMdIndex());
		await loadProgress(getCourseIdFromURL());
		const { buildicons } = await import('../../components/menu.js');
		buildicons(courseUnits, getCurrentIndex(), progressList, (idx) => {
			showSplashScreen();
			loadPage(idx).then(() => {
				hideSplashOnImagesLoad();
				setupNavigation(window.prevPage, window.nextPage);
			});
		});
		hideSplashOnImagesLoad();
		setupNavigation(window.prevPage, window.nextPage);
	} else if (getCurrentIndex() < courseUnits.length - 1) {
		showSplashScreen();
		await loadPage(getCurrentIndex() + 1);
		hideSplashOnImagesLoad();
		setupNavigation(window.prevPage, window.nextPage);
	}
};
setupNavigation(window.prevPage, window.nextPage);