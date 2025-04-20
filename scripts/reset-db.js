import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

async function resetDatabase() {
  try {
    // Create connection to MySQL server
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'lab_management';

    // Drop database if exists and create new one
    await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
    await connection.query(`CREATE DATABASE ${dbName}`);
    
    // Use the database
    await connection.query(`USE ${dbName}`);

    console.log('Database reset successfully');

    // Create Users table
    await connection.query(`
      CREATE TABLE Users (
        id CHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'student',
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        deletedAt DATETIME
      )
    `);
    console.log('Users table created');

    // Create Teachers table
    await connection.query(`
      CREATE TABLE Teachers (
        id CHAR(36) PRIMARY KEY,
        userId CHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(15),
        department VARCHAR(255) NOT NULL,
        subjects JSON,
        isActive BOOLEAN NOT NULL DEFAULT true,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        deletedAt DATETIME,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    console.log('Teachers table created');

    // Create Assessments table
    await connection.query(`
      CREATE TABLE Assessments (
        id CHAR(36) PRIMARY KEY,
        studentRollNo VARCHAR(255) NOT NULL,
        experimentNo INT NOT NULL,
        scheduledPerformanceDate DATETIME,
        actualPerformanceDate DATETIME,
        scheduledSubmissionDate DATETIME,
        actualSubmissionDate DATETIME,
        rppMarks INT,
        spoMarks INT,
        assignmentMarks INT,
        finalAssignmentMarks INT,
        unitTest1Marks INT,
        unitTest2Marks INT,
        unitTest3Marks INT,
        convertedUnitTestMarks FLOAT,
        testMarks INT,
        theoryAttendanceMarks INT,
        finalMarks FLOAT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        deletedAt DATETIME,
        INDEX idx_studentRollNo (studentRollNo),
        INDEX idx_experimentNo (experimentNo)
      )
    `);
    console.log('Assessments table created');

    // Create indexes
    await connection.query('CREATE INDEX idx_email ON Users(email)');
    await connection.query('CREATE INDEX idx_teacher_email ON Teachers(email)');
    await connection.query('CREATE INDEX idx_teacher_userId ON Teachers(userId)');

    console.log('All tables and indexes created successfully');

    // Close connection
    await connection.end();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetDatabase(); 