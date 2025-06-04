import { fetchCourses, fetchUnits } from './api.js';

export async function renderCourses() {
	const courses = await fetchCourses();
	const list = document.getElementById('courses-list');
	list.innerHTML = '';
	courses.forEach(c => {
		const li = document.createElement('li');
		li.textContent = `${c.name} (${c.systemName})`;
		list.appendChild(li);
	});

	const select = document.getElementById('course-select');
	select.innerHTML = '';
	courses.forEach(c => {
		const opt = document.createElement('option');
		opt.value = c.id;
		opt.textContent = c.name;
		select.appendChild(opt);
	});

	if (courses.length > 0) {
		select.value = courses[0].id;
		await renderUnits(select.value);
	} else {
		document.getElementById('units-list').innerHTML = '<li>Нет курсов</li>';
	}
}

export async function renderUnits(courseId) {
	if (!courseId) {
		document.getElementById('units-list').innerHTML = '<li>Курс не выбран</li>';
		return;
	}
	const units = await fetchUnits(courseId);
	const list = document.getElementById('units-list');
	list.innerHTML = '';
	units.forEach(u => {
		const li = document.createElement('li');
		li.textContent = `${u.name} (${u.courseUnitTypeName})`;
		list.appendChild(li);
	});
}

export async function fillTestCourseSelect() {
	const courses = await fetchCourses();
	const select = document.getElementById('test-course-select');
	select.innerHTML = '';
	courses.forEach(c => {
		const opt = document.createElement('option');
		opt.value = c.id;
		opt.textContent = c.name;
		select.appendChild(opt);
	});
}

export async function fillExerciseCourseSelect() {
	const courses = await fetchCourses();
	const select = document.getElementById('exercise-course-select');
	select.innerHTML = '';
	courses.forEach(c => {
		const opt = document.createElement('option');
		opt.value = c.id;
		opt.textContent = c.name;
		select.appendChild(opt);
	});
}