// seeds/orderSeed.js
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/database');

const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');

const seedOrders = async () => {
  try {
    await connectDB();

    const tables = await Table.find({}).limit(10); // grab first 10 tables
    const menuItems = await MenuItem.find({}).limit(20); // first 20 menu items
    const users = await User.find({ role: 'customer' }).limit(5); // first 5 customers

    if (!tables.length || !menuItems.length) {
      console.log('⚠️ No tables or menu items found. Seed cannot proceed.');
      process.exit(1);
    }

    const ordersData = [];

    for (let i = 0; i < 10; i++) {
      // Random table
      const table = tables[Math.floor(Math.random() * tables.length)];

      // Random customer or guest
      const isGuest = Math.random() < 0.3; // 30% guest orders
      const customer = isGuest ? null : users[Math.floor(Math.random() * users.length)];

      // Random number of items
      const numItems = Math.floor(Math.random() * 3) + 1; // 1 to 3 items
      const items = [];

      for (let j = 0; j < numItems; j++) {
        const menuItem = menuItems[Math.floor(Math.random() * menuItems.length)];
        const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 qty

        items.push({
          menuItemId: menuItem._id,
          quantity,
          price: menuItem.price,
          note: Math.random() < 0.3 ? 'Extra spicy' : '' // random note
        });
      }

      // Random tax
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = +(subtotal * 0.1).toFixed(2); // 10% tax
      const total = +(subtotal + tax).toFixed(2);

      ordersData.push({
        tableId: table._id,
        customerId: customer ? customer._id : null,
        items,
        tax,
        subtotal,
        total,
        specialInstructions: Math.random() < 0.2 ? 'Please serve quickly' : '',
        paymentStatus: Math.random() < 0.8 ? 'paid' : 'pending',
        paymentMethod: ['cash', 'card', 'digital'][Math.floor(Math.random() * 3)]
      });
    }

    for (const order of ordersData) {
      const existingOrder = await Order.findOne({ orderNumber: order.orderNumber });
      if (!existingOrder) {
        await Order.create(order);
        console.log(`📌 Order created for table ${order.tableId}`);
      }
    }

    console.log('🎉 All orders seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error.message);
    process.exit(1);
  }
};

seedOrders();
