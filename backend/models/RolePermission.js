const mongoose = require('mongoose');

// This acts as the junction table (Role_Permissions) requested
const RolePermissionSchema = new mongoose.Schema({
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  permission: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission', required: true }
}, { timestamps: true });

// Prevent duplicate role-permission pairs
RolePermissionSchema.index({ role: 1, permission: 1 }, { unique: true });

module.exports = mongoose.model('RolePermission', RolePermissionSchema);
