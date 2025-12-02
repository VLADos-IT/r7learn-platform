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
	const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

	loadComponent('/header.html', 'header-placeholder', '4rem').then(() => {
		if (isIndex) {
			const burgerBtn = document.querySelector('.toggle-icons-button');
			if (burgerBtn) burgerBtn.remove();
		}

		const btnContainer = document.getElementById('auth-profile-btn');
		if (btnContainer) {
			const userId = localStorage.getItem('userId');
			const login = localStorage.getItem('login');
			const userRole = localStorage.getItem('userRole');

			let html = '';
			if (userRole === 'admin') {
				html += `<button class="profile-button" onclick="location.href='https://admin.r7learn.xorg.su'" style="margin-right: 10px;">
					<img src="assets/icons/settings.svg" class="btn-icon" />
					admin-panel
				</button>`;
			}

			if (userId && login) {
				html += `<button class="profile-button" onclick="location.href='profile.html'">
        <img src="assets/icons/person.svg" class="btn-icon" alt="Профиль" />
        ${escapeHtml(login)}
    </button>`;
			} else if (userId) {
				html += `<button class="profile-button" onclick="location.href='profile.html'">
        <img src="assets/icons/person.svg" class="btn-icon" alt="Профиль" />
        Профиль
    </button>`;
			} else {
				html += `<button class="login-button" onclick="location.href='auth.html'">
        <img src="assets/icons/login.svg" class="btn-icon" alt="Войти" />
        Авторизация
    </button>`;
			}
			btnContainer.innerHTML = html;
		}
		const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const applyTheme = isDark => document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
		applyTheme(darkQuery.matches);
		darkQuery.addEventListener("change", e => applyTheme(e.matches));

	});
	loadComponent('/footer.html', 'footer-placeholder', '2.5rem');
});

async function setBuildVersionFooter() {
	try {
		const resp = await fetch('/build_version.json');
		if (!resp.ok) return;

		const data = await resp.json();

		const buildSpan = document.getElementById('footer-build-version');
		if (buildSpan) {
			buildSpan.textContent = `Build: ${data.version}`;
		}
	} catch (e) {
		console.error('Failed to load build version', e);
	}
}

window.addEventListener('DOMContentLoaded', setBuildVersionFooter);
