const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: [true, 'Table is required']
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for guest orders
  },
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note cannot exceed 200 characters']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    }
  }],
  status: {
    type: String,
    enum: ['placed', 'preparing', 'ready', 'served', 'canceled'],
    default: 'placed'
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  orderNumber: {
    type: String,
    unique: true,
  },
  estimatedReadyTime: {
    type: Date,
    default: null
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: [500, 'Special instructions cannot exceed 500 characters']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'digital'],
    default: 'cash'
  }
}, {
  timestamps: true
});

// Indexes for performance
orderSchema.index({ tableId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
// orderSchema.index({ orderNumber: 1 });
// orderSchema.index({ customerId: 1 });
orderSchema.index({ 'items.menuItemId': 1 });

// Virtual for table information
orderSchema.virtual('table', {
  ref: 'Table',
  localField: 'tableId',
  foreignField: '_id',
  justOne: true
});

// Virtual for customer information
orderSchema.virtual('customer', {
  ref: 'User',
  localField: 'customerId',
  foreignField: '_id',
  justOne: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.total = this.subtotal + this.tax;
  next();
});

module.exports = mongoose.model('Order', orderSchema);

