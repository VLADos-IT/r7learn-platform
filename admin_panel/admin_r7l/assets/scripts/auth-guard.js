import { hideSplashScreen } from './splash.js';

export function checkAdminAccess() {
	if (localStorage.getItem('userRole') !== 'admin') {
		document.body.innerHTML = '';
		document.body.style.display = 'block';
		const err = document.createElement('div');
		err.id = 'admin-auth-error';
		err.className = 'admin-auth-error';
		err.innerHTML = `
            <h2>Доступ запрещён</h2>
            <p>У вас нет прав доступа к админ-панели.<br>
            Пожалуйста, <a href="https://r7learn.xorg.su/auth.html">войдите как администратор</a>.</p>
        `;
		document.body.appendChild(err);
		hideSplashScreen();
		throw new Error('Access denied');
	}
	// Если админ — показываем страницу
	document.body.style.display = 'block';
	hideSplashScreen();
}