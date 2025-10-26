import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiMapPin } from 'react-icons/fi';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isSeller } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/products/${product._id}`} className="card hover:shadow-xl transition group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.images[0]?.url || 'https://via.placeholder.com/300'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
            -{product.discountPercentage}%
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-2 left-2 bg-secondary-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="badge bg-primary-100 text-primary-700 mb-2">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FiMapPin className="w-4 h-4 mr-1" />
          <span>{product.location?.city || 'Location not specified'}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.discountedPrice}
            </span>
            {product.originalPrice > product.discountedPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-600">per {product.unit}</span>
        </div>

        {/* Environmental Impact */}
        <div className="bg-green-50 p-2 rounded-lg mb-3">
          <p className="text-xs text-green-700">
            🌱 Saves {product.estimatedWasteReduced}kg waste
          </p>
        </div>

        {/* Stock */}
        <div className="mb-3">
          {product.stock > 0 ? (
            <span className="text-sm text-gray-600">
              {product.stock} {product.unit}s available
            </span>
          ) : (
            <span className="text-sm text-red-600 font-semibold">Out of stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        {!isSeller && product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="btn btn-primary w-full flex items-center justify-center space-x-2"
          >
            <FiShoppingCart />
            <span>Add to Cart</span>
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;