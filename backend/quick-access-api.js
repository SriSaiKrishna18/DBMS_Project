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

// Get timetable data
router.get('/timetable', async (req, res) => {
    try {
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data
        const timetableData = [
            { day: 'Monday', time_slot: '09:00 - 10:30', course_code: 'CS101', course_name: 'Introduction to Computer Science', room: 'Room A101' },
            { day: 'Monday', time_slot: '11:00 - 12:30', course_code: 'CS201', course_name: 'Data Structures', room: 'Room B202' },
            { day: 'Tuesday', time_slot: '09:00 - 10:30', course_code: 'MATH101', course_name: 'Calculus I', room: 'Room C303' },
            { day: 'Wednesday', time_slot: '14:00 - 15:30', course_code: 'CS301', course_name: 'Database Systems', room: 'Lab 101' },
            { day: 'Thursday', time_slot: '11:00 - 12:30', course_code: 'CS401', course_name: 'Artificial Intelligence', room: 'Room D404' },
            { day: 'Friday', time_slot: '09:00 - 10:30', course_code: 'CS101', course_name: 'Introduction to Computer Science', room: 'Lab 202' }
        ];
        
        res.json(timetableData);
    } catch (error) {
        console.error('Error fetching timetable data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get exams data
router.get('/exams', async (req, res) => {
    try {
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data
        const examsData = [
            { 
                course_id: 'CS101', 
                course_name: 'Introduction to Computer Science', 
                date: '2023-05-15', 
                time: '09:00 - 11:00', 
                duration: 120, 
                venue: 'Exam Hall A', 
                type: 'Final Exam' 
            },
            { 
                course_id: 'CS201', 
                course_name: 'Data Structures', 
                date: '2023-05-18', 
                time: '14:00 - 16:00', 
                duration: 120, 
                venue: 'Exam Hall B', 
                type: 'Final Exam' 
            },
            { 
                course_id: 'MATH101', 
                course_name: 'Calculus I', 
                date: '2023-05-20', 
                time: '09:00 - 11:00', 
                duration: 120, 
                venue: 'Exam Hall C', 
                type: 'Final Exam' 
            }
        ];
        
        res.json(examsData);
    } catch (error) {
        console.error('Error fetching exams data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get events data
router.get('/events', async (req, res) => {
    try {
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data
        const eventsData = [
            { 
                title: 'Tech Symposium', 
                date: '2023-04-25', 
                time: '10:00 - 16:00', 
                venue: 'University Auditorium', 
                organizer: 'Computer Science Department',
                description: 'Annual technology symposium featuring guest speakers from leading tech companies.'
            },
            { 
                title: 'Career Fair', 
                date: '2023-05-05', 
                time: '09:00 - 17:00', 
                venue: 'University Sports Complex', 
                organizer: 'Career Services',
                description: 'Connect with potential employers and explore career opportunities.'
            }
        ];
        
        res.json(eventsData);
    } catch (error) {
        console.error('Error fetching events data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get messages data
router.get('/messages', async (req, res) => {
    try {
        // In a real app, you would fetch this from a database
        // For this demo, we'll return sample data
        const messagesData = [
            { 
                id: 1,
                subject: 'Assignment Deadline Extended', 
                sender: 'Dr. John Smith', 
                date: '2023-04-20', 
                content: 'The deadline for the CS101 final project has been extended to May 5th.',
                read: true
            },
            { 
                id: 2,
                subject: 'Lab Session Rescheduled', 
                sender: 'Dr. Emily Johnson', 
                date: '2023-04-22', 
                content: 'The CS201 lab session scheduled for April 25th has been moved to April 27th due to maintenance work in the lab.',
                read: false
            },
            { 
                id: 3,
                subject: 'Study Group Formation', 
                sender: 'Student Council', 
                date: '2023-04-23', 
                content: 'We are forming study groups for final exam preparation. If you are interested, please reply to this message.',
                read: false
            },
            { 
                id: 4,
                subject: 'Scholarship Opportunity', 
                sender: 'Financial Aid Office', 
                date: '2023-04-24', 
                content: 'New scholarship opportunities are available for the next academic year. Application deadline is June 15th.',
                read: false
            },
            { 
                id: 5,
                subject: 'Campus Event: Tech Talk', 
                sender: 'Events Committee', 
                date: '2023-04-25', 
                content: 'Join us for a tech talk by industry experts on "The Future of AI" on April 30th at 3 PM in the University Auditorium.',
                read: false
            }
        ];
        
        res.json(messagesData);
    } catch (error) {
        console.error('Error fetching messages data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;