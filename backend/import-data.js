const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Helper function to read CSV files
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function importData() {
  const pool = mysql.createPool(dbConfig);
  
  try {
    console.log('Starting data import...');
    
    // Import students data
    console.log('Importing students data...');
    const studentsData = await readCSV(path.join(__dirname, './data/updated_students.csv'));
    
    for (const student of studentsData) {
      await pool.query(
        `INSERT INTO students 
         (student_id, name, roll_number, email, phone_number, branch, current_semester, cgpa, username, password) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          student.student_id,
          student.name,
          student.roll_number,
          student.email,
          student.phone_number,
          student.branch,
          student.current_semester,
          student.cgpa,
          student.roll_number, // Using roll_number as username
          'password' // Default password
        ]
      );
    }
    
    // Import courses data
    console.log('Importing courses data...');
    const coursesData = await readCSV(path.join(__dirname, './data/updated_courses.csv'));
    
    for (const course of coursesData) {
      await pool.query(
        `INSERT INTO courses 
         (course_id, course_name, credits, department, description) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          course.course_id,
          course.course_name,
          course.credits,
          course.department || 'General',
          course.description || ''
        ]
      );
    }
    
    // Import attendance data
    console.log('Importing attendance data...');
    const attendanceData = await readCSV(path.join(__dirname, './data/attendance.csv'));
    
    for (const record of attendanceData) {
      await pool.query(
        `INSERT INTO attendance 
         (attendance_id, student_id, course_id, semester, total_classes, attended_classes) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          record.attendance_id,
          record.student_id,
          record.course_id,
          record.semester,
          record.total_classes,
          record.attended_classes
        ]
      );
    }
    
    // Import results data
    console.log('Importing results data...');
    const resultsData = await readCSV(path.join(__dirname, './data/results.csv'));
    
    for (const result of resultsData) {
      await pool.query(
        `INSERT INTO results 
         (result_id, student_id, course_id, semester, grade) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          result.result_id,
          result.student_id,
          result.course_id,
          result.semester,
          result.grade
        ]
      );
    }
    
    // Import semester records data
    console.log('Importing semester records data...');
    const semesterRecordsData = await readCSV(path.join(__dirname, './data/previous_semester_records.csv'));
    
    for (const record of semesterRecordsData) {
      await pool.query(
        `INSERT INTO semester_records 
         (record_id, student_id, semester_number, sgpa) 
         VALUES (?, ?, ?, ?)`,
        [
          record.record_id,
          record.student_id,
          record.semester_number,
          record.sgpa
        ]
      );
    }
    
    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await pool.end();
  }
}

importData();