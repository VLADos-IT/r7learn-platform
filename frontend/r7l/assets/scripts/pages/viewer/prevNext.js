import { renderMarkdown } from '../../components/markdown.js';
import { mdFiles, mdBasePath } from './core.js';
import {
	updateProgress, loadProgress, getCourseIdFromURL, getUserId,
	courseUnits, progressList, getCurrentIndex, setCurrentMdIndex, getCurrentMdIndex
} from './core.js';
import { buildMenu } from '../../components/menu.js';
import { loadPage, updateNavButtons } from './nav.js';
import { updatePageIndicator } from './md.js';

window.prevPage = async function () {
	if (mdFiles.length && getCurrentMdIndex() > 0) {
		setCurrentMdIndex(getCurrentMdIndex() - 1);
		const container = document.getElementById("markdown-content");
		const mdFileName = mdFiles[getCurrentMdIndex()].split('/').pop();
		const md = await fetch(mdFiles[getCurrentMdIndex()]).then(resp => resp.text());
		renderMarkdown(md, container, mdBasePath, mdFileName);
		updatePageIndicator(container);
		updateNavButtons();
		const unit = courseUnits[getCurrentIndex()];
		if (unit) {
			await updateProgress(unit.id, getCurrentMdIndex());
			await loadProgress(getCourseIdFromURL(), getUserId());
			buildMenu(courseUnits, getCurrentIndex(), progressList, (idx) => {
				loadPage(idx);
			});
		}
	} else if (getCurrentIndex() > 0) {
		loadPage(getCurrentIndex() - 1);
	}
};

window.nextPage = async function () {
	if (mdFiles.length && getCurrentMdIndex() < mdFiles.length - 1) {
		setCurrentMdIndex(getCurrentMdIndex() + 1);
		const container = document.getElementById("markdown-content");
		const mdFileName = mdFiles[getCurrentMdIndex()].split('/').pop();
		const md = await fetch(mdFiles[getCurrentMdIndex()]).then(resp => resp.text());
		renderMarkdown(md, container, mdBasePath, mdFileName);
		updatePageIndicator(container);
		updateNavButtons();
		const unit = courseUnits[getCurrentIndex()];
		if (unit) {
			await updateProgress(unit.id, getCurrentMdIndex());
			await loadProgress(getCourseIdFromURL(), getUserId());
			buildMenu(courseUnits, getCurrentIndex(), progressList, (idx) => {
				loadPage(idx);
			});
		}
	} else if (getCurrentIndex() < courseUnits.length - 1) {
		loadPage(getCurrentIndex() + 1);
	}
};