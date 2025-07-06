# R7L Platform API Reference

This document describes all available backend API endpoints for the R7L platform. All endpoints are prefixed with `/api/`.

---

## Authentication

### POST `/api/User/Authenticate`

Authenticate user and get JWT token.

- **Body:** `{ login: string, password: string }`
- **Response:** `{ id, login, positionName, email, firstName, lastName, registrationDate, token }`

### POST `/api/User/Create`

Register a new user.

- **Body:** `{ login, email, password, firstName, lastName, positionId }`
- **Response:** Same as Authenticate

---

## User

### GET `/api/User/{id}`

Get user info by id (admin or self).

- **Auth:** JWT required
- **Response:** UserReadDTO

### GET `/api/User/CurrentUser`

Get current user info.

- **Auth:** JWT required
- **Response:** UserReadDTO

### PUT `/api/User/Update`

Update current user info.

- **Auth:** JWT required
- **Body:** UserUpdateDTO

### PUT `/api/User/ChangePassword`

Change current user password.

- **Auth:** JWT required
- **Body:** `{ oldPassword, newPassword }`

### POST `/api/User/CheckLoginAndEmailUniqueness`

Check if login/email are unique.

- **Body:** `{ login, email }`
- **Response:** `{ LoginIsUnique, EmailIsUnique }`

---

## Courses

### GET `/api/Course/GetAllCourses`

Get all courses.

- **Response:** `CourseReadDTO[]`

### POST `/api/Course/Create`

Create a new course.

- **Body:** CourseCreateDTO
- **Response:** CourseReadDTO

### GET `/api/Course/{courseId}/Units`

Get all units for a course.

- **Response:** CourseUnitReadDTO[]

---

## Course Units

### POST `/api/CourseUnit/Create`

Create a course unit.

- **Body:** CourseUnitCreateDTO
- **Response:** CourseUnitReadDTO

### PUT `/api/CourseUnit`

Update a course unit.

- **Body:** CourseUnitUpdateDTO

### PATCH `/api/CourseUnit/{courseUnitId}/{newOrderInCourse}`

Change unit order in course.

### DELETE `/api/CourseUnit/{courseUnitId}`

Delete a course unit.

---

## Course Progress

### GET `/api/CourseProgress/{courseId}`

Get current user's progress in a course.

- **Auth:** JWT required
- **Response:** CourseUnitProgressReadDTO[]

### PUT `/api/CourseProgress/Update`

Update progress for a course unit.

- **Auth:** JWT required
- **Body:** CourseUnitProgressUpdateDTO

---

## Tests

### GET `/api/Test/{courseUnitId}`

Get test for a course unit.

- **Response:** TestReadDTO

### POST `/api/Test/Create`

Create a test.

- **Body:** TestCreateDTO
- **Response:** test id

### POST `/api/Test/Question/Create`

Create a test question.

- **Body:** TestQuestionCreateDTO
- **Response:** question id

### POST `/api/Test/Question/Option/Create`

Create a test question option.

- **Body:** TestQuestionOptionCreateDTO
- **Response:** option id

### PUT `/api/Test/Update`

Update a test.

- **Body:** TestUpdateDTO

### PUT `/api/Test/Question/Update`

Update a test question.

- **Body:** TestQuestionUpdateDTO

### PUT `/api/Test/Question/Option/Update`

Update a test question option.

- **Body:** TestQuestionOptionUpdateDTO

### DELETE `/api/Test/Question/Delete/{questionId}`

Delete a test question.

### DELETE `/api/Test/Question/Option/Delete/{optionId}`

Delete a test question option.

### PUT `/api/Test/Answer/Update`

Update or create user test answer.

- **Auth:** JWT required
- **Body:** TestAnswerDTO
- **Response:** user test degree (int)

---

## Resources

### GET `/api/resource/public/{*path}`

Get public resource (image, etc).

### GET `/api/resource/list/{*path}`

List files in a directory.

### GET `/api/resource/internal/{*path}`

Get internal resource (local network only).

### GET `/api/resource/{*path}`

Get resource (auth required).

### POST `/api/resource/upload`

Upload a resource file.

- **Auth:** JWT required
- **Form:** file, subdir, courseId, orderInCourse, name
- **Response:** `{ path }`

### POST `/api/resource/upload/temp_exercise`

Upload a temporary exercise file.

- **Auth:** JWT, student role
- **Form:** file, userId
- **Response:** `{ path }`

---

## Error Handling

- Most endpoints return HTTP 400 with error message on failure.
- Auth endpoints return 401/403 on unauthorized/forbidden.

---

For more details on request/response formats, see DTO definitions in the backend source code.
