import React from 'react';
import { Link } from 'react-router-dom';
import { FiXCircle } from 'react-icons/fi';

const PaymentFailed = () => {
  return (
    <div className="container-custom py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <FiXCircle className="w-20 h-20 text-red-500 mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-8">
          Unfortunately, your payment could not be processed. Please try again.
        </p>
        <div className="space-y-4">
          <Link to="/checkout" className="btn btn-primary w-full block">
            Try Again
          </Link>
          <Link to="/products" className="btn btn-secondary w-full block">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;