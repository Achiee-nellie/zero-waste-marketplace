const Product = require('../models/Product');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    const queryObj = { status: 'active' };

    if (req.query.category && req.query.category !== 'all') {
      queryObj.category = req.query.category;
    }

    if (req.query.search) {
      queryObj.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      queryObj.discountedPrice = {};
      if (req.query.minPrice) queryObj.discountedPrice.$gte = req.query.minPrice;
      if (req.query.maxPrice) queryObj.discountedPrice.$lte = req.query.maxPrice;
    }

    if (req.query.expiryType) {
      queryObj.expiryType = req.query.expiryType;
    }

    // Sort
    let sortObj = {};
    if (req.query.sort === 'price-low') sortObj.discountedPrice = 1;
    else if (req.query.sort === 'price-high') sortObj.discountedPrice = -1;
    else if (req.query.sort === 'newest') sortObj.createdAt = -1;
    else if (req.query.sort === 'popular') sortObj.totalSold = -1;
    else sortObj.createdAt = -1;

    // Execute query
    const products = await Product.find(queryObj)
      .populate('seller', 'name businessName avatar rating')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(queryObj);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name businessName avatar rating reviewCount');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Seller
exports.createProduct = async (req, res, next) => {
  try {
    // Check subscription limits
    if (req.user.role === 'seller') {
      const productCount = await Product.countDocuments({
        seller: req.user.id,
        status: 'active',
      });

      const limits = {
        free: 5,
        basic: 50,
        premium: 200,
        enterprise: Infinity,
      };

      const userLimit = limits[req.user.subscription.plan] || limits.free;

      if (productCount >= userLimit) {
        return res.status(403).json({
          success: false,
          message: `Product limit reached for ${req.user.subscription.plan} plan`,
        });
      }
    }

    // Handle image uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file, 'products');
        images.push(result);
      }
    }

    const product = await Product.create({
      ...req.body,
      seller: req.user.id,
      images,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Seller
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      // Delete old images
      for (const image of product.images) {
        await deleteFromCloudinary(image.public_id);
      }

      // Upload new images
      const images = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file, 'products');
        images.push(result);
      }
      req.body.images = images;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Seller
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check ownership
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    // Delete images from cloudinary
    for (const image of product.images) {
      await deleteFromCloudinary(image.public_id);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seller products
// @route   GET /api/products/seller/:sellerId
// @access  Public
exports.getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      seller: req.params.sellerId,
      status: 'active',
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      featuredUntil: { $gte: new Date() },
      status: 'active',
    })
      .populate('seller', 'name businessName avatar')
      .limit(10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};