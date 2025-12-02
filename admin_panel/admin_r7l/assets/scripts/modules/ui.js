import { fetchCourses, fetchUnits } from './api.js';

let currentCourseId = null;

export async function renderCourses() {
	const courses = await fetchCourses();
	const select = document.getElementById('global-course-select');
	select.innerHTML = '';

	courses.forEach(c => {
		const opt = document.createElement('option');
		opt.value = c.id;
		opt.textContent = c.name;
		select.appendChild(opt);
	});

	// Add event listener if not already added (or just overwrite onclick/onchange)
	select.onchange = () => onGlobalCourseChange(select.value, courses);

	if (courses.length > 0) {
		// Restore selection if possible
		if (currentCourseId && courses.find(c => c.id == currentCourseId)) {
			select.value = currentCourseId;
		} else {
			select.value = courses[0].id;
		}
		onGlobalCourseChange(select.value, courses);
	} else {
		document.getElementById('current-course-name').textContent = 'Нет курсов';
	}
}

export async function onGlobalCourseChange(courseId, courses) {
	currentCourseId = courseId;
	const course = courses.find(c => c.id == courseId);
	if (course) {
		document.getElementById('current-course-name').textContent = course.name;
	}

	// Update all hidden inputs
	document.querySelectorAll('.course-id-input').forEach(input => {
		input.value = courseId;
	});

	await renderUnits(courseId);
}

export async function renderUnits(courseId) {
	if (!courseId) return;
	const units = await fetchUnits(courseId);
	const list = document.getElementById('units-list');
	list.innerHTML = '';

	if (units.length === 0) {
		list.innerHTML = '<li>В этом курсе пока нет тем.</li>';
		return;
	}

	// Sort by order
	units.sort((a, b) => a.orderInCourse - b.orderInCourse);

	units.forEach(u => {
		const li = document.createElement('li');
		li.textContent = `${u.orderInCourse}. ${u.name} (${u.courseUnitTypeName})`;
		list.appendChild(li);
	});
}

export async function fillTestCourseSelect() { }
export async function fillExerciseCourseSelect() { }