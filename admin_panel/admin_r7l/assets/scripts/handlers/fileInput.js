export function initFileInputHandlers() {
	document.getElementById('docx-file').addEventListener('change', function () {
		const label = document.getElementById('file-name-label');
		label.textContent = this.files.length ? this.files[0].name : 'Файл не выбран';
	});

	document.getElementById('test-txt-file').addEventListener('change', function () {
		const label = document.getElementById('test-file-name-label');
		label.textContent = this.files.length ? this.files[0].name : 'Файл не выбран';
	});

	document.getElementById('exercise-docx-file').addEventListener('change', function () {
		const label = document.getElementById('exercise-file-name-label');
		label.textContent = this.files.length ? this.files[0].name : 'Файл не выбран';
	});

	document.getElementById('exercise-desc-docx-file').addEventListener('change', function () {
		const label = document.getElementById('exercise-desc-file-name-label');
		label.textContent = this.files.length ? this.files[0].name : 'Файл не выбран';
	});
}