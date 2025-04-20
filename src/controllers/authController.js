import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import Role from '../models/Role.js';

export const register = async (req, res) => {
  try {
    const { email, password, role, department, phone, subjects, rollNumber, year, division, name } = req.body;
    
    console.log('Register request received:', { email, role, department, subjects });

    // Validate input data
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user account
    const user = await User.create({ email, password, role });
    console.log('User created successfully:', user.id);

    // If registering as a teacher, create teacher profile
    if (role === 'teacher') {
      // Validate teacher-specific fields
      if (!department) {
        await user.destroy(); // Rollback user creation
        return res.status(400).json({ message: 'Department is required for teacher registration' });
      }

      try {
        // Parse subjects if provided, otherwise use empty array
        let parsedSubjects = [];
        if (subjects) {
          // If subjects is already an array, use it as is
          if (Array.isArray(subjects)) {
            parsedSubjects = subjects;
          } 
          // If subjects is a string, try to parse it
          else if (typeof subjects === 'string' && subjects.trim()) {
            parsedSubjects = subjects.split(',').map(s => s.trim());
          }
        }

        // Create teacher profile
        const teacher = await Teacher.create({
          userId: user.id,
          name: name || email.split('@')[0], // Use provided name or email username
          email,
          department,
          phone: phone || null,
          subjects: parsedSubjects
        });

        console.log('Teacher profile created successfully:', teacher.id);

        res.status(201).json({ 
          message: 'Teacher registered successfully',
          userId: user.id,
          teacherId: teacher.id
        });
      } catch (teacherError) {
        console.error('Error creating teacher profile:', teacherError);
        // If teacher creation fails, delete the user and return error
        await user.destroy();
        throw teacherError;
      }
    } else if (role === 'student') {
      // Validate student-specific fields
      if (!rollNumber || !year || !division || !department) {
        await user.destroy(); // Rollback user creation
        return res.status(400).json({ 
          message: 'Roll number, year, division, and department are required for student registration' 
        });
      }

      try {
        // Create student profile
        const student = await Student.create({
          userId: user.id,
          name: name || email.split('@')[0], // Use provided name or email username
          email,
          rollNumber,
          year,
          division,
          department
        });

        console.log('Student profile created successfully:', student.id);

        res.status(201).json({ 
          message: 'Student registered successfully',
          userId: user.id,
          studentId: student.id
        });
      } catch (studentError) {
        console.error('Error creating student profile:', studentError);
        // If student creation fails, delete the user and return error
        await user.destroy();
        throw studentError;
      }
    } else {
      // For other roles (like admin), just return success
      res.status(201).json({ 
        message: 'User registered successfully',
        userId: user.id 
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email with student profile
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'rollNumber', 'name', 'year', 'division', 'department']
        },
        {
          model: Teacher,
          as: 'teacher',
          attributes: ['id', 'name', 'department']
        }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Get role permissions
    let permissions = {};
    try {
      const role = await Role.findOne({
        where: { role_name: user.role.toLowerCase() }
      });
      
      if (role && role.permissions) {
        permissions = typeof role.permissions === 'string' 
          ? JSON.parse(role.permissions) 
          : role.permissions;
      }
    } catch (error) {
      console.warn('Could not fetch role permissions:', error.message);
    }

    // Prepare token payload
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions
    };

    // Add role-specific data to token
    if (user.role === 'student' && user.student) {
      tokenPayload.studentId = user.student.id;
      tokenPayload.rollNumber = user.student.rollNumber;
      tokenPayload.name = user.student.name;
      tokenPayload.year = user.student.year;
      tokenPayload.division = user.student.division;
      tokenPayload.department = user.student.department;
    } else if (user.role === 'teacher' && user.teacher) {
      tokenPayload.teacherId = user.teacher.id;
      tokenPayload.name = user.teacher.name;
      tokenPayload.department = user.teacher.department;
    }

    // Generate token
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: tokenPayload.name,
        student: user.role === 'student' && user.student ? {
          id: user.student.id,
          rollNumber: user.student.rollNumber,
          name: user.student.name,
          year: user.student.year,
          division: user.student.division,
          department: user.student.department
        } : null,
        teacher: user.role === 'teacher' && user.teacher ? {
          id: user.teacher.id,
          name: user.teacher.name,
          department: user.teacher.department
        } : null,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // This will come from the auth middleware

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword; // This will be hashed by the User model's beforeUpdate hook
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // The user object is already attached to req by the authenticateToken middleware
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying token',
      error: error.message
    });
  }
}; 