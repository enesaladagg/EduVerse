require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Role = require('./models/Role');
const Permission = require('./models/Permission');
const RolePermission = require('./models/RolePermission');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/online-egitim');
    console.log('MongoDB Connected for Seeding');

    // 1. Create Permissions
    await Permission.deleteMany();
    const permViewCourses = await Permission.create({ name: 'view_courses', description: 'Can view courses' });
    const permCreateCourses = await Permission.create({ name: 'create_courses', description: 'Can create courses' });
    const permManageUsers = await Permission.create({ name: 'manage_users', description: 'Can manage system users' });
    
    // 2. Create Roles
    await Role.deleteMany();
    const adminRole = await Role.create({ name: 'admin', description: 'System Administrator' });
    const teacherRole = await Role.create({ name: 'teacher', description: 'Course Teacher' });
    const studentRole = await Role.create({ name: 'student', description: 'Registered Student' });

    // 3. Assign Permissions to Roles (Role_Permissions table simulation)
    await RolePermission.deleteMany();
    // Admin gets all permissions
    await RolePermission.create({ role: adminRole._id, permission: permViewCourses._id });
    await RolePermission.create({ role: adminRole._id, permission: permCreateCourses._id });
    await RolePermission.create({ role: adminRole._id, permission: permManageUsers._id });
    // Teacher gets view and create courses
    await RolePermission.create({ role: teacherRole._id, permission: permViewCourses._id });
    await RolePermission.create({ role: teacherRole._id, permission: permCreateCourses._id });
    // Student gets only view courses
    await RolePermission.create({ role: studentRole._id, permission: permViewCourses._id });

    // 4. Create an Admin User
    await User.deleteMany();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword, // The schema will hash this again if we don't handle the pre-save hook, so we pass raw here and let schema hash it
      role: adminRole._id
    });
    
    // Fix: delete and recreate using raw password to trigger pre-save hook correctly
    await User.deleteMany();
    await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123',
      role: adminRole._id
    });

    console.log('Data Seeded Successfully!');
    console.log('Admin Email: admin@test.com');
    console.log('Admin Password: admin123');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
