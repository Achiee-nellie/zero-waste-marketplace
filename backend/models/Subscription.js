const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    required: true,
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
  },
  stripePriceId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'past_due', 'incomplete'],
    default: 'active',
  },
  currentPeriodStart: {
    type: Date,
    required: true,
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false,
  },
  features: {
    maxListings: Number,
    featuredListings: Number,
    analytics: Boolean,
    prioritySupport: Boolean,
    customBranding: Boolean,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Subscription', subscriptionSchema);