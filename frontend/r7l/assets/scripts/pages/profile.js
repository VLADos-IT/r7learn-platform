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

	if (!userId) {
		renderTemplate('profile-not-authorized', container);
		hideSplashOnImagesLoad();
		return;
	}

	let userData;
	try {
		userData = await userGet(userId);
		if (!userData || userData.error) {
			localStorage.removeItem('userId');
			renderTemplate('profile-not-authorized', container);
			hideSplashOnImagesLoad();
			return;
		}
	} catch (err) {
		renderTemplate('profile-load-error', container);
		document.getElementById('reload-btn').onclick = () => location.reload();
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

async function injectProfileTemplates() {
	const existing = document.getElementById('profile-main');
	if (existing) return;
	const res = await fetch('assets/pages/profile.templates.html');
	const html = await res.text();
	const temp = document.createElement('div');
	temp.innerHTML = html;
	document.body.appendChild(temp);
}