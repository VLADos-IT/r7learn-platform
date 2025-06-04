import { showAlert } from '../../components/alert.js';

export function fadeIn(el) {
	el.classList.add('fade-in');
	setTimeout(() => el.classList.add('visible'), 10);
}

export { showAlert };