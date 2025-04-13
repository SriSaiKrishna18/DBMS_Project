// Make sure this is at the very top of your file, before any other requires
require('dotenv').config();


// ... rest of your imports

const express = require('express');
const cors = require('cors');
//const authRoutes = require('./routes/auth');
//const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
//const attendanceRoutes = require('./routes/attendance');
//const resultsRoutes = require('./routes/results');
const quickAccessRoutes = require('./quick-access-api');
const assignmentsRoutes = require('./routes/assignments');
const fs = require('fs');
const path = require('path');
const chatbotRoutes = require('./chatbot-api');
const bodyParser = require('body-parser');
const { pool, testConnection } = require('./config/db');
const csv = require('csv-parser');
const feedbackRouter = require('./feedback');
const app = express();
const PORT = process.env.PORT || 2006;

// Middleware
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
testConnection();
app.use(express.json());
app.use(feedbackRouter);
//app.use('/api/auth', authRoutes);
//app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
//app.use('/api/attendance', attendanceRoutes);
//app.use('/api/results', resultsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/quick-access', quickAccessRoutes);
app.use(express.static(path.join(__dirname, '..', 'frontend'), {
    index: false // Prevent serving index.html automatically
}));



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

// Routes

// ... existing code ...

// Routes
// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

// Add a specific route for the dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Get student profile data
app.get('/api/student/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const studentsData = await readCSV(path.join(__dirname, 'data', 'updated_students.csv'));
        
        // ... existing code ...
        
        const student = studentsData.find(s => s.student_id === studentId);
        
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        res.json(student);
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student courses
app.get('/api/student/:id/courses', async (req, res) => {
    try {
        const studentId = req.params.id;
        const registeredCoursesData = await readCSV(path.join(__dirname, 'data', 'registered_courses.csv'));
        const coursesData = await readCSV(path.join(__dirname, 'data', 'updated_courses.csv'));
        const instructorData = await readCSV(path.join(__dirname, 'data', 'course_instructor.csv'));
        
        // Filter courses for the specific student
        const studentCourses = registeredCoursesData.filter(rc => rc.student_id === studentId);
        
        // Enrich with course details and instructor information
        const enrichedCourses = studentCourses.map(sc => {
            const courseDetails = coursesData.find(c => c.course_id === sc.course_id);
            const instructorInfo = instructorData.find(i => i.course_id === sc.course_id && i.semester === sc.semester);
            
            return {
                ...sc,
                ...courseDetails,
                instructor_id: instructorInfo ? instructorInfo.instructor_id : null
            };
        });
        
        res.json(enrichedCourses);
    } catch (error) {
        console.error('Error fetching courses data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student attendance
app.get('/api/student/:id/attendance', async (req, res) => {
    try {
        const studentId = req.params.id;
        const attendanceData = await readCSV(path.join(__dirname, 'data', 'attendance.csv'));
        const registeredCoursesData = await readCSV(path.join(__dirname, 'data', 'registered_courses.csv'));
        const coursesData = await readCSV(path.join(__dirname, 'data', 'updated_courses.csv'));
        
        // Filter attendance records for the specific student
        const studentRegistrations = registeredCoursesData.filter(rc => rc.student_id === studentId);
        
        // Match attendance records with registrations
        const studentAttendance = [];
        
        for (const registration of studentRegistrations) {
            const attendanceRecord = attendanceData.find(a => 
                a.student_id === studentId && 
                a.course_id === registration.course_id && 
                a.semester === registration.semester
            );
            
            if (attendanceRecord) {
                const courseDetails = coursesData.find(c => c.course_id === registration.course_id);
                
                studentAttendance.push({
                    course_id: registration.course_id,
                    course_name: courseDetails ? courseDetails.course_name : 'Unknown Course',
                    semester: registration.semester,
                    total_classes: attendanceRecord.total_classes,
                    attended_classes: attendanceRecord.attended_classes,
                    attendance_percentage: Math.round((parseInt(attendanceRecord.attended_classes) / parseInt(attendanceRecord.total_classes)) * 100)
                });
            }
        }
        
        res.json(studentAttendance);
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student results
app.get('/api/student/:id/results', async (req, res) => {
    try {
        const studentId = req.params.id;
        const resultsData = await readCSV(path.join(__dirname, 'data', 'results.csv'));
        const coursesData = await readCSV(path.join(__dirname, 'data', 'updated_courses.csv'));
        
        // Filter results for the specific student
        const studentResults = resultsData.filter(r => r.student_id === studentId);
        
        // Enrich with course details
        const enrichedResults = studentResults.map(sr => {
            const courseDetails = coursesData.find(c => c.course_id === sr.course_id);
            
            return {
                ...sr,
                course_name: courseDetails ? courseDetails.course_name : 'Unknown Course',
                credits: courseDetails ? courseDetails.credits : 0
            };
        });
        
        res.json(enrichedResults);
    } catch (error) {
        console.error('Error fetching results data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student semester records
app.get('/api/student/:id/semester-records', async (req, res) => {
    try {
        const studentId = req.params.id;
        const semesterRecordsData = await readCSV(path.join(__dirname, 'data', 'previous_semester_records.csv'));
        
        // Filter semester records for the specific student
        const studentSemesterRecords = semesterRecordsData.filter(sr => sr.student_id === studentId);
        
        res.json(studentSemesterRecords);
    } catch (error) {
        console.error('Error fetching semester records data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




// ... existing code ...

// Update student profile
app.post('/api/student/:id/update-profile', async (req, res) => {
    try {
        const studentId = req.params.id;
        const { email, phone_number } = req.body;
        
        // In a real application, you would update the database
        // For this demo, we'll just return success
        
        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            updatedData: { email, phone_number }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // In a real app, you would hash the password and compare with stored hash
      const [rows] = await pool.query(
        'SELECT student_id, password FROM students WHERE username = ?',
        [username]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No user found with the given username' });
      }
      
      const user = rows[0];
      
      // In a real app, you would use bcrypt.compare
      if (password !== 'password') { // Simplified for demo
        return res.status(401).json({ error: 'Invalid password' });
      }
      
      res.json({ student_id: user.student_id });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get student data
  app.get('/api/student/:id', async (req, res) => {
    try {
      const studentId = req.params.id;
      
      const [rows] = await pool.query(
        'SELECT * FROM students WHERE student_id = ?',
        [studentId]
      );
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }
      
      // Don't send password to client
      const student = rows[0];
      delete student.password;
      
      res.json(student);
    } catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get student attendance
  app.get('/api/student/:id/attendance', async (req, res) => {
    try {
      const studentId = req.params.id;
      
      const [rows] = await pool.query(
        `SELECT a.*, c.course_name 
         FROM attendance a
         JOIN courses c ON a.course_id = c.course_id
         WHERE a.student_id = ?`,
        [studentId]
      );
      
      res.json(rows);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get student results
  app.get('/api/student/:id/results', async (req, res) => {
    try {
      const studentId = req.params.id;
      
      const [rows] = await pool.query(
        `SELECT r.*, c.course_name, c.credits
         FROM results r
         JOIN courses c ON r.course_id = c.course_id
         WHERE r.student_id = ?`,
        [studentId]
      );
      
      res.json(rows);
    } catch (error) {
      console.error('Error fetching results data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get student semester records
  app.get('/api/student/:id/semester-records', async (req, res) => {
    try {
      const studentId = req.params.id;
      
      const [rows] = await pool.query(
        'SELECT * FROM semester_records WHERE student_id = ? ORDER BY semester_number',
        [studentId]
      );
      
      res.json(rows);
    } catch (error) {
      console.error('Error fetching semester records:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Start server


// ... existing code ...





//new server.js


// const express = require('express');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// const bodyParser = require('body-parser');
// const { pool, testConnection } = require('./config/db');
// const feedbackRouter = require('./feedback');
// const app = express();
// const PORT = process.env.PORT || 2006;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// testConnection();
// app.use(express.json());
// app.use(feedbackRouter);
// app.use(express.static(path.join(__dirname, '..', 'frontend'), {
//     index: false // Prevent serving index.html automatically
// }));

// // Routes
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
// });

// // Add a specific route for the dashboard
// app.get('/dashboard', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
// });

// // Get student profile data
// app.get('/api/student/:id', async (req, res) => {
//     try {
//         const studentId = req.params.id;
        
//         const [rows] = await pool.query(
//             'SELECT * FROM students WHERE student_id = ?',
//             [studentId]
//         );
        
//         if (rows.length === 0) {
//             return res.status(404).json({ error: 'Student not found' });
//         }
        
//         // Don't send password to client
//         const student = rows[0];
//         delete student.password;
        
//         res.json(student);
//     } catch (error) {
//         console.error('Error fetching student data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Get student courses
// app.get('/api/student/:id/courses', async (req, res) => {
//     try {
//         const studentId = req.params.id;
        
//         const [rows] = await pool.query(
//             `SELECT rc.*, c.course_name, c.credits, c.department, c.description, i.instructor_id 
//              FROM registered_courses rc
//              JOIN courses c ON rc.course_id = c.course_id
//              LEFT JOIN course_instructor i ON rc.course_id = i.course_id AND rc.semester = i.semester
//              WHERE rc.student_id = ?`,
//             [studentId]
//         );
        
//         res.json(rows);
//     } catch (error) {
//         console.error('Error fetching courses data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Get student attendance
// app.get('/api/student/:id/attendance', async (req, res) => {
//     try {
//         const studentId = req.params.id;
        
//         const [rows] = await pool.query(
//             `SELECT a.*, c.course_name,
//              ROUND((a.attended_classes / a.total_classes) * 100) as attendance_percentage
//              FROM attendance a
//              JOIN courses c ON a.course_id = c.course_id
//              WHERE a.student_id = ?`,
//             [studentId]
//         );
        
//         res.json(rows);
//     } catch (error) {
//         console.error('Error fetching attendance data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Get student results
// app.get('/api/student/:id/results', async (req, res) => {
//     try {
//         const studentId = req.params.id;
        
//         const [rows] = await pool.query(
//             `SELECT r.*, c.course_name, c.credits
//              FROM results r
//              JOIN courses c ON r.course_id = c.course_id
//              WHERE r.student_id = ?`,
//             [studentId]
//         );
        
//         res.json(rows);
//     } catch (error) {
//         console.error('Error fetching results data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Get student semester records
// app.get('/api/student/:id/semester-records', async (req, res) => {
//     try {
//         const studentId = req.params.id;
        
//         const [rows] = await pool.query(
//             'SELECT * FROM semester_records WHERE student_id = ? ORDER BY semester_number',
//             [studentId]
//         );
        
//         res.json(rows);
//     } catch (error) {
//         console.error('Error fetching semester records data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Update student profile
// app.post('/api/student/:id/update-profile', async (req, res) => {
//     try {
//         const studentId = req.params.id;
//         const { email, phone_number } = req.body;
        
//         await pool.query(
//             'UPDATE students SET email = ?, phone_number = ? WHERE student_id = ?',
//             [email, phone_number, studentId]
//         );
        
//         res.json({ 
//             success: true, 
//             message: 'Profile updated successfully',
//             updatedData: { email, phone_number }
//         });
//     } catch (error) {
//         console.error('Error updating profile:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Login endpoint
// app.post('/api/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
        
//         const [rows] = await pool.query(
//             'SELECT student_id, password FROM students WHERE username = ?',
//             [username]
//         );
        
//         if (rows.length === 0) {
//             return res.status(404).json({ error: 'No user found with the given username' });
//         }
        
//         const user = rows[0];
        
//         // In a real app, you would use bcrypt.compare
//         if (password !== 'password') { // Simplified for demo
//             return res.status(401).json({ error: 'Invalid password' });
//         }
        
//         res.json({ student_id: user.student_id });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Register new user
// app.post('/api/register', async (req, res) => {
//     try {
//         const { name, roll_number, email, phone_number, branch, current_semester, username, password } = req.body;
        
//         // Check if username already exists
//         const [existingUsers] = await pool.query(
//             'SELECT * FROM students WHERE username = ? OR roll_number = ?',
//             [username, roll_number]
//         );
        
//         if (existingUsers.length > 0) {
//             return res.status(409).json({ error: 'Username or roll number already exists' });
//         }
        
//         // Insert new user
//         const [result] = await pool.query(
//             `INSERT INTO students 
//              (name, roll_number, email, phone_number, branch, current_semester, cgpa, username, password) 
//              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//             [name, roll_number, email, phone_number, branch, current_semester, 0.00, username, password]
//         );
        
//         res.status(201).json({ 
//             success: true, 
//             message: 'User registered successfully',
//             student_id: result.insertId
//         });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });