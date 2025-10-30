const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'Table number is required'],
    unique: true,
    trim: true
  },
  qrSlug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  activeSessionId: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    default: 4,
    min: [1, 'Capacity must be at least 1'],
    max: [20, 'Capacity cannot exceed 20']
  },
  location: {
    type: String,
    trim: true,
    default: 'Main Dining'
  }
}, {
  timestamps: true
});

// Indexes for performance
// tableSchema.index({ qrSlug: 1 });
// tableSchema.index({ number: 1 });
tableSchema.index({ isActive: 1 });

// Generate QR slug before saving
tableSchema.pre('save', function(next) {
   console.log('>> Pre-save hook running for:', this.number); 
  if (!this.qrSlug) {
    this.qrSlug = `table-${this.number.toLowerCase().replace(/\s+/g, '-')}`;
  }
  next();
});

module.exports = mongoose.model('Table', tableSchema);

