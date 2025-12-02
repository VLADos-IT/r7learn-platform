from fastapi import HTTPException
import requests
from fastapi import FastAPI, Body, APIRouter
from pydantic import BaseModel
import os

import docx_comparer


app = FastAPI()
router = APIRouter()


# correct type_name from db
exercise_course_unit_type_name = "exercise"

# backend API url base; ends with '/'
url_base = "http://r7l-backend:5000/api/"


# current endpoint host
endpoint_host = "0.0.0.0"

# currect endpoint port
endpoint_port = 8000


path_separator = "/"


# path to directory with all of exercises
exercises_dir_path = "/resources/exercises"
exercise_expected_solution_name = "expected"


class ExerciseCreateDTO(BaseModel):
    courseId: int
    orderInCourse: int
    name: str
    expectedSolutionPath: str


class ExerciseCheckDTO(BaseModel):
    courseUnitId: int
    userId: int
    userSolutionPath: str


def post_exercise_course_unit(course_id: int, order_in_course: int, name: str, max_degree: int):
    url = url_base + "CourseUnit/Create"
    payload = {
        "courseId": course_id,
        "orderInCourse": order_in_course,
        "courseUnitTypeName": exercise_course_unit_type_name,
        "name": name,
        "maxDegree": max_degree
    }

    response = requests.post(url, json=payload)
    print("CourseUnit create result:", response.status_code)

    return int(response.json()['id'])


def create_exercise(expected_solution_path: str, course_id: int, order_in_course: int, name: str):
    max_degree = 1

    course_unit_id = post_exercise_course_unit(
        course_id, order_in_course, name, max_degree)

    exercise_dir = exercises_dir_path + path_separator + str(course_unit_id)
    os.makedirs(exercise_dir, exist_ok=False)

    new_expected_solution_path = exercise_dir + \
        path_separator + exercise_expected_solution_name

    expected_solution_file_extension = expected_solution_path.split('.')[-1]
    new_expected_solution_path += '.' + expected_solution_file_extension

    os.rename(expected_solution_path, new_expected_solution_path)


def update_course_progress(user_id: int, course_unit_id: int, degree: int):
    url = url_base + "CourseProgress/Update"
    payload = {
        "userId": user_id,
        "courseUnitId": course_unit_id,
        "degree": degree,
    }

    response = requests.put(url, json=payload)
    print("CourseProgress update result:", response.status_code)


def check_exercise(course_unit_id: int, user_id: int, user_solution_path: str):
    import logging
    logger = logging.getLogger("exercisecheck")
    solution_file_extension = user_solution_path.split('.')[-1]
    expected_solution_path = (
        exercises_dir_path + path_separator
        + str(course_unit_id) + path_separator
        + exercise_expected_solution_name + '.' + solution_file_extension
    )

    if not os.path.isfile(user_solution_path):
        logger.error(f"User solution file not found: {user_solution_path}")
        return [f"Файл пользователя не найден: {user_solution_path}"], False

    if not os.path.isfile(expected_solution_path):
        logger.error(
            f"Expected solution file not found: {expected_solution_path}")
        return [f"Эталонный файл не найден: {expected_solution_path}"], False

    try:
        user_solution_differrences = docx_comparer.compare_docx(
            expected_solution_path, user_solution_path)
    except Exception as e:
        logger.exception(f"Ошибка сравнения файлов: {e}")
        return [f"Ошибка сравнения файлов: {e}"], False

    degree = int(len(user_solution_differrences) == 0)
    try:
        update_course_progress(user_id, course_unit_id, degree)
    except Exception as e:
        logger.exception(f"Ошибка обновления прогресса: {e}")
    return user_solution_differrences, degree == 1


@router.put("/CheckExercise")
async def check_user_exrcise(exercise_check_dto: ExerciseCheckDTO):
    differences, result = check_exercise(
        course_unit_id=exercise_check_dto.courseUnitId,
        user_id=exercise_check_dto.userId,
        user_solution_path=exercise_check_dto.userSolutionPath
    )
    if not result:
        if differences and any("не найден" in str(d) or "Ошибка" in str(d) for d in differences):
            raise HTTPException(status_code=400, detail={
                                "result": False, "differences": differences})
    return {
        "result": result,
        "differences": differences
    }


@router.post("/CreateNewExercise")
async def create_new_exercise(exercise_create_dto: ExerciseCreateDTO):
    create_exercise(
        expected_solution_path=exercise_create_dto.expectedSolutionPath,
        course_id=exercise_create_dto.courseId,
        order_in_course=exercise_create_dto.orderInCourse,
        name=exercise_create_dto.name
    )

app.include_router(router)
app.include_router(router, prefix="/exercisecheck")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=endpoint_host, port=endpoint_port)
