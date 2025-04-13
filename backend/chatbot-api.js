// Chatbot API integration with OpenAI
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { pool } = require('./config/db');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const natural = require('natural'); // Add natural language processing
require('dotenv').config();

// OpenAI API endpoint
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Get OpenAI API key from environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Data folder path
const DATA_FOLDER = path.join(__dirname, 'data');

// Initialize tokenizer for query analysis
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Endpoint for chatbot responses
router.post('/chat', async (req, res) => {
    try {
        const { message, studentId, history, sessionId } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        if (!OPENAI_API_KEY) {
            return res.status(500).json({ error: 'OpenAI API key is not configured' });
        }
        
        // Log incoming query for analysis
        console.log(`[${new Date().toISOString()}] Query from student ${studentId}: ${message}`);
        
        // Analyze query intent
        const intent = analyzeQueryIntent(message);
        console.log(`Detected intent: ${intent.mainIntent}, confidence: ${intent.confidence}`);
        
        // Get student context from database if studentId is provided
        let studentContext = 'No context provided';
        if (studentId) {
            studentContext = await getStudentContext(studentId);
        }
        
        // Load relevant data based on intent and query
        const additionalData = await loadRelevantData(message, intent);
        
        // Get personalized system prompt based on intent
        const systemPrompt = getPersonalizedSystemPrompt(intent, studentContext, additionalData);
        
        // Prepare messages for OpenAI API
        const messages = [
            {
                role: 'system',
                content: systemPrompt
            }
        ];
        
        // Get chat history from database or use provided history
        let chatHistory = [];
        if (studentId) {
            const dbHistory = await getChatHistory(studentId, sessionId);
            chatHistory = dbHistory.length > 0 ? dbHistory : (history || []);
        } else if (history && Array.isArray(history)) {
            chatHistory = history;
        }
        
        // Add chat history (limited to last 10 messages to avoid token limits)
        if (chatHistory.length > 0) {
            messages.push(...chatHistory.slice(-10));
        }
        
        // Add the current message
        messages.push({ role: 'user', content: message });
        
        // Call OpenAI API with appropriate model based on complexity
        const model = determineAppropriateModel(message, intent);
        
        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: model,
                messages,
                max_tokens: 800, // Increased token limit for more detailed responses
                temperature: 0.7,
                top_p: 0.9,
                presence_penalty: 0.1,
                frequency_penalty: 0.5
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            }
        );
        
        // Extract the response text
        const aiResponse = response.data.choices[0].message.content;
        
        // Post-process the response
        const processedResponse = postProcessResponse(aiResponse, intent, studentContext);
        
        // Store the conversation in the database if studentId is provided
        if (studentId) {
            await storeConversation(studentId, message, processedResponse, sessionId, intent.mainIntent);
        }
        
        // Return the AI response with additional metadata
        res.json({ 
            response: processedResponse,
            intent: intent.mainIntent,
            model: model,
            sessionId: sessionId || generateSessionId()
        });
    } catch (error) {
        console.error('Error calling OpenAI API:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to get response from AI',
            details: error.response?.data || error.message
        });
    }
});

// Function to analyze query intent
function analyzeQueryIntent(query) {
    // Tokenize and stem the query
    const tokens = tokenizer.tokenize(query.toLowerCase());
    const stemmedTokens = tokens.map(token => stemmer.stem(token));
    
    // Define intent categories and their keywords
    const intentCategories = {
        academic_record: ['grade', 'gpa', 'cgpa', 'result', 'score', 'transcript', 'semester', 'performance'],
        attendance: ['attend', 'absence', 'present', 'miss', 'class', 'lecture', 'attendance'],
        course_info: ['course', 'subject', 'curriculum', 'syllabus', 'credit', 'elective', 'prerequisite'],
        schedule: ['timetable', 'schedule', 'class', 'exam', 'test', 'quiz', 'assignment', 'deadline'],
        registration: ['register', 'enroll', 'sign up', 'add course', 'drop course', 'withdraw'],
        faculty: ['professor', 'teacher', 'instructor', 'faculty', 'staff', 'department'],
        financial: ['fee', 'payment', 'scholarship', 'financial aid', 'tuition', 'refund'],
        technical: ['password', 'login', 'account', 'portal', 'website', 'system', 'error', 'bug'],
        general: ['help', 'information', 'guide', 'explain', 'tell me', 'what is', 'how to']
    };
    
    // Count matches for each category
    const intentScores = {};
    for (const [intent, keywords] of Object.entries(intentCategories)) {
        intentScores[intent] = 0;
        for (const keyword of keywords) {
            const stemmedKeyword = stemmer.stem(keyword);
            if (stemmedTokens.includes(stemmedKeyword) || query.toLowerCase().includes(keyword)) {
                intentScores[intent] += 1;
            }
        }
    }
    
    // Find the intent with the highest score
    let mainIntent = 'general';
    let maxScore = 0;
    
    for (const [intent, score] of Object.entries(intentScores)) {
        if (score > maxScore) {
            maxScore = score;
            mainIntent = intent;
        }
    }
    
    // Calculate confidence (simple version)
    const confidence = maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.3;
    
    return {
        mainIntent,
        confidence,
        allIntents: intentScores
    };
}

// Function to determine the appropriate model based on query complexity
function determineAppropriateModel(query, intent) {
    // Default to GPT-3.5 Turbo
    let model = 'gpt-3.5-turbo';
    
    // Check query complexity
    const queryLength = query.length;
    const tokenCount = tokenizer.tokenize(query).length;
    
    // Use more powerful model for complex queries
    if ((queryLength > 100 || tokenCount > 20) && 
        (intent.mainIntent === 'academic_record' || 
         intent.mainIntent === 'course_info' || 
         intent.confidence < 0.5)) {
        model = 'gpt-4'; // Use GPT-4 for complex queries if available
    }
    
    return model;
}

// Function to get personalized system prompt based on intent
function getPersonalizedSystemPrompt(intent, studentContext, additionalData) {
    let basePrompt = `You are an AI assistant for a student portal named "StudyBuddy". 
You help students with information about their academic records, attendance, courses, and other student-related queries.

The student's current information:
${JSON.stringify(studentContext, null, 2)}

Additional relevant data:
${JSON.stringify(additionalData, null, 2)}`;

    // Add intent-specific instructions
    switch (intent.mainIntent) {
        case 'academic_record':
            basePrompt += `\n\nYou are now focusing on the student's academic performance. When discussing grades or GPA:
- Be encouraging and supportive, regardless of performance
- Highlight improvements when possible
- Suggest specific resources for improvement if grades are low
- Congratulate achievements
- Be precise with numbers and calculations
- Explain academic policies clearly`;
            break;
            
        case 'attendance':
            basePrompt += `\n\nYou are now focusing on the student's attendance records. When discussing attendance:
- Be factual but not judgmental about attendance rates
- Explain attendance policies clearly
- Calculate remaining absences allowed before penalties
- Suggest ways to improve attendance if needed`;
            break;
            
        case 'course_info':
            basePrompt += `\n\nYou are now focusing on course information. When discussing courses:
- Provide detailed information about course content, prerequisites, and requirements
- Explain how courses fit into degree requirements
- Suggest complementary courses when relevant
- Be specific about deadlines and important dates`;
            break;
            
        case 'schedule':
            basePrompt += `\n\nYou are now focusing on scheduling information. When discussing schedules:
- Be precise about dates, times, and locations
- Highlight upcoming deadlines and important events
- Suggest time management strategies when appropriate
- Format schedule information in an easy-to-read way`;
            break;
            
        default:
            basePrompt += `\n\nWhen answering questions:
- Be helpful, concise, and accurate
- Use the specific data provided when available
- Provide general guidance for university policies or information not in the data
- Be friendly and supportive`;
    }
    
    return basePrompt;
}

// Function to post-process the response
function postProcessResponse(response, intent, studentContext) {
    // Add personalized greeting if it's not already there
    if (studentContext && studentContext.studentInfo && studentContext.studentInfo.name) {
        const studentName = studentContext.studentInfo.name.split(' ')[0]; // Get first name
        
        if (!response.includes(studentName) && Math.random() < 0.3) { // 30% chance to add name
            response = `${studentName}, ${response.charAt(0).toLowerCase()}${response.slice(1)}`;
        }
    }
    
    // Add relevant links for certain intents
    if (intent.mainIntent === 'academic_record') {
        response += '\n\nYou can view your complete academic record in the Results section of the portal.';
    } else if (intent.mainIntent === 'attendance') {
        response += '\n\nYou can view your detailed attendance records in the Attendance section of the portal.';
    }
    
    return response;
}

// Function to generate a session ID
function generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Endpoint to get chat history
router.get('/history/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const sessionId = req.query.sessionId;
        
        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }
        
        const history = await getChatHistory(studentId, sessionId);
        res.json(history);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// Endpoint to get chat sessions
router.get('/sessions/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        
        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }
        
        const [rows] = await pool.query(
            `SELECT DISTINCT session_id, 
                    MIN(created_at) as started_at, 
                    MAX(created_at) as last_message,
                    COUNT(*) as message_count
             FROM chat_history
             WHERE student_id = ?
             GROUP BY session_id
             ORDER BY last_message DESC`,
            [studentId]
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error fetching chat sessions:', error);
        res.status(500).json({ error: 'Failed to fetch chat sessions' });
    }
});

// Function to get student context from database
async function getStudentContext(studentId) {
    try {
        // Get basic student info
        const [studentRows] = await pool.query(
            'SELECT name, roll_number, branch, current_semester, cgpa FROM students WHERE student_id = ?',
            [studentId]
        );
        
        if (studentRows.length === 0) {
            return { error: 'Student not found' };
        }
        
        const studentInfo = studentRows[0];
        
        // Get attendance information
        const [attendanceRows] = await pool.query(
            `SELECT 
                a.course_id,
                c.course_name,
                a.semester,
                a.total_classes,
                a.attended_classes,
                ROUND((a.attended_classes / a.total_classes) * 100, 2) as attendance_percentage
             FROM attendance a
             JOIN courses c ON a.course_id = c.course_id
             WHERE a.student_id = ? AND a.total_classes > 0`,
            [studentId]
        );
        
        // Get recent results
        const [resultsRows] = await pool.query(
            `SELECT 
                r.course_id,
                c.course_name,
                r.grade,
                r.semester
             FROM results r
             JOIN courses c ON r.course_id = c.course_id
             WHERE r.student_id = ?
             ORDER BY r.semester DESC
             LIMIT 10`,
            [studentId]
        );
        
        // Get registered courses
        const [coursesRows] = await pool.query(
            `SELECT 
                rc.course_id,
                c.course_name,
                c.credits,
                c.department,
                rc.semester
             FROM registered_courses rc
             JOIN courses c ON rc.course_id = c.course_id
             WHERE rc.student_id = ?
             ORDER BY rc.semester DESC`,
            [studentId]
        );
        
        // Get semester-wise GPA
        const [semesterRows] = await pool.query(
            `SELECT 
                semester_number,
                sgpa
             FROM semester_records
             WHERE student_id = ?
             ORDER BY semester_number`,
            [studentId]
        );
        
        // Get upcoming deadlines and events
        const [upcomingEvents] = await pool.query(
            `SELECT * FROM academic_calendar 
             WHERE event_date >= CURDATE() 
             ORDER BY event_date 
             LIMIT 5`
        );
        
        return {
            studentInfo,
            attendance: attendanceRows,
            recentResults: resultsRows,
            registeredCourses: coursesRows,
            semesterRecords: semesterRows,
            upcomingEvents
        };
    } catch (error) {
        console.error('Error fetching student context:', error);
        return { error: 'Failed to fetch student context' };
    }
}

// Function to get chat history from database
async function getChatHistory(studentId, sessionId = null) {
    try {
        let query = `SELECT 
                message_type as role,
                message_content as content,
                created_at,
                session_id
             FROM chat_history
             WHERE student_id = ?`;
             
        const params = [studentId];
        
        if (sessionId) {
            query += ` AND session_id = ?`;
            params.push(sessionId);
        }
        
        query += ` ORDER BY created_at LIMIT 20`;
        
        const [rows] = await pool.query(query, params);
        
        // Format the rows to match OpenAI's expected format
        return rows.map(row => ({
            role: row.role === 'user' ? 'user' : 'assistant',
            content: row.content
        }));
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return [];
    }
}

// Function to store conversation in database
async function storeConversation(studentId, userMessage, aiResponse, sessionId = null, intent = 'general') {
    try {
        // Use provided session ID or generate a new one
        const chatSessionId = sessionId || generateSessionId();
        
        // Store user message
        await pool.query(
            `INSERT INTO chat_history 
             (student_id, message_type, message_content, session_id, intent) 
             VALUES (?, 'user', ?, ?, ?)`,
            [studentId, userMessage, chatSessionId, intent]
        );
        
        // Store AI response
        await pool.query(
            `INSERT INTO chat_history 
             (student_id, message_type, message_content, session_id, intent) 
             VALUES (?, 'assistant', ?, ?, ?)`,
            [studentId, aiResponse, chatSessionId, intent]
        );
        
        return chatSessionId;
    } catch (error) {
        console.error('Error storing conversation:', error);
    }
}

// Function to load relevant data based on the query and intent
async function loadRelevantData(query, intent) {
    const data = {
        courses: [],
        departments: [],
        academicCalendar: [],
        generalInfo: {},
        students: [],
        highestPerformers: {},
        attendanceRecords: {}
    };
    
    try {
        // Load ALL course data instead of limiting to 30
        const [courses] = await pool.query('SELECT * FROM courses');
        data.courses = courses;
        
        // Load department information
        const [departments] = await pool.query('SELECT * FROM departments');
        data.departments = departments;
        
        // Load ALL academic calendar events
        const [calendarEvents] = await pool.query('SELECT * FROM academic_calendar ORDER BY event_date');
        data.academicCalendar = calendarEvents;
        
        // Load top performers for each department and course
        const [topPerformers] = await pool.query(`
            SELECT s.student_id, s.name, s.branch, s.cgpa, s.current_semester
            FROM students s
            WHERE s.cgpa > 8.5
            ORDER BY s.cgpa DESC
            LIMIT 20
        `);
        data.highestPerformers.overall = topPerformers;
        
        // Load department-wise top performers
        const [deptToppers] = await pool.query(`
            SELECT s.student_id, s.name, s.branch, s.cgpa, s.current_semester
            FROM students s
            WHERE (s.branch, s.cgpa) IN (
                SELECT branch, MAX(cgpa)
                FROM students
                GROUP BY branch
            )
            ORDER BY s.cgpa DESC
        `);
        data.highestPerformers.departmentWise = deptToppers;
        
        // Load attendance thresholds and policies
        const [attendancePolicies] = await pool.query('SELECT * FROM attendance_policies');
        data.attendanceRecords.policies = attendancePolicies;
        
        // Load more detailed data based on intent
        switch (intent.mainIntent) {
            case 'academic_record':
                // Load ALL grading policies
                data.gradingPolicies = await loadCSVData('grading_policies.csv');
                
                // Load grade distribution statistics
                const [gradeStats] = await pool.query(`
                    SELECT course_id, grade, COUNT(*) as count
                    FROM results
                    GROUP BY course_id, grade
                    ORDER BY course_id, grade
                `);
                data.gradeStatistics = gradeStats;
                break;
                
            case 'attendance':
                // Load ALL attendance policies
                data.attendancePolicies = await loadCSVData('attendance_policies.csv');
                
                // Load course-specific attendance requirements
                const [courseAttendance] = await pool.query(`
                    SELECT course_id, minimum_attendance_percentage
                    FROM course_attendance_requirements
                `);
                data.courseAttendanceRequirements = courseAttendance;
                break;
                
            case 'course_info':
                // Extract course keywords from query
                const courseKeywords = extractCourseKeywords(query);
                
                // Load ALL course details regardless of keywords
                const [allCourseDetails] = await pool.query(`
                    SELECT c.*, p.prerequisite_course_id, pc.course_name as prerequisite_name
                    FROM courses c
                    LEFT JOIN prerequisites p ON c.course_id = p.course_id
                    LEFT JOIN courses pc ON p.prerequisite_course_id = pc.course_id
                `);
                data.allCourseDetails = allCourseDetails;
                
                // Load ALL syllabus data
                data.syllabus = await loadCSVData('syllabus.csv');
                
                // Load course evaluations and reviews
                const [courseReviews] = await pool.query(`
                    SELECT course_id, AVG(rating) as avg_rating, COUNT(*) as review_count
                    FROM course_reviews
                    GROUP BY course_id
                `);
                data.courseReviews = courseReviews;
                break;
                
            case 'schedule':
                // Load ALL exam schedules
                data.examSchedule = await loadCSVData('exam_schedule.csv');
                
                // Load class schedules
                const [classSchedules] = await pool.query(`
                    SELECT * FROM class_schedules
                    ORDER BY day_of_week, start_time
                `);
                data.classSchedules = classSchedules;
                break;
                
            case 'faculty':
                // Load ALL faculty information
                data.faculty = await loadCSVData('faculty.csv');
                
                // Load faculty office hours
                const [officeHours] = await pool.query(`
                    SELECT * FROM faculty_office_hours
                    ORDER BY faculty_id, day_of_week, start_time
                `);
                data.facultyOfficeHours = officeHours;
                break;
                
            case 'financial':
                // Load ALL fee structures and scholarship information
                data.feeStructure = await loadCSVData('fee_structure.csv');
                data.scholarships = await loadCSVData('scholarships.csv');
                
                // Load payment deadlines
                const [paymentDeadlines] = await pool.query(`
                    SELECT * FROM payment_deadlines
                    WHERE deadline >= CURDATE()
                    ORDER BY deadline
                `);
                data.paymentDeadlines = paymentDeadlines;
                break;
                
            case 'technical':
                // Load system status and maintenance schedules
                data.systemStatus = await loadCSVData('system_status.csv');
                data.maintenanceSchedule = await loadCSVData('maintenance_schedule.csv');
                break;
        }
        
        // Load ALL general information files
        const generalInfoFiles = [
            'university_info.csv',
            'faq.csv',
            'policies.csv',
            'academic_rules.csv',
            'campus_facilities.csv',
            'student_services.csv',
            'library_info.csv',
            'hostel_info.csv',
            'transportation.csv',
            'clubs_and_societies.csv',
            'career_services.csv',
            'health_services.csv',
            'sports_facilities.csv',
            'cafeteria_info.csv',
            'wifi_access.csv',
            'lab_facilities.csv',
            'printing_services.csv',
            'emergency_contacts.csv'
        ];
        
        for (const file of generalInfoFiles) {
            try {
                const fileData = await loadCSVData(file);
                if (fileData.length > 0) {
                    data.generalInfo[file.replace('.csv', '')] = fileData;
                }
            } catch (error) {
                // Skip if file doesn't exist
            }
        }
        
        return data;
    } catch (error) {
        console.error('Error loading relevant data:', error);
        return { error: 'Failed to load relevant data' };
    }
}

// Function to extract course keywords from query
function extractCourseKeywords(query) {
    // Common course prefixes and subjects
    const courseSubjects = [
        'math', 'physics', 'chemistry', 'biology', 'computer', 'science',
        'engineering', 'history', 'english', 'literature', 'economics',
        'psychology', 'sociology', 'philosophy', 'art', 'music',
        'database', 'programming', 'algorithm', 'network', 'system',
        'calculus', 'algebra', 'statistics', 'probability'
    ];
    
    const tokens = tokenizer.tokenize(query.toLowerCase());
    return tokens.filter(token => 
        courseSubjects.includes(token) || 
        /^[a-z]{2,4}\d{3,4}$/i.test(token) // Match course codes like CS101
    );
}

// Function to load data from CSV file
function loadCSVData(filename) {
    return new Promise((resolve, reject) => {
        const results = [];
        const filePath = path.join(DATA_FOLDER, filename);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            resolve([]);
            return;
        }
        
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                console.error(`Error reading CSV file ${filename}:`, error);
                resolve([]);
            });
    });
}

// Endpoint to get chatbot analytics
router.get('/analytics/:studentId?', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        let query = `
            SELECT 
                DATE(created_at) as date,
                intent,
                COUNT(*) as query_count
            FROM chat_history
            WHERE message_type = 'user'
        `;
        
        const params = [];
        if (studentId) {
            query += ` AND student_id = ?`;
            params.push(studentId);
        }
        
        query += ` GROUP BY DATE(created_at), intent
                  ORDER BY date DESC, query_count DESC
                  LIMIT 100`;
        
        const [rows] = await pool.query(query, params);
        
        res.json(rows);
    } catch (error) {
        console.error('Error fetching chatbot analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Endpoint to get feedback on chatbot responses
router.post('/feedback', async (req, res) => {
    try {
        const { studentId, messageId, rating, feedback } = req.body;
        
        if (!studentId || !messageId || !rating) {
            return res.status(400).json({ error: 'Student ID, message ID, and rating are required' });
        }
        
        await pool.query(
            `INSERT INTO chatbot_feedback 
             (student_id, message_id, rating, feedback_text) 
             VALUES (?, ?, ?, ?)`,
            [studentId, messageId, rating, feedback || null]
        );
        
        res.json({ success: true, message: 'Feedback recorded successfully' });
    } catch (error) {
        console.error('Error recording feedback:', error);
        res.status(500).json({ error: 'Failed to record feedback' });
    }
});

module.exports = router;