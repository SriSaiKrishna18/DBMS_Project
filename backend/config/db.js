const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'student_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// For debugging
console.log('DB Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  // Don't log the full password for security
  password: process.env.DB_PASSWORD ? '******' : 'not set',
  database: process.env.DB_NAME
});

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};