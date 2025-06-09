async function loadComponent(url, placeholderId) {
	try {
		const cached = sessionStorage.getItem(url);
		if (cached) {
			document.getElementById(placeholderId).innerHTML = cached;
		} else {
			const response = await fetch(url);
			if (!response.ok) throw new Error(`Failed to load ${url}`);
			const html = await response.text();
			sessionStorage.setItem(url, html);
			document.getElementById(placeholderId).innerHTML = html;
		}
	} catch (error) {
		console.error(error);
		document.getElementById(placeholderId).innerHTML = `<p>Error loading component.</p>`;
	}
}

function toggleicons() {
	const sidebar = document.querySelector('.sidebar');
	sidebar.classList.toggle('visible');
	sidebar.classList.toggle('hidden');
}

document.addEventListener("DOMContentLoaded", () => {
	loadComponent('/header.html', 'header-placeholder').then(() => {
	});
	loadComponent('/footer.html', 'footer-placeholder');
});