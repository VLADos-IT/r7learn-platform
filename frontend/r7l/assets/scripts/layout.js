import { escapeHtml } from './utils/escape.js';

async function loadComponent(url, placeholderId, skeletonHeight = '3.5rem') {
	showSkeleton(placeholderId, skeletonHeight);
	try {
		const version = window.BUILD_VERSION || 'dev';
		const cacheKey = url + ':' + version;
		const cached = sessionStorage.getItem(cacheKey);
		const cacheTime = sessionStorage.getItem(cacheKey + ':time');
		const now = Date.now();
		const el = document.getElementById(placeholderId);
		if (!el) return;
		if (cached && cacheTime && now - cacheTime < 60 * 60 * 1000) { // 1 час
			el.innerHTML = cached;
		} else {
			const response = await fetch(url + '?v=' + version);
			if (!response.ok) throw new Error(`Failed to load ${url}`);
			const html = await response.text();
			sessionStorage.setItem(cacheKey, html);
			sessionStorage.setItem(cacheKey + ':time', now);
			el.innerHTML = html;
		}
	} catch (error) {
		console.error(error);
		const el = document.getElementById(placeholderId);
		if (el) el.innerHTML = `<p style="color:#e74c3c;text-align:center;">Ошибка загрузки компонента</p>`;
	}
}

function showSkeleton(placeholderId, height = '3.5rem') {
	const el = document.getElementById(placeholderId);
	if (el) {
		el.innerHTML = `<div class="loading-skeleton" style="height:${height};width:100%"></div>`;
	}
}

function toggleMenu() {
	const sidebar = document.querySelector('.sidebar');
	if (sidebar) {
		sidebar.classList.toggle('visible');
		sidebar.classList.toggle('hidden');
	}
}

document.addEventListener("DOMContentLoaded", () => {
	loadComponent('/header.html', 'header-placeholder', '4rem').then(() => {
		const btnContainer = document.getElementById('auth-profile-btn');
		if (btnContainer) {
			const userId = localStorage.getItem('userId');
			const login = localStorage.getItem('login');
			if (userId && login) {
				btnContainer.innerHTML = `<button class="profile-button" onclick="location.href='profile.html'">${escapeHtml(login)}</button>`;
			} else if (userId) {
				btnContainer.innerHTML = `<button class="profile-button" onclick="location.href='profile.html'">Профиль</button>`;
			} else {
				btnContainer.innerHTML = `<button class="login-button" onclick="location.href='auth.html'">Авторизация</button>`;
			}
		}
	});
	loadComponent('/footer.html', 'footer-placeholder', '2.5rem');
});