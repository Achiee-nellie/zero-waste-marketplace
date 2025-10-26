const stripe = require('../config/stripe');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is the buyer
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id,
      },
    });

    // Create payment record
    await Payment.create({
      order: orderId,
      user: req.user.id,
      stripePaymentId: paymentIntent.id,
      amount: order.totalPrice,
      status: 'pending',
      paymentMethod: order.paymentMethod,
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
exports.handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};

// Helper function to handle successful payment
const handlePaymentSuccess = async (paymentIntent) => {
  const payment = await Payment.findOne({
    stripePaymentId: paymentIntent.id,
  });

  if (payment) {
    payment.status = 'succeeded';
    await payment.save();

    const order = await Order.findById(payment.order);
    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'confirmed';
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
    };
    await order.save();

    // Update product stock and metrics
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      product.totalSold += item.quantity;
      product.totalRevenue += item.price * item.quantity;
      if (product.stock === 0) product.status = 'sold-out';
      await product.save();
    }
  }
};

// Helper function to handle failed payment
const handlePaymentFailure = async (paymentIntent) => {
  const payment = await Payment.findOne({
    stripePaymentId: paymentIntent.id,
  });

  if (payment) {
    payment.status = 'failed';
    await payment.save();
  }
};

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
exports.refundPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentId,
      amount: Math.round(req.body.amount * 100),
      reason: req.body.reason,
    });

    payment.status = 'refunded';
    payment.refundAmount = req.body.amount;
    payment.refundReason = req.body.reason;
    await payment.save();

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
