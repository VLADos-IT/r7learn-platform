let splashTimeout = null;

export function injectSplashScreen() {
	if (document.getElementById('splash-screen')) return;
	const splash = document.createElement('div');
	splash.id = 'splash-screen';
	splash.className = 'splash-screen splash-visible';
	splash.innerHTML = `
        <div class="splash-spinner-wrap">
            <span class="splash-spinner">
                <svg width="54" height="54" viewBox="0 0 50 50" aria-label="Загрузка">
                    <defs>
                        <linearGradient id="splash-spinner-gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stop-color="#0078d7"/>
                            <stop offset="100%" stop-color="#4caf50"/>
                        </linearGradient>
                    </defs>
                    <circle
                        cx="25" cy="25" r="20"
                        fill="none"
                        stroke="url(#splash-spinner-gradient)"
                        stroke-width="5"
                        stroke-linecap="round"
                        stroke-dasharray="31.415, 31.415"
                    >
                        <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite"/>
                    </circle>
                </svg>
            </span>
        </div>
    `;
	document.body.appendChild(splash);
}

export function showSplashScreen() {
	const splash = document.getElementById('splash-screen');
	if (!splash) return;
	splash.classList.add('splash-visible');
	splash.classList.remove('splash-hide');
	document.body.style.overflow = 'hidden';
}

export function hideSplashScreen() {
	const splash = document.getElementById('splash-screen');
	if (!splash) return;
	if (splashTimeout) clearTimeout(splashTimeout);
	splash.classList.remove('splash-visible');
	splash.classList.add('splash-hide');
	splashTimeout = setTimeout(() => {
		splash.classList.remove('splash-hide');
		document.body.style.overflow = '';
	}, 350);
}

export function hideSplashOnImagesLoad() {
	const splash = document.getElementById('splash-screen');
	if (!splash) return;
	const imgs = Array.from(document.images).filter(img => img.offsetParent !== null);
	let loaded = 0;
	if (imgs.length === 0) {
		hideSplashScreen();
		return;
	}
	const checkLoaded = () => {
		loaded++;
		if (loaded === imgs.length) hideSplashScreen();
	};
	imgs.forEach(img => {
		if (img.complete && img.naturalHeight !== 0) {
			checkLoaded();
		} else {
			img.addEventListener('load', checkLoaded, { once: true });
			img.addEventListener('error', checkLoaded, { once: true });
		}
	});
}