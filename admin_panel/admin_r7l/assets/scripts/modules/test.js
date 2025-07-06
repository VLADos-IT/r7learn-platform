function getCookie(name) {
	const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

export async function uploadTestTxt(formData, courseId, orderInCourse) {
	const file = formData.get('testTxt');
	const name = file && file.name ? file.name.replace(/\.[^.]+$/, '') : 'test';
	const uploadForm = new FormData();
	uploadForm.append('file', file);
	uploadForm.append('subdir', 'Tests');
	uploadForm.append('courseId', courseId);
	uploadForm.append('orderInCourse', orderInCourse);
	uploadForm.append('name', name);
	let headers = {};
	const token = getCookie('jwt');
	if (token) headers['Authorization'] = `Bearer ${token}`;
	const res = await fetch('/api/resource/upload', {
		method: 'POST',
		body: uploadForm,
		headers,
		credentials: 'include'
	});
	if (!res.ok) throw new Error('Ошибка загрузки файла: ' + (await res.text()));
	return await res.json();
}