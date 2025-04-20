import Role from '../models/Role.js';

export const checkAdminPermissions = async (req, res, next) => {
  try {
    // Always grant all permissions to admin users
    const permissions = {
      createBatches: true,
      assignTeachers: true,
      manageUsers: true,
      viewAllData: true,
      modifyAllData: true,
      viewOwnBatches: true,
      manageOwnBatches: true,
      viewOwnStudents: true,
      manageOwnStudents: true,
      viewOwnAssessments: true,
      manageOwnAssessments: true,
      viewOwnAttendance: true,
      viewOwnMarks: true,
      modifyData: true,
      accessOthersData: true
    };

    // Store permissions in request object for use in controllers
    req.adminPermissions = permissions;
    
    next();
  } catch (error) {
    console.error('Error checking admin permissions:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 