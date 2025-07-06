import json
import requests
from fastapi import FastAPI, Body
from pydantic import BaseModel

app = FastAPI()

single_question_type_name = "single"
multi_question_type_name = "multi"
test_course_unit_type_name = "test"

# backend API:
url_base = "http://r7l-backend:5000/api/"
endpoint_host = "0.0.0.0"
endpoint_port = 8001


class TestCreateDTO(BaseModel):
    courseId: int
    orderInCourse: int
    testInfoPath: str


class Question:
    def __init__(self):
        self.test_id = -1
        self.is_multi = False
        self.question = "Question"
        self.options = []

    def set_question_id(self, question_id: int):
        for option in self.options:
            option.question_id = question_id

    def to_dict(self):
        type_name = single_question_type_name
        if (self.is_multi):
            type_name = multi_question_type_name

        return {
            "testId": self.test_id,
            "typeName": type_name,
            "question": self.question
        }

    def to_json(self):
        return json.dumps(self.to_dict())


class QuestionOption:
    def __init__(self):
        self.question_id = -1
        self.content = "Content"
        self.is_correct = False

    def to_dict(self):
        return {
            "questionId": self.question_id,
            "content": self.content,
            "isCorrect": self.is_correct
        }

    def to_json(self):
        return json.dumps(self.to_dict())


def get_txt_file_lines(txt_file_path):
    result = []

    with open(txt_file_path, 'r', encoding='utf-8') as txt:
        for line in txt:
            cleaned_line = line.strip()
            if cleaned_line == '':
                continue
            result.append(cleaned_line)

    return result


def parse_test_info(test_info_path):
    test_info = get_txt_file_lines(test_info_path)
    name = "test name"
    description = "test description"
    questions = []

    for i in range(0, len(test_info)):
        line = test_info[i]

        if line[0] == '@':
            name = line[1:]
        elif line[0] == '~':
            description = line[1:]
        elif line[0] == '?' or line[0] == '!':
            current_question = Question()
            current_question.is_multi = line[0] == '?'
            current_question.question = line[1:]
            current_question.options = []

            i += 1
            while i < len(test_info):
                line = test_info[i]

                if line[0] != '-' and line[0] != '+':
                    break

                current_question_option = QuestionOption()
                current_question_option.is_correct = line[0] == '+'
                current_question_option.content = line[1:]

                current_question.options.append(current_question_option)
                i += 1

            questions.append(current_question)

    return name, description, questions


def post_test_course_unit(course_id: int, order_in_course: int, name: str, max_degree: int):
    url = url_base + "CourseUnit/Create"
    payload = {
        "courseId": course_id,
        "orderInCourse": order_in_course,
        "courseUnitTypeName": test_course_unit_type_name,
        "name": name,
        "maxDegree": max_degree
    }

    response = requests.post(url, json=payload)
    print("CourseUnit create result:", response.status_code)

    return int(response.json()['id'])


def post_test(course_unit_id: int, description: str):
    url = url_base + "Test/Create"
    payload = {
        "courseUnitId": course_unit_id,
        "description": description
    }

    response = requests.post(url, json=payload)
    print("Test create result:", response.status_code)

    return int(response.text)


def post_test_question(question: Question):
    url = url_base + "Test/Question/Create"
    payload = question.to_dict()

    response = requests.post(url, json=payload)
    print("TestQuestion create result:", response.status_code)

    return int(response.text)


def post_test_question_option(option: QuestionOption):
    url = url_base + "Test/Question/Option/Create"
    payload = option.to_dict()

    response = requests.post(url, json=payload)
    print("TestQuestionOption create result:", response.status_code)

    return int(response.text)


def create_test(test_info_path: str, course_id: int, order_in_course: int):
    name, description, questions = parse_test_info(test_info_path)

    course_unit_id = post_test_course_unit(
        course_id, order_in_course, name, len(questions))
    test_id = post_test(course_unit_id, description)

    for question in questions:
        question.test_id = test_id
        question_id = post_test_question(question)
        question.set_question_id(question_id)

        for option in question.options:
            post_test_question_option(option)


@app.post("/CreateNewTest")
async def create_new_test(test_create_dto: TestCreateDTO):
    create_test(test_create_dto.testInfoPath,
                test_create_dto.courseId, test_create_dto.orderInCourse)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=endpoint_host, port=endpoint_port)
