const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'student', 'teacher', 'admin'
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
