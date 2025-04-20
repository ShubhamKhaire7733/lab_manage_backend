import jwt from 'jsonwebtoken';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log('Auth middleware: Checking authorization header');
    console.log('Auth middleware: Headers:', req.headers);
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Auth middleware: No token found in request');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    console.log('Auth middleware: Token found, length:', token.length);
    console.log('Auth middleware: Verifying token');
    
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Auth middleware: Token verified successfully');
    console.log('Auth middleware: User data:', verified);
    
    req.user = verified;
    console.log('Auth middleware: User attached to request:', req.user);
    
    next();
  } catch (error) {
    console.error('Auth middleware: Token verification failed:', error.message);
    console.error('Auth middleware: Error details:', error);
    res.status(401).json({ 
      message: 'Token verification failed, authorization denied',
      error: error.message
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  console.log('Admin authorization middleware: Checking admin role');
  console.log('Admin authorization middleware: User role:', req.user?.role);
  
  if (!req.user) {
    console.log('Admin authorization middleware: No user found in request');
    return res.status(401).json({ message: 'No user found in request' });
  }

  if (req.user.role !== 'admin') {
    console.log('Admin authorization middleware: User is not an admin');
    return res.status(403).json({ 
      message: 'Access denied: admin privileges required',
      userRole: req.user.role
    });
  }

  console.log('Admin authorization middleware: User is authorized as admin');
  next();
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    console.log('Role check middleware: Checking roles:', roles);
    console.log('Role check middleware: User role:', req.user?.role);
    
    if (!req.user) {
      console.log('Role check middleware: No user found in request');
      return res.status(401).json({ message: 'No user found in request' });
    }

    if (!roles.includes(req.user.role)) {
      console.log('Role check middleware: User role not authorized');
      return res.status(403).json({ 
        message: 'Access denied: insufficient permissions',
        requiredRoles: roles,
        userRole: req.user.role
      });
    }

    console.log('Role check middleware: User role authorized');
    next();
  };
};