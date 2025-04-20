import sequelize from '../config/database.js';
import { QueryTypes } from 'sequelize';

const fixStudentTable = async () => {
  try {
    console.log('Starting to fix Student table...');
    
    // Check if the unique index already exists
    const [indexes] = await sequelize.query(
      "SHOW INDEX FROM Students WHERE Key_name = 'student_roll_number_unique'",
      { type: QueryTypes.SELECT }
    );
    
    if (indexes.length === 0) {
      // Create the unique index if it doesn't exist
      await sequelize.query(
        "ALTER TABLE Students ADD UNIQUE INDEX student_roll_number_unique (rollNumber)",
        { type: QueryTypes.RAW }
      );
      console.log('Added unique index on rollNumber column');
    } else {
      console.log('Unique index on rollNumber already exists');
    }
    
    console.log('Student table fixed successfully');
  } catch (error) {
    console.error('Error fixing Student table:', error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the script
fixStudentTable(); 