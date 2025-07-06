import { hideSplashScreen } from './splash.js';

function getCookie(name) {
	const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

let adminAccessChecked = false;

export function checkAdminAccess() {
	if (adminAccessChecked) return;
	adminAccessChecked = true;
	const token = getCookie('jwt');
	let userRole = getCookie('userRole');
	if (userRole) userRole = userRole.trim().toLowerCase();
	if (!token || token === 'undefined' || token === 'null' || token.trim() === '' || userRole !== 'admin') {
		document.body.innerHTML = '';
		document.body.style.display = 'block';
		const err = document.createElement('div');
		err.id = 'admin-auth-error';
		err.className = 'admin-auth-error';
		let reason = '';
		if (!token || token === 'undefined' || token === 'null' || token.trim() === '') {
			reason = '<p>Токен авторизации не найден или истёк.<br>Пожалуйста, войдите заново.</p>';
		} else if (userRole !== 'admin') {
			reason = `<p>У вас нет прав администратора (userRole: ${userRole}).<br>Пожалуйста, войдите как администратор.</p>`;
		}
		err.innerHTML = `
            <h2>Доступ запрещён</h2>
            ${reason}
            <p><a href="https://r7learn.xorg.su/auth.html">Войти</a></p>
        `;
		document.body.appendChild(err);
		hideSplashScreen();
		console.error('[auth-guard] Access denied:', { token, userRole });
		throw new Error('Access denied');
	}
	document.body.style.display = 'block';
	hideSplashScreen();
}