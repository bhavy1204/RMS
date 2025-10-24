const mongoose = require('mongoose');

const menuCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  displayOrder: {
    type: Number,
    required: [true, 'Display order is required'],
    min: [0, 'Display order must be non-negative']
  },
  active: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for performance
menuCategorySchema.index({ displayOrder: 1 });
menuCategorySchema.index({ active: 1 });
menuCategorySchema.index({ name: 1 });

// Virtual for item count
menuCategorySchema.virtual('itemCount', {
  ref: 'MenuItem',
  localField: '_id',
  foreignField: 'categoryId',
  count: true
});

module.exports = mongoose.model('MenuCategory', menuCategorySchema);

