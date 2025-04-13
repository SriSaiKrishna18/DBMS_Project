USE student_portal;

-- Instructors table
CREATE TABLE IF NOT EXISTS instructors (
  instructor_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  department VARCHAR(50) NOT NULL,
  designation VARCHAR(50) NOT NULL,
  profile_image VARCHAR(255) DEFAULT NULL,
  bio TEXT
);

-- Prerequisites table
CREATE TABLE IF NOT EXISTS prerequisites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(20) NOT NULL,
  prerequisite_course_id VARCHAR(20) NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  FOREIGN KEY (prerequisite_course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Syllabus table
CREATE TABLE IF NOT EXISTS syllabus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(20) NOT NULL,
  week_number INT NOT NULL,
  topic VARCHAR(200) NOT NULL,
  description TEXT,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Course reviews table
CREATE TABLE IF NOT EXISTS course_reviews (
  review_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id VARCHAR(20) NOT NULL,
  student_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);