const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items',
      });
    }

    // Calculate platform fee
    const platformFee = itemsPrice * (parseFloat(process.env.PLATFORM_COMMISSION) / 100);
    const totalPrice = itemsPrice + shippingPrice + platformFee;

    // Calculate environmental impact
    let totalWasteReduced = 0;
    let totalCO2Saved = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      totalWasteReduced += product.estimatedWasteReduced * item.quantity;
      totalCO2Saved += product.estimatedCO2Saved * item.quantity;
    }

    // Get seller from first product
    const firstProduct = await Product.findById(orderItems[0].product);
    const seller = firstProduct.seller;

    const order = await Order.create({
      buyer: req.user.id,
      seller,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      platformFee,
      totalPrice,
      totalWasteReduced,
      totalCO2Saved,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('seller', 'name businessName email')
      .populate('orderItems.product', 'title images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    if (
      order.buyer._id.toString() !== req.user.id &&
      order.seller._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.orderStatus = 'confirmed';
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email: req.body.email,
    };

    const updatedOrder = await order.save();

    // Update product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      product.stock -= item.quantity;
      product.totalSold += item.quantity;
      product.totalRevenue += item.price * item.quantity;
      
      if (product.stock === 0) {
        product.status = 'sold-out';
      }
      
      await product.save();
    }

    // Update buyer and seller metrics
    const buyer = await User.findById(order.buyer);
    buyer.totalPurchases += 1;
    buyer.wasteReduced += order.totalWasteReduced;
    buyer.co2Saved += order.totalCO2Saved;
    await buyer.save();

    const seller = await User.findById(order.seller);
    seller.totalSales += 1;
    await seller.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Seller
exports.updateOrderToDelivered = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is the seller
    if (order.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.orderStatus = 'delivered';

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('seller', 'name businessName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller orders
// @route   GET /api/orders/seller
// @access  Private/Seller
exports.getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user.id })
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    if (order.buyer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Can only cancel if not shipped
    if (order.orderStatus === 'shipped' || order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel shipped or delivered orders',
      });
    }

    order.isCancelled = true;
    order.cancelledAt = Date.now();
    order.orderStatus = 'cancelled';
    order.cancellationReason = req.body.reason;

    await order.save();

    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      product.totalSold -= item.quantity;
      product.status = 'active';
      await product.save();
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};