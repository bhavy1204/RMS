// seeds/menuItemSeed.js
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/database');

const MenuCategory = require('../models/MenuCategory');
const MenuItem = require('../models/MenuItem');

// Sample menu items for variety
const menuItemsData = [
  {
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce.',
    price: 8.99,
    categoryName: 'Main Course',
    imageUrl: 'https://example.com/images/cheeseburger.jpg',
    tags: ['beef', 'burger', 'classic'],
    allergens: ['dairy', 'gluten'],
    preparationTime: 20,
    calories: 650,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: 'Margherita Pizza',
    description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
    price: 10.5,
    categoryName: 'Main Course',
    imageUrl: 'https://example.com/images/margherita.jpg',
    tags: ['pizza', 'italian', 'cheese'],
    allergens: ['dairy', 'gluten'],
    preparationTime: 25,
    calories: 700,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with Caesar dressing, croutons, and parmesan.',
    price: 7.5,
    categoryName: 'Salads',
    imageUrl: 'https://example.com/images/caesar_salad.jpg',
    tags: ['salad', 'healthy', 'crunchy'],
    allergens: ['dairy', 'gluten', 'egg'],
    preparationTime: 10,
    calories: 350,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream.',
    price: 6.5,
    categoryName: 'Desserts',
    imageUrl: 'https://example.com/images/lava_cake.jpg',
    tags: ['dessert', 'chocolate', 'sweet'],
    allergens: ['dairy', 'gluten', 'egg'],
    preparationTime: 15,
    calories: 450,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    name: 'Fresh Orange Juice',
    description: 'Cold-pressed orange juice served chilled.',
    price: 3.5,
    categoryName: 'Beverages',
    imageUrl: 'https://example.com/images/orange_juice.jpg',
    tags: ['drink', 'juice', 'fresh'],
    allergens: [],
    preparationTime: 5,
    calories: 110,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: 'Vegan Buddha Bowl',
    description: 'Quinoa, chickpeas, avocado, roasted vegetables, and tahini dressing.',
    price: 9.99,
    categoryName: 'Main Course',
    imageUrl: 'https://example.com/images/buddha_bowl.jpg',
    tags: ['vegan', 'healthy', 'bowl'],
    allergens: ['sesame'],
    preparationTime: 18,
    calories: 550,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: true
  },
  {
    name: 'Buffalo Wings',
    description: 'Spicy chicken wings served with blue cheese dip.',
    price: 8.5,
    categoryName: 'Appetizers',
    imageUrl: 'https://example.com/images/buffalo_wings.jpg',
    tags: ['chicken', 'spicy', 'starter'],
    allergens: ['dairy'],
    preparationTime: 15,
    calories: 600,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  }
];

const seedMenuItems = async () => {
  try {
    await connectDB();

    for (const item of menuItemsData) {
      // Find category by name
      const category = await MenuCategory.findOne({ name: item.categoryName });
      if (!category) {
        console.log(`⚠️ Category "${item.categoryName}" not found for item "${item.name}". Skipping...`);
        continue;
      }

      // Check if item already exists
      const existingItem = await MenuItem.findOne({ name: item.name });
      if (existingItem) {
        console.log(`✅ Menu item "${item.name}" already exists. Skipping...`);
        continue;
      }

      // Create menu item
      const menuItem = new MenuItem({
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: category._id,
        imageUrl: item.imageUrl,
        tags: item.tags,
        allergens: item.allergens,
        preparationTime: item.preparationTime,
        calories: item.calories,
        isVegetarian: item.isVegetarian,
        isVegan: item.isVegan,
        isGlutenFree: item.isGlutenFree
      });

      await menuItem.save();
      console.log(`📌 Menu item "${menuItem.name}" created successfully!`);
    }

    console.log('🎉 All menu items seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding menu items:', error.message);
    process.exit(1);
  }
};

seedMenuItems();
