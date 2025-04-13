USE student_portal;

-- Insert sample students
INSERT INTO students (username, password, name, roll_number, email, phone_number, branch, current_semester, cgpa)
VALUES 
('john_doe', '$2b$10$XdUAbmh3Yt6JHT.FCrD.5.6FBmMj8q0mY3VZ.eIYxHm4LXxQxZKXC', 'John Doe', 'CS2001', 'john.doe@example.com', '1234567890', 'Computer Science', 5, 8.75),
('jane_smith', '$2b$10$XdUAbmh3Yt6JHT.FCrD.5.6FBmMj8q0mY3VZ.eIYxHm4LXxQxZKXC', 'Jane Smith', 'CS2002', 'jane.smith@example.com', '9876543210', 'Computer Science', 5, 9.20),
('bob_johnson', '$2b$10$XdUAbmh3Yt6JHT.FCrD.5.6FBmMj8q0mY3VZ.eIYxHm4LXxQxZKXC', 'Bob Johnson', 'EC2001', 'bob.johnson@example.com', '5555555555', 'Electronics', 3, 7.80);

-- Insert sample courses
INSERT INTO courses (course_id, course_name, credits, department, description)
VALUES 
('CS301', 'Data Structures', 4, 'Computer Science', 'Study of data structures and algorithms'),
('CS302', 'Database Systems', 4, 'Computer Science', 'Introduction to database management systems'),
('CS303', 'Computer Networks', 3, 'Computer Science', 'Fundamentals of computer networking'),
('CS304', 'Operating Systems', 4, 'Computer Science', 'Principles of operating systems'),
('CS305', 'Software Engineering', 3, 'Computer Science', 'Software development methodologies'),
('EC301', 'Digital Electronics', 4, 'Electronics', 'Fundamentals of digital circuits'),
('EC302', 'Signals and Systems', 4, 'Electronics', 'Analysis of signals and systems');

-- Insert sample semesters
INSERT INTO semesters (semester_number, start_date, end_date, is_current)
VALUES 
(1, '2021-08-01', '2021-12-31', FALSE),
(2, '2022-01-01', '2022-05-31', FALSE),
(3, '2022-08-01', '2022-12-31', FALSE),
(4, '2023-01-01', '2023-05-31', FALSE),
(5, '2023-08-01', '2023-12-31', TRUE);

-- Insert sample results for John Doe
INSERT INTO results (student_id, course_id, semester, grade)
VALUES 
(1, 'CS301', 3, 'A'),
(1, 'CS302', 3, 'B+'),
(1, 'CS303', 4, 'A+'),
(1, 'CS304', 4, 'B'),
(1, 'CS305', 5, 'A');

-- Insert sample results for Jane Smith
INSERT INTO results (student_id, course_id, semester, grade)
VALUES 
(2, 'CS301', 3, 'A+'),
(2, 'CS302', 3, 'A'),
(2, 'CS303', 4, 'A'),
(2, 'CS304', 4, 'A+'),
(2, 'CS305', 5, 'A+');

-- Insert sample attendance for John Doe
INSERT INTO attendance (student_id, course_id, semester, total_classes, attended_classes)
VALUES 
(1, 'CS301', 3, 30, 25),
(1, 'CS302', 3, 30, 28),
(1, 'CS303', 4, 25, 20),
(1, 'CS304', 4, 30, 26),
(1, 'CS305', 5, 20, 18);

-- Insert sample semester records for John Doe
INSERT INTO semester_records (student_id, semester_number, sgpa)
VALUES 
(1, 1, 8.20),
(1, 2, 8.50),
(1, 3, 8.70),
(1, 4, 8.90),
(1, 5, 9.10);

-- Insert sample semester records for Jane Smith
INSERT INTO semester_records (student_id, semester_number, sgpa)
VALUES 
(2, 1, 8.80),
(2, 2, 9.00),
(2, 3, 9.20),
(2, 4, 9.40),
(2, 5, 9.60);

-- Course Details
INSERT INTO courses (course_id, course_name, credits, department, description) VALUES
('CS101', 'Introduction to Computer Science', 3, 'Computer Science', 'An introductory course to the fundamental concepts of computer science.'),
('CS201', 'Data Structures', 4, 'Computer Science', 'Study of data structures and algorithms for manipulating them.'),
('CS301', 'Database Systems', 4, 'Computer Science', 'Introduction to database design, implementation, and management.'),
('CS401', 'Artificial Intelligence', 3, 'Computer Science', 'Introduction to the principles and techniques of artificial intelligence.'),
('MATH101', 'Calculus I', 3, 'Mathematics', 'Introduction to differential and integral calculus.');

-- Course Instructors
INSERT INTO instructors (instructor_id, name, department, email) VALUES
(1, 'Dr. John Smith', 'Computer Science', 'john.smith@university.edu'),
(2, 'Dr. Emily Johnson', 'Computer Science', 'emily.johnson@university.edu'),
(3, 'Dr. Michael Brown', 'Mathematics', 'michael.brown@university.edu'),
(4, 'Dr. Sarah Davis', 'Computer Science', 'sarah.davis@university.edu'),
(5, 'Dr. Robert Wilson', 'Computer Science', 'robert.wilson@university.edu');

-- Course-Instructor Assignments
INSERT INTO course_instructor (course_id, instructor_id, semester) VALUES
('CS101', 1, 'Fall 2023'),
('CS201', 2, 'Fall 2023'),
('CS301', 4, 'Fall 2023'),
('CS401', 5, 'Fall 2023'),
('MATH101', 3, 'Fall 2023');

-- Course Syllabus
INSERT INTO syllabus (course_id, week, topic, description) VALUES
('CS101', 1, 'Introduction to Computing', 'History of computing, basic computer organization'),
('CS101', 2, 'Problem Solving', 'Algorithms, flowcharts, pseudocode'),
('CS101', 3, 'Programming Basics', 'Variables, data types, operators'),
('CS101', 4, 'Control Structures', 'Conditionals, loops, decision making'),
('CS201', 1, 'Introduction to Data Structures', 'Overview of data structures and their importance'),
('CS201', 2, 'Arrays and Linked Lists', 'Implementation and operations'),
('CS201', 3, 'Stacks and Queues', 'Implementation and applications'),
('CS201', 4, 'Trees', 'Binary trees, traversal algorithms');

-- Course Materials
INSERT INTO materials (course_id, title, type, description, url) VALUES
('CS101', 'Introduction to Programming', 'pdf', 'Lecture notes for week 1', '/materials/cs101/intro.pdf'),
('CS101', 'Problem Solving Techniques', 'pdf', 'Lecture notes for week 2', '/