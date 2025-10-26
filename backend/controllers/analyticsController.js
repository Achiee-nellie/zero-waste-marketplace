const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const moment = require('moment');

// @desc    Get seller analytics
// @route   GET /api/analytics/seller
// @access  Private/Seller
exports.getSellerAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    // Total revenue
    const orders = await Order.find({
      seller: req.user.id,
      isPaid: true,
      ...(Object.keys(dateFilter).length && { createdAt: dateFilter }),
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.itemsPrice, 0);
    const platformFees = orders.reduce((sum, order) => sum + order.platformFee, 0);
    const netRevenue = totalRevenue - platformFees;

    // Product stats
    const products = await Product.find({ seller: req.user.id });
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const totalViews = products.reduce((sum, p) => sum + p.views, 0);

    // Sales by category
    const salesByCategory = await Order.aggregate([
      { $match: { seller: req.user._id, isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSales: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
    ]);

    // Environmental impact
    const totalWasteReduced = orders.reduce((sum, order) => sum + order.totalWasteReduced, 0);
    const totalCO2Saved = orders.reduce((sum, order) => sum + order.totalCO2Saved, 0);

    // Recent orders
    const recentOrders = await Order.find({ seller: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('buyer', 'name email');

    // Sales trend (last 30 days)
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    const salesTrend = await Order.aggregate([
      {
        $match: {
          seller: req.user._id,
          isPaid: true,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          sales: { $sum: 1 },
          revenue: { $sum: '$itemsPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenue: {
          total: totalRevenue,
          net: netRevenue,
          platformFees,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          totalViews,
        },
        orders: {
          total: orders.length,
          recent: recentOrders,
        },
        salesByCategory,
        environmentalImpact: {
          wasteReduced: totalWasteReduced,
          co2Saved: totalCO2Saved,
        },
        salesTrend,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get buyer analytics
// @route   GET /api/analytics/buyer
// @access  Private
exports.getBuyerAnalytics = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user.id, isPaid: true });

    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const totalOrders = orders.length;
    const totalWasteReduced = orders.reduce((sum, order) => sum + order.totalWasteReduced, 0);
    const totalCO2Saved = orders.reduce((sum, order) => sum + order.totalCO2Saved, 0);

    // Orders by category
    const ordersByCategory = await Order.aggregate([
      { $match: { buyer: req.user._id, isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: 1 },
          spent: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        spending: {
          total: totalSpent,
          average: totalOrders > 0 ? totalSpent / totalOrders : 0,
        },
        orders: {
          total: totalOrders,
        },
        environmentalImpact: {
          wasteReduced: totalWasteReduced,
          co2Saved: totalCO2Saved,
        },
        ordersByCategory,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform analytics (admin only)
// @route   GET /api/analytics/platform
// @access  Private/Admin
exports.getPlatformAnalytics = async (req, res, next) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalBuyers = await User.countDocuments({ role: 'buyer' });

    // Total products
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });

    // Total orders and revenue
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((sum, order) => sum + order.itemsPrice, 0);
    const totalPlatformFees = orders.reduce((sum, order) => sum + order.platformFee, 0);

    // Environmental impact
    const totalWasteReduced = orders.reduce((sum, order) => sum + order.totalWasteReduced, 0);
    const totalCO2Saved = orders.reduce((sum, order) => sum + order.totalCO2Saved, 0);

    // Growth metrics (last 30 days)
    const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newProducts = await Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const newOrders = await Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          sellers: totalSellers,
          buyers: totalBuyers,
          newLast30Days: newUsers,
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          newLast30Days: newProducts,
        },
        orders: {
          total: orders.length,
          newLast30Days: newOrders,
        },
        revenue: {
          total: totalRevenue,
          platformFees: totalPlatformFees,
        },
        environmentalImpact: {
          wasteReduced: totalWasteReduced,
          co2Saved: totalCO2Saved,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};