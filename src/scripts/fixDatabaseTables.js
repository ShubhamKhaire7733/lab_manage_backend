import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

const fixDatabaseTables = async () => {
  try {
    console.log('Starting to fix database tables...');
    
    // 1. First, let's check all indexes on the Students table
    const studentIndexes = await sequelize.query(
      "SHOW INDEX FROM Students",
      { type: QueryTypes.SELECT }
    );
    
    console.log(`Found ${studentIndexes.length} indexes on Students table`);
    
    // 2. Remove unnecessary indexes from Students table
    // Keep only primary key and essential indexes
    for (const index of studentIndexes) {
      // Skip primary key index
      if (index.Key_name === 'PRIMARY') continue;
      
      // Remove the index
      await sequelize.query(
        `ALTER TABLE Students DROP INDEX ${index.Key_name}`,
        { type: QueryTypes.RAW }
      );
      console.log(`Removed index ${index.Key_name} from Students table`);
    }
    
    // 3. Add only essential indexes
    // Add unique index on rollNumber
    try {
      await sequelize.query(
        "ALTER TABLE Students ADD UNIQUE INDEX student_roll_number_unique (rollNumber)",
        { type: QueryTypes.RAW }
      );
      console.log('Added unique index on rollNumber column');
    } catch (error) {
      console.error('Error adding rollNumber index:', error.message);
    }
    
    // Add index on email
    try {
      await sequelize.query(
        "ALTER TABLE Students ADD UNIQUE INDEX student_email_unique (email)",
        { type: QueryTypes.RAW }
      );
      console.log('Added unique index on email column');
    } catch (error) {
      console.error('Error adding email index:', error.message);
    }
    
    // 4. Check and fix Assessment table
    const assessmentIndexes = await sequelize.query(
      "SHOW INDEX FROM Assessments",
      { type: QueryTypes.SELECT }
    );
    
    console.log(`Found ${assessmentIndexes.length} indexes on Assessments table`);
    
    // Remove unnecessary indexes from Assessment table
    for (const index of assessmentIndexes) {
      // Skip primary key index
      if (index.Key_name === 'PRIMARY') continue;
      
      // Remove the index
      await sequelize.query(
        `ALTER TABLE Assessments DROP INDEX ${index.Key_name}`,
        { type: QueryTypes.RAW }
      );
      console.log(`Removed index ${index.Key_name} from Assessments table`);
    }
    
    // Add only essential index for Assessment
    try {
      await sequelize.query(
        "ALTER TABLE Assessments ADD INDEX assessment_student_experiment_idx (studentRollNo, experimentNo)",
        { type: QueryTypes.RAW }
      );
      console.log('Added index on studentRollNo and experimentNo columns');
    } catch (error) {
      console.error('Error adding Assessment index:', error.message);
    }
    
    console.log('Database tables fixed successfully');
  } catch (error) {
    console.error('Error fixing database tables:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the script
fixDatabaseTables(); 