const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a product title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'food',
      'clothing',
      'electronics',
      'cosmetics',
      'home-goods',
      'books',
      'toys',
      'sports',
      'other'
    ],
  },
  images: [{
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  }],
  originalPrice: {
    type: Number,
    required: [true, 'Please provide original price'],
    min: [0, 'Price cannot be negative'],
  },
  discountedPrice: {
    type: Number,
    required: [true, 'Please provide discounted price'],
    min: [0, 'Price cannot be negative'],
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  unit: {
    type: String,
    enum: ['piece', 'kg', 'liter', 'box', 'pack'],
    default: 'piece',
  },
  expiryDate: {
    type: Date,
  },
  expiryType: {
    type: String,
    enum: ['near-expiry', 'overstock', 'seasonal', 'discontinued', 'other'],
    required: true,
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair'],
    default: 'new',
  },
  // Location
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  // Waste metrics
  estimatedWasteReduced: {
    type: Number,
    default: 0, // in kilograms per unit
  },
  estimatedCO2Saved: {
    type: Number,
    default: 0, // in kilograms per unit
  },
  // Ratings
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  // Featured listing (monetization)
  isFeatured: {
    type: Boolean,
    default: false,
  },
  featuredUntil: {
    type: Date,
  },
  // Sales metrics
  totalSold: {
    type: Number,
    default: 0,
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'sold-out', 'expired'],
    default: 'active',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Calculate discount percentage
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.discountedPrice) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.discountedPrice) / this.originalPrice) * 100
    );
  }
  next();
});

// Update status based on stock and expiry
productSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.status = 'sold-out';
  } else if (this.expiryDate && this.expiryDate < new Date()) {
    this.status = 'expired';
  }
  next();
});

// Indexes for better query performance
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ discountedPrice: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, status: 1 });

module.exports = mongoose.model('Product', productSchema);