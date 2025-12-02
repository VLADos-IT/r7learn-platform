export function setupLightbox(container) {
	if (!container) return;

	let overlay = document.getElementById('lightbox-overlay');
	if (!overlay) {
		overlay = document.createElement('div');
		overlay.id = 'lightbox-overlay';
		overlay.className = 'lightbox-overlay';
		overlay.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-image" src="" alt="Zoomed Image">
        `;
		document.body.appendChild(overlay);

		const closeBtn = overlay.querySelector('.lightbox-close');
		const img = overlay.querySelector('.lightbox-image');

		const closeLightbox = () => {
			overlay.classList.remove('active');
			setTimeout(() => {
				img.src = '';
			}, 300);
		};

		overlay.addEventListener('click', (e) => {
			if (e.target !== img) {
				closeLightbox();
			}
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && overlay.classList.contains('active')) {
				closeLightbox();
			}
		});
	}

	const imgEl = overlay.querySelector('.lightbox-image');
	const images = container.querySelectorAll('img');

	images.forEach(img => {
		if (img.classList.contains('lightbox-trigger')) return;

		img.classList.add('lightbox-trigger');
		img.style.cursor = 'zoom-in';

		img.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			imgEl.src = img.src;
			imgEl.alt = img.alt;
			overlay.classList.add('active');
		});
	});
}
