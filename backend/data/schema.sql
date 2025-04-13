-- Create database
CREATE DATABASE IF NOT EXISTS student_portal;
USE student_portal;

-- Students table
CREATE TABLE IF NOT EXISTS students (
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  roll_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone_number VARCHAR(15),
  branch VARCHAR(50) NOT NULL,
  current_semester INT NOT NULL,
  cgpa DECIMAL(3,2) DEFAULT 0.00,
  profile_image VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  course_id VARCHAR(20) PRIMARY KEY,
  course_name VARCHAR(100) NOT NULL,
  credits INT NOT NULL,
  department VARCHAR(50) NOT NULL,
  description TEXT
);

-- Semesters table
CREATE TABLE IF NOT EXISTS semesters (
  semester_id INT AUTO_INCREMENT PRIMARY KEY,
  semester_number INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
  result_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id VARCHAR(20) NOT NULL,
  semester INT NOT NULL,
  grade VARCHAR(2) NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id VARCHAR(20) NOT NULL,
  semester INT NOT NULL,
  total_classes INT NOT NULL DEFAULT 0,
  attended_classes INT NOT NULL DEFAULT 0,
  FOREIGN KEY (student_id) REFERENCES students(student_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Semester records table
CREATE TABLE IF NOT EXISTS semester_records (
  record_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  semester_number INT NOT NULL,
  sgpa DECIMAL(3,2) NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  feedback_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);