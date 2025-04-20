import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  // Drop the existing table
  await queryInterface.dropTable('TeacherSubjectBatches');

  // Create the table with the correct constraints
  await queryInterface.createTable('TeacherSubjectBatches', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Teachers',
        key: 'id'
      }
    },
    subjectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Subjects',
        key: 'id'
      }
    },
    batchId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Batches',
        key: 'id'
      }
    },
    division: {
      type: DataTypes.STRING,
      allowNull: false
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  // Add the unique constraint
  await queryInterface.addIndex('TeacherSubjectBatches', {
    fields: ['teacherId', 'subjectId', 'batchId', 'division', 'academicYear'],
    unique: true,
    name: 'tsb_unique_allocation'
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('TeacherSubjectBatches');
} 