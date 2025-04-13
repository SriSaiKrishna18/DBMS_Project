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

// Get all assignments
router.get('/', async (req, res) => {
    try {
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data
        const assignmentsData = [
            { 
                id: 1,
                course_id: 'CS101',
                course_name: 'Introduction to Computer Science',
                title: 'Programming Basics Assignment',
                description: 'Implement a simple calculator program using the concepts learned in class.',
                due_date: '2023-05-10',
                marks: 20,
                status: 'Not Started'
            },
            { 
                id: 2,
                course_id: 'CS201',
                course_name: 'Data Structures',
                title: 'Linked List Implementation',
                description: 'Implement a doubly linked list with insertion, deletion, and traversal operations.',
                due_date: '2023-05-12',
                marks: 30,
                status: 'In Progress'
            },
            { 
                id: 3,
                course_id: 'CS301',
                course_name: 'Database Systems',
                title: 'Database Design Project',
                description: 'Design a database schema for a library management system and implement basic SQL queries.',
                due_date: '2023-05-15',
                marks: 40,
                status: 'Submitted',
                submission: {
                    submitted_date: '2023-05-05',
                    file_name: 'database_design.pdf',
                    file_url: '/submissions/database_design.pdf',
                    comments: 'Completed all requirements as specified.'
                }
            },
            { 
                id: 4,
                course_id: 'CS401',
                course_name: 'Artificial Intelligence',
                title: 'Search Algorithms Implementation',
                description: 'Implement BFS, DFS, and A* search algorithms for a given problem domain.',
                due_date: '2023-05-08',
                marks: 35,
                status: 'Graded',
                submission: {
                    submitted_date: '2023-05-01',
                    file_name: 'search_algorithms.zip',
                    file_url: '/submissions/search_algorithms.zip',
                    comments: 'Implemented all required algorithms.',
                    score: 32,
                    feedback: 'Excellent implementation of all algorithms. The A* heuristic could be more efficient.'
                }
            }
        ];
        
        res.json(assignmentsData);
    } catch (error) {
        console.error('Error fetching assignments data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get assignment by ID
router.get('/:id', async (req, res) => {
    try {
        const assignmentId = parseInt(req.params.id);
        
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data
        const assignmentsData = [
            { 
                id: 1,
                course_id: 'CS101',
                course_name: 'Introduction to Computer Science',
                title: 'Programming Basics Assignment',
                description: 'Implement a simple calculator program using the concepts learned in class. The calculator should support addition, subtraction, multiplication, and division operations. Bonus points for implementing additional features like memory functions or scientific operations.',
                due_date: '2023-05-10',
                marks: 20,
                status: 'Not Started'
            },
            { 
                id: 2,
                course_id: 'CS201',
                course_name: 'Data Structures',
                title: 'Linked List Implementation',
                description: 'Implement a doubly linked list with insertion, deletion, and traversal operations. Your implementation should include methods for adding elements at the beginning, end, and at a specific position. Also implement methods for removing elements and searching for a specific value.',
                due_date: '2023-05-12',
                marks: 30,
                status: 'In Progress'
            },
            { 
                id: 3,
                course_id: 'CS301',
                course_name: 'Database Systems',
                title: 'Database Design Project',
                description: 'Design a database schema for a library management system and implement basic SQL queries. The system should handle books, members, borrowing records, and staff information. Include at least 10 SQL queries that demonstrate various operations like insertion, deletion, updates, and complex joins.',
                due_date: '2023-05-15',
                marks: 40,
                status: 'Submitted',
                submission: {
                    submitted_date: '2023-05-05',
                    file_name: 'database_design.pdf',
                    file_url: '/submissions/database_design.pdf',
                    comments: 'Completed all requirements as specified.'
                }
            },
            { 
                id: 4,
                course_id: 'CS401',
                course_name: 'Artificial Intelligence',
                title: 'Search Algorithms Implementation',
                description: 'Implement BFS, DFS, and A* search algorithms for a given problem domain. The implementation should be able to solve the 8-puzzle problem efficiently. Compare the performance of these algorithms in terms of time complexity and space complexity.',
                due_date: '2023-05-08',
                marks: 35,
                status: 'Graded',
                submission: {
                    submitted_date: '2023-05-01',
                    file_name: 'search_algorithms.zip',
                    file_url: '/submissions/search_algorithms.zip',
                    comments: 'Implemented all required algorithms.',
                    score: 32,
                    feedback: 'Excellent implementation of all algorithms. The A* heuristic could be more efficient.'
                }
            }
        ];
        
        const assignment = assignmentsData.find(a => a.id === assignmentId);
        
        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }
        
        res.json(assignment);
    } catch (error) {
        console.error('Error fetching assignment data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit assignment
router.post('/:id/submit', async (req, res) => {
    try {
        const assignmentId = parseInt(req.params.id);
        const { comments } = req.body;
        
        // In a real app, you would update the database
        // For this demo, we'll just return success
        
        res.json({ 
            success: true, 
            message: 'Assignment submitted successfully',
            submission: {
                assignment_id: assignmentId,
                submitted_date: new Date().toISOString().split('T')[0],
                comments: comments || '',
                status: 'Submitted'
            }
        });
    } catch (error) {
        console.error('Error submitting assignment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;