const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const RolePermission = require('../models/RolePermission');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      req.user = await User.findById(decoded.id).select('-password').populate('role');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

// Check if user's role is in the list of allowed roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: 'User role not found' });
    }
    
    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        message: `Bu işleme erişim yetkiniz yok. Gerekli roller: ${roles.join(', ')}`
      });
    }
    next();
  };
};

// New middleware to check specific permissions using the 4-table RBAC structure
exports.authorizePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ success: false, message: 'User role not found' });
      }

      // Find if there is a role-permission mapping
      // First populate the permission model
      const rolePermissions = await RolePermission.find({ role: req.user.role._id }).populate('permission');
      
      const hasPermission = rolePermissions.some(rp => rp.permission.name === requiredPermission);

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Bu işleme erişim yetkiniz yok. Gerekli izin: ${requiredPermission}`
        });
      }

      next();
    } catch (error) {
      console.error('Permission Check Error:', error);
      res.status(500).json({ success: false, message: 'Error checking permissions' });
    }
  };
};
