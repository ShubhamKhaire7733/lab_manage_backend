import Role from '../models/Role.js';

export const checkStudentPermissions = async (req, res, next) => {
  try {
    // Default permissions for students
    const defaultPermissions = {
      viewOwnAttendance: true,
      viewOwnMarks: true,
      modifyData: false,
      accessOthersData: false
    };

    // Try to get the student role permissions
    let permissions = defaultPermissions;
    
    try {
      const studentRole = await Role.findOne({
        where: { role_name: 'Student' }
      });

      if (studentRole && studentRole.permissions) {
        permissions = studentRole.permissions;
      }
    } catch (error) {
      console.warn('Could not fetch role permissions, using defaults:', error.message);
      // Continue with default permissions
    }

    // Check if the route requires viewing own attendance
    if (req.path.includes('/attendance') && !permissions.viewOwnAttendance) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view attendance'
      });
    }

    // Check if the route requires viewing own marks
    if ((req.path.includes('/assessments') || req.path.includes('/performance')) && !permissions.viewOwnMarks) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view marks'
      });
    }

    // Check if the route requires modifying data
    if (req.method !== 'GET' && !permissions.modifyData) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify data'
      });
    }

    // Check if the route requires accessing others' data
    if (req.params.id && req.params.id !== req.user.id && !permissions.accessOthersData) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access others\' data'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking student permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 