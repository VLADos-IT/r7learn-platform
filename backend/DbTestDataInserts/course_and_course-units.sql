INSERT INTO course
(name, system_name, description)
VALUES
('How to become 42-man', '42', 'The best course in the world!');

INSERT INTO course_unit
(course_id, order_in_course, course_unit_type_id, name, max_degree)
VALUES
(1, 1, 1, 'Introduction to course', 1),
(1, 2, 1, 'Welcome!', 3),
(1, 3, 2, 'The first test!', 10),
(1, 4, 3, 'The first exercise!', 1);