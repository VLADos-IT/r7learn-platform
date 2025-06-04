export function showAlert(message, type = 'error') {
	let alertBox = document.getElementById('custom-alert');
	if (!alertBox) {
		alertBox = document.createElement('div');
		alertBox.id = 'custom-alert';
		alertBox.style.position = 'fixed';
		alertBox.style.top = '2rem';
		alertBox.style.left = '50%';
		alertBox.style.transform = 'translateX(-50%)';
		alertBox.style.zIndex = '9999';
		alertBox.style.minWidth = '220px';
		alertBox.style.maxWidth = '90vw';
		alertBox.style.padding = '1rem 2rem';
		alertBox.style.borderRadius = '0.5rem';
		alertBox.style.boxShadow = '0 2px 16px rgba(0,0,0,0.12)';
		alertBox.style.fontSize = '1rem';
		alertBox.style.textAlign = 'center';
		alertBox.style.transition = 'opacity 0.3s';
		alertBox.style.opacity = '0';
		document.body.appendChild(alertBox);
	}
	alertBox.textContent = message;
	alertBox.style.background = type === 'success' ? '#4caf50' : '#e74c3c';
	alertBox.style.color = '#fff';
	alertBox.style.opacity = '1';
	setTimeout(() => {
		alertBox.style.opacity = '0';
	}, 2500);
}