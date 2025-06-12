import { initCourseHandlers } from './handlers/course.js';
import { initUnitHandlers } from './handlers/unit.js';
import { initTestHandlers } from './handlers/test.js';
import { initExerciseHandlers } from './handlers/exercise.js';
import { initFileInputHandlers } from './handlers/fileInput.js';
import { fillTestCourseSelect, fillExerciseCourseSelect } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
	await initCourseHandlers();
	await initUnitHandlers();
	await initTestHandlers();
	await initExerciseHandlers();
	initFileInputHandlers();
});

fillTestCourseSelect();
fillExerciseCourseSelect();