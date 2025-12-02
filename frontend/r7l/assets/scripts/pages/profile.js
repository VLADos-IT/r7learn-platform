import { userGet } from './profile/api.js';
import { injectSplashScreen, showSplashScreen, hideSplashOnImagesLoad } from '../components/splash.js';
import { renderTemplate } from './profile/dynamic.js';
import { setupLogout } from './profile/events.js';

injectSplashScreen();
showSplashScreen();

document.addEventListener('DOMContentLoaded', async () => {
	await injectProfileTemplates();

	const userId = localStorage.getItem('userId');
	const container = document.querySelector('.profile-container');

	const { fadeIn, setupProfileForm, setupPasswordForm } = await import('./profile/dynamic.js');

	renderTemplate('profile-skeleton', container);

	const token = localStorage.getItem('jwt');
	if (!token) {
		renderTemplate('profile-not-authorized', container);
		hideSplashOnImagesLoad();
		return;
	}
	let userData = await userGet();
	if (!userData || userData.error) {
		renderTemplate('profile-not-authorized', container);
		hideSplashOnImagesLoad();
		return;
	}

	renderTemplate('profile-main', container, userData);

	setupProfileForm(userData);
	setupPasswordForm(userData);

	document.querySelectorAll('.fade-in').forEach(fadeIn);
	hideSplashOnImagesLoad();
	setupLogout();
});

import { loadTemplate } from '../utils/template.js';

async function injectProfileTemplates() {
	const existing = document.getElementById('profile-main');
	if (existing) return;
	const html = await loadTemplate('assets/pages/profile.templates.html');
	const temp = document.createElement('div');
	temp.innerHTML = html;
	document.body.appendChild(temp);
}
