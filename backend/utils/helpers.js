
// Calculate environmental impact
exports.calculateImpact = (quantity, weightPerUnit) => {
  const wasteReduced = quantity * weightPerUnit;
  const co2Saved = wasteReduced * 0.5; // Simplified calculation
  
  return {
    wasteReduced: parseFloat(wasteReduced.toFixed(2)),
    co2Saved: parseFloat(co2Saved.toFixed(2)),
  };
};

// Generate order number
exports.generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

// Format currency
exports.formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Calculate discount percentage
exports.calculateDiscount = (original, discounted) => {
  return Math.round(((original - discounted) / original) * 100);
};
