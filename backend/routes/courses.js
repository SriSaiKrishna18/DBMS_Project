const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

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

// Get all courses
router.get('/', async (req, res) => {
    try {
        const coursesData = await readCSV(path.join(__dirname, '..', 'data', 'updated_courses.csv'));
        res.json(coursesData);
    } catch (error) {
        console.error('Error fetching courses data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get course by ID
router.get('/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        const coursesData = await readCSV(path.join(__dirname, '..', 'data', 'updated_courses.csv'));
        const instructorData = await readCSV(path.join(__dirname, '..', 'data', 'course_instructor.csv'));
        
        const course = coursesData.find(c => c.course_id === courseId);
        
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        
        // Get instructor information
        const instructorInfo = instructorData.find(i => i.course_id === courseId);
        
        // Combine course and instructor data
        const courseDetails = {
            ...course,
            instructor_id: instructorInfo ? instructorInfo.instructor_id : null,
            instructor_name: instructorInfo ? instructorInfo.instructor_name : 'Not assigned',
            semester: instructorInfo ? instructorInfo.semester : 'Current'
        };
        
        res.json(courseDetails);
    } catch (error) {
        console.error('Error fetching course data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get course syllabus
router.get('/:id/syllabus', async (req, res) => {
    try {
        const courseId = req.params.id;
        
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data based on the course ID
        let syllabusData = [];
        
        if (courseId === 'CS101') {
            syllabusData = [
                { week: 1, topic: 'Introduction to Computing', description: 'History of computing, basic computer organization' },
                { week: 2, topic: 'Problem Solving', description: 'Algorithms, flowcharts, pseudocode' },
                { week: 3, topic: 'Programming Basics', description: 'Variables, data types, operators' },
                { week: 4, topic: 'Control Structures', description: 'Conditionals, loops, decision making' },
                { week: 5, topic: 'Functions', description: 'Function definition, parameters, return values' },
                { week: 6, topic: 'Arrays', description: 'Array declaration, initialization, operations' },
                { week: 7, topic: 'Strings', description: 'String manipulation, common string operations' },
                { week: 8, topic: 'File I/O', description: 'Reading from and writing to files' },
                { week: 9, topic: 'Pointers', description: 'Memory addresses, pointer operations' },
                { week: 10, topic: 'Structures', description: 'Custom data types, structure operations' },
                { week: 11, topic: 'Introduction to OOP', description: 'Classes, objects, encapsulation' },
                { week: 12, topic: 'Final Project', description: 'Implementation of a complete program' }
            ];
        } else if (courseId === 'CS201') {
            syllabusData = [
                { week: 1, topic: 'Introduction to Data Structures', description: 'Overview of data structures and their importance' },
                { week: 2, topic: 'Arrays and Linked Lists', description: 'Implementation and operations' },
                { week: 3, topic: 'Stacks and Queues', description: 'Implementation and applications' },
                { week: 4, topic: 'Trees', description: 'Binary trees, traversal algorithms' },
                { week: 5, topic: 'Binary Search Trees', description: 'Properties, operations, balancing' },
                { week: 6, topic: 'AVL Trees', description: 'Self-balancing trees, rotations' },
                { week: 7, topic: 'Heaps', description: 'Min-heaps, max-heaps, priority queues' },
                { week: 8, topic: 'Graphs', description: 'Representation, traversal algorithms' },
                { week: 9, topic: 'Hashing', description: 'Hash functions, collision resolution' },
                { week: 10, topic: 'Sorting Algorithms', description: 'Comparison-based and non-comparison-based sorting' },
                { week: 11, topic: 'Searching Algorithms', description: 'Linear search, binary search, interpolation search' },
                { week: 12, topic: 'Advanced Data Structures', description: 'Trie, B-tree, Red-Black tree' }
            ];
        } else if (courseId === 'CS301') {
            syllabusData = [
                { week: 1, topic: 'Introduction to Database Systems', description: 'Overview of database concepts' },
                { week: 2, topic: 'Relational Model', description: 'Relations, attributes, keys' },
                { week: 3, topic: 'SQL Basics', description: 'Data definition, manipulation, queries' },
                { week: 4, topic: 'Advanced SQL', description: 'Joins, subqueries, views' },
                { week: 5, topic: 'Database Design', description: 'ER diagrams, normalization' },
                { week: 6, topic: 'Normalization', description: '1NF, 2NF, 3NF, BCNF' },
                { week: 7, topic: 'Transaction Management', description: 'ACID properties, concurrency control' },
                { week: 8, topic: 'Indexing', description: 'B-trees, hash-based indexing' },
                { week: 9, topic: 'Query Processing', description: 'Query optimization, execution plans' },
                { week: 10, topic: 'NoSQL Databases', description: 'Document, key-value, column-family, graph databases' },
                { week: 11, topic: 'Data Warehousing', description: 'OLAP, data mining' },
                { week: 12, topic: 'Database Security', description: 'Authentication, authorization, encryption' }
            ];
        } else if (courseId === 'CS401') {
            syllabusData = [
                { week: 1, topic: 'Introduction to AI', description: 'History, applications, Turing test' },
                { week: 2, topic: 'Problem Solving by Search', description: 'State space, uninformed search' },
                { week: 3, topic: 'Informed Search', description: 'Heuristics, A* algorithm' },
                { week: 4, topic: 'Constraint Satisfaction Problems', description: 'Backtracking, forward checking' },
                { week: 5, topic: 'Game Playing', description: 'Minimax, alpha-beta pruning' },
                { week: 6, topic: 'Knowledge Representation', description: 'Logic, semantic networks' },
                { week: 7, topic: 'Machine Learning Basics', description: 'Supervised, unsupervised learning' },
                { week: 8, topic: 'Decision Trees', description: 'ID3 algorithm, pruning' },
                { week: 9, topic: 'Neural Networks', description: 'Perceptrons, backpropagation' },
                { week: 10, topic: 'Deep Learning', description: 'CNN, RNN, LSTM' },
                { week: 11, topic: 'Natural Language Processing', description: 'Parsing, sentiment analysis' },
                { week: 12, topic: 'Robotics and Computer Vision', description: 'Perception, planning, control' }
            ];
        } else if (courseId === 'MATH101') {
            syllabusData = [
                { week: 1, topic: 'Functions and Models', description: 'Functions, transformations, models' },
                { week: 2, topic: 'Limits and Derivatives', description: 'Definition, properties, rules' },
                { week: 3, topic: 'Differentiation Rules', description: 'Product, quotient, chain rules' },
                { week: 4, topic: 'Applications of Differentiation', description: 'Max/min problems, related rates' },
                { week: 5, topic: 'Integrals', description: 'Antiderivatives, definite integrals' },
                { week: 6, topic: 'Applications of Integration', description: 'Area, volume, work' },
                { week: 7, topic: 'Techniques of Integration', description: 'Substitution, parts, partial fractions' },
                { week: 8, topic: 'Improper Integrals', description: 'Infinite limits, infinite integrands' },
                { week: 9, topic: 'Sequences and Series', description: 'Convergence, divergence, tests' },
                { week: 10, topic: 'Power Series', description: 'Taylor series, Maclaurin series' },
                { week: 11, topic: 'Parametric Equations and Polar Coordinates', description: 'Curves, areas' },
                { week: 12, topic: 'Vector Calculus', description: 'Vectors, dot product, cross product' }
            ];
        }
        
        res.json(syllabusData);
    } catch (error) {
        console.error('Error fetching syllabus data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get course materials
router.get('/:id/materials', async (req, res) => {
    try {
        const courseId = req.params.id;
        
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data based on the course ID
        let materialsData = [];
        
        if (courseId === 'CS101') {
            materialsData = [
                { id: 1, title: 'Introduction to Programming', type: 'pdf', description: 'Lecture notes for week 1', url: '/materials/cs101/intro.pdf', date: '2023-01-15' },
                { id: 2, title: 'Problem Solving Techniques', type: 'pdf', description: 'Lecture notes for week 2', url: '/materials/cs101/problem_solving.pdf', date: '2023-01-22' },
                { id: 3, title: 'Programming Basics - Variables and Data Types', type: 'ppt', description: 'Presentation slides for week 3', url: '/materials/cs101/programming_basics.ppt', date: '2023-01-29' },
                { id: 4, title: 'Control Structures Tutorial', type: 'video', description: 'Video tutorial on if-else and loops', url: '/materials/cs101/control_structures.mp4', date: '2023-02-05' },
                { id: 5, title: 'Functions and Arrays', type: 'pdf', description: 'Lecture notes for weeks 5-6', url: '/materials/cs101/functions_arrays.pdf', date: '2023-02-12' }
            ];
        } else if (courseId === 'CS201') {
            materialsData = [
                { id: 1, title: 'Data Structures Overview', type: 'pdf', description: 'Lecture notes for week 1', url: '/materials/cs201/ds_overview.pdf', date: '2023-01-15' },
                { id: 2, title: 'Arrays and Linked Lists', type: 'pdf', description: 'Lecture notes for week 2', url: '/materials/cs201/arrays_linkedlists.pdf', date: '2023-01-22' },
                { id: 3, title: 'Stacks and Queues', type: 'video', description: 'Video tutorial on implementation', url: '/materials/cs201/stacks_queues.mp4', date: '2023-01-29' },
                { id: 4, title: 'Trees Implementation', type: 'code', description: 'Sample code for tree implementations', url: '/materials/cs201/trees.zip', date: '2023-02-05' },
                { id: 5, title: 'Graph Algorithms', type: 'pdf', description: 'Lecture notes on graph traversal', url: '/materials/cs201/graphs.pdf', date: '2023-02-12' }
            ];
        } else if (courseId === 'CS301') {
            materialsData = [
                { id: 1, title: 'Database Concepts', type: 'pdf', description: 'Introduction to database systems', url: '/materials/cs301/db_concepts.pdf', date: '2023-01-15' },
                { id: 2, title: 'SQL Basics', type: 'pdf', description: 'SQL commands and syntax', url: '/materials/cs301/sql_basics.pdf', date: '2023-01-22' },
                { id: 3, title: 'ER Diagrams', type: 'ppt', description: 'Entity-Relationship modeling', url: '/materials/cs301/er_diagrams.ppt', date: '2023-01-29' },
                { id: 4, title: 'Normalization Examples', type: 'pdf', description: 'Examples of database normalization', url: '/materials/cs301/normalization.pdf', date: '2023-02-05' },
                { id: 5, title: 'SQL Practice Problems', type: 'doc', description: 'Practice problems for SQL queries', url: '/materials/cs301/sql_practice.doc', date: '2023-02-12' }
            ];
        } else if (courseId === 'MATH101') {
            materialsData = [
                { id: 1, title: 'Functions and Models', type: 'pdf', description: 'Lecture notes for week 1', url: '/materials/math101/functions.pdf', date: '2023-01-15' },
                { id: 2, title: 'Limits and Derivatives', type: 'pdf', description: 'Lecture notes for week 2', url: '/materials/math101/limits.pdf', date: '2023-01-22' },
                { id: 3, title: 'Differentiation Rules', type: 'ppt', description: 'Presentation on differentiation techniques', url: '/materials/math101/diff_rules.ppt', date: '2023-01-29' },
                { id: 4, title: 'Practice Problems', type: 'doc', description: 'Practice problems for weeks 1-2', url: '/materials/math101/practice.doc', date: '2023-02-05' },
                { id: 5, title: 'Integration Techniques', type: 'pdf', description: 'Lecture notes on integration', url: '/materials/math101/integration.pdf', date: '2023-02-12' }
            ];
        }
        
        res.json(materialsData);
    } catch (error) {
        console.error('Error fetching materials data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get course assignments
router.get('/:id/assignments', async (req, res) => {
    try {
        const courseId = req.params.id;
        
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data based on the course ID
        let assignmentsData = [];
        
        if (courseId === 'CS101') {
            assignmentsData = [
                { 
                    id: 1,
                    title: 'Programming Basics Assignment',
                    description: 'Implement a simple calculator program using the concepts learned in class.',
                    due_date: '2023-05-10',
                    marks: 20,
                    status: 'Not Started'
                },
                { 
                    id: 2,
                    title: 'Control Structures Assignment',
                    description: 'Implement various control structures to solve given problems.',
                    due_date: '2023-05-20',
                    marks: 25,
                    status: 'Not Started'
                },
                { 
                    id: 3,
                    title: 'Functions and Arrays Assignment',
                    description: 'Create functions to manipulate arrays and solve problems.',
                    due_date: '2023-05-30',
                    marks: 30,
                    status: 'Not Started'
                }
            ];
        } else if (courseId === 'CS201') {
            assignmentsData = [
                { 
                    id: 4,
                    title: 'Linked List Implementation',
                    description: 'Implement a doubly linked list with insertion, deletion, and traversal operations.',
                    due_date: '2023-05-12',
                    marks: 30,
                    status: 'Not Started'
                },
                { 
                    id: 5,
                    title: 'Stack and Queue Implementation',
                    description: 'Implement stack and queue data structures and their operations.',
                    due_date: '2023-05-22',
                    marks: 30,
                    status: 'Not Started'
                },
                { 
                    id: 6,
                    title: 'Tree Traversal Algorithms',
                    description: 'Implement and compare different tree traversal algorithms.',
                    due_date: '2023-06-01',
                    marks: 40,
                    status: 'Not Started'
                }
            ];
        } else if (courseId === 'CS301') {
            assignmentsData = [
                { 
                    id: 7,
                    title: 'Database Design',
                    description: 'Design a database schema for a given scenario.',
                    due_date: '2023-05-15',
                    marks: 30,
                    status: 'Not Started'
                },
                { 
                    id: 8,
                    title: 'SQL Queries',
                    description: 'Write SQL queries to retrieve and manipulate data.',
                    due_date: '2023-05-25',
                    marks: 35,
                    status: 'Not Started'
                },
                { 
                    id: 9,
                    title: 'Normalization Exercise',
                    description: 'Normalize a given database schema to 3NF.',
                    due_date: '2023-06-05',
                    marks: 35,
                    status: 'Not Started'
                }
            ];
        } else if (courseId === 'MATH101') {
            assignmentsData = [
                { 
                    id: 10,
                    title: 'Limits and Derivatives',
                    description: 'Solve problems related to limits and derivatives.',
                    due_date: '2023-05-15',
                    marks: 25,
                    status: 'Not Started'
                },
                { 
                    id: 11,
                    title: 'Applications of Derivatives',
                    description: 'Solve real-world problems using derivatives.',
                    due_date: '2023-05-25',
                    marks: 30,
                    status: 'Not Started'
                },
                { 
                    id: 12,
                    title: 'Integration Techniques',
                    description: 'Apply various integration techniques to solve problems.',
                    due_date: '2023-06-05',
                    marks: 30,
                    status: 'Not Started'
                }
            ];
        }
        
        res.json(assignmentsData);
    } catch (error) {
        console.error('Error fetching assignments data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get course exams
router.get('/:id/exams', async (req, res) => {
    try {
        const courseId = req.params.id;
        
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data based on the course ID
        let examsData = [];
        
        if (courseId === 'CS101') {
            examsData = [
                { 
                    id: 1,
                    title: 'Midterm Exam',
                    description: 'Covers topics from weeks 1-6',
                    date: '2023-03-15',
                    time: '09:00 - 11:00',
                    duration: 120,
                    venue: 'Exam Hall A',
                    marks: 40
                },
                { 
                    id: 2,
                    title: 'Final Exam',
                    description: 'Comprehensive exam covering all topics',
                    date: '2023-05-20',
                    time: '14:00 - 17:00',
                    duration: 180,
                    venue: 'Exam Hall B',
                    marks: 60
                }
            ];
        } else if (courseId === 'CS201') {
            examsData = [
                { 
                    id: 3,
                    title: 'Midterm Exam',
                    description: 'Covers topics from weeks 1-6',
                    date: '2023-03-16',
                    time: '09:00 - 11:00',
                    duration: 120,
                    venue: 'Exam Hall C',
                    marks: 40
                },
                { 
                    id: 4,
                    title: 'Final Exam',
                    description: 'Comprehensive exam covering all topics',
                    date: '2023-05-21',
                    time: '14:00 - 17:00',
                    duration: 180,
                    venue: 'Exam Hall A',
                    marks: 60
                }
            ];
        } else if (courseId === 'CS301') {
            examsData = [
                { 
                    id: 5,
                    title: 'Midterm Exam',
                    description: 'Covers topics from weeks 1-6',
                    date: '2023-03-17',
                    time: '09:00 - 11:00',
                    duration: 120,
                    venue: 'Exam Hall B',
                    marks: 40
                },
                { 
                    id: 6,
                    title: 'Final Exam',
                    description: 'Comprehensive exam covering all topics',
                    date: '2023-05-22',
                    time: '14:00 - 17:00',
                    duration: 180,
                    venue: 'Exam Hall C',
                    marks: 60
                }
            ];
        } else if (courseId === 'MATH101') {
            examsData = [
                { 
                    id: 7,
                    title: 'Midterm Exam',
                    description: 'Covers topics from weeks 1-6',
                    date: '2023-03-18',
                    time: '09:00 - 11:00',
                    duration: 120,
                    venue: 'Exam Hall A',
                    marks: 40
                },
                { 
                    id: 8,
                    title: 'Final Exam',
                    description: 'Comprehensive exam covering all topics',
                    date: '2023-05-23',
                    time: '14:00 - 17:00',
                    duration: 180,
                    venue: 'Exam Hall B',
                    marks: 60
                }
            ];
        }
        
        res.json(examsData);
    } catch (error) {
        console.error('Error fetching exams data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get student grades for a course
router.get('/:id/grades/:studentId', async (req, res) => {
    try {
        const courseId = req.params.id;
        const studentId = req.params.studentId;
        
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data based on the course ID and student ID
        let gradesData = {
            course_id: courseId,
            student_id: studentId,
            assignments: [],
            exams: [],
            final_grade: null
        };
        
        if (courseId === 'CS101') {
            gradesData.assignments = [
                { id: 1, title: 'Programming Basics Assignment', score: 18, max_score: 20, weight: 10 },
                { id: 2, title: 'Control Structures Assignment', score: 22, max_score: 25, weight: 10 },
                { id: 3, title: 'Functions and Arrays Assignment', score: 27, max_score: 30, weight: 10 }
            ];
            gradesData.exams = [
                { id: 1, title: 'Midterm Exam', score: 35, max_score: 40, weight: 30 },
                { id: 2, title: 'Final Exam', score: 52, max_score: 60, weight: 40 }
            ];
            gradesData.final_grade = 'A-';
        } else if (courseId === 'CS201') {
            gradesData.assignments = [
                { id: 4, title: 'Linked List Implementation', score: 25, max_score: 30, weight: 10 },
                { id: 5, title: 'Stack and Queue Implementation', score: 28, max_score: 30, weight: 10 },
                { id: 6, title: 'Tree Traversal Algorithms', score: 35, max_score: 40, weight: 10 }
            ];
            gradesData.exams = [
                { id: 3, title: 'Midterm Exam', score: 32, max_score: 40, weight: 30 },
                { id: 4, title: 'Final Exam', score: 50, max_score: 60, weight: 40 }
            ];
            gradesData.final_grade = 'B+';
        } else if (courseId === 'CS301') {
            gradesData.assignments = [
                { id: 7, title: 'Database Design', score: 27, max_score: 30, weight: 10 },
                { id: 8, title: 'SQL Queries', score: 30, max_score: 35, weight: 10 },
                { id: 9, title: 'Normalization Exercise', score: 32, max_score: 35, weight: 10 }
            ];
            gradesData.exams = [
                { id: 5, title: 'Midterm Exam', score: 36, max_score: 40, weight: 30 },
                { id: 6, title: 'Final Exam', score: 54, max_score: 60, weight: 40 }
            ];
            gradesData.final_grade = 'A';
        } else if (courseId === 'MATH101') {
            gradesData.assignments = [
                { id: 10, title: 'Limits and Derivatives', score: 20, max_score: 25, weight: 10 },
                { id: 11, title: 'Applications of Derivatives', score: 25, max_score: 30, weight: 10 },
                { id: 12, title: 'Integration Techniques', score: 24, max_score: 30, weight: 10 }
            ];
            gradesData.exams = [
                { id: 7, title: 'Midterm Exam', score: 30, max_score: 40, weight: 30 },
                { id: 8, title: 'Final Exam', score: 48, max_score: 60, weight: 40 }
            ];
            gradesData.final_grade = 'B';
        }
        
        res.json(gradesData);
    } catch (error) {
        console.error('Error fetching grades data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit assignment
router.post('/:id/assignments/:assignmentId/submit', async (req, res) => {
    try {
        const courseId = req.params.id;
        const assignmentId = req.params.assignmentId;
        const { studentId, fileUrl, comments } = req.body;
        
        // In a real app, you would save this to a database
        // For this demo, we'll just return a success response
        
        res.json({
            success: true,
            message: 'Assignment submitted successfully',
            data: {
                course_id: courseId,
                assignment_id: assignmentId,
                student_id: studentId,
                file_url: fileUrl,
                comments: comments,
                submitted_date: new Date().toISOString(),
                status: 'Submitted'
            }
        });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get course announcements
router.get('/:id/announcements', async (req, res) => {
    try {
        const courseId = req.params.id;
        
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data based on the course ID
        let announcementsData = [];
        
        if (courseId === 'CS101') {
            announcementsData = [
                { 
                    id: 1,
                    title: 'Welcome to CS101',
                    content: 'Welcome to Introduction to Computer Science! Please review the syllabus and course materials.',
                    date: '2023-01-10',
                    author: 'Dr. John Smith'
                },
                { 
                    id: 2,
                    title: 'Assignment 1 Posted',
                    content: 'The first assignment has been posted. Please check the assignments section.',
                    date: '2023-01-20',
                    author: 'Dr. John Smith'
                },
                { 
                    id: 3,
                    title: 'Office Hours Change',
                    content: 'My office hours will be changed to Tuesdays and Thursdays from 2-4 PM starting next week.',
                    date: '2023-02-01',
                    author: 'Dr. John Smith'
                }
            ];
        } else if (courseId === 'CS201') {
            announcementsData = [
                { 
                    id: 4,
                    title: 'Welcome to Data Structures',
                    content: 'Welcome to Data Structures! Please review the syllabus and course materials.',
                    date: '2023-01-10',
                    author: 'Dr. Emily Johnson'
                },
                { 
                    id: 5,
                    title: 'Lab Sessions',
                    content: 'Lab sessions will start from next week. Please check the schedule.',
                    date: '2023-01-15',
                    author: 'Dr. Emily Johnson'
                },
                { 
                    id: 6,
                    title: 'Midterm Exam Date',
                    content: 'The midterm exam will be held on March 16th. More details will be provided soon.',
                    date: '2023-02-10',
                    author: 'Dr. Emily Johnson'
                }
            ];
        } else if (courseId === 'CS301') {
            announcementsData = [
                { 
                    id: 7,
                    title: 'Welcome to Database Systems',
                    content: 'Welcome to Database Systems! Please review the syllabus and course materials.',
                    date: '2023-01-10',
                    author: 'Dr. Michael Brown'
                },
                { 
                    id: 8,
                    title: 'Database Software',
                    content: 'Please install MySQL and MySQL Workbench for our lab sessions.',
                    date: '2023-01-15',
                    author: 'Dr. Michael Brown'
                },
                { 
                    id: 9,
                    title: 'Guest Lecture',
                    content: 'We will have a guest lecture on NoSQL databases on February 20th.',
                    date: '2023-02-05',
                    author: 'Dr. Michael Brown'
                }
            ];
        } else if (courseId === 'MATH101') {
            announcementsData = [
                { 
                    id: 10,
                    title: 'Welcome to Calculus I',
                    content: 'Welcome to Calculus I! Please review the syllabus and course materials.',
                    date: '2023-01-10',
                    author: 'Dr. Robert Chen'
                },
                { 
                    id: 11,
                    title: 'Textbook Information',
                    content: 'The required textbook is available in the university bookstore.',
                    date: '2023-01-12',
                    author: 'Dr. Robert Chen'
                },
                { 
                    id: 12,
                    title: 'Study Groups',
                    content: 'I encourage you to form study groups for this course. Please use the discussion forum to find group members.',
                    date: '2023-01-20',
                    author: 'Dr. Robert Chen'
                }
            ];
        }
        
        res.json(announcementsData);
    } catch (error) {
        console.error('Error fetching announcements data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;