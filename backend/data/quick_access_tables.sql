USE student_portal;

-- Class schedules table
CREATE TABLE IF NOT EXISTS class_schedules (
  schedule_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(20) NOT NULL,
  day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday') NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  exam_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(20) NOT NULL,
  exam_type ENUM('Mid-Term', 'End-Term', 'Quiz', 'Assignment', 'Project') NOT NULL,
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  max_marks INT NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  event_description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue VARCHAR(100) NOT NULL,
  organizer VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Department events table
CREATE TABLE IF NOT EXISTS department_events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(50) NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  event_description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue VARCHAR(100) NOT NULL,
  organizer VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(20) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  max_marks INT NOT NULL,
  submission_status ENUM('Not Started', 'In Progress', 'Submitted', 'Graded') DEFAULT 'Not Started',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Assignment submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  submission_id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  submission_date DATETIME NOT NULL,
  file_path VARCHAR(255),
  comments TEXT,
  marks INT,
  feedback TEXT,
  FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Course materials table
CREATE TABLE IF NOT EXISTS course_materials (
  material_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(20) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  file_path VARCHAR(255),
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  material_type ENUM('Lecture Notes', 'Slides', 'Reference', 'Assignment', 'Other') NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);