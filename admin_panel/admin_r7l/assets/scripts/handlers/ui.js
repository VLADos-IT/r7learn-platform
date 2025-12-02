export function initUIHandlers() {
	// Tabs
	document.querySelectorAll('.tab-btn').forEach(btn => {
		btn.addEventListener('click', () => {
			document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
			document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

			btn.classList.add('active');
			document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
		});
	});

	// Add Course Modal
	const modal = document.getElementById('modal-add-course');
	const btn = document.getElementById('btn-add-course');
	const close = document.querySelector('.close-modal');

	if (btn) {
		btn.addEventListener('click', () => {
			modal.classList.remove('hidden');
		});
	}

	if (close) {
		close.addEventListener('click', () => {
			modal.classList.add('hidden');
		});
	}

	window.addEventListener('click', (e) => {
		if (e.target === modal) {
			modal.classList.add('hidden');
		}
	});
}
