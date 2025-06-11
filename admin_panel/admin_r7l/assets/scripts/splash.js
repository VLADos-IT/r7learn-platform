export function hideSplashOnImagesLoad() {
	window.addEventListener('load', () => {
		const imgs = document.querySelectorAll('img');
		let loaded = 0;
		if (imgs.length === 0) {
			document.getElementById('splash-screen')?.classList.add('hide');
			return;
		}
		imgs.forEach(img => {
			if (img.complete) loaded++;
			else img.addEventListener('load', () => {
				loaded++;
				if (loaded === imgs.length) {
					setTimeout(() => {
						document.getElementById('splash-screen')?.classList.add('hide');
					}, 200);
				}
			});
		});
		if (loaded === imgs.length) {
			setTimeout(() => {
				document.getElementById('splash-screen')?.classList.add('hide');
			}, 200);
		}
	});
}