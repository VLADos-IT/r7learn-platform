const templateCache = {};

export async function loadTemplate(path) {
	if (templateCache[path]) return templateCache[path];
	const res = await fetch(path);
	if (!res.ok) throw new Error(`Failed to load template: ${path}`);
	const text = await res.text();
	templateCache[path] = text;
	return text;
}

export function renderTemplate(html, data = {}) {
	for (const key in data) {
		html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
	}
	const temp = document.createElement('div');
	temp.innerHTML = html.trim();
	return temp.firstElementChild || document.createTextNode(html);
}
