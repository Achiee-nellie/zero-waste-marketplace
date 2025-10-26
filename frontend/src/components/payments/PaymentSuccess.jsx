import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const PaymentSuccess = () => {
  return (
    <div className="container-custom py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        <div className="space-y-4">
          <Link to="/orders" className="btn btn-primary w-full block">
            View Orders
          </Link>
          <Link to="/products" className="btn btn-secondary w-full block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
