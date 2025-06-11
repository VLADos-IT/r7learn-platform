import { renderMarkdown } from '../../components/markdown.js';
import {
	updateProgress, userMdProgress, setCurrentMdIndex, getCurrentMdIndex,
	mdBasePath, mdFiles, setMdFiles, setMdBasePath, getCurrentIndex, courseUnits
} from './core.js';
import { updateNavButtons } from './nav.js';

export async function fetchMdFiles(mdPath) {
	const unitName = decodeURIComponent(mdPath.split('/')[2]);
	const resp = await fetch(`/api/mdfiles?unit=${encodeURIComponent(unitName)}`);
	if (!resp.ok) return [];
	const files = await resp.json();
	const base = mdPath.substring(0, mdPath.lastIndexOf('/'));
	return files.map(f => `${base}/${f}`);
}

export async function loadMdFile(mdPath, mdIndex = 0, unitId = null) {
	setMdBasePath(mdPath.substring(0, mdPath.lastIndexOf('/')));
	setMdFiles(await fetchMdFiles(mdPath));

	if (unitId && userMdProgress[unitId] !== undefined) {
		mdIndex = userMdProgress[unitId];
	}
	setCurrentMdIndex(mdIndex);

	const container = document.getElementById("markdown-content");
	if (mdFiles.length === 0) {
		container.innerHTML = `<h2>Ошибка</h2><p>Файлы урока не найдены</p>`;
		setMdFiles([]);
		setCurrentMdIndex(0);
		updateNavButtons();
		return;
	}
	const mdFileName = mdFiles[getCurrentMdIndex()].split('/').pop();
	const md = await fetch(mdFiles[getCurrentMdIndex()]).then(resp => resp.text());
	renderMarkdown(md, container, mdBasePath, mdFileName);

	updatePageIndicator(container);
	updateNavButtons();
	if (unitId) updateProgress(unitId, getCurrentMdIndex());
}

export function updatePageIndicator(container) {
	const unit = courseUnits[getCurrentIndex()];
	const existingIndicator = container.parentNode.querySelector('.page-indicator');
	if (!unit || unit.courseUnitTypeName !== "lesson") {
		if (existingIndicator) existingIndicator.remove();
		return;
	}
	const text = `Страница ${getCurrentMdIndex() + 1} из ${mdFiles.length}`;
	if (existingIndicator) {
		existingIndicator.innerHTML = text;
	} else {
		const pageIndicator = document.createElement('div');
		pageIndicator.className = 'page-indicator';
		pageIndicator.textContent = text;
		container.parentNode.insertBefore(pageIndicator, container.nextSibling);
	}
}