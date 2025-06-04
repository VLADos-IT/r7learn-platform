import json
import requests
from fastapi import FastAPI, Body, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os

import docx_to_md_converter



app = FastAPI()

RESOURCES_DIR = "/resources"

# correct type_name from db
lesson_course_unit_type_name = "lesson"

# backend API url base; ends with '/'
url_base = "http://r7l-backend:5000/api/"

# current endpoint host
endpoint_host = "0.0.0.0"

# current endpoint port
endpoint_port = 8000


# path to directory with all lessons
root_result_dir = "/resources"

# base 'src' for all images tegs in each mds
imgs_src_base = "./"


md_serial_number_separator = '-'
docx_to_md_converter.md_serial_number_separator = md_serial_number_separator



class LessonCreateDTO(BaseModel):
    courseId: int
    orderInCourse: int
    lessonInfoPath: str



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
        root_result_dir, imgs_src_base, lesson_info_path)

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
    # temporary directory for uploaded docx files
    docx_dir = "/resources/docx"
    os.makedirs(docx_dir, exist_ok=True)
    temp_path = os.path.join(docx_dir, docx.filename)
    with open(temp_path, "wb") as f:
        f.write(await docx.read())
    # convert docx to md
    name, mds_count = docx_to_md_converter.convert("/resources", "./", temp_path)
    md_path = f"/resources/{name}/mds/start.md"
    # Create course unit in backend
    post_lesson_course_unit(courseId, orderInCourse, name, mds_count)
    return {"name": name, "mdPath": md_path, "mdsCount": mds_count}

# List all resources (units, mds files, images)
@app.get("/api/resources")
def list_resources():
    result = []
    if not os.path.isdir(RESOURCES_DIR):
        return JSONResponse(content=[], status_code=200)
    for unit in sorted(os.listdir(RESOURCES_DIR)):
        unit_path = os.path.join(RESOURCES_DIR, unit)
        if not os.path.isdir(unit_path):
            continue
        mds_dir = os.path.join(unit_path, "mds")
        imgs_dir = os.path.join(unit_path, "imgs")
        mds = []
        imgs = []
        if os.path.isdir(mds_dir):
            mds = sorted([f for f in os.listdir(mds_dir) if f.endswith(".md")])
        if os.path.isdir(imgs_dir):
            imgs = sorted([f for f in os.listdir(imgs_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg'))])
        result.append({
            "unit": unit,
            "mds": mds,
            "imgs": imgs
        })
    return result

# Get list of images for a specific unit
@app.get("/api/mdfiles")
def get_md_files(unit: str):
    mds_dir = os.path.join(RESOURCES_DIR, unit, "mds")
    if not os.path.isdir(mds_dir):
        raise HTTPException(status_code=404, detail="Unit not found")
    files = sorted([f for f in os.listdir(mds_dir) if f.endswith(".md")])
    return files

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=endpoint_host, port=endpoint_port)
