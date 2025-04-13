const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function setupDatabase() {
  // First connection without database specified to create the database
  const initialConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  try {
    console.log('Setting up database...');
    
    // Create database if it doesn't exist
    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    console.log(`Database ${process.env.DB_NAME} created or already exists`);
    
    // Close initial connection
    await initialConnection.end();
    
    // Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    // Create tables
    console.log('Creating tables...');
    
    // Students table
    await connection.query(`
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
      )
    `);
    console.log('Students table created');
    
    // Courses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        course_id VARCHAR(20) PRIMARY KEY,
        course_name VARCHAR(100) NOT NULL,
        credits INT NOT NULL,
        department VARCHAR(50) NOT NULL,
        description TEXT
      )
    `);
    console.log('Courses table created');
    
    // Semesters table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS semesters (
        semester_id INT AUTO_INCREMENT PRIMARY KEY,
        semester_number INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        is_current BOOLEAN DEFAULT FALSE
      )
    `);
    console.log('Semesters table created');
    
    // Results table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS results (
        result_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        course_id VARCHAR(20) NOT NULL,
        semester INT NOT NULL,
        grade VARCHAR(2) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (course_id) REFERENCES courses(course_id)
      )
    `);
    console.log('Results table created');
    
    // Attendance table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        attendance_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        course_id VARCHAR(20) NOT NULL,
        semester INT NOT NULL,
        total_classes INT NOT NULL DEFAULT 0,
        attended_classes INT NOT NULL DEFAULT 0,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (course_id) REFERENCES courses(course_id)
      )
    `);
    console.log('Attendance table created');
    
    // Semester records table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS semester_records (
        record_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        semester_number INT NOT NULL,
        sgpa DECIMAL(3,2) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(student_id)
      )
    `);
    console.log('Semester records table created');
    
    // Feedback table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        feedback_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        subject VARCHAR(100) NOT NULL,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(student_id)
      )
    `);
    console.log('Feedback table created');
    
    // Registered courses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS registered_courses (
        registration_id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        course_id VARCHAR(20) NOT NULL,
        semester INT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(student_id),
        FOREIGN KEY (course_id) REFERENCES courses(course_id)
      )
    `);
    console.log('Registered courses table created');
    
    // Course instructor table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS course_instructor (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id VARCHAR(20) NOT NULL,
        instructor_id VARCHAR(20) NOT NULL,
        semester INT NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(course_id)
      )
    `);
    console.log('Course instructor table created');
    
    console.log('All tables created successfully!');
    await connection.end();
    
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();