export function buildicons(courseUnits, currentIndex, progressList, onSelect) {
	const icons = document.getElementById("icons");
	if (!icons) return;
	icons.innerHTML = "";
	if (!courseUnits || courseUnits.length === 0) {
		icons.innerHTML = "<li>Нет тем</li>";
		return;
	}
	courseUnits.forEach((unit, idx) => {
		const li = document.createElement("li");
		li.className = "icons-section" + (idx === currentIndex ? " active" : "");
		const title = document.createElement("span");
		title.className = "icons-section-title";
		if (unit.courseUnitTypeName === 'test') {
			title.innerHTML = `<img src="assets/icons/test.svg" class="icons-icon" alt="Тест" title="Тест"> ` +
				unit.name.replace(/^Тест[_\s]+/i, 'Тест ');
		} else if (unit.courseUnitTypeName === 'exercise') {
			title.innerHTML = `<img src="assets/icons/exercise.svg" class="icons-icon" alt="Задание" title="Задание"> ` +
				unit.name.replace(/^Задание[_\s]+/i, 'Задание ');
		} else {
			title.textContent = unit.name.replace(/_/g, ' ');
		}
		li.appendChild(title);
		const progressObj = progressList.find(p => p.courseUnitId === unit.id);
		const progress = progressObj && unit.maxDegree
			? Math.round((progressObj.degree / unit.maxDegree) * 100)
			: 0;
		const progressWrapper = document.createElement("div");
		progressWrapper.className = "progress-wrapper";
		const progressBar = document.createElement("div");
		progressBar.className = "progress-bar";
		progressBar.style.width = `${progress}%`;
		progressWrapper.appendChild(progressBar);
		li.appendChild(progressWrapper);

		li.onclick = () => onSelect(idx);
		icons.appendChild(li);
	});
}