export function setupNavigation(prevCallback, nextCallback) {
	const prevBtn = document.querySelector('.nav-buttons button:nth-child(1)');
	const nextBtn = document.querySelector('.nav-buttons button:nth-child(2)');
	if (prevBtn) prevBtn.onclick = prevCallback;
	if (nextBtn) nextBtn.onclick = nextCallback;
}