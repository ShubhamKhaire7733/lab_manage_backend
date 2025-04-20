import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export default {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if the roles table exists
      const tableExists = await queryInterface.showAllTables()
        .then(tables => tables.includes('roles'));
      
      if (!tableExists) {
        // Create the roles table if it doesn't exist
        await queryInterface.createTable('roles', {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
          },
          role_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
          },
          permissions: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
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
      }

      // Update or insert Student role permissions
      const studentPermissions = {
        viewOwnAttendance: true,
        viewOwnMarks: true,
        modifyData: false,
        accessOthersData: false
      };

      // Check if the Student role exists
      const studentRole = await queryInterface.sequelize.query(
        'SELECT * FROM roles WHERE role_name = ?',
        {
          replacements: ['Student'],
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      );

      if (studentRole.length > 0) {
        // Update existing Student role
        await queryInterface.sequelize.query(
          'UPDATE roles SET permissions = ? WHERE role_name = ?',
          {
            replacements: [JSON.stringify(studentPermissions), 'Student'],
            type: queryInterface.sequelize.QueryTypes.UPDATE
          }
        );
        console.log('Updated Student role permissions');
      } else {
        // Insert new Student role
        await queryInterface.sequelize.query(
          'INSERT INTO roles (id, role_name, permissions, createdAt, updatedAt) VALUES (UUID(), ?, ?, NOW(), NOW())',
          {
            replacements: ['Student', JSON.stringify(studentPermissions)],
            type: queryInterface.sequelize.QueryTypes.INSERT
          }
        );
        console.log('Inserted new Student role with permissions');
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Migration failed:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove the Student role
      await queryInterface.sequelize.query(
        'DELETE FROM roles WHERE role_name = ?',
        {
          replacements: ['Student'],
          type: queryInterface.sequelize.QueryTypes.DELETE
        }
      );
      console.log('Removed Student role');
      return Promise.resolve();
    } catch (error) {
      console.error('Migration rollback failed:', error);
      return Promise.reject(error);
    }
  }
}; 