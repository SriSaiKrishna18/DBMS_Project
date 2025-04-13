USE student_portal;

-- Create table for storing chat history
CREATE TABLE IF NOT EXISTS chat_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  message_type ENUM('user', 'assistant') NOT NULL,
  message_content TEXT NOT NULL,
  session_id VARCHAR(50) NOT NULL,
  intent VARCHAR(50) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_student_chat ON chat_history(student_id, created_at);
CREATE INDEX idx_session_id ON chat_history(session_id);