import { userAuth, userCreate, userCheckUnique } from '../api/user.js';
import { showAlert } from '../components/alert.js';

function fadeIn(el) {
	el.classList.add('fade-in');
	setTimeout(() => el.classList.add('visible'), 10);
}

document.addEventListener('DOMContentLoaded', async () => {
	const loginForm = document.getElementById('login-form');
	const registerForm = document.getElementById('register-form');
	const loginContainer = loginForm?.closest('.auth-container');
	const registerContainer = registerForm?.closest('.auth-container');

	if (loginContainer) fadeIn(loginContainer);
	if (registerContainer) fadeIn(registerContainer);

	if (loginForm) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const btn = loginForm.querySelector('button[type="submit"]');
			btn && (btn.disabled = true);
			const payload = {
				login: loginForm.login.value,
				password: loginForm.password.value,
			};
			try {
				const user = await userAuth(payload);
				if (user && user.id) {
					localStorage.setItem('userId', user.id);
					localStorage.setItem('login', user.login);
					localStorage.setItem('userRole', user.positionName);
					showAlert('Вход выполнен!', 'success');
					if (user.positionName === 'admin') {
						setTimeout(() => window.location.href = 'https://admin.r7learn.xorg.su', 800);
					} else {
						setTimeout(() => window.location.href = 'profile.html', 800);
					}
				} else {
					showAlert('Неверный логин или пароль');
					loginForm.password.focus();
				}
			} catch (err) {
				showAlert('Ошибка авторизации');
			} finally {
				btn && (btn.disabled = false);
			}
		});
		loginForm.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				const active = document.activeElement;
				if (active && active.tagName === 'INPUT') {
					e.preventDefault();
					loginForm.querySelector('button[type="submit"]').focus();
				}
			}
		});
	}

	if (registerForm) {
		registerForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			const btn = registerForm.querySelector('button[type="submit"]');
			btn && (btn.disabled = true);
			const payload = {
				login: registerForm.login.value,
				password: registerForm.password.value,
				email: registerForm.email.value,
				firstName: registerForm['first-name'].value,
				lastName: registerForm['last-name'].value
			};
			if (payload.password.length < 6) {
				showAlert('Пароль должен быть не менее 6 символов');
				registerForm.password.focus();
				btn && (btn.disabled = false);
				return;
			}
			try {
				const unique = await userCheckUnique({ login: payload.login, email: payload.email });
				if (!unique.loginIsUnique) {
					showAlert('Такой логин уже занят, попробуйте другой.');
					registerForm.login.focus();
					btn && (btn.disabled = false);
					return;
				}
				if (!unique.emailIsUnique) {
					showAlert('Этот email уже используется другим пользователем.');
					registerForm.email.focus();
					btn && (btn.disabled = false);
					return;
				}
				const data = await userCreate(payload);
				if (data && data.id) {
					showAlert('Регистрация успешна!', 'success');
					localStorage.setItem('userId', data.id);
					localStorage.setItem('login', data.login);
					localStorage.setItem('userRole', data.positionName); // Сохраняем роль
					if (data.positionName === 'admin') {
						setTimeout(() => window.location.href = 'https://admin.r7learn.xorg.su', 800);
					} else {
						setTimeout(() => window.location.href = 'profile.html', 800);
					}
				} else {
					showAlert('Ошибка регистрации. Попробуйте позже.');
				}
			} catch (err) {
				showAlert('Ошибка регистрации. Попробуйте позже.');
			} finally {
				btn && (btn.disabled = false);
			}
		});
		registerForm.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				const active = document.activeElement;
				if (active && active.tagName === 'INPUT') {
					e.preventDefault();
					registerForm.querySelector('button[type="submit"]').focus();
				}
			}
		});
	}

	const showRegister = document.getElementById('show-register');
	const showLogin = document.getElementById('show-login');
	if (showRegister && registerContainer && loginContainer) {
		showRegister.addEventListener('click', (e) => {
			e.preventDefault();
			loginContainer.classList.add('hidden');
			registerContainer.classList.remove('hidden');
			fadeIn(registerContainer);
			registerForm.login.focus();
		});
	}
	if (showLogin && registerContainer && loginContainer) {
		showLogin.addEventListener('click', (e) => {
			e.preventDefault();
			registerContainer.classList.add('hidden');
			loginContainer.classList.remove('hidden');
			fadeIn(loginContainer);
			loginForm.login.focus();
		});
	}
});