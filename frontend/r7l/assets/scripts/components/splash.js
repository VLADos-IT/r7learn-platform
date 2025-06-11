export function hideSplashOnImagesLoad() {
	const splash = document.getElementById('splash-screen');
	if (!splash) return;
	const imgs = document.querySelectorAll('img');
	let loaded = 0;
	if (imgs.length === 0) {
		splash.classList.add('hide');
		return;
	}
	imgs.forEach(img => {
		if (img.complete) loaded++;
		else img.addEventListener('load', () => {
			loaded++;
			if (loaded === imgs.length) {
				setTimeout(() => splash.classList.add('hide'), 200);
			}
		});
	});
	if (loaded === imgs.length) {
		setTimeout(() => splash.classList.add('hide'), 200);
	}
}