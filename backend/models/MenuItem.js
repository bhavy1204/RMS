const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuCategory',
    required: [true, 'Category is required']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  availability: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  allergens: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  preparationTime: {
    type: Number,
    default: 15,
    min: [1, 'Preparation time must be at least 1 minute']
  },
  calories: {
    type: Number,
    min: [0, 'Calories cannot be negative']
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  popularityScore: {
    type: Number,
    default: 0,
    min: [0, 'Popularity score cannot be negative']
  }
}, {
  timestamps: true
});

// Indexes for performance
menuItemSchema.index({ categoryId: 1, name: 1 });
menuItemSchema.index({ availability: 1 });
menuItemSchema.index({ tags: 1 });
menuItemSchema.index({ name: 'text', description: 'text', tags: 'text' });
menuItemSchema.index({ popularityScore: -1 });
menuItemSchema.index({ price: 1 });

// Virtual for category name
menuItemSchema.virtual('category', {
  ref: 'MenuCategory',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);

