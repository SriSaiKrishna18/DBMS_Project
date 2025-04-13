const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  let connection;

  try {
    // Create connection without database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('Connected to MySQL server');

    // Read and execute schema.sql
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf8'
    );
    
    console.log('Creating database and tables...');
    const schemaSQLStatements = schemaSQL.split(';').filter(statement => statement.trim());
    
    for (const statement of schemaSQLStatements) {
      if (statement.trim()) {
        await connection.query(statement + ';');
      }
    }
    
    console.log('Database and tables created successfully');

    // Read and execute sample_data.sql
    const sampleDataSQL = fs.readFileSync(
      path.join(__dirname, 'sample_data.sql'),
      'utf8'
    );
    
    console.log('Inserting sample data...');
    const sampleDataSQLStatements = sampleDataSQL.split(';').filter(statement => statement.trim());
    
    for (const statement of sampleDataSQLStatements) {
      if (statement.trim()) {
        await connection.query(statement + ';');
      }
    }
    
    console.log('Sample data inserted successfully');

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the initialization
initializeDatabase();