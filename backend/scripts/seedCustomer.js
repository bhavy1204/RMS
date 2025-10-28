const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = require('../config/database');
const User = require('../models/User');

const customers = [
  { name: 'Rohan Mehta', email: 'rohan.mehta@example.com', password: 'rohan123' },
  { name: 'Sneha Kapoor', email: 'sneha.kapoor@example.com', password: 'sneha123' },
  { name: 'Amit Sharma', email: 'amit.sharma@example.com', password: 'amit123' },
  { name: 'Priya Verma', email: 'priya.verma@example.com', password: 'priya123' },
  { name: 'Karan Singh', email: 'karan.singh@example.com', password: 'karan123' },
  { name: 'Anjali Rao', email: 'anjali.rao@example.com', password: 'anjali123' },
  { name: 'Vikram Patel', email: 'vikram.patel@example.com', password: 'vikram123' },
  { name: 'Meera Joshi', email: 'meera.joshi@example.com', password: 'meera123' },
  { name: 'Aditya Nair', email: 'aditya.nair@example.com', password: 'aditya123' },
  { name: 'Ritika Desai', email: 'ritika.desai@example.com', password: 'ritika123' },
];

const seedCustomers = async () => {
  try {
    await connectDB();

    for (const customerData of customers) {
      const { name, email, password } = customerData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`User already exists: ${email}`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create user
      const user = new User({
        name,
        email,
        passwordHash,
        role: 'customer',
        isActive: true
      });

      await user.save();
      console.log(`✅ Customer created: ${name} (${email})`);
    }

    console.log('\n🎉 All seed customers have been added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding customers:', error.message);
    process.exit(1);
  }
};

seedCustomers();
