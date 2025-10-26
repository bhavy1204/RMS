const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/database');
const Table = require('../models/Table');

const tables = [
  { number: 'T1', capacity: 4, location: 'Main Dining' },
  { number: 'T2', capacity: 4, location: 'Main Dining' },
  { number: 'T3', capacity: 2, location: 'Patio' },
  { number: 'T4', capacity: 6, location: 'Main Dining' },
  { number: 'T5', capacity: 4, location: 'Patio' },
  { number: 'T6', capacity: 8, location: 'VIP Room' },
  { number: 'T7', capacity: 2, location: 'Main Dining' },
  { number: 'T8', capacity: 4, location: 'Patio' },
  { number: 'T9', capacity: 6, location: 'VIP Room' },
  { number: 'T10', capacity: 4, location: 'Main Dining' },
];

const seedTables = async () => {
  try {
    await connectDB();

    for (const tableData of tables) {
      const { number, capacity, location } = tableData;

      // Check if table already exists
      const existingTable = await Table.findOne({ number });
      if (existingTable) {
        console.log(`Table already exists: ${number}`);
        continue;
      }

      // Create table
      const table = new Table({
        number,
        capacity,
        location
        // qrSlug will be generated automatically by pre-save hook
      });

      await table.save();
      console.log(`✅ Table created: ${number} (Capacity: ${capacity}, Location: ${location})`);
    }

    console.log('\n🎉 All seed tables have been added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding tables:', error.message);
    process.exit(1);
  }
};

seedTables();
