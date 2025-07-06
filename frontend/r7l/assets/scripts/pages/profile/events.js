import { userUpdate, userChangePassword, userCheckUnique } from './api.js';
import { showAlert } from './ui.js';

export function setupProfileForm(userData) {
	const form = document.getElementById('profile-form');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const btn = form.querySelector('button[type="submit"]');
		btn.querySelector('.btn-text').style.display = 'none';
		btn.querySelector('.btn-spinner').style.display = '';

		let needCheck = false;
		if (form.login.value !== userData.login || form.email.value !== userData.email) {
			needCheck = true;
		}
		if (needCheck) {
			try {
				const unique = await userCheckUnique({ login: form.login.value, email: form.email.value });
				if (!unique.loginIsUnique && form.login.value !== userData.login) {
					showAlert('Такой логин уже занят, попробуйте другой.');
					btn.querySelector('.btn-text').style.display = '';
					btn.querySelector('.btn-spinner').style.display = 'none';
					form.login.focus();
					return;
				}
				if (!unique.emailIsUnique && form.email.value !== userData.email) {
					showAlert('Этот email уже используется другим пользователем.');
					btn.querySelector('.btn-text').style.display = '';
					btn.querySelector('.btn-spinner').style.display = 'none';
					form.email.focus();
					return;
				}
			} catch (err) {
				showAlert('Ошибка проверки уникальности. Попробуйте позже.');
				btn.querySelector('.btn-text').style.display = '';
				btn.querySelector('.btn-spinner').style.display = 'none';
				return;
			}
		}

		const payload = {
			login: form.login.value,
			email: form.email.value,
			firstName: form.firstName.value,
			lastName: form.lastName.value,
		};
		try {
			await userUpdate(payload);
			showAlert('Данные успешно обновлены!', 'success');
			setTimeout(() => location.reload(), 1000);
		} catch (err) {
			showAlert('Ошибка при обновлении профиля: ' + (err.message || 'Попробуйте позже'));
		} finally {
			btn.querySelector('.btn-text').style.display = '';
			btn.querySelector('.btn-spinner').style.display = 'none';
		}
	});
}

export function setupPasswordForm(userData) {
	const form = document.getElementById('password-form');
	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const btn = form.querySelector('button[type="submit"]');
		btn.querySelector('.btn-text').style.display = 'none';
		btn.querySelector('.btn-spinner').style.display = '';

		const oldPassword = form.oldPassword.value;
		const newPassword = form.newPassword.value;

		if (newPassword.length < 6) {
			showAlert('Новый пароль должен быть не менее 6 символов.');
			btn.querySelector('.btn-text').style.display = '';
			btn.querySelector('.btn-spinner').style.display = 'none';
			form.newPassword.focus();
			return;
		}

		if (oldPassword === newPassword) {
			showAlert('Новый пароль не должен совпадать со старым.');
			btn.querySelector('.btn-text').style.display = '';
			btn.querySelector('.btn-spinner').style.display = 'none';
			form.newPassword.focus();
			return;
		}

		const payload = {
			oldPassword: form.oldPassword.value,
			newPassword: form.newPassword.value
		};
		try {
			await userChangePassword({ oldPassword, newPassword });
			showAlert('Пароль успешно изменён!', 'success');
			form.reset();
		} catch (err) {
			if (err && err.message && err.message.includes('old password')) {
				showAlert('Старый пароль неверный.');
				form.oldPassword.focus();
			} else {
				showAlert('Ошибка смены пароля: ' + (err.message || 'Попробуйте позже'));
			}
		} finally {
			btn.querySelector('.btn-text').style.display = '';
			btn.querySelector('.btn-spinner').style.display = 'none';
		}
	});
}

export function setupLogout() {
	const btn = document.getElementById('logout-btn');
	if (btn) {
		btn.addEventListener('click', () => {
			localStorage.removeItem('jwt');
			localStorage.removeItem('login');
			localStorage.removeItem('userId');
			localStorage.removeItem('userRole');
			window.location.href = 'auth.html';
		});
	}
}