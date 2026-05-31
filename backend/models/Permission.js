const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'view_courses', 'create_course', 'manage_users'
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Permission', PermissionSchema);
