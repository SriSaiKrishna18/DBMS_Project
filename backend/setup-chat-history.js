const fs = require('fs');
const path = require('path');
const { pool } = require('./config/db');

async function setupChatHistoryTable() {
  try {
    console.log('Setting up chat history table...');
    
    // Read the SQL file
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'data', 'chat_history_table.sql'), 
      'utf8'
    );
    
    // Split the script into individual statements
    const statements = sqlScript
      .split(';')
      .filter(statement => statement.trim() !== '');
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
      }
    }
    
    console.log('Chat history table created successfully!');
  } catch (error) {
    console.error('Error setting up chat history table:', error);
  } finally {
    // Close the connection pool
    pool.end();
  }
}

setupChatHistoryTable();