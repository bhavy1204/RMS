// seeds/categorySeed.js
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/database');
const MenuCategory = require('../models/MenuCategory');

const categories = [
  {
    name: 'Appetizers',
    displayOrder: 1,
    description: 'Start your meal with something light and tasty.',
    imageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
  },
  {
    name: 'Salads',
    displayOrder: 2,
    description: 'Fresh and healthy salads for every appetite.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
  },
  {
    name: 'Main Course',
    displayOrder: 3,
    description: 'Delicious main dishes to satisfy your hunger.',
    imageUrl: 'https://images.unsplash.com/photo-1625862577363-1c5e5a0f0e43?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
  },
  {
    name: 'Beverages',
    displayOrder: 4,
    description: 'Quench your thirst with our refreshing drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2157'
  },
  {
    name: 'Desserts',
    displayOrder: 5,
    description: 'Sweet treats to end your meal on a high note.',
    imageUrl: 'https://images.unsplash.com/photo-1710629622520-e5ee8b5796a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
  },
  {
    name: 'Specials',
    displayOrder: 6,
    description: 'Chef’s specials and seasonal delights.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1663054953253-c11113f14d87?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'
  }
];

const seedCategories = async () => {
  try {
    await connectDB();

    for (const categoryData of categories) {
      const existing = await MenuCategory.findOne({ name: categoryData.name });
      if (existing) {
        console.log(`✅ Category "${categoryData.name}" already exists. Skipping...`);
        continue;
      }

      const category = new MenuCategory(categoryData);
      await category.save();
      console.log(`📌 Category "${category.name}" created successfully!`);
    }

    console.log('🎉 All categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
    process.exit(1);
  }
};

seedCategories();
