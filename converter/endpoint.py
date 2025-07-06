import os
import requests
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel

import docx_to_md_converter

app = FastAPI()

lesson_course_unit_type_name = "lesson"
exercise_course_unit_type_name = "exercise"

url_base = "http://r7l-backend:5000/api/"

endpoint_host = "0.0.0.0"
endpoint_port = 8000

root_result_dir = "/resources"
exercise_desc_dir = "/resources/exercise_desc"

imgs_src_base = "./"

md_serial_number_separator = '-'
docx_to_md_converter.md_serial_number_separator = md_serial_number_separator
path_separator = '/'
docx_to_md_converter.path_separator = path_separator


class LessonCreateDTO(BaseModel):
    courseId: int
    orderInCourse: int
    lessonInfoPath: str


class ExerciseInfoCreateDTO(BaseModel):
    exerciseInfoPath: str
    name: str


def post_lesson_course_unit(course_id: int, order_in_course: int, name: str, max_degree: int):
    url = url_base + "CourseUnit/Create"
    payload = {
        "courseId": course_id,
        "orderInCourse": order_in_course,
        "courseUnitTypeName": lesson_course_unit_type_name,
        "name": name,
        "maxDegree": max_degree
    }
    response = requests.post(url, json=payload)
    print("CourseUnit create result:", response.status_code)
    return int(response.json()['id'])


def create_lesson(lesson_info_path: str, course_id: int, order_in_course: int):
    docx_name, mds_count = docx_to_md_converter.convert(
        root_result_dir, imgs_src_base, lesson_info_path, True)
    max_degree = mds_count
    name = docx_name
    post_lesson_course_unit(course_id, order_in_course, name, max_degree)


@app.post("/CreateNewLesson")
async def create_new_lesson(lesson_create_dto: LessonCreateDTO):
    create_lesson(lesson_create_dto.lessonInfoPath,
                  lesson_create_dto.courseId, lesson_create_dto.orderInCourse)


@app.post("/convertDocx")
async def convert_docx(
    docx: UploadFile = File(...),
    courseId: int = Form(...),
    orderInCourse: int = Form(...)
):
    docx_dir = "/resources/docx"
    os.makedirs(docx_dir, exist_ok=True)
    temp_path = os.path.join(docx_dir, docx.filename)
    with open(temp_path, "wb") as f:
        f.write(await docx.read())
    name, mds_count = docx_to_md_converter.convert(
        root_result_dir, imgs_src_base, temp_path, True)
    md_path = f"/resources/{name}/mds/start.md"
    post_lesson_course_unit(courseId, orderInCourse, name, mds_count)
    return {"name": name, "mdPath": md_path, "mdsCount": mds_count}


@app.post("/CreateExerciseInfo")
async def create_exercise_info(
    descDocx: UploadFile = File(...),
    name: str = Form(...)
):
    docx_dir = "/resources/temp_exercise_desc"
    os.makedirs(docx_dir, exist_ok=True)
    temp_path = os.path.join(docx_dir, name + "_temp.docx")
    with open(temp_path, "wb") as f:
        f.write(await descDocx.read())
    unit_dir = os.path.join(exercise_desc_dir, name)
    docx_to_md_converter.convert(
        unit_dir, imgs_src_base, temp_path, True)
    mds_dir = os.path.join(unit_dir, "mds")
    return {"status": "ok", "mdsDir": mds_dir}


@app.get("/api/mdfiles")
def get_md_files(unit: str):
    mds_dir = os.path.join(root_result_dir, unit, "mds")
    if not os.path.isdir(mds_dir):
        mds_dir = os.path.join(exercise_desc_dir, unit, "mds")
        if not os.path.isdir(mds_dir):
            raise HTTPException(status_code=404, detail="Unit not found")
    files = sorted([f for f in os.listdir(mds_dir) if f.endswith(".md")])
    return files


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=endpoint_host, port=endpoint_port)
