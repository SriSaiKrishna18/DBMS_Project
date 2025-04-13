// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const path = require('path');

// // Ensure the feedback directory exists
// const feedbackDir = path.join(__dirname, '../feedback');
// if (!fs.existsSync(feedbackDir)) {
//     fs.mkdirSync(feedbackDir);
// }

// // Handle feedback submission
// router.post('/api/feedback', (req, res) => {
//     try {
//         const feedback = req.body;
        
//         // Validate feedback data
//         if (!feedback.subject || !feedback.type || !feedback.message) {
//             return res.status(400).json({ error: 'Missing required fields' });
//         }
        
//         // Create a filename with timestamp
//         const timestamp = new Date().toISOString().replace(/:/g, '-');
//         const filename = `feedback_${feedback.student_id}_${timestamp}.json`;
//         const filepath = path.join(feedbackDir, filename);
        
//         // Write feedback to file
//         fs.writeFileSync(filepath, JSON.stringify(feedback, null, 2));
        
//         // Also append to a consolidated feedback file
//         const consolidatedPath = path.join(feedbackDir, 'all_feedback.json');
//         let allFeedback = [];
        
//         if (fs.existsSync(consolidatedPath)) {
//             const fileContent = fs.readFileSync(consolidatedPath, 'utf8');
//             allFeedback = JSON.parse(fileContent);
//         }
        
//         allFeedback.push(feedback);
//         fs.writeFileSync(consolidatedPath, JSON.stringify(allFeedback, null, 2));
        
//         res.status(200).json({ message: 'Feedback submitted successfully' });
//     } catch (error) {
//         console.error('Error saving feedback:', error);
//         res.status(500).json({ error: 'Failed to save feedback' });
//     }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { pool } = require('./config/db');

// Ensure the feedback directory exists (for backup)
const feedbackDir = path.join(__dirname, '../feedback');
if (!fs.existsSync(feedbackDir)) {
    fs.mkdirSync(feedbackDir);
}

// Handle feedback submission
router.post('/api/feedback', async (req, res) => {
    try {
        const feedback = req.body;
        
        // Validate feedback data
        if (!feedback.subject || !feedback.type || !feedback.message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Insert feedback into database
        await pool.query(
            'INSERT INTO feedback (student_id, subject, type, message) VALUES (?, ?, ?, ?)',
            [feedback.student_id, feedback.subject, feedback.type, feedback.message]
        );
        
        // Also save to file as backup
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const filename = `feedback_${feedback.student_id}_${timestamp}.json`;
        const filepath = path.join(feedbackDir, filename);
        
        fs.writeFileSync(filepath, JSON.stringify(feedback, null, 2));
        
        res.status(200).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
});

// Get all feedback (admin only)
router.get('/api/feedback', async (req, res) => {
    try {
        // In a real app, you would check if the user is an admin
        
        const [rows] = await pool.query(
            `SELECT f.*, s.name as student_name 
             FROM feedback f
             JOIN students s ON f.student_id = s.student_id
             ORDER BY f.timestamp DESC`
        );
        
        res.json(rows);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

module.exports = router;