import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['second-hand', 'upcycled', 'surplus-food', 'reusable', 'waste-materials']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: [{
    type: String
  }],
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'for-parts'],
    default: 'good'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  location: {
    city: String,
    state: String,
    country: String
  },
  sdgGoals: [{
    type: Number,
    min: 1,
    max: 17
  }],
  environmentalImpact: {
    co2Saved: Number,
    wasteDiverted: Number,
    waterSaved: Number
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'reserved', 'inactive'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.index({ title: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;