export async function uploadTestTxt(formData, courseId, orderInCourse) {
	const file = formData.get('testTxt');
	const filename = `test_${Date.now()}.txt`;
	const uploadRes = await fetch('/resources/Tests/' + filename, {
		method: 'PUT',
		body: file
	});
	if (!uploadRes.ok) throw new Error('Ошибка загрузки файла на сервер');

	const body = {
		courseId: Number(courseId),
		orderInCourse: Number(orderInCourse),
		testInfoPath: `/resources/Tests/${filename}`
	};
	const res = await fetch("/testcreator/CreateNewTest", {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	if (!res.ok) throw new Error(await res.text());
	return res.json();
}