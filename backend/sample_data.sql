-- Updated sample data for courses
INSERT INTO courses (course_id, course_name, department, credits, description, instructor_id)
VALUES
('116', 'Transportation Engineering', 'Civil Engineering', 3, 'Introduction to transportation systems, planning, and design. Topics include traffic flow, highway capacity, level of service, and transportation planning.', 1),
('126', 'Fluid Mechanics', 'Mechanical Engineering', 3, 'Study of fluid properties, statics, and dynamics. Topics include fluid statics, fluid kinematics, flow measurement, and dimensional analysis.', 2),
('139', 'Thermodynamics', 'Mechanical Engineering', 3, 'Introduction to the principles of thermodynamics. Topics include energy, entropy, and the laws of thermodynamics.', 3),
('CS101', 'Introduction to Computer Science', 'Computer Science', 3, 'An introductory course to computer science concepts and programming fundamentals.', 4),
('CS201', 'Data Structures', 'Computer Science', 4, 'A comprehensive study of data structures and algorithms.', 5),
('CS301', 'Database Systems', 'Computer Science', 3, 'Introduction to database design, implementation, and management.', 6),
('MATH101', 'Calculus I', 'Mathematics', 4, 'Introduction to differential and integral calculus.', 7);

-- Updated sample data for course enrollments
INSERT INTO course_enrollment (student_id, course_id, enrollment_date, status)
VALUES 
(1, '116', '2023-01-15', 'Active'),
(1, '126', '2023-01-15', 'Active'),
(1, '139', '2023-01-15', 'Active'),
(1, 'CS101', '2023-01-15', 'Active'),
(1, 'CS201', '2023-01-15', 'Active'),
(1, 'CS301', '2023-01-15', 'Active'),
(1, 'MATH101', '2023-01-15', 'Active');