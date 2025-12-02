let splashTimeout = null;

export function injectSplashScreen() {
  if (document.getElementById('splash-screen')) return;

  const splash = document.createElement('div');
  splash.id = 'splash-screen';
  splash.className = 'splash-screen splash-visible';
  splash.innerHTML = `
    <span class="splash-spinner">
      <svg width="54" height="54" viewBox="0 0 50 50" aria-label="Загрузка">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#fff"
          stroke-width="5"
          stroke-linecap="round"
          stroke-dasharray="90"
          stroke-dashoffset="0"
          class="spinner-circle"
        />
      </svg>
    </span>
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
  if (imgs.length === 0) {
    hideSplashScreen();
    return;
  }

  const minToLoad = Math.min(3, Math.ceil(imgs.length * 0.3), imgs.length);
  let loaded = 0;
  let finished = false;

  const checkLoaded = () => {
    if (finished) return;
    loaded++;
    if (loaded >= minToLoad) {
      finished = true;
      hideSplashScreen();
    }
  };

  imgs.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      checkLoaded();
    } else {
      img.addEventListener('load', checkLoaded, { once: true });
      img.addEventListener('error', checkLoaded, { once: true });
    }
  });

  setTimeout(() => {
    if (!finished) hideSplashScreen();
  }, 2500);
}
