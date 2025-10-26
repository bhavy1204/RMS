const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('../config/database');

const User = require('../models/User');

const createAdminUser = async () => {
  try {
    await connectDB();

    const { name, email, password } = {
      name: process.argv[2] || 'Admin User',
      email: process.argv[3] || 'admin@restaurant.com',
      password: process.argv[4] || 'admin123'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists with this email');
      if (existingAdmin.role === 'admin') {
        console.log('User is already an admin');
        process.exit(0);
      } else {
        // Update existing user to admin
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('User upgraded to admin successfully');
        process.exit(0);
      }
    }

    // Hash password
    const passwordHash =  password;

    // Create admin user
    const admin = new User({
      name,
      email,
      passwordHash,
      role: 'admin',
      isActive: true
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', email);
    console.log('🔐 Password:', password);
    console.log('👤 Name:', name);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();

