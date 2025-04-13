USE student_portal;

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NULL, -- NULL means it's for all students
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT 0,
    notification_type VARCHAR(50) DEFAULT 'general',
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_notifications_student ON notifications(student_id, created_at);

-- Insert some sample notifications
INSERT INTO notifications (student_id, title, message, notification_type) VALUES
(NULL, 'University Holiday', 'The university will be closed on October 2nd for Gandhi Jayanti.', 'announcement'),
(NULL, 'Exam Schedule Released', 'The end semester examination schedule has been released. Please check the academic calendar.', 'academic'),
(NULL, 'Library Notice', 'All borrowed books must be returned by the end of the semester.', 'library');