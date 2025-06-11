import { userGet } from './profile/api.js';

document.addEventListener('DOMContentLoaded', async () => {
	await injectProfileTemplates();

	const userId = localStorage.getItem('userId');
	const container = document.querySelector('.profile-container');

	const { renderTemplate, fadeIn, setupProfileForm, setupPasswordForm, setupLogout } = await import('./profile/dynamic.js');

	renderTemplate('profile-skeleton', container);

	if (!userId) {
		renderTemplate('profile-not-authorized', container);
		return;
	}

	let userData;
	try {
		userData = await userGet(userId);
		if (!userData || userData.error) {
			localStorage.removeItem('userId');
			renderTemplate('profile-not-authorized', container);
			return;
		}
	} catch (err) {
		renderTemplate('profile-load-error', container);
		document.getElementById('reload-btn').onclick = () => location.reload();
		return;
	}

	renderTemplate('profile-main', container, userData);

	document.querySelectorAll('.fade-in').forEach(fadeIn);

	setupProfileForm(userData);
	setupPasswordForm(userData);
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