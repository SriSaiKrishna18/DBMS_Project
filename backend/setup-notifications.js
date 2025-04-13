const fs = require('fs');
const path = require('path');
const { pool } = require('./config/db');

async function setupNotificationsTable() {
  try {
    console.log('Setting up notifications table...');
    
    // Read the SQL file
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'data', 'notifications_table.sql'), 
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
    
    console.log('Notifications table created successfully!');
  } catch (error) {
    console.error('Error setting up notifications table:', error);
  } finally {
    // Close the connection pool
    pool.end();
  }
}

setupNotificationsTable();