export function renderTemplate(id, container, data = {}) {
	const tpl = document.getElementById(id);
	if (!tpl) return;
	const clone = tpl.content.cloneNode(true);
	if (id === 'profile-main' && data) {
		clone.querySelector('input[name="login"]').value = data.login || '';
		clone.querySelector('input[name="email"]').value = data.email || '';
		clone.querySelector('input[name="firstName"]').value = data.firstName || '';
		clone.querySelector('input[name="lastName"]').value = data.lastName || '';
	}
	container.innerHTML = '';
	container.appendChild(clone);
}