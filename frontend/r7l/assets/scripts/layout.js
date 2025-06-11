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
		if (cached && cacheTime && now - cacheTime < 60 * 60 * 1000) {
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

function toggleicons(forceClose = false) {
	const sidebar = document.querySelector('.sidebar');
	const backdrop = document.querySelector('.sidebar-backdrop');
	if (sidebar) {
		const isVisible = sidebar.classList.contains('visible');
		if (forceClose || isVisible) {
			sidebar.classList.remove('visible');
			if (backdrop) backdrop.style.display = 'none';
		} else {
			sidebar.classList.add('visible');
			if (backdrop) backdrop.style.display = 'block';
		}
	}
}
window.toggleicons = toggleicons;

document.addEventListener('DOMContentLoaded', () => {
	const sidebar = document.querySelector('.sidebar');
	const backdrop = document.querySelector('.sidebar-backdrop');
	if (backdrop) {
		backdrop.addEventListener('click', () => toggleicons(true));
	}
	if (sidebar) {
		sidebar.addEventListener('click', (e) => {
			if (e.target.classList.contains('icons-section')) {
				toggleicons(true);
			}
		});
	}
});

document.addEventListener("DOMContentLoaded", () => {
	loadComponent('/header.html', 'header-placeholder', '4rem').then(() => {
		const btnContainer = document.getElementById('auth-profile-btn');
		if (btnContainer) {
			const userId = localStorage.getItem('userId');
			const login = localStorage.getItem('login');
			if (userId && login) {
				btnContainer.innerHTML = `<button class="profile-button" onclick="location.href='profile.html'">
        <img src="assets/icons/person.svg" class="btn-icon" alt="Профиль" />
        ${escapeHtml(login)}
    </button>`;
			} else if (userId) {
				btnContainer.innerHTML = `<button class="profile-button" onclick="location.href='profile.html'">
        <img src="assets/icons/person.svg" class="btn-icon" alt="Профиль" />
        Профиль
    </button>`;
			} else {
				btnContainer.innerHTML = `<button class="login-button" onclick="location.href='auth.html'">
        <img src="assets/icons/login.svg" class="btn-icon" alt="Войти" />
        Авторизация
    </button>`;
			}
		}
	});
	loadComponent('/footer.html', 'footer-placeholder', '2.5rem');
});

async function setBuildVersionFooter() {
	try {
		const resp = await fetch('build_version.txt');
		if (!resp.ok) return;
		const version = await resp.text();
		const buildSpan = document.getElementById('footer-build-version');
		if (buildSpan) {
			buildSpan.textContent = `Build: ${version.trim()}`;
		}
	} catch (e) {
		// ignore
	}
}

window.addEventListener('DOMContentLoaded', setBuildVersionFooter);