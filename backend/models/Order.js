const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    image: String,
    wasteReduced: Number,
    co2Saved: Number,
  }],
  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'bank_transfer', 'mobile_money'],
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email: String,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  platformFee: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  // Environmental impact
  totalWasteReduced: {
    type: Number,
    default: 0,
  },
  totalCO2Saved: {
    type: Number,
    default: 0,
  },
  // Order status
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: Date,
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingNumber: String,
  // Reviews
  isReviewed: {
    type: Boolean,
    default: false,
  },
  // Cancellation
  isCancelled: {
    type: Boolean,
    default: false,
  },
  cancelledAt: Date,
  cancellationReason: String,
}, {
  timestamps: true,
});

// Calculate platform fee before saving
orderSchema.pre('save', function(next) {
  if (!this.platformFee) {
    const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION) / 100;
    this.platformFee = this.itemsPrice * commissionRate;
  }
  next();
});

// Indexes
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);