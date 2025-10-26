const { body, validationResult } = require('express-validator');

// Validation rules
exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.productValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('originalPrice')
    .isNumeric()
    .withMessage('Original price must be a number'),
  body('discountedPrice')
    .isNumeric()
    .withMessage('Discounted price must be a number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a positive integer'),
];

// Middleware to check validation results
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

