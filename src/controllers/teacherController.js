import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      attributes: ['id', 'name', 'email', 'department'],
      where: {
        isActive: true
      },
      order: [['name', 'ASC']]
    });

    if (!teachers || teachers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No teachers found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teachers fetched successfully',
      data: teachers
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teachers',
      error: error.message
    });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['email', 'role']
      }]
    });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ message: 'Error fetching teacher' });
  }
};

// Create new teacher
export const createTeacher = async (req, res) => {
  try {
    const { name, email, phone, department, subjects, password } = req.body;

    // Create user account first
    const user = await User.create({
      email,
      password, // Password will be hashed by the User model
      role: 'teacher'
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      userId: user.id,
      name,
      email,
      phone,
      department,
      subjects
    });

    res.status(201).json(teacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating teacher' });
  }
};

// Update teacher
export const updateTeacher = async (req, res) => {
  try {
    const { name, email, phone, department, subjects, isActive } = req.body;
    const teacher = await Teacher.findByPk(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.update({
      name,
      email,
      phone,
      department,
      subjects,
      isActive
    });

    res.json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating teacher' });
  }
};

// Delete teacher (soft delete)
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    await teacher.destroy(); // This will perform a soft delete
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Error deleting teacher' });
  }
}; 