export function renderMarkdown(md, container, mdBasePath = '', mdFileName = '') {
	const renderer = new window.marked.Renderer();

	renderer.image = function (href, title, text) {
		if (typeof href === 'object' && href !== null) {
			const token = href;
			title = token.title;
			text = token.text;
			href = token.href;
		}
		if (typeof href !== 'string') return '';

		let unitName = '';
		if (mdBasePath) {
			const match = mdBasePath.match(/\/resources\/([^/]+)\/mds/);
			if (match) unitName = match[1];
		}
		let imgSubfolder = '';
		if (mdFileName) {
			imgSubfolder = mdFileName.replace(/\.md$/, '');
		}
		if (href.startsWith('../imgs/') && unitName && imgSubfolder) {
			const imageName = href.split('/').pop();
			href = `/resources/${unitName}/imgs/${imgSubfolder}/${imageName}`;
		}
		let out = `<img src="${href}" alt="${text || ''}"`;
		if (title) out += ` title="${title}"`;
		out += '>';
		return out;
	};

	container.classList.add('markdown');
	container.innerHTML = window.marked.parse(md, { renderer });
}