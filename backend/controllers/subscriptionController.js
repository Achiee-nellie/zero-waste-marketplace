const stripe = require('../config/stripe');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Subscription plans
const PLANS = {
  basic: {
    name: 'Basic',
    price: 2900, // $29 in cents
    priceId: 'price_basic',
    features: {
      maxListings: 50,
      featuredListings: 5,
      analytics: false,
      prioritySupport: false,
      customBranding: false,
    },
  },
  premium: {
    name: 'Premium',
    price: 5900, // $59 in cents
    priceId: 'price_premium',
    features: {
      maxListings: 200,
      featuredListings: 20,
      analytics: true,
      prioritySupport: true,
      customBranding: false,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 9900, // $99 in cents
    priceId: 'price_enterprise',
    features: {
      maxListings: Infinity,
      featuredListings: 50,
      analytics: true,
      prioritySupport: true,
      customBranding: true,
    },
  },
};

// @desc    Create subscription
// @route   POST /api/subscriptions
// @access  Private/Seller
exports.createSubscription = async (req, res, next) => {
  try {
    const { plan, paymentMethodId } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan',
      });
    }

    // Create or retrieve Stripe customer
    let customerId = req.user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      customerId = customer.id;
      
      await User.findByIdAndUpdate(req.user.id, {
        stripeCustomerId: customerId,
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: PLANS[plan].priceId }],
      payment_settings: {
        payment_method_types: ['card'],
      },
      expand: ['latest_invoice.payment_intent'],
    });

    // Save subscription to database
    const newSubscription = await Subscription.create({
      user: req.user.id,
      plan,
      stripeSubscriptionId: subscription.id,
      stripePriceId: PLANS[plan].priceId,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      features: PLANS[plan].features,
    });

    // Update user subscription
    await User.findByIdAndUpdate(req.user.id, {
      'subscription.plan': plan,
      'subscription.status': 'active',
      'subscription.startDate': new Date(subscription.current_period_start * 1000),
      'subscription.endDate': new Date(subscription.current_period_end * 1000),
      'subscription.stripeSubscriptionId': subscription.id,
    });

    res.status(201).json({
      success: true,
      data: newSubscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current subscription
// @route   GET /api/subscriptions/current
// @access  Private/Seller
exports.getCurrentSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: 'active',
    });

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private/Seller
exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Cancel at period end
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    subscription.cancelAtPeriodEnd = true;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: 'Subscription will be cancelled at period end',
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subscription
// @route   PUT /api/subscriptions/:id
// @access  Private/Seller
exports.updateSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    if (subscription.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Update Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    const updatedSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: PLANS[plan].priceId,
          },
        ],
      }
    );

    // Update database
    subscription.plan = plan;
    subscription.stripePriceId = PLANS[plan].priceId;
    subscription.features = PLANS[plan].features;
    await subscription.save();

    await User.findByIdAndUpdate(req.user.id, {
      'subscription.plan': plan,
    });

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};