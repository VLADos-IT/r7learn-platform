import { userGet } from './profile/api.js';
import { renderTemplate } from './profile/templates.js';
import { fadeIn } from './profile/ui.js';
import { setupProfileForm, setupPasswordForm, setupLogout } from './profile/events.js';
import { escapeHtml } from '../utils/escape.js';

document.addEventListener('DOMContentLoaded', async () => {
	const userId = localStorage.getItem('userId');
	const container = document.querySelector('.profile-container');

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
			renderTemplate('profile-auth-error', container);
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
await injectProfileTemplates();

function fillProfileForm(userData) {
	const form = document.getElementById('profile-form');
	if (!form) return;
	if (form.login) form.login.value = escapeHtml(userData.login || '');
	if (form.email) form.email.value = escapeHtml(userData.email || '');
	if (form.firstName) form.firstName.value = escapeHtml(userData.firstName || '');
	if (form.lastName) form.lastName.value = escapeHtml(userData.lastName || '');
}