import { uploadResource } from './resource.js';

export async function uploadTestTxt(formData, courseId, orderInCourse) {
	const file = formData.get('testTxt');
	const name = file && file.name ? file.name.replace(/\.[^.]+$/, '') : 'test';
	const uploadForm = new FormData();
	uploadForm.append('file', file);
	uploadForm.append('subdir', 'Tests');
	uploadForm.append('courseId', courseId);
	uploadForm.append('orderInCourse', orderInCourse);
	uploadForm.append('name', name);

	return await uploadResource(uploadForm);
}